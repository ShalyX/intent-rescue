import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chainTransactionUrl, explorerReferences } from '../src/explorer-links.mjs';
import { analyzeEvidence, exportBundle } from '../src/analyze.mjs';

const f1 = JSON.parse(fs.readFileSync(new URL('../fixtures/f1-failed.json',import.meta.url),'utf8'));
test('public F1 source transaction gets an explicitly identified Litecoin explorer link', () => {
  const bundle = exportBundle(f1,{assurance:'CAPTURED_PUBLIC_SNAPSHOT'});
  assert.equal(bundle.source_links.origin_transactions.length,1);
  assert.equal(bundle.source_links.origin_transactions[0],
    'https://litecoinspace.org/tx/' + f1.origin_tx_hashes[0]);
  assert.equal(bundle.source_links.near_deposit_transactions.length,1);
  assert.equal(bundle.source_links.near_swap_transactions.length,1);
  assert.deepEqual(bundle.source_links.destination_transactions,[]);
  assert.deepEqual(bundle.source_links.refund_transactions,[]);
});
test('explicit source/destination/refund chain produces well-formed, chain-specific links',()=>{
  const hash='0x'+ 'a'.repeat(64);
  const e={source_chain:'base',destination_chain:'ethereum',refund_chain:'base',
    origin_tx_hashes:[hash],destination_tx_hashes:[hash],refund_tx_hashes:[hash]};
  const l=explorerReferences(e);
  assert.equal(l.origin_transactions[0],'https://basescan.org/tx/'+hash);
  assert.equal(l.destination_transactions[0],'https://etherscan.io/tx/'+hash);
  assert.equal(l.refund_transactions[0],'https://basescan.org/tx/'+hash);
});
test('no invented links for ambiguous assets, unknown chains, malformed hashes or untrusted urls',()=>{
  const hash='0x'+'a'.repeat(64);
  assert.equal(chainTransactionUrl('ETH',hash),null);
  assert.equal(chainTransactionUrl('unknown',hash),null);
  assert.equal(chainTransactionUrl('base','https://evil.example'),null);
  const e={source_asset:'ETH',origin_tx_hashes:[hash],source_url:'https://evil.example/transactions/123'};
  const l=explorerReferences(e);
  assert.deepEqual(l.origin_transactions,[]);
  assert.equal(l.near_intents_explorer,null);
});

test('F2 frozen refund evidence produces Base source and refund links without inventing delivery',()=>{
  const e=JSON.parse(fs.readFileSync(new URL('../fixtures/f2-refunded.json',import.meta.url),'utf8'));
  const bundle=exportBundle(e,{assurance:'CAPTURED_PUBLIC_SNAPSHOT'});
  assert.equal(bundle.source_links.origin_transactions.length,1);
  assert.equal(bundle.source_links.refund_transactions.length,1);
  assert.ok(bundle.source_links.origin_transactions[0].startsWith('https://basescan.org/tx/'));
  assert.ok(bundle.source_links.refund_transactions[0].startsWith('https://basescan.org/tx/'));
  assert.deepEqual(bundle.source_links.destination_transactions,[]);
});
