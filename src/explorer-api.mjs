const API_URL = 'https://explorer.near-intents.org/api/v0/transactions';
const VALID_STATUSES = new Set([
  'FAILED',
  'INCOMPLETE_DEPOSIT',
  'PENDING_DEPOSIT',
  'PROCESSING',
  'REFUNDED',
  'SUCCESS'
]);

export class ExplorerApiError extends Error {
  constructor(code, message, statusCode = 502) {
    super(message);
    this.name = 'ExplorerApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function safeList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter(item => typeof item === 'string')
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.length <= 180))];
}

function chainFromAsset(asset) {
  if (typeof asset !== 'string') return null;
  return asset.match(/^nep141:([a-z0-9]+)(?:-|\.)/i)?.[1]?.toLowerCase() || null;
}

function sameIdentifier(candidate, identifier) {
  const isHex = value => /^0x[0-9a-f]{40,128}$/i.test(value);
  return isHex(candidate) && isHex(identifier)
    ? candidate.toLowerCase() === identifier.toLowerCase()
    : candidate === identifier;
}

function matchesIdentifier(transaction, identifier) {
  const candidates = [
    ...safeList(transaction.originChainTxHashes),
    ...safeList(transaction.destinationChainTxHashes),
    ...safeList(transaction.nearTxHashes),
    ...safeList(typeof transaction.intentHashes === 'string' ? [transaction.intentHashes] : transaction.intentHashes),
    ...safeList(transaction.senders),
    ...safeList([
      transaction.depositAddress,
      transaction.depositAddressAndMemo,
      transaction.recipient
    ])
  ];
  return candidates.some(candidate => sameIdentifier(candidate, identifier));
}

function safeText(value, max = 240) {
  return typeof value === 'string' && value.trim().length
    ? value.trim().slice(0, max)
    : null;
}

