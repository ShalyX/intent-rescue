import { hasDestinationEvidence, hasRefundEvidence } from './classifier.mjs';

const has = (arr) => Array.isArray(arr) && arr.length > 0;

export function buildLifecycle(evidence) {
  const originEvidence = provenance(evidence.origin_tx_hashes, evidence.near_deposit_tx_hashes, evidence.deposit_evidence);
  const intakeEvidence = provenance(evidence.intent_hashes);
  const intentEvidence = provenance(evidence.intent_hashes, evidence.near_swap_tx_hashes);
  const destinationEvidence = provenance(evidence.destination_tx_hashes, evidence.destination_evidence);
  const refundEvidence = provenance(evidence.refund_tx_hashes, evidence.refund_evidence);
  const deposit = Boolean(evidence.deposit_verified) || originEvidence.length > 0;
  const intake = deposit && (Boolean(evidence.intent_verified) || intakeEvidence.length > 0 || has(evidence.near_swap_tx_hashes));
  const intent = Boolean(evidence.intent_verified) || intentEvidence.length > 0;
  const destination = hasDestinationEvidence(evidence);
  const refund = hasRefundEvidence(evidence);
  return [
    stage('Source deposit', deposit ? 'VERIFIED' : 'NOT_OBSERVED', originEvidence, originEvidence.length ? 'OBSERVED' : evidence.deposit_verified ? 'INFERRED' : 'UNKNOWN'),
    stage('1Click intake', intake ? 'VERIFIED' : deposit ? 'UNKNOWN' : 'NOT_OBSERVED', intakeEvidence, intakeEvidence.length ? 'OBSERVED' : intake ? 'INFERRED' : 'UNKNOWN'),
    stage('Intent / solver', intent ? 'VERIFIED' : deposit && String(evidence.reported_status || '').toUpperCase() === 'FAILED' ? 'FAILED_OR_TERMINAL' : 'UNKNOWN', intentEvidence, intentEvidence.length ? 'OBSERVED' : intent ? 'INFERRED' : 'UNKNOWN'),
    stage('Destination delivery', destination ? 'VERIFIED' : 'NOT_OBSERVED', destinationEvidence, destinationEvidence.length ? 'OBSERVED' : destination ? 'INFERRED' : 'UNKNOWN'),
    stage('Refund', refund ? 'VERIFIED' : 'NOT_OBSERVED', refundEvidence, refundEvidence.length ? 'OBSERVED' : refund ? 'INFERRED' : 'UNKNOWN')
  ];
}
function provenance(...arrays) { return arrays.filter(Array.isArray).flat().filter(value => typeof value === 'string' && value.trim()); }
function stage(label,status,evidence,basis) { return {label,status,basis,evidence}; }
