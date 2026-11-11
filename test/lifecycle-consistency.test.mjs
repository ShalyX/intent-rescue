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


test('provider and public Explorer snapshots remain reported until independent chain verification', () => {
  const refund = exportBundle({
    reported_status: 'REFUNDED',
    refund_evidence: ['1Click status reports REFUNDED'],
    origin_chain_tx_hashes: ['0x' + 'a'.repeat(64)]
  }, { assurance: 'OFFICIAL_STATUS_SNAPSHOT' });
  assert.equal(refund.diagnosis.classification, 'REFUND_REPORTED');
  assert.equal(refund.diagnosis.first_unresolved_step, 'refund');
  assert.equal(refund.diagnosis.verification_status, 'SNAPSHOT_ONLY');
  assert.equal(refund.source.independently_chain_verified, false);
  assert.equal(refund.lifecycle[4].status, 'REPORTED');
  assert.equal(refund.lifecycle[4].basis, 'SOURCE_REPORTED');
  assert.match(refund.diagnosis.safe_action, /confirm the refund transaction/i);

  const delivery = exportBundle({
    reported_status: 'SUCCESS',
    destination_evidence: ['Explorer reports withdrawn']
  }, { assurance: 'PUBLIC_EXPLORER_SNAPSHOT' });
  assert.equal(delivery.diagnosis.classification, 'DELIVERY_REPORTED');
  assert.equal(delivery.diagnosis.first_unresolved_step, 'destination_delivery');
  assert.equal(delivery.lifecycle[3].status, 'REPORTED');
  assert.equal(delivery.lifecycle[3].basis, 'SOURCE_REPORTED');
});
