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
  const out = analyzeEvidence(evidence, { assurance: 'CAPTURED_PUBLIC_SNAPSHOT' });
  assert.equal(out.classification, 'FAILED_UNRESOLVED');
  assert.equal(out.first_unresolved_step, 'destination_delivery');
  assert.deepEqual(out.lifecycle.map(s => s.status), ['REPORTED','REPORTED','REPORTED','NOT_OBSERVED','NOT_OBSERVED']);
});

test('export bundle carries source, diagnosis, lifecycle and identifiers', () => {
  const evidence = fixture('f1-failed.json');
  const bundle = exportBundle(evidence);
  assert.equal(bundle.schema, 'osiali-evidence/v1');
  assert.equal(bundle.source.url, evidence.source_url);
  assert.equal(bundle.diagnosis.classification, 'FAILED_UNRESOLVED');
  assert.equal(bundle.lifecycle.length, 5);
  assert.equal(bundle.identifiers.intent_hashes[0], evidence.intent_hashes[0]);
});

test('F1 exposes provenance basis and exact advice predicates', () => {
  const evidence = fixture('f1-failed.json');
  const out = analyzeEvidence(evidence, { assurance: 'CAPTURED_PUBLIC_SNAPSHOT' });
  assert.deepEqual(out.lifecycle.map(s => s.basis), ['SOURCE_REPORTED','SOURCE_REPORTED','SOURCE_REPORTED','UNKNOWN','UNKNOWN']);
  assert.ok(out.evidence_predicates.includes('reported_status=FAILED'));
  assert.ok(out.evidence_predicates.includes('destination_observed=false'));
  assert.ok(out.evidence_predicates.includes('refund_observed=false'));
});


test('terminal verified flags cannot promote lifecycle or export without concrete evidence', () => {
  const cases = [
    { label: 'Destination delivery', flag: 'destination_verified', reported_status: 'SUCCESS' },
    { label: 'Refund', flag: 'refund_verified', reported_status: 'REFUNDED' }
  ];
  for (const item of cases) {
    const evidence = {
      reported_status: item.reported_status,
      [item.flag]: true,
      destination_tx_hashes: [],
      destination_evidence: [],
      refund_tx_hashes: [],
      refund_evidence: []
    };
    const analysis = analyzeEvidence(evidence, { assurance: 'CAPTURED_PUBLIC_SNAPSHOT' });
    assert.equal(analysis.classification, 'INSUFFICIENT_EVIDENCE', item.label);
    const stage = analysis.lifecycle.find(entry => entry.label === item.label);
    assert.deepEqual(
      { status: stage.status, basis: stage.basis, evidence: stage.evidence },
      { status: 'NOT_OBSERVED', basis: 'UNKNOWN', evidence: [] },
      item.label
    );
    const bundle = exportBundle(evidence);
    assert.equal(bundle.diagnosis.classification, 'INSUFFICIENT_EVIDENCE', item.label + ' export diagnosis');
    const exportedStage = bundle.lifecycle.find(entry => entry.label === item.label);
    assert.equal(exportedStage.status, 'NOT_OBSERVED', item.label + ' export lifecycle');
  }
});

test('terminal source snapshots remain reported even when transaction identifiers are present', () => {
  const cases = [
    {
      label: 'Destination delivery',
      evidence: { reported_status: 'SUCCESS', destination_tx_hashes: ['0x' + 'd'.repeat(64)] }
    },
    {
      label: 'Refund',
      evidence: { reported_status: 'REFUNDED', refund_tx_hashes: ['0x' + 'e'.repeat(64)] }
    }
  ];
  for (const item of cases) {
    const analysis = analyzeEvidence(item.evidence, { assurance: 'CAPTURED_PUBLIC_SNAPSHOT' });
    const expected = item.label === 'Refund' ? 'REFUND_REPORTED' : 'DELIVERY_REPORTED';
    assert.equal(analysis.classification, expected, item.label);
    const stage = analysis.lifecycle.find(entry => entry.label === item.label);
    assert.deepEqual(
      { status: stage.status, basis: stage.basis, evidence: stage.evidence },
      {
        status: 'REPORTED',
        basis: 'SOURCE_REPORTED',
        evidence: item.label === 'Refund' ? ['0x' + 'e'.repeat(64)] : ['0x' + 'd'.repeat(64)]
      },
      item.label
    );
  }
});

test('contrast fixtures contain no placeholder evidence', () => {
  for (const name of ['f2-refunded.json','f3-success.json']) {
    const raw = fs.readFileSync(path.join(here, '..', 'fixtures', name), 'utf8');
    assert.equal(raw.includes('fixture-present'), false);
  }
  const f2 = fixture('f2-refunded.json');
  assert.equal(f2.refund_tx_hashes[0], '0x8a6cbe7715108be0078123944ec7c7995e3ffb526b8ca48618171ba369b70b5e');
  const f3 = fixture('f3-success.json');
  const out = analyzeEvidence(f3, { assurance: 'CAPTURED_PUBLIC_SNAPSHOT' });
  assert.equal(out.lifecycle[3].basis, 'SOURCE_REPORTED');
  assert.equal(f3.near_swap_tx_hashes[0], 'Eh8v4CJDhF7m7Er8EsvWDrs9Sw9xpacofrA2oe5qSYBA');
});
