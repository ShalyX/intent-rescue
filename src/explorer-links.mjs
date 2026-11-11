// Only emit public explorer links when BOTH the chain and hash format are explicit.
// Never infer a destination chain from a token ticker or a missing transaction.
const evm = /^0x[0-9a-fA-F]{64}$/;
const hex = /^[0-9a-fA-F]{64}$/;
const near = /^[1-9A-HJ-NP-Za-km-z]{42,50}$/;
const solana = /^[1-9A-HJ-NP-Za-km-z]{65,90}$/;
const RULES = {
  near: ['https://nearblocks.io/txns/',near],
  ethereum: ['https://etherscan.io/tx/',evm],
  base: ['https://basescan.org/tx/',evm],
  arbitrum: ['https://arbiscan.io/tx/',evm],
  optimism: ['https://optimistic.etherscan.io/tx/',evm],
  polygon: ['https://polygonscan.com/tx/',evm],
  gnosis: ['https://gnosisscan.io/tx/',evm],
  bitcoin: ['https://mempool.space/tx/',hex],
  litecoin: ['https://litecoinspace.org/tx/',hex],
  solana: ['https://solscan.io/tx/',solana],
  tron: ['https://tronscan.org/#/transaction/',hex]
};
export function chainTransactionUrl(chain, hash) {
  const rule = RULES[String(chain || '').trim().toLowerCase()];
  if (!rule || typeof hash !== 'string' || !rule[1].test(hash)) return null;
  return rule[0] + encodeURIComponent(hash);
}
export function explorerReferences(evidence) {
  const links = (chain, values) => (Array.isArray(values) ? values : [])
    .map(hash => chainTransactionUrl(chain, hash))
    .filter(Boolean);
  let official = null;
  try {
    const u = new URL(evidence.source_url);
    if (u.protocol === 'https:' && u.hostname === 'explorer.near-intents.org' &&
        /^\/transactions\/[^/]+\/?$/.test(u.pathname)) official = u.href;
  } catch {}
  const nearDeposit = links('near', evidence.near_deposit_tx_hashes);
  const nearSwap = links('near', evidence.near_swap_tx_hashes);
  const unassignedOrigin = links(evidence.source_chain, evidence.unassigned_origin_tx_hashes || evidence.origin_chain_tx_hashes);
  const unassignedNear = links('near', evidence.unassigned_near_tx_hashes);
  return {
    near_intents_explorer: official,
    origin_transactions: links(evidence.source_chain, evidence.origin_tx_hashes),
    unassigned_origin_transactions: unassignedOrigin,
    near_deposit_transactions: nearDeposit,
    near_swap_transactions: nearSwap,
    near_transactions: [...nearDeposit, ...nearSwap],
    unassigned_near_transactions: unassignedNear,
    destination_transactions: links(evidence.destination_chain, evidence.destination_tx_hashes),
    refund_transactions: links(evidence.refund_chain, evidence.refund_tx_hashes)
  };
}
