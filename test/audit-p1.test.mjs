import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStatus } from '../src/status-api.mjs';
import { classifyIncident } from '../src/classifier.mjs';
import { buildLifecycle } from '../src/lifecycle.mjs';
import { exportBundle } from '../src/analyze.mjs';
import handler from '../api/incident.js';

const address = '0x' + 'a'.repeat(40);
const depositHash = '0x' + 'b'.repeat(64);
const refundHash = '0x' + 'c'.repeat(64);
const nearOne = '3ow6FDKxJMbuRPZKfEku7quk55DzJ9C5TbiiD43vKKD9';
const nearTwo = '58KRGAJgrifdyCLNoxsuB4dfBU4jBDEGaan6kmskhGkr';
const intentHash = 'CgnViLjZqbfxTsp4prNWt9bpPBFLs3ET24QKGoK49rDw';
const updatedAt = '2026-08-18T16:18:27.000Z';

function refundedPayload() {
  return {
    status: 'REFUNDED',
    updatedAt,
    correlationId: 'audit-correlation-1',
    quoteResponse: {
      signature: 'provider-quote-signature',
      timestamp: '2026-08-18T16:00:00.000Z',
      quoteRequest: {
        originAsset: 'nep141:usdc.omft.near',
        destinationAsset: 'nep141:xdai.omft.near',
        recipient: 'recipient.near',
        refundTo: '0x' + 'd'.repeat(40),
        deadline: '2026-08-18T17:00:00.000Z',
        depositType: 'ORIGIN_CHAIN',
        recipientType: 'DESTINATION_CHAIN',
        refundType: 'ORIGIN_CHAIN',
        swapType: 'EXACT_INPUT',
        amount: '1000000',
        slippageTolerance: 100
      },
      quote: {
        depositAddress: address,
        depositMemo: 'memo-123',
        amountIn: '1000000',
        amountInFormatted: '1.00'
      }
    },
    swapDetails: {
      originChainTxHashes: [
        { hash: depositHash, explorerUrl: 'https://basescan.org/tx/' + depositHash },
        { hash: refundHash, explorerUrl: 'https://basescan.org/tx/' + refundHash }
      ],
      destinationChainTxHashes: [],
      intentHashes: [intentHash],
      nearTxHashes: [nearOne, nearTwo],
      depositedAmount: '1000000',
      depositedAmountFormatted: '1.00',
      refundedAmount: '990000',
      refundedAmountFormatted: '0.99',
      refundedAmountUsd: '0.99',
      refundReason: 'NO_LIQUIDITY',
      refundFee: '10000',
      refundFeeFormatted: '0.01',
      amountIn: '990000',
      amountInFormatted: '0.99',
      amountOut: '0',
      amountOutFormatted: '0'
    }
  };
}

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; }
  };
}

test('1Click origin and NEAR hashes keep ambiguous transaction roles unassigned in the evidence bundle', () => {
  const evidence = normalizeStatus(refundedPayload(), address, 'memo-123');
  assert.deepEqual(evidence.origin_tx_hashes, []);
  assert.deepEqual(evidence.unassigned_origin_tx_hashes, [depositHash, refundHash]);
  assert.deepEqual(evidence.unassigned_near_tx_hashes, [nearOne, nearTwo]);
  assert.deepEqual(evidence.origin_chain_tx_hashes, [depositHash, refundHash]);
  const bundle = exportBundle(evidence, { assurance: 'OFFICIAL_STATUS_SNAPSHOT' });
  assert.deepEqual(bundle.identifiers.unassigned_origin_tx_hashes, [depositHash, refundHash]);
  assert.deepEqual(bundle.identifiers.unassigned_near_tx_hashes, [nearOne, nearTwo]);
});

