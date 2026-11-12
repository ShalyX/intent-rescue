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
 assert.equal(analyzeEvidence(evidence, { assurance: 'PUBLIC_EXPLORER_SNAPSHOT' }).classification,'FAILED_UNRESOLVED');
 assert.equal(evidence.near_deposit_tx_hashes.length,1);
 assert.equal(evidence.destination_tx_hashes.length,0);
});
test('public refund and withdrawal require exact visible outcomes',()=>{
 const refund=parsePublicExplorer(page('<h3>Refunded</h3><p>Transaction refunded</p>'),URL);
 assert.equal(refund.reported_status,'REFUNDED');
 assert.equal(analyzeEvidence(refund, { assurance: 'PUBLIC_EXPLORER_SNAPSHOT' }).classification,'REFUND_REPORTED');
 const complete=parsePublicExplorer(page('<h3>Withdrawn</h3><p>Funds were successfully withdrawn</p>'),URL);
 assert.equal(complete.reported_status,'SUCCESS');
 assert.equal(analyzeEvidence(complete, { assurance: 'PUBLIC_EXPLORER_SNAPSHOT' }).classification,'DELIVERY_REPORTED');
});
test('ambiguous or forged status fails closed',()=>{
 assert.throws(()=>parsePublicExplorer(page('<h3>Failed</h3>Transaction failed<h3>Refunded</h3>Transaction refunded'),URL),/uniquely/);
 assert.throws(()=>parsePublicExplorer(page('<script>Transaction refunded</script>'),URL),/uniquely/);
 assert.throws(()=>parsePublicExplorer(page('<h3>Failed</h3><!-- Transaction failed -->'),URL),/uniquely/);
 assert.throws(()=>parsePublicExplorer(source,'https://evil.example/transactions/1234567890abcdef'),/Unsupported/);
 assert.throws(()=>parsePublicExplorer('<html>oops</html>',URL),/unavailable/);
});

test('Explorer address links are never attributed as transaction hashes',()=>{
  const addressPage=page('<h3>Failed</h3><p>Transaction failed</p><p>Deposit transaction: <a href="https://litecoinspace.org/address/ltc1qexampleaddress0123456789">address</a></p>');
  const evidence=parsePublicExplorer(addressPage,URL);
  assert.deepEqual(evidence.origin_tx_hashes,[]);
  assert.equal(evidence.source_chain,null);
});

for (const marker of [
  'hidden',
  'aria-hidden="true"',
  'style="display:none"',
  'style="visibility:hidden"',
  'class="hidden"',
  'aria-hidden=true',
  'style=display:none',
  'class=hidden'
]) {
  test('Explorer ignores terminal assertions inside visually hidden content: ' + marker, () => {
    const hidden = page('<div ' + marker + '><section><h3>Refunded</h3><p>Transaction refunded</p></section></div>');
    assert.throws(() => parsePublicExplorer(hidden, URL), /uniquely/);

    const mixed = page('<h3>Failed</h3><p>Transaction failed</p><div ' + marker +
      '><section><h3>Refunded</h3><p>Transaction refunded</p></section></div>');
    assert.equal(parsePublicExplorer(mixed, URL).reported_status, 'FAILED');
  });
}

test('restores Next.js streamed transaction details only with a matching reveal instruction', () => {
  const streamed = '<template id="B:0"></template>' +
    '<div hidden id="S:0"><div><h3>Refunded</h3><p>Transaction refunded</p>' +
    '<script>const nestedMarkup = "</div>";</script></div></div>' +
    '<script>$RC("B:0","S:0")</script>';
  assert.equal(parsePublicExplorer(page(streamed), URL).reported_status, 'REFUNDED');
});

test('unrevealed and mismatched Next.js stream segments remain hidden', () => {
  const hidden = '<template id="B:0"></template>' +
    '<div hidden id="S:0"><div><h3>Refunded</h3><p>Transaction refunded</p></div></div>';
  assert.throws(() => parsePublicExplorer(page(hidden), URL), /uniquely/);

  const mismatched = hidden + '<script>$RC("B:1","S:0")</script>';
  assert.throws(() => parsePublicExplorer(page(mismatched), URL), /uniquely/);
});

test('restores nested Next.js stream segments after their parent boundary is revealed', () => {
  const nested = '<template id="B:0"></template>' +
    '<div hidden id="S:0"><div class="outer"><template id="B:1"></template>' +
    '<div hidden id="S:1"><div><h3>Refunded</h3><p>Transaction refunded</p></div></div>' +
    '</div></div><script>$RC("B:0","S:0");$RC("B:1","S:1")</script>';
  assert.equal(parsePublicExplorer(page(nested), URL).reported_status, 'REFUNDED');
});