export async function fetchExplorerApiEvidence({
  sourceUrl,
  token,
  fetchImpl = globalThis.fetch,
  capturedAt = new Date().toISOString()
}) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new ExplorerApiError('TOKEN_MISSING', 'Explorer API JWT is not configured', 503);
  }
  if (typeof fetchImpl !== 'function') {
    throw new ExplorerApiError('FETCH_UNAVAILABLE', 'Fetch is unavailable in this runtime', 502);
  }

  const source = new URL(sourceUrl);
  const match = source.pathname.match(/^\/transactions\/([A-Za-z0-9_-]{16,150})\/?$/);
  if (source.protocol !== 'https:' || source.hostname !== 'explorer.near-intents.org' || !match) {
    throw new ExplorerApiError('UNSUPPORTED_REFERENCE', 'Unsupported Explorer transaction URL', 400);
  }

  const transactionHash = match[1];
  const requestUrl = new URL(API_URL);
  requestUrl.searchParams.set('search', transactionHash);
  requestUrl.searchParams.set('numberOfTransactions', '10');
  requestUrl.searchParams.set('statuses', 'FAILED,INCOMPLETE_DEPOSIT,PENDING_DEPOSIT,PROCESSING,REFUNDED,SUCCESS');

  let response;
  try {
    response = await fetchImpl(requestUrl, {
      method: 'GET',
      redirect: 'error',
      signal: AbortSignal.timeout(9000),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.trim(),
        'User-Agent': 'OSIALI-explorer-api-reader/1.0'
      }
    });
  } catch {
    throw new ExplorerApiError('TRANSPORT', 'Explorer API request failed', 502);
  }

  if (response.status === 401 || response.status === 403) {
    throw new ExplorerApiError('TOKEN_REJECTED', 'Explorer API rejected the configured JWT', 503);
  }
  if (response.status === 429) {
    throw new ExplorerApiError('RATE_LIMITED', 'Explorer API rate limit reached; wait before retrying', 503);
  }
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new ExplorerApiError('UPSTREAM_ERROR', 'Explorer API returned an unusable response', 502);
  }

  let rows;
  try {
    rows = await response.json();
  } catch {
    throw new ExplorerApiError('INVALID_JSON', 'Explorer API returned invalid JSON', 502);
  }
  if (!Array.isArray(rows)) {
    throw new ExplorerApiError('INVALID_PAYLOAD', 'Explorer API response was not a transaction list', 502);
  }

  const matches = rows.filter(row => row && typeof row === 'object' && matchesIdentifier(row, transactionHash));
  if (matches.length === 0) return null;
  if (matches.length !== 1) {
    throw new ExplorerApiError('AMBIGUOUS_MATCH', 'Explorer API returned multiple exact transaction matches', 409);
  }

  const transaction = matches[0];
  const status = safeText(transaction.status, 40)?.toUpperCase();
  if (!VALID_STATUSES.has(status)) {
    throw new ExplorerApiError('UNKNOWN_STATUS', 'Explorer API returned an unsupported transaction status', 422);
  }

  const originHashes = safeList(transaction.originChainTxHashes);
  const destinationHashes = safeList(transaction.destinationChainTxHashes);
  const nearHashes = safeList(transaction.nearTxHashes);
  const intentHashes = safeList(typeof transaction.intentHashes === 'string'
    ? [transaction.intentHashes]
    : transaction.intentHashes);
  const originAsset = safeText(transaction.originAsset, 260);
  const destinationAsset = safeText(transaction.destinationAsset, 260);
  const refundReason = safeText(transaction.refundReason, 120);
  const refundTo = safeText(transaction.refundTo, 180);
  const refundFee = safeText(transaction.refundFeeFormatted, 80);
  const refundType = safeText(transaction.refundType, 40);

  const refundEvidence = status === 'REFUNDED'
    ? ['NEAR Intents Explorer API reports REFUNDED' +
      (refundReason ? ' (' + refundReason + ')' : '') +
      '; refund type: ' + (refundType || 'not supplied') +
      '; refund destination: ' + (refundTo || 'not supplied') +
      '; refund fee: ' + (refundFee || 'not supplied') +
      '. No independent refund-chain verification is implied.']
    : [];
  const destinationEvidence = status === 'SUCCESS' && destinationHashes.length
    ? ['NEAR Intents Explorer API reports SUCCESS and ' + destinationHashes.length +
      ' destination-chain transaction reference(s). This is source-reported, not independently verified.']
    : [];
  // The API groups origin-chain references but does not reliably assign each
  // hash to deposit vs refund. Preserve them as unassigned until role evidence exists.

  return {
    id: 'PUBLIC-' + transactionHash.slice(0, 12),
    source_url: source.origin + source.pathname,
    captured_at: capturedAt,
    reported_status: status,
    source_asset: originAsset,
    destination_asset: destinationAsset,
    source_chain: chainFromAsset(originAsset),
    destination_chain: chainFromAsset(destinationAsset),
    refund_chain: refundType === 'ORIGIN_CHAIN' ? chainFromAsset(originAsset) : null,
    origin_tx_hashes: [],
    unassigned_origin_tx_hashes: originHashes,
    intent_hashes: intentHashes,
    near_deposit_tx_hashes: [],
    near_swap_tx_hashes: [],
    destination_tx_hashes: status === 'SUCCESS' ? destinationHashes : [],
    // The documented Explorer API does not expose a dedicated refund transaction hash.
    // Never mislabel an origin or destination hash as a refund hash.
    refund_tx_hashes: [],
    deposit_evidence: [],
    destination_evidence: destinationEvidence,
    refund_evidence: refundEvidence,
    unassigned_near_tx_hashes: nearHashes,
    explorer_api_metadata: {
      created_at: safeText(transaction.createdAt, 40),
      amount_in_formatted: safeText(transaction.amountInFormatted, 80),
      amount_out_formatted: safeText(transaction.amountOutFormatted, 80),
      refund_reason: refundReason,
      refund_to: refundTo,
      refund_fee_formatted: refundFee,
      refund_type: refundType
    }
  };
}