test('1Click correlation IDs remain metadata and do not change the stable case identity', () => {
  const first = normalizeStatus(refundedPayload(), address, 'memo-123');
  const secondPayload = refundedPayload();
  secondPayload.correlationId = 'audit-correlation-2';
  const second = normalizeStatus(secondPayload, address, 'memo-123');
  assert.match(first.id, /^1click-[a-f0-9]{16}$/);
  assert.equal(second.id, first.id);
  assert.equal(first.correlation_id, 'audit-correlation-1');
  assert.equal(second.correlation_id, 'audit-correlation-2');
  const otherMemoPayload = refundedPayload();
  otherMemoPayload.quoteResponse.quote.depositMemo = 'memo-456';
  assert.notEqual(normalizeStatus(otherMemoPayload, address, 'memo-456').id, first.id);
});

test('1Click refund reason, amounts, fees, quote context and provider timestamp survive export', () => {
  const evidence = normalizeStatus(refundedPayload(), address, 'memo-123');
  assert.equal(evidence.source_updated_at, updatedAt);
  assert.equal(evidence.provider_details.refund_reason, 'NO_LIQUIDITY');
  assert.equal(evidence.provider_details.quote_signature, 'provider-quote-signature');
  assert.equal(evidence.provider_details.quote.depositMemo, 'memo-123');
  assert.equal(evidence.provider_details.quote_request.swapType, 'EXACT_INPUT');
  assert.equal(evidence.provider_details.quote_timestamp, '2026-08-18T16:00:00.000Z');
  assert.equal(evidence.provider_details.swap_type, 'EXACT_INPUT');
  assert.equal(evidence.provider_details.deposited_amount_formatted, '1.00');
  assert.equal(evidence.provider_details.refunded_amount_formatted, '0.99');
  assert.equal(evidence.provider_details.refund_fee_formatted, '0.01');
  assert.equal(evidence.provider_details.recipient, 'recipient.near');
  assert.equal(evidence.provider_details.refund_to, '0x' + 'd'.repeat(40));
  const bundle = exportBundle(evidence, { assurance: 'OFFICIAL_STATUS_SNAPSHOT' });
  assert.equal(bundle.source.updated_at, updatedAt);
  assert.equal(bundle.incident.refund_reason, 'NO_LIQUIDITY');
  assert.equal(bundle.provider_details.refunded_amount_formatted, '0.99');
  assert.equal(bundle.provider_details.refund_fee_formatted, '0.01');
  assert.equal(bundle.provider_details.quote_signature, 'provider-quote-signature');
  assert.equal(bundle.provider_details.quote.depositMemo, 'memo-123');
});

test('a memo-bearing 1Click quote cannot be resolved without the matching user memo', () => {
  assert.throws(() => normalizeStatus(refundedPayload(), address), /memo.*required/i);
  assert.throws(() => normalizeStatus(refundedPayload(), address, 'wrong-memo'), /memo.*match/i);
  assert.equal(normalizeStatus(refundedPayload(), address, 'memo-123').deposit_memo, 'memo-123');
});

test('deposit_verified and intent_verified flags alone are declarations, never verification', () => {
  const evidence = { deposit_verified: true, intent_verified: true };
  const diagnosis = classifyIncident(evidence);
  const lifecycle = buildLifecycle(evidence);
  assert.equal(diagnosis.classification, 'INSUFFICIENT_EVIDENCE');
  assert.equal(lifecycle[0].status, 'REPORTED');
  assert.equal(lifecycle[0].basis, 'DECLARED');
  assert.equal(lifecycle[1].status, 'UNKNOWN');
  assert.equal(lifecycle[1].basis, 'UNKNOWN');
  assert.equal(lifecycle[2].status, 'REPORTED');
  assert.equal(lifecycle[2].basis, 'DECLARED');
  const bundle = exportBundle(evidence);
  assert.deepEqual(bundle.lifecycle.slice(0, 3).map(stage => stage.status), ['REPORTED','UNKNOWN','REPORTED']);
  assert.ok(bundle.unresolved_evidence.some(item => item.step === 'Source deposit'));
  assert.ok(bundle.unresolved_evidence.some(item => item.step === 'Intent / solver'));
});

