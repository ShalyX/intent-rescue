import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeStatus} from '../src/status-api.mjs';import {analyzeEvidence,exportBundle} from '../src/analyze.mjs';import {parseEvidenceEnvelope} from '../src/intake.mjs';
const address='0x'+'a'.repeat(40);
test('API status must match requested deposit and supports active stages',()=>{
 for(const status of ['PENDING_DEPOSIT','PROCESSING','REFUNDED','SUCCESS']){const evidence=normalizeStatus({status,quoteResponse:{quote:{depositAddress:address}},swapDetails:{}},address);const analysis=analyzeEvidence(evidence,{assurance:'OFFICIAL_STATUS_SNAPSHOT'});if(status==='PENDING_DEPOSIT')assert.equal(analysis.classification,'DEPOSIT_NOT_OBSERVED');if(status==='REFUNDED')assert.equal(analysis.classification,'REFUND_REPORTED');assert.equal(exportBundle(evidence,{assurance:'OFFICIAL_STATUS_SNAPSHOT'}).source.independently_chain_verified,false);}
 assert.throws(()=>normalizeStatus({status:'SUCCESS',quoteResponse:{quote:{depositAddress:'other'}}},address),/match/);
 assert.throws(()=>normalizeStatus({status:'made-up'},address),/Unrecognized/);
});
test('guided unknown report exports its reference and notes without claiming observation',()=>{
 const e=parseEvidenceEnvelope(JSON.stringify({searched_reference:'my-wallet-reference',reported_status:'UNKNOWN',user_notes:'Sent yesterday',origin_tx_hashes:[]}));const b=exportBundle(e);assert.equal(b.identifiers.searched_reference,'my-wallet-reference');assert.equal(b.incident.notes,'Sent yesterday');assert.equal(b.diagnosis.classification,'INSUFFICIENT_EVIDENCE');assert.equal(b.diagnosis.verification_status,'PROVISIONAL');
});

test('memo-specific results reject missing or different quote memos',()=>{
 const p={status:'PROCESSING',quoteResponse:{quote:{depositAddress:address}},swapDetails:{}};
 assert.throws(()=>normalizeStatus(p,address,'memo-1'),/memo/);
 p.quoteResponse.quote.depositMemo='memo-1';assert.equal(normalizeStatus(p,address,'memo-1').deposit_memo,'memo-1');
});
