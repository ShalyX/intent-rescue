import { validTransactionHash } from './intake.mjs';

const values = (...arrays) => arrays.filter(Array.isArray).flat()
  .filter(value => typeof value === 'string' && value.trim());

function validHashes(...arrays) {
  return arrays.filter(Array.isArray).flat().filter(validTransactionHash);
}

export function buildLifecycle(evidence) {
  const reported = String(evidence.reported_status || '').toUpperCase();
  const originHashes = validHashes(evidence.origin_tx_hashes, evidence.near_deposit_tx_hashes);
  const depositObservations = values(evidence.deposit_evidence);
  const nearSwapHashes = validHashes(evidence.near_swap_tx_hashes);
  const intentHashes = [...validHashes(evidence.intent_hashes), ...nearSwapHashes];
  const destinationHashes = validHashes(evidence.destination_tx_hashes);
  const destinationObservations = values(evidence.destination_evidence);
  const refundHashes = validHashes(evidence.refund_tx_hashes);
  const refundObservations = values(evidence.refund_evidence);

  const depositObserved = originHashes.length > 0;
  const activeDepositReported = ['KNOWN_DEPOSIT_TX', 'PROCESSING', 'PENDING'].includes(reported);
  const depositDeclared = evidence.deposit_verified === true;
  const depositReported = depositObserved || depositObservations.length > 0 || activeDepositReported || depositDeclared;
  const depositStatus = depositObserved ? 'VERIFIED' : depositReported ? 'REPORTED' : 'NOT_OBSERVED';
  const depositBasis = depositObserved ? 'OBSERVED'
    : depositObservations.length || activeDepositReported ? 'SOURCE_REPORTED'
    : depositDeclared ? 'DECLARED' : 'UNKNOWN';

  const intentObserved = intentHashes.length > 0;
  const intentDeclared = evidence.intent_verified === true;
  const intakeReported = ['KNOWN_DEPOSIT_TX', 'PROCESSING', 'PENDING', 'INCOMPLETE_DEPOSIT', 'SUCCESS', 'REFUNDED', 'FAILED'].includes(reported);
  const intakeStatus = intakeReported ? 'REPORTED' : depositReported ? 'UNKNOWN' : 'NOT_OBSERVED';
  const intakeBasis = intakeReported ? 'SOURCE_REPORTED' : 'UNKNOWN';
  const intakeEvidence = intakeReported ? ['1Click status reports ' + reported] : [];
  const intentStatus = intentObserved ? 'VERIFIED'
    : intentDeclared ? 'REPORTED'
    : depositObserved && reported === 'FAILED' ? 'FAILED_OR_TERMINAL'
    : 'UNKNOWN';
  const intentBasis = intentObserved ? 'OBSERVED' : intentDeclared ? 'DECLARED' : 'UNKNOWN';

  const destinationStatus = destinationHashes.length ? 'VERIFIED'
    : destinationObservations.length ? 'REPORTED' : 'NOT_OBSERVED';
  const refundStatus = refundHashes.length ? 'VERIFIED'
    : refundObservations.length ? 'REPORTED' : 'NOT_OBSERVED';

  return [
    stage('Source deposit', depositStatus, [...originHashes, ...depositObservations], depositBasis),
    stage('1Click intake', intakeStatus, intakeEvidence, intakeBasis),
    stage('Intent / solver', intentStatus, intentHashes, intentBasis),
    stage('Destination delivery', destinationStatus,
      [...destinationHashes, ...destinationObservations],
      destinationHashes.length ? 'OBSERVED' : destinationObservations.length ? 'SOURCE_REPORTED' : 'UNKNOWN'),
    stage('Refund', refundStatus,
      [...refundHashes, ...refundObservations],
      refundHashes.length ? 'OBSERVED' : refundObservations.length ? 'SOURCE_REPORTED' : 'UNKNOWN')
  ];
}

function stage(label, status, evidence, basis) {
  return { label, status, basis, evidence };
}
