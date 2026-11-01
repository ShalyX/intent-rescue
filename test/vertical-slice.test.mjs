import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeEvidence, exportBundle } from '../src/analyze.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => JSON.parse(fs.readFileSync(path.join(here, '..', 'fixtures', name), 'utf8'));

test('F1 vertical slice reconstructs the locked hero story', () => {
  const evidence = fixture('f1-failed.json');
  const out = analyzeEvidence(evidence);
  assert.equal(out.classification, 'FAILED_UNRESOLVED');
  assert.equal(out.first_unresolved_step, 'destination_delivery');
  assert.deepEqual(out.lifecycle.map(s => s.status), ['VERIFIED','VERIFIED','VERIFIED','NOT_OBSERVED','NOT_OBSERVED']);
});

test('export bundle carries source, diagnosis, lifecycle and identifiers', () => {
  const evidence = fixture('f1-failed.json');
  const bundle = exportBundle(evidence);
  assert.equal(bundle.schema, 'intent-rescue-evidence/v1');
  assert.equal(bundle.source.url, evidence.source_url);
  assert.equal(bundle.diagnosis.classification, 'FAILED_UNRESOLVED');
  assert.equal(bundle.lifecycle.length, 5);
  assert.equal(bundle.identifiers.intent_hashes[0], evidence.intent_hashes[0]);
});

test('F1 exposes provenance basis and exact advice predicates', () => {
  const evidence = fixture('f1-failed.json');
  const out = analyzeEvidence(evidence);
  assert.deepEqual(out.lifecycle.map(s => s.basis), ['OBSERVED','OBSERVED','OBSERVED','UNKNOWN','UNKNOWN']);
  assert.ok(out.evidence_predicates.includes('reported_status=FAILED'));
  assert.ok(out.evidence_predicates.includes('destination_observed=false'));
  assert.ok(out.evidence_predicates.includes('refund_observed=false'));
});

test('contrast fixtures contain no placeholder evidence', () => {
  for (const name of ['f2-refunded.json','f3-success.json']) {
    const raw = fs.readFileSync(path.join(here, '..', 'fixtures', name), 'utf8');
    assert.equal(raw.includes('fixture-present'), false);
  }
  const f2 = fixture('f2-refunded.json');
  assert.equal(f2.refund_tx_hashes[0], '0x8a6cbe7715108be0078123944ec7c7995e3ffb526b8ca48618171ba369b70b5e');
  const f3 = fixture('f3-success.json');
  const out = analyzeEvidence(f3);
  assert.equal(out.lifecycle[3].basis, 'OBSERVED');
  assert.equal(f3.near_swap_tx_hashes[0], 'Eh8v4CJDhF7m7Er8EsvWDrs9Sw9xpacofrA2oe5qSYBA');
});
