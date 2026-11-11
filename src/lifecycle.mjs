import { hasDestinationEvidence, hasRefundEvidence } from './classifier.mjs';

const values = (...arrays) => arrays.filter(Array.isArray).flat().filter(value => typeof value === 'string' && value.trim());

export function buildLifecycle(evidence) {
  const reported = String(evidence.reported_status || '').toUpperCase();
  const originEvidence = values(evidence.origin_tx_hashes, evidence.near_deposit_tx_hashes, evidence.deposit_evidence);
  const intakeEvidence = values(evidence.intent_hashes);
  const intentEvidence = values(evidence.intent_hashes, evidence.near_swap_tx_hashes);
  const destinationEvidence = values(evidence.destination_tx_hashes, evidence.destination_evidence);
  const refundEvidence = values(evidence.refund_tx_hashes, evidence.refund_evidence);

  const depositObserved = originEvidence.length > 0;
  const activeDepositReported = ['KNOWN_DEPOSIT_TX', 'PROCESSING'].includes(reported);
  const depositDeclared = evidence.deposit_verified === true;
  const deposit = depositObserved || activeDepositReported || depositDeclared;
  const depositStatus = depositObserved ? 'VERIFIED' : deposit ? 'REPORTED' : 'NOT_OBSERVED';
  const depositBasis = depositObserved ? 'OBSERVED'
    : depositDeclared ? 'DECLARED'
    : activeDepositReported ? 'SOURCE_REPORTED' : 'UNKNOWN';

  const intentObserved = intentEvidence.length > 0;
  const intentDeclared = evidence.intent_verified === true;
  const intake = deposit && (intakeEvidence.length > 0 || intentDeclared || hasNearSwap(evidence));
  const intakeStatus = intakeEvidence.length ? 'VERIFIED' : intake ? 'REPORTED' : deposit ? 'UNKNOWN' : 'NOT_OBSERVED';
  const intakeBasis = intakeEvidence.length ? 'OBSERVED' : intentDeclared ? 'DECLARED' : intake ? 'SOURCE_REPORTED' : 'UNKNOWN';
  const intentStatus = intentObserved ? 'VERIFIED'
    : intentDeclared ? 'REPORTED'
    : depositObserved && reported === 'FAILED' ? 'FAILED_OR_TERMINAL'
    : 'UNKNOWN';
  const intentBasis = intentObserved ? 'OBSERVED' : intentDeclared ? 'DECLARED' : 'UNKNOWN';

  const destination = hasDestinationEvidence(evidence);
  const refund = hasRefundEvidence(evidence);

  return [
    stage('Source deposit', depositStatus, originEvidence, depositBasis),
    stage('1Click intake', intakeStatus, intakeEvidence, intakeBasis),
    stage('Intent / solver', intentStatus, intentEvidence, intentBasis),
    stage('Destination delivery', destination ? 'VERIFIED' : 'NOT_OBSERVED', destinationEvidence, destinationEvidence.length ? 'OBSERVED' : 'UNKNOWN'),
    stage('Refund', refund ? 'VERIFIED' : 'NOT_OBSERVED', refundEvidence, refundEvidence.length ? 'OBSERVED' : 'UNKNOWN')
  ];
}

function hasNearSwap(evidence) {
  return Array.isArray(evidence.near_swap_tx_hashes) && evidence.near_swap_tx_hashes.length > 0;
}
function stage(label, status, evidence, basis) {
  return { label, status, basis, evidence };
}
