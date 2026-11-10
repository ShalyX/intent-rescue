import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyIncident } from '../src/classifier.mjs';
import { buildLifecycle } from '../src/lifecycle.mjs';
import { exportBundle } from '../src/analyze.mjs';

const cases = [
  ['reported refund plus verified flag, but no refund evidence', { reported_status: 'REFUNDED', refund_verified: true }, 'refund'],
  ['verified flag alone, without a reported outcome or refund evidence', { refund_verified: true }, 'source_deposit']
];

for (const [name, evidence, unresolvedStep] of cases) {
  test(`refund flag alone is not proof: ${name}`, () => {
    const diagnosis = classifyIncident(evidence);
    const lifecycle = buildLifecycle(evidence);
    assert.equal(diagnosis.classification, 'INSUFFICIENT_EVIDENCE');
    assert.equal(diagnosis.first_unresolved_step, unresolvedStep);
    assert.equal(lifecycle[4].label, 'Refund');
    assert.equal(lifecycle[4].status, 'NOT_OBSERVED');
    assert.equal(lifecycle[4].basis, 'UNKNOWN');
  });
}

test('exported case keeps diagnosis and refund lifecycle consistent without refund evidence', () => {
  const bundle = exportBundle({ reported_status: 'REFUNDED', refund_verified: true });
  assert.equal(bundle.diagnosis.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(bundle.lifecycle[4].status, 'NOT_OBSERVED');
  assert.equal(bundle.lifecycle[4].basis, 'UNKNOWN');
  assert.equal(bundle.diagnosis.first_unresolved_step, 'refund');
});