test('keeps nested stream content hidden when its own reveal marker is missing', () => {
  const nested = '<template id="B:0"></template>' +
    '<div hidden id="S:0"><template id="B:1"></template>' +
    '<div hidden id="S:1"><div><h3>Refunded</h3><p>Transaction refunded</p></div></div>' +
    '</div><script>$RC("B:0","S:0")</script>';
  assert.throws(() => parsePublicExplorer(page(nested), URL), /uniquely/);
});

test('script and style payload markup cannot mask visible transaction status', () => {
  const body = '<script>const template = "<div hidden><h3>Refunded</h3>Transaction refunded</div>";</script>' +
    '<style>.x::after { content: "<div hidden>"; }</style>' +
    '<h3>Failed</h3><p>Transaction failed</p>';
  assert.equal(parsePublicExplorer(page(body), URL).reported_status, 'FAILED');
});

test('API does not proxy non-Explorer domains or accept writes',async()=>{
 const response={code:200,body:null,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(d){this.body=d;return this}};
 await handler({method:'GET',query:{reference:'https://evil.example/transactions/1234567890abcdef'}},response);
 assert.equal(response.code,400);
 assert.equal(response.body.error.includes('NEAR Intents Explorer'),true);
 await handler({method:'POST',query:{reference:URL}},response);
 assert.equal(response.code,405);
});

test('transaction lookup reports missing server-side Explorer JWT without making an unauthenticated request', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT;
    else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken;
  });
  delete process.env.NEAR_INTENTS_EXPLORER_JWT;
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('must not call unauthenticated endpoint'); };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: URL } }, response);
  assert.equal(response.code, 503);
  assert.match(response.body.error, /NEAR_INTENTS_EXPLORER_JWT/i);
  assert.equal(called, false);
});

test('incident API uses the authenticated Explorer API and preserves source-reported refund semantics', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT;
    else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken;
  });
  process.env.NEAR_INTENTS_EXPLORER_JWT = 'test.jwt.value';
  const hash = URL.split('/').at(-1);
  globalThis.fetch = async (url, options) => {
    assert.ok(String(url).startsWith('https://explorer.near-intents.org/api/v0/transactions'));
    assert.equal(options.headers.Authorization, 'Bearer test.jwt.value');
    return new Response(JSON.stringify([{
      originAsset: 'nep141:eth-0x0000000000000000000000000000000000000000.omft.near',
      destinationAsset: 'nep141:gnosis-0x0000000000000000000000000000000000000000.omft.near',
      status: 'REFUNDED',
      originChainTxHashes: [hash],
      destinationChainTxHashes: [],
      nearTxHashes: ['near-hash'],
      intentHashes: 'intent-hash',
      refundTo: '0x1111111111111111111111111111111111111111',
      refundType: 'ORIGIN_CHAIN',
      refundReason: 'AMOUNT_MORE_THAN_BALANCE',
      refundFeeFormatted: '0.01'
    }]), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: URL } }, response);
  assert.equal(response.code, 200);
  assert.equal(response.body.kind, 'explorer_api_snapshot');
  assert.equal(response.body.evidence.reported_status, 'REFUNDED');
  assert.deepEqual(response.body.evidence.refund_tx_hashes, []);
  assert.match(response.body.notice, /not independently verified on-chain/i);
});

test('explicit public source-chain transaction link preserves chain for F1-type evidence',()=>{
  const body=page('<h3>Failed</h3>Transaction failed. The transaction has failed to complete and deposit was not refunded'+
  '<p>Deposit <!-- -->transaction<!-- -->: <a href="https://blockchair.com/litecoin/transaction/1e59a2a06ee0985eec6ca76a5264697f44581017a9f8383598a7538daed2f6df">hash</a></p>');
  const e=parsePublicExplorer(body,URL);
  assert.equal(e.source_chain,'litecoin');
  assert.equal(e.origin_tx_hashes[0],'1e59a2a06ee0985eec6ca76a5264697f44581017a9f8383598a7538daed2f6df');
});


test('an explicit Explorer URL with a Base58 NEAR transaction hash bypasses 1Click address lookup', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  t.after(() => { globalThis.fetch = originalFetch; if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT; else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken; });
  process.env.NEAR_INTENTS_EXPLORER_JWT = 'test.jwt.value';
  const nearHash = '9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF';
  const explorerUrl = 'https://explorer.near-intents.org/transactions/' + nearHash;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).startsWith('https://explorer.near-intents.org/api/v0/transactions')) {
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
    }
    return new Response(source, { status: 200, headers: { 'content-type': 'text/html' } });
  };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: explorerUrl } }, response);
  assert.equal(response.code, 200);
  assert.equal(response.body.kind, 'public_explorer_snapshot');
  assert.equal(calls.length, 2);
  assert.ok(calls[0].startsWith('https://explorer.near-intents.org/api/v0/transactions'));
  assert.equal(calls[1], explorerUrl);
});

