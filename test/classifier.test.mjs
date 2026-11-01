import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyIncident } from '../src/classifier.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => JSON.parse(fs.readFileSync(path.join(here, '..', 'fixtures', name), 'utf8'));

test('F1 failed/no-refund becomes FAILED_UNRESOLVED at destination delivery', () => {
  const out = classifyIncident(fixture('f1-failed.json'));
  assert.equal(out.classification, 'FAILED_UNRESOLVED');
  assert.equal(out.first_unresolved_step, 'destination_delivery');
  assert.equal(out.confidence, 'HIGH');
});

test('F2 refunded becomes REFUND_VERIFIED', () => {
  const out = classifyIncident(fixture('f2-refunded.json'));
  assert.equal(out.classification, 'REFUND_VERIFIED');
  assert.equal(out.first_unresolved_step, null);
});

test('F3 successful becomes COMPLETE', () => {
  const out = classifyIncident(fixture('f3-success.json'));
  assert.equal(out.classification, 'COMPLETE');
  assert.equal(out.first_unresolved_step, null);
});

test('destination plus refund is treated as conflicted evidence', () => {
  const out = classifyIncident({ reported_status: 'SUCCESS', destination_evidence: ['withdrawn'], refund_evidence: ['refunded'] });
  assert.equal(out.classification, 'CONFLICTED_EVIDENCE');
  assert.match(out.safe_action, /Do not infer retry safety/);
});

test('reported refund without refund tx stays insufficient', () => {
  const out = classifyIncident({ reported_status: 'REFUNDED', deposit_verified: true, refund_tx_hashes: [] });
  assert.equal(out.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(out.first_unresolved_step, 'refund');
});

test('pending deposit with no deposit evidence asks for source verification', () => {
  const out = classifyIncident({ reported_status: 'PENDING_DEPOSIT' });
  assert.equal(out.classification, 'DEPOSIT_NOT_OBSERVED');
  assert.equal(out.first_unresolved_step, 'source_deposit');
});

test('empty evidence stays insufficient and low-confidence', () => {
  const out = classifyIncident({});
  assert.equal(out.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(out.first_unresolved_step, 'source_deposit');
  assert.equal(out.confidence, 'LOW');
});

test('reported success without concrete destination evidence does not become COMPLETE', () => {
  const out = classifyIncident({ reported_status: 'SUCCESS', destination_verified: true });
  assert.equal(out.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(out.first_unresolved_step, 'destination_delivery');
});

test('reported refund without concrete refund evidence does not become REFUND_VERIFIED', () => {
  const out = classifyIncident({ reported_status: 'REFUNDED', refund_verified: true });
  assert.equal(out.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(out.first_unresolved_step, 'refund');
});

test('direct Explorer observations count as concrete terminal evidence', () => {
  const complete = classifyIncident({ reported_status: 'SUCCESS', destination_evidence: ['Explorer: withdrawn'] });
  assert.equal(complete.classification, 'COMPLETE');
  const refunded = classifyIncident({ reported_status: 'REFUNDED', refund_evidence: ['Explorer: refunded'] });
  assert.equal(refunded.classification, 'REFUND_VERIFIED');
});
