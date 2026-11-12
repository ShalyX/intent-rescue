import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchExplorerApiEvidence,
  ExplorerApiError
} from '../src/explorer-api.mjs';

const HASH = '0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32';
const URL = 'https://explorer.near-intents.org/transactions/' + HASH;
const TOKEN = 'test.jwt.value';

function transaction(overrides = {}) {
  return {
    originAsset: 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
    destinationAsset: 'nep141:gnosis.omft.near',
    status: 'REFUNDED',
    createdAt: '2026-11-10T12:00:00.000Z',
    intentHashes: 'intent-hash-example',
    amountInFormatted: '12.50',
    amountOutFormatted: '0',
    nearTxHashes: ['near-hash-one'],
    originChainTxHashes: [HASH],
    destinationChainTxHashes: [],
    refundTo: '0x1111111111111111111111111111111111111111',
    refundFeeFormatted: '0.01',
    refundType: 'ORIGIN_CHAIN',
    refundReason: 'AMOUNT_MORE_THAN_BALANCE',
    ...overrides
  };
}

function response(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body
  };
}

test('queries the authenticated Explorer API and returns conservative refund evidence', async () => {
  let request;
  const evidence = await fetchExplorerApiEvidence({
    sourceUrl: URL,
    token: TOKEN,
    capturedAt: '2026-11-12T00:00:00.000Z',
    fetchImpl: async (url, options) => {
      request = { url: new globalThis.URL(url), options };
      return response(200, [transaction()]);
    }
  });

  assert.equal(request.url.origin + request.url.pathname, 'https://explorer.near-intents.org/api/v0/transactions');
  assert.equal(request.url.searchParams.get('search'), HASH);
  assert.equal(request.url.searchParams.get('numberOfTransactions'), '10');
  assert.equal(request.options.headers.Authorization, 'Bearer ' + TOKEN);
  assert.equal(evidence.reported_status, 'REFUNDED');
  assert.equal(evidence.source_chain, 'eth');
  assert.equal(evidence.destination_chain, 'gnosis');
  assert.deepEqual(evidence.origin_tx_hashes, [HASH]);
  assert.deepEqual(evidence.refund_tx_hashes, []);
  assert.equal(evidence.explorer_api_metadata.refund_reason, 'AMOUNT_MORE_THAN_BALANCE');
  assert.match(evidence.refund_evidence[0], /source-reported|No independent refund-chain verification/i);
});

test('does not invent a refund transaction hash from an origin transaction hash', async () => {
  const evidence = await fetchExplorerApiEvidence({
    sourceUrl: URL,
    token: TOKEN,
    fetchImpl: async () => response(200, [transaction({
      originChainTxHashes: [HASH],
      status: 'REFUNDED'
    })])
  });
  assert.deepEqual(evidence.refund_tx_hashes, []);
  assert.deepEqual(evidence.destination_tx_hashes, []);
});

test('only assigns destination transaction hashes to a source-reported SUCCESS', async () => {
  const evidence = await fetchExplorerApiEvidence({
    sourceUrl: URL,
    token: TOKEN,
    fetchImpl: async () => response(200, [transaction({
      status: 'SUCCESS',
      destinationChainTxHashes: ['0x' + 'b'.repeat(64)]
    })])
  });
  assert.equal(evidence.reported_status, 'SUCCESS');
  assert.deepEqual(evidence.destination_tx_hashes, ['0x' + 'b'.repeat(64)]);
  assert.deepEqual(evidence.refund_evidence, []);
});

test('returns null when the API has no exact hash match', async () => {
  const evidence = await fetchExplorerApiEvidence({
    sourceUrl: URL,
    token: TOKEN,
    fetchImpl: async () => response(200, [transaction({ originChainTxHashes: ['different-hash'] })])
  });
  assert.equal(evidence, null);
});

test('matches EVM hashes case-insensitively but keeps Base58 transaction identifiers case-sensitive', async () => {
  const lowerHexUrl = 'https://explorer.near-intents.org/transactions/' + HASH.toLowerCase();
  const hexEvidence = await fetchExplorerApiEvidence({
    sourceUrl: lowerHexUrl,
    token: TOKEN,
    fetchImpl: async () => response(200, [transaction({ originChainTxHashes: [HASH] })])
  });
  assert.equal(hexEvidence.reported_status, 'REFUNDED');

  const base58 = '9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF';
  const base58Evidence = await fetchExplorerApiEvidence({
    sourceUrl: 'https://explorer.near-intents.org/transactions/' + base58,
    token: TOKEN,
    fetchImpl: async () => response(200, [transaction({ originChainTxHashes: [base58.toLowerCase()] })])
  });
  assert.equal(base58Evidence, null);
});

test('rejects ambiguous exact hash matches', async () => {
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: URL,
      token: TOKEN,
      fetchImpl: async () => response(200, [transaction(), transaction()])
    }),
    error => error instanceof ExplorerApiError && error.code === 'AMBIGUOUS_MATCH' && error.statusCode === 409
  );
});

test('requires a server-side JWT and never makes an unauthenticated request', async () => {
  let called = false;
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: URL,
      token: '',
      fetchImpl: async () => { called = true; return response(200, []); }
    }),
    error => error instanceof ExplorerApiError && error.code === 'TOKEN_MISSING' && error.statusCode === 503
  );
  assert.equal(called, false);
});

test('rejects unsupported hosts and paths before making a request', async () => {
  let called = false;
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: 'https://evil.example/transactions/' + HASH,
      token: TOKEN,
      fetchImpl: async () => { called = true; return response(200, []); }
    }),
    error => error instanceof ExplorerApiError && error.code === 'UNSUPPORTED_REFERENCE'
  );
  assert.equal(called, false);
});

test('maps rejected credentials, rate limits and transport failures to distinct errors', async t => {
  const scenarios = [
    [401, 'TOKEN_REJECTED', 503],
    [403, 'TOKEN_REJECTED', 503],
    [429, 'RATE_LIMITED', 503],
    [502, 'UPSTREAM_ERROR', 502]
  ];
  for (const [status, code, statusCode] of scenarios) {
    await assert.rejects(
      fetchExplorerApiEvidence({
        sourceUrl: URL,
        token: TOKEN,
        fetchImpl: async () => response(status, {})
      }),
      error => error instanceof ExplorerApiError && error.code === code && error.statusCode === statusCode
    );
  }
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: URL,
      token: TOKEN,
      fetchImpl: async () => { throw new TypeError('network unavailable'); }
    }),
    error => error instanceof ExplorerApiError && error.code === 'TRANSPORT' && error.statusCode === 502
  );
});

test('rejects invalid API payloads and unsupported statuses', async () => {
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: URL,
      token: TOKEN,
      fetchImpl: async () => response(200, { transactions: [] })
    }),
    error => error instanceof ExplorerApiError && error.code === 'INVALID_PAYLOAD'
  );
  await assert.rejects(
    fetchExplorerApiEvidence({
      sourceUrl: URL,
      token: TOKEN,
      fetchImpl: async () => response(200, [transaction({ status: 'PENDING' })])
    }),
    error => error instanceof ExplorerApiError && error.code === 'UNKNOWN_STATUS'
  );
});
