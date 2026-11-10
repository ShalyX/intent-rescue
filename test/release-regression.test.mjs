import test from 'node:test';
import assert from 'node:assert/strict';
import {parseEvidenceEnvelope,findCapturedCase} from '../src/intake.mjs';
import {analyzeEvidence,exportBundle} from '../src/analyze.mjs';
const hash='0x'+'a'.repeat(64);
test('malformed terminal references and typed evidence fail intake',()=>{
 for(const payload of [{refund_tx_hashes:['not-a-transaction']},{destination_tx_hashes:['garbage']},{origin_tx_hashes:hash},{deposit_evidence:[{url:'https://example.com'}]}]) assert.throws(()=>parseEvidenceEnvelope(JSON.stringify({reported_status:'FAILED',...payload})));
 assert.equal(analyzeEvidence({reported_status:'REFUNDED',refund_tx_hashes:['garbage']}).classification,'INSUFFICIENT_EVIDENCE');
});
test('case-sensitive references never match a case-mutated identifier',()=>{
 const original='HW6fpeeFmdj3QxgAaBo2M3WN3rk78dJ38PSPKA8G7hgp';
 assert.equal(findCapturedCase(original.toLowerCase(),[{intent_hashes:[original]}]).kind,'uncaptured');
 assert.equal(findCapturedCase(hash.toUpperCase().replace('0X','0x'),[{origin_tx_hashes:[hash]}]).kind,'captured');
});
test('manual case export preserves correlation and chain context and stays reported',()=>{
 const input=parseEvidenceEnvelope(JSON.stringify({status:'REFUNDED',depositAddress:'deposit-123',correlationId:'correlation-123',source_chain:'base',refund_chain:'base',refundTxHashes:[hash]}));
 const bundle=exportBundle(input);
 assert.equal(bundle.schema,'osiali-evidence/v1');
 assert.equal(bundle.identifiers.deposit_address,'deposit-123');
 assert.equal(bundle.identifiers.correlation_id,'correlation-123');
 assert.equal(bundle.identifiers.refund_chain,'base');
 assert.equal(bundle.diagnosis.classification,'REFUND_REPORTED');
 assert.equal(bundle.diagnosis.confidence,'UNVERIFIED');
 assert.equal(bundle.lifecycle.at(-1).status,'REPORTED');
 assert.equal(bundle.lifecycle.at(-1).basis,'SUPPLIED');
 assert.match(bundle.diagnosis.safe_action,/Confirm/);
});
