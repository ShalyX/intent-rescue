import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublicExplorer } from '../src/public-explorer.mjs';
import { analyzeEvidence } from '../src/analyze.mjs';
import handler from '../api/incident.js';
const URL='https://explorer.near-intents.org/transactions/1234567890abcdef';
const page=(section)=>'<html><body><h1>Transaction Details</h1>'+
 '<h3>Deposit Completed</h3><p>Token deposit has been confirmed.</p>'+
 '<h2>From</h2><img alt="LTC" /><h2>To</h2><img alt="ETH" />'+section+
 '<div class="pad">'+('a'.repeat(3500))+'</div></body></html>';
const source=page('<h3>Failed</h3><p>Transaction failed</p>'+
'<p>The transaction has failed to complete and deposit was not refunded</p>'+
'<h3>Intent Hash</h3><a href="https://pikespeak.ai/intents/HW6fpeeFmdj3QxgAaBo2M3WN3rk78dJ38PSPKA8G7hgp">intent</a>'+
'<h3>Near Deposit Transaction</h3><a href="https://nearblocks.io/txns/9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF">near</a>');
test('public HTML failed-case reconstruction stays source-attributed',()=>{
 const evidence=parsePublicExplorer(source,URL,'2026-11-09T00:00:00Z');
 assert.equal(evidence.reported_status,'FAILED');
 assert.equal(evidence.source_asset,'LTC');
 assert.equal(evidence.destination_asset,'ETH');
 assert.equal(analyzeEvidence(evidence).classification,'FAILED_UNRESOLVED');
 assert.equal(evidence.near_deposit_tx_hashes.length,1);
 assert.equal(evidence.destination_tx_hashes.length,0);
});
test('public refund and withdrawal require exact visible outcomes',()=>{
 const refund=parsePublicExplorer(page('<h3>Refunded</h3><p>Transaction refunded</p>'),URL);
 assert.equal(refund.reported_status,'REFUNDED');
 assert.equal(analyzeEvidence(refund).classification,'REFUND_VERIFIED');
 const complete=parsePublicExplorer(page('<h3>Withdrawn</h3><p>Funds were successfully withdrawn</p>'),URL);
 assert.equal(complete.reported_status,'SUCCESS');
 assert.equal(analyzeEvidence(complete).classification,'COMPLETE');
});
test('ambiguous or forged status fails closed',()=>{
 assert.throws(()=>parsePublicExplorer(page('<h3>Failed</h3>Transaction failed<h3>Refunded</h3>Transaction refunded'),URL),/uniquely/);
 assert.throws(()=>parsePublicExplorer(page('<script>Transaction refunded</script>'),URL),/uniquely/);
 assert.throws(()=>parsePublicExplorer(source,'https://evil.example/transactions/1234567890abcdef'),/Unsupported/);
 assert.throws(()=>parsePublicExplorer('<html>oops</html>',URL),/unavailable/);
});
test('API does not proxy non-Explorer domains or accept writes',async()=>{
 const response={code:200,body:null,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(d){this.body=d;return this}};
 await handler({method:'GET',query:{reference:'https://evil.example/transactions/1234567890abcdef'}},response);
 assert.equal(response.code,400);
 assert.equal(response.body.error.includes('NEAR Intents Explorer'),true);
 await handler({method:'POST',query:{reference:URL}},response);
 assert.equal(response.code,405);
});

test('explicit public source-chain transaction link preserves chain for F1-type evidence',()=>{
  const body=page('<h3>Failed</h3>Transaction failed. The transaction has failed to complete and deposit was not refunded'+
  '<p>Deposit <!-- -->transaction<!-- -->: <a href="https://blockchair.com/litecoin/transaction/1e59a2a06ee0985eec6ca76a5264697f44581017a9f8383598a7538daed2f6df">hash</a></p>');
  const e=parsePublicExplorer(body,URL);
  assert.equal(e.source_chain,'litecoin');
  assert.equal(e.origin_tx_hashes[0],'1e59a2a06ee0985eec6ca76a5264697f44581017a9f8383598a7538daed2f6df');
});
