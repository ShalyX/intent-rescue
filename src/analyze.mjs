import { classifyIncident } from './classifier.mjs';
import { buildLifecycle } from './lifecycle.mjs';
import { makeEvidenceBundle } from './evidence-bundle.mjs';

const PROVISIONAL_OUTCOMES = {
  REFUND_VERIFIED: {
    classification: 'REFUND_REPORTED',
    first_unresolved_step: 'refund',
    safe_action: 'User-supplied evidence reports a refund. Confirm the refund transaction and returned funds in your wallet before starting another swap. Do not retry on the basis of this report alone.'
  },
  COMPLETE: {
    classification: 'DELIVERY_REPORTED',
    first_unresolved_step: 'destination_delivery',
    safe_action: 'User-supplied evidence reports destination delivery. Verify the destination transaction and confirm receipt in your wallet before treating the transfer as complete.'
  },
  INCOMPLETE_REFUNDED: {
    classification: 'INCOMPLETE_REFUND_REPORTED',
    first_unresolved_step: 'refund',
    safe_action: 'User-supplied evidence reports a refund for an incomplete deposit. Verify the refund transaction and confirm returned funds before starting another swap.'
  }
};

function applyAssurance(analysis, assurance) {
  if (assurance !== 'USER_SUPPLIED_UNVERIFIED') return analysis;
  const provisional = PROVISIONAL_OUTCOMES[analysis.classification];
  return {
    ...analysis,
    ...(provisional || {}),
    confidence: provisional ? 'LOW' : analysis.confidence,
    lifecycle: analysis.lifecycle.map(stage => ({
      ...stage,
      status: stage.status === 'VERIFIED' ? 'REPORTED' : stage.status,
      basis: stage.basis === 'OBSERVED' || stage.basis === 'SOURCE_REPORTED' ? 'SUPPLIED' : stage.basis
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
