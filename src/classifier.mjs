import { validTransactionHash } from './intake.mjs';

const hasHashes = values => Array.isArray(values) && values.length > 0 && values.every(validTransactionHash);
const has = values => Array.isArray(values) && values.length > 0;

export const hasDestinationEvidence = evidence =>
  hasHashes(evidence.destination_tx_hashes) || has(evidence.destination_evidence);
export const hasRefundEvidence = evidence =>
  hasHashes(evidence.refund_tx_hashes) || has(evidence.refund_evidence);

export function classifyIncident(evidence) {
  const reported = String(evidence.reported_status || '').toUpperCase();
  // Boolean *_verified fields are declarations, not evidence. Only concrete
  // identifiers or source-attributed evidence arrays can satisfy these gates.
  const depositVerified = hasHashes(evidence.origin_tx_hashes) ||
    hasHashes(evidence.near_deposit_tx_hashes) || has(evidence.deposit_evidence);
  const intentVerified = hasHashes(evidence.intent_hashes) || hasHashes(evidence.near_swap_tx_hashes);
  const destinationObserved = hasDestinationEvidence(evidence);
  const refundObserved = hasRefundEvidence(evidence);
  const basePredicates = [
    'reported_status=' + (reported || 'UNKNOWN'),
    'deposit_verified=' + depositVerified,
    'intent_verified=' + intentVerified,
    'destination_observed=' + destinationObserved,
    'refund_observed=' + refundObserved
  ];

  if (destinationObserved && refundObserved) {
    return result('CONFLICTED_EVIDENCE', 'outcome', 'UNKNOWN',
      'Destination delivery and refund are both present. Do not infer retry safety until the conflict is resolved.', basePredicates);
  }
  if (destinationObserved || reported === 'SUCCESS' || reported === 'COMPLETED') {
    if (!destinationObserved && (reported === 'SUCCESS' || reported === 'COMPLETED')) {
      return result('INSUFFICIENT_EVIDENCE', 'destination_delivery', 'LOW',
        'The reported status is successful, but destination evidence is missing from this evidence set.', basePredicates);
    }
    return result('COMPLETE', null, 'HIGH', 'Complete - no recovery action required.', basePredicates);
  }
  if (refundObserved || reported === 'REFUNDED') {
    if (!refundObserved && reported === 'REFUNDED') {
      return result('INSUFFICIENT_EVIDENCE', 'refund', 'LOW',
        'A refund is reported, but no refund transaction is present in this evidence set.', basePredicates);
    }
    return result('REFUND_VERIFIED', null, 'HIGH',
      'Refund confirmed. Verify receipt in the refund wallet before creating a fresh quote.', basePredicates);
  }
  if (reported === 'INCOMPLETE_DEPOSIT') {
    if (refundObserved) {
      return result('INCOMPLETE_REFUNDED', null, 'HIGH',
        'Refund evidence is present. Verify receipt before creating a fresh quote.', basePredicates);
    }
    return result('INCOMPLETE_REFUND_UNRESOLVED', 'refund', depositVerified ? 'MEDIUM' : 'LOW',
      'Track the refund or escalate. Do not assume funds have been returned.', basePredicates);
  }
  if (['PROCESSING', 'PENDING', 'KNOWN_DEPOSIT_TX'].includes(reported)) {
    const unresolved = depositVerified
      ? (intentVerified ? 'destination_delivery' : 'intent_execution')
      : 'source_deposit';
    return result('IN_PROGRESS', unresolved, depositVerified ? 'MEDIUM' : 'LOW',
      'The status source reports an active transfer. Do not submit a duplicate or retry with the same funds. Refresh the status and verify the source deposit and next unresolved leg before considering recovery.',
      basePredicates);
  }
  if ((reported === 'PENDING_DEPOSIT' || reported === 'AWAITING_DEPOSIT') && !depositVerified) {
    return result('DEPOSIT_NOT_OBSERVED', 'source_deposit', 'MEDIUM',
      'Verify the source transaction, deposit address, memo, and required amount.', basePredicates);
  }
  if (depositVerified && reported === 'FAILED' && !destinationObserved && !refundObserved) {
    return result('FAILED_UNRESOLVED', intentVerified ? 'destination_delivery' : 'intent_execution', intentVerified ? 'HIGH' : 'MEDIUM',
      'Do not duplicate-retry with the same funds. Escalate with evidence and verify destination or refund before creating a fresh quote.', basePredicates);
  }
  return result('INSUFFICIENT_EVIDENCE', depositVerified ? 'intent_execution' : 'source_deposit', 'LOW',
    'More evidence is required before a safe recovery action can be recommended.', basePredicates);
}

function result(classification, first_unresolved_step, confidence, safe_action, evidence_predicates) {
  return { classification, first_unresolved_step, confidence, safe_action, evidence_predicates };
}
