import { classifyIncident } from './classifier.mjs';
import { buildLifecycle } from './lifecycle.mjs';
import { makeEvidenceBundle } from './evidence-bundle.mjs';

const REPORTED_OUTCOMES = {
  REFUND_VERIFIED: {
    classification: 'REFUND_REPORTED',
    first_unresolved_step: 'refund',
    safe_action: 'The source reports a refund. Confirm the refund transaction and verify returned funds in your wallet before starting another swap. Do not retry on the basis of a provider or Explorer snapshot alone.'
  },
  COMPLETE: {
    classification: 'DELIVERY_REPORTED',
    first_unresolved_step: 'destination_delivery',
    safe_action: 'The source reports destination delivery. Verify the destination transaction and confirm receipt in your wallet before treating the transfer as complete.'
  },
  INCOMPLETE_REFUNDED: {
    classification: 'INCOMPLETE_REFUND_REPORTED',
    first_unresolved_step: 'refund',
    safe_action: 'The source reports a refund for an incomplete deposit. Verify the refund transaction and confirm returned funds before starting another swap.'
  }
};

function applyAssurance(analysis, assurance) {
  const reported = REPORTED_OUTCOMES[analysis.classification];
  if (assurance !== 'USER_SUPPLIED_UNVERIFIED' && assurance !== 'CAPTURED_PUBLIC_SNAPSHOT'
      && assurance !== 'PUBLIC_EXPLORER_SNAPSHOT' && assurance !== 'OFFICIAL_STATUS_SNAPSHOT') return analysis;
  const isUserSupplied = assurance === 'USER_SUPPLIED_UNVERIFIED';
  return {
    ...analysis,
    ...(reported || {}),
    confidence: reported ? (isUserSupplied ? 'LOW' : 'MEDIUM') : analysis.confidence,
    lifecycle: analysis.lifecycle.map(stage => ({
      ...stage,
      status: stage.status === 'VERIFIED' ? 'REPORTED' : stage.status,
      basis: stage.basis === 'OBSERVED' || stage.basis === 'SOURCE_REPORTED'
        ? (isUserSupplied ? 'SUPPLIED' : 'SOURCE_REPORTED')
        : stage.basis
    }))
  };
}

export function analyzeEvidence(evidence, options = {}) {
  const assurance = options.assurance || 'SOURCE_SNAPSHOT';
  const diagnosis = classifyIncident(evidence);
  const lifecycle = buildLifecycle(evidence);
  return applyAssurance({ ...diagnosis, lifecycle }, assurance);
}

export function exportBundle(evidence, options = {}) {
  const assurance = options.assurance || 'USER_SUPPLIED_UNVERIFIED';
  const analysis = analyzeEvidence(evidence, { assurance });
  return makeEvidenceBundle(evidence, analysis, { ...options, assurance });
}
