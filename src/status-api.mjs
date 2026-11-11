import { createHash } from 'node:crypto';
import { validTransactionHash } from './intake.mjs';

const STATUSES = ['PENDING_DEPOSIT','KNOWN_DEPOSIT_TX','INCOMPLETE_DEPOSIT','PROCESSING','SUCCESS','REFUNDED','FAILED'];
const scalar = value => (typeof value === 'string' && value.trim()) || (typeof value === 'number' && Number.isFinite(value)) ? String(value) : null;
const first = (...values) => values.map(scalar).find(value => value !== null) ?? null;
const records = values => (Array.isArray(values) ? values : []).map(item => {
  const hash = typeof item === 'string' ? item : item?.hash;
  if (!validTransactionHash(hash)) return null;
  return { hash, explorer_url: typeof item?.explorerUrl === 'string' ? item.explorerUrl : null };
}).filter(Boolean);
const hashes = values => records(values).map(item => item.hash);
const isPositive = value => {
  if (value == null) return false;
  try { return BigInt(String(value)) > 0n; }
  catch { const number = Number(value); return Number.isFinite(number) && number > 0; }
};

export function normalizeStatus(payload, address, memo, capturedAt = new Date().toISOString()) {
  if (!payload || !STATUSES.includes(payload.status)) throw Error('Unrecognized status response');
  const quoteResponse = payload.quoteResponse || {};
  const quote = quoteResponse.quote || {};
  const quoteRequest = quoteResponse.quoteRequest || {};
  if (typeof quote.depositAddress !== 'string' ||
      (/^0x[0-9a-fA-F]{40}$/.test(address)
        ? quote.depositAddress.toLowerCase() !== address.toLowerCase()
        : quote.depositAddress !== address)) {
    throw Error('Status does not match the requested deposit address');
  }

  const providerMemo = scalar(quote.depositMemo);
  const suppliedMemo = typeof memo === 'string' ? memo.trim() : '';
  if (providerMemo && !suppliedMemo) throw Error('A deposit memo is required to resolve this status');
  if (suppliedMemo && !providerMemo) throw Error('Status response does not include the supplied deposit memo');
  if (providerMemo && providerMemo !== suppliedMemo) throw Error('Status memo does not match the requested deposit');

  const details = payload.swapDetails || {};
  const originRecords = records(details.originChainTxHashes);
  const destinationRecords = records(details.destinationChainTxHashes);
  const explicitDepositRecords = records(details.depositChainTxHashes ?? details.depositTxHashes ?? details.depositTransactions);
  const explicitRefundRecords = records(details.refundChainTxHashes ?? details.refundTxHashes ?? details.refundTransactions);
  const explicitNearDeposit = hashes(details.nearDepositTxHashes);
  const explicitNearSwap = hashes(details.nearSwapTxHashes);
  const allNear = hashes(details.nearTxHashes);
  const explicitlyAssignedNear = new Set([...explicitNearDeposit, ...explicitNearSwap]);
  const unassignedNear = allNear.filter(hash => !explicitlyAssignedNear.has(hash));
  const depositHashes = explicitDepositRecords.map(item => item.hash);
  const refundHashes = explicitRefundRecords.map(item => item.hash);
  const assignedOrigin = new Set([...depositHashes, ...refundHashes]);
  const unassignedOrigin = originRecords.filter(item => !assignedOrigin.has(item.hash)).map(item => item.hash);
  const depositedAmount = first(details.depositedAmount);
  const depositedFormatted = first(details.depositedAmountFormatted, depositedAmount);
  const refundReason = first(details.refundReason);

  const providerDetails = {
    quote_request: { ...quoteRequest },
    quote: { ...quote },
    quote_signature: first(quoteResponse.signature),
    quote_timestamp: first(quoteResponse.timestamp),
    swap_type: first(quoteRequest.swapType),
    requested_amount: first(quoteRequest.amount),
    quoted_amount_in: first(quote.amountIn),
    quoted_amount_out: first(quote.amountOut),
    min_amount_in: first(quote.minAmountIn),
    min_amount_out: first(quote.minAmountOut),
    slippage_tolerance: first(quoteRequest.slippageTolerance, quote.slippageTolerance),
    amount_in: first(details.amountIn, quote.amountIn),
    amount_in_formatted: first(details.amountInFormatted, quote.amountInFormatted),
    amount_in_usd: first(details.amountInUsd, quote.amountInUsd),
    amount_out: first(details.amountOut, quote.amountOut),
    amount_out_formatted: first(details.amountOutFormatted, quote.amountOutFormatted),
    amount_out_usd: first(details.amountOutUsd, quote.amountOutUsd),
    deposited_amount: depositedAmount,
    deposited_amount_formatted: depositedFormatted,
    deposited_amount_usd: first(details.depositedAmountUsd),
    refunded_amount: first(details.refundedAmount),
    refunded_amount_formatted: first(details.refundedAmountFormatted, details.refundedAmount),
    refunded_amount_usd: first(details.refundedAmountUsd),
    refund_reason: refundReason,
    refund_fee: first(details.refundFee, quote.refundFee),
    refund_fee_formatted: first(details.refundFeeFormatted, quote.refundFeeFormatted),
    withdraw_fee: first(details.withdrawFee, quote.withdrawFee),
    withdraw_fee_formatted: first(details.withdrawFeeFormatted, quote.withdrawFeeFormatted),
    slippage: typeof details.slippage === 'number' && Number.isFinite(details.slippage) ? details.slippage : null,
    recipient: first(quoteRequest.recipient, quote.recipient),
    refund_to: first(quoteRequest.refundTo, quote.refundTo),
    deadline: first(quoteRequest.deadline, quote.deadline),
    deposit_type: first(quoteRequest.depositType, quote.depositType),
    recipient_type: first(quoteRequest.recipientType, quote.recipientType),
    refund_type: first(quoteRequest.refundType, quote.refundType),
    origin_asset_id: first(quoteRequest.originAsset),
    destination_asset_id: first(quoteRequest.destinationAsset)
  };

  const depositEvidence = isPositive(details.depositedAmount)
    ? ['1Click reports a deposited amount of ' + depositedFormatted + '; transaction role is not independently assigned.']
    : [];
  const sourceUrl = 'https://1click.chaindefuser.com/v0/status?depositAddress=' +
    encodeURIComponent(address) + (providerMemo ? '&depositMemo=' + encodeURIComponent(providerMemo) : '');

  return {
    // A deterministic hash keeps the case ID stable without exposing a deposit memo.
    id: '1click-' + createHash('sha256').update(address).update('\0').update(providerMemo || '').digest('hex').slice(0, 16),
    deposit_address: address,
    deposit_memo: providerMemo,
    correlation_id: payload.correlationId || null,
    origin_asset_id: providerDetails.origin_asset_id,
    destination_asset_id: providerDetails.destination_asset_id,
    reported_status: payload.status,
    captured_at: capturedAt,
    source_updated_at: scalar(payload.updatedAt),
    source_url: sourceUrl,
    // The API describes originChainTxHashes as all origin-chain transactions.
    // It does not reliably assign each hash to the deposit or refund leg.
    origin_tx_hashes: depositHashes,
    origin_chain_tx_hashes: originRecords.map(item => item.hash),
    unassigned_origin_tx_hashes: unassignedOrigin,
    origin_chain_transaction_records: originRecords,
    destination_tx_hashes: destinationRecords.map(item => item.hash),
    destination_chain_transaction_records: destinationRecords,
    refund_tx_hashes: refundHashes,
    refund_chain_transaction_records: explicitRefundRecords,
    intent_hashes: hashes(details.intentHashes),
    near_deposit_tx_hashes: explicitNearDeposit,
    near_swap_tx_hashes: explicitNearSwap,
    unassigned_near_tx_hashes: unassignedNear,
    deposit_evidence: depositEvidence,
    destination_evidence: payload.status === 'SUCCESS'
      ? ['1Click status reports SUCCESS; destination receipt is not independently verified in the recipient wallet.']
      : [],
    refund_evidence: payload.status === 'REFUNDED'
      ? ['1Click status reports REFUNDED; returned funds are not independently verified in the recipient wallet.']
      : [],
    refund_reason: refundReason,
    provider_details: providerDetails
  };
}

