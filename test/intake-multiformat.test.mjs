import test from 'node:test';
import assert from 'node:assert/strict';
import {findCapturedCase,parseEvidenceEnvelope} from '../src/intake.mjs';
test('matches deposit address, correlation ID and source/destination identifiers',()=>{
 const e={deposit_address:'0x123ab',correlation_id:'session-17',origin_tx_hashes:['0x' + 'a'.repeat(64)],destination_tx_hashes:['0x456fff'],source_url:'https://explorer.near-intents.org/transactions/1234567890abcdef'};
 for(const ref of ['0x123ab','session-17','0x' + 'a'.repeat(64),'0x456fff','https://explorer.near-intents.org/transactions/1234567890abcdef']) assert.equal(findCapturedCase(ref,[e]).kind,'captured');
 assert.equal(findCapturedCase('session-17',[e,{correlation_id:'session-17'}]).kind,'ambiguous');
 assert.equal(findCapturedCase('another-id',[e]).kind,'uncaptured');
});
test('normalizes official status payload without inventing refund evidence',()=>{
 const e=parseEvidenceEnvelope(JSON.stringify({status:'REFUNDED',depositAddress:'0x123ab',correlationId:'session-17',originTxHashes:['0x' + 'a'.repeat(64)]}));
 assert.equal(e.reported_status,'REFUNDED');
 assert.equal(e.deposit_address,'0x123ab');
 assert.equal(e.correlation_id,'session-17');
 assert.deepEqual(e.origin_tx_hashes,['0x' + 'a'.repeat(64)]);
 assert.equal(e.refund_evidence,undefined);
});
test('rejects irrelevant JSON',()=>assert.throws(()=>parseEvidenceEnvelope('{"foo":"bar"}'),/incident evidence/));