test('PROCESSING without transaction hashes remains active and explicitly blocks duplicate retry', () => {
  const evidence = { reported_status: 'PROCESSING' };
  const diagnosis = classifyIncident(evidence);
  const lifecycle = buildLifecycle(evidence);
  assert.equal(diagnosis.classification, 'IN_PROGRESS');
  assert.equal(diagnosis.first_unresolved_step, 'source_deposit');
  assert.match(diagnosis.safe_action, /do not (?:submit|duplicate|retry)/i);
  assert.equal(lifecycle[0].status, 'REPORTED');
  assert.equal(lifecycle[0].basis, 'SOURCE_REPORTED');
});

test('user-reported refund hash stays provisional and remains the first unresolved escalation step', () => {
  const bundle = exportBundle({
    reported_status: 'REFUNDED',
    refund_tx_hashes: [refundHash]
  }, { assurance: 'USER_SUPPLIED_UNVERIFIED' });
  assert.equal(bundle.diagnosis.classification, 'REFUND_REPORTED');
  assert.equal(bundle.diagnosis.first_unresolved_step, 'refund');
  assert.equal(bundle.lifecycle[4].status, 'REPORTED');
  assert.ok(bundle.unresolved_evidence.some(item => item.step === 'Refund'));
  assert.match(bundle.escalation.summary, /First unresolved leg: refund/i);
});


test('user-reported destination hash remains provisional and unresolved', () => {
  const bundle = exportBundle({
    reported_status: 'SUCCESS',
    destination_tx_hashes: [depositHash]
  }, { assurance: 'USER_SUPPLIED_UNVERIFIED' });
  assert.equal(bundle.diagnosis.classification, 'DELIVERY_REPORTED');
  assert.equal(bundle.diagnosis.first_unresolved_step, 'destination_delivery');
  assert.equal(bundle.lifecycle[3].status, 'REPORTED');
  assert.ok(bundle.unresolved_evidence.some(item => item.step === 'Destination delivery'));
  assert.match(bundle.diagnosis.safe_action, /Verify the destination transaction/);
});

test('KNOWN_DEPOSIT_TX without a hash is still active and blocks duplicate retry', () => {
  const diagnosis = classifyIncident({ reported_status: 'KNOWN_DEPOSIT_TX' });
  const lifecycle = buildLifecycle({ reported_status: 'KNOWN_DEPOSIT_TX' });
  assert.equal(diagnosis.classification, 'IN_PROGRESS');
  assert.equal(diagnosis.first_unresolved_step, 'source_deposit');
  assert.match(diagnosis.safe_action, /Do not submit a duplicate/);
  assert.equal(lifecycle[0].status, 'REPORTED');
  assert.equal(lifecycle[0].basis, 'SOURCE_REPORTED');
});

test('a failed memo-specific status lookup stops at the provider and does not fall through to Explorer', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify(refundedPayload()), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };
  const response = mockResponse();
  await handler({ method: 'GET', query: { reference: address } }, response);
  assert.equal(response.statusCode, 422);
  assert.match(response.body.error, /memo/i);
  assert.equal(calls, 1);
});


test('1Click intake is attributed to provider status, not duplicated intent hashes', () => {
  const evidence = normalizeStatus(refundedPayload(), address, 'memo-123');
  const lifecycle = buildLifecycle(evidence);
  assert.equal(lifecycle[1].label, '1Click intake');
  assert.equal(lifecycle[1].status, 'REPORTED');
  assert.match(lifecycle[1].evidence[0], /1Click status reports REFUNDED/);
  assert.equal(lifecycle[2].label, 'Intent / solver');
  assert.deepEqual(lifecycle[2].evidence, [intentHash, ...[]].filter(Boolean));
});