test('an unqualified Base58 transaction hash checks 1Click first, then authenticated Explorer API', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  t.after(() => { globalThis.fetch = originalFetch; if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT; else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken; });
  process.env.NEAR_INTENTS_EXPLORER_JWT = 'test.jwt.value';
  const nearHash = '9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF';
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    if (String(url).startsWith('https://1click.chaindefuser.com/v0/status'))
      return new Response('not found', { status: 404, headers: { 'content-type': 'text/plain' } });
    if (String(url).startsWith('https://explorer.near-intents.org/api/v0/transactions'))
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
    return new Response(source, { status: 200, headers: { 'content-type': 'text/html' } });
  };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: nearHash } }, response);
  assert.equal(response.code, 200);
  assert.equal(response.body.kind, 'public_explorer_snapshot');
  assert.equal(calls.length, 3);
  assert.ok(calls[0].startsWith('https://1click.chaindefuser.com/v0/status'));
  assert.ok(calls[1].startsWith('https://explorer.near-intents.org/api/v0/transactions'));
  assert.equal(calls[2], 'https://explorer.near-intents.org/transactions/' + nearHash);
});

test('a memo-bound 1Click 404 does not fall through to Explorer', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const address = '0x' + 'a'.repeat(40);
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    return new Response('not found', { status: 404, headers: { 'content-type': 'text/plain' } });
  };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: address, memo: 'memo-123' } }, response);
  assert.equal(response.code, 422);
  assert.match(response.body.error, /address and memo/i);
  assert.equal(calls.length, 1);
});

test('a memo-bound 1Click provider outage returns 502 instead of a memo-validation error', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const address = '0x' + 'a'.repeat(40);
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    return new Response('upstream unavailable', { status: 503, headers: { 'content-type': 'text/plain' } });
  };
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: address, memo: 'memo-123' } }, response);
  assert.equal(response.code, 502);
  assert.match(response.body.error, /1Click status lookup failed/i);
  assert.equal(calls.length, 1);
});

test('authenticated Explorer API transport failures return 502 without falling through to HTML', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  const originalError = console.error;
  t.after(() => {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT;
    else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken;
  });
  process.env.NEAR_INTENTS_EXPLORER_JWT = 'test.jwt.value';
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  console.error = () => {};
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: URL } }, response);
  assert.equal(response.code, 502);
  assert.match(response.body.error, /Explorer API request failed/i);
});

test('unreconstructable public Explorer HTML remains unresolved and never invents a diagnosis', async t => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.NEAR_INTENTS_EXPLORER_JWT;
  const originalError = console.error;
  t.after(() => {
    globalThis.fetch = originalFetch;
    console.error = originalError;
    if (originalToken === undefined) delete process.env.NEAR_INTENTS_EXPLORER_JWT;
    else process.env.NEAR_INTENTS_EXPLORER_JWT = originalToken;
  });
  process.env.NEAR_INTENTS_EXPLORER_JWT = 'test.jwt.value';
  globalThis.fetch = async url => {
    if (String(url).startsWith('https://explorer.near-intents.org/api/v0/transactions'))
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
    return new Response(page('<h3>Unknown</h3><p>No terminal status</p>'), {
      status: 200, headers: { 'content-type': 'text/html' }
    });
  };
  console.error = () => {};
  const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
  await handler({ method: 'GET', query: { reference: URL } }, response);
  assert.equal(response.code, 422);
  assert.match(response.body.error, /No diagnosis was invented/i);
});

for (const scenario of [
  ['HTTP 503', async () => new Response('upstream unavailable', { status: 503, headers: { 'content-type': 'text/plain' } })],
  ['network failure', async () => { throw new TypeError('fetch failed'); }],
  ['mismatched status payload', async () => new Response(JSON.stringify({
    status: 'PROCESSING', quoteResponse: { quote: { depositAddress: '0x' + 'a'.repeat(40) } }, swapDetails: {}
  }), { status: 200, headers: { 'content-type': 'application/json' } })]
]) {
  test('an unqualified Base58 identifier does not fall through to Explorer after a 1Click ' + scenario[0], async t => {
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    const nearHash = '9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF';
    const calls = [];
    globalThis.fetch = async url => {
      calls.push(String(url));
      if (String(url).startsWith('https://1click.chaindefuser.com/v0/status')) return scenario[1]();
      return new Response(source, { status: 200, headers: { 'content-type': 'text/html' } });
    };
    const response = { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(d){this.body=d;return this;} };
    await handler({ method: 'GET', query: { reference: nearHash } }, response);
    assert.equal(response.code, 502);
    assert.match(response.body.error, /fallback was not attempted/i);
    assert.equal(calls.length, 1);
    assert.ok(calls[0].startsWith('https://1click.chaindefuser.com/v0/status'));
  });
}
