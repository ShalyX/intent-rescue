import { classifyIncident } from './classifier.mjs';
import { buildLifecycle } from './lifecycle.mjs';
import { makeEvidenceBundle } from './evidence-bundle.mjs';

export function analyzeEvidence(evidence) {
  const diagnosis = classifyIncident(evidence);
  const lifecycle = buildLifecycle(evidence);
  return { ...diagnosis, lifecycle };
}

export function exportBundle(evidence) {
  const analysis = analyzeEvidence(evidence);
  return makeEvidenceBundle(evidence, analysis);
}
