import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { findCapturedCase, extractIdentifier, parseEvidenceEnvelope } from '../src/intake.mjs';
const root = new URL('../fixtures/', import.meta.url);
const captures = ['f1-failed.json','f2-refunded.json','f3-success.json'].map(f=>JSON.parse(fs.readFileSync(new URL(f,root),'utf8')));
test('resolver accepts a source explorer URL including tracking query',()=>{
  const hit=findCapturedCase(captures[0].source_url+'?tracking=123',captures);
  assert.equal(hit.kind,'captured'); assert.equal(hit.evidence.id,'F1');
});
test('resolver matches known source and NEAR execution identifiers',()=>{
  for (const f of captures) {
    assert.equal(findCapturedCase(f.intent_hashes[0],captures).evidence.id,f.id);
    assert.equal(findCapturedCase(f.near_swap_tx_hashes[0],captures).evidence.id,f.id);
  }
});
test('unrecognized hash never receives invented classification',()=>{
  const r=findCapturedCase('deadbeef01234567890',captures);
  assert.equal(r.kind,'uncaptured'); assert.equal('evidence' in r,false);
});
test('rejects arbitrary URLs and unsupported domains',()=>{
  assert.equal(findCapturedCase('https://evil.example/transactions/a',captures).kind,'invalid');
  assert.equal(extractIdentifier('https://explorer.near-intents.org/other/abc'),null);
});
test('rejects ambiguous identifiers rather than choosing a match',()=>{
  const r=findCapturedCase('F1',[captures[0],{...captures[0],id:'F4'}]);
  // F1 is uniquely the first; a duplicated hash must be ambiguous.
  assert.equal(r.kind,'captured');
  assert.equal(findCapturedCase(captures[0].intent_hashes[0],[captures[0],{...captures[0],id:'F4'}]).kind,'ambiguous');
});
test('manual evidence requires a recognizable object',()=>{
  assert.throws(()=>parseEvidenceEnvelope('{}'),/not an incident/);
  assert.throws(()=>parseEvidenceEnvelope('[]'),/JSON object/);
  assert.equal(parseEvidenceEnvelope('{"reported_status":"FAILED"}').reported_status,'FAILED');
});