export async function readStatus(address, memo) {
  const url = new URL('https://1click.chaindefuser.com/v0/status');
  url.searchParams.set('depositAddress', address);
  if (memo) url.searchParams.set('depositMemo', memo);
  const headers = { Accept: 'application/json' };
  if (process.env.ONECLICK_API_KEY) headers.Authorization = 'Bearer ' + process.env.ONECLICK_API_KEY;
  const response = await fetch(url, { headers, redirect: 'error', signal: AbortSignal.timeout(6000) });
  if (!response.ok) {
    const error = new Error('Status provider returned ' + response.status);
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  if (text.length > 250000) throw Error('Status response too large');
  const evidence = normalizeStatus(JSON.parse(text), address, memo);
  try {
    const tokensResponse = await fetch('https://1click.chaindefuser.com/v0/tokens', { signal: AbortSignal.timeout(3000) });
    if (tokensResponse.ok) {
      const tokens = await tokensResponse.json();
      if (Array.isArray(tokens)) {
        const origin = tokens.find(token => token.assetId === evidence.origin_asset_id);
        const destination = tokens.find(token => token.assetId === evidence.destination_asset_id);
        evidence.source_asset = origin?.symbol || null;
        evidence.destination_asset = destination?.symbol || null;
        evidence.source_chain = origin?.blockchain || null;
        evidence.destination_chain = destination?.blockchain || null;
        if (evidence.provider_details.refund_type === 'ORIGIN_CHAIN') evidence.refund_chain = evidence.source_chain;
      }
    }
  } catch {}
  return evidence;
}
