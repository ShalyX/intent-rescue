import fs from 'node:fs/promises';

const endpoint = process.env.NEAR_RPC_URL || 'https://near.drpc.org';
const out = 'C:\\Users\\USER\\Documents\\intent-rescue\\fixtures\\rpc\\recent-tx-proof.json';

async function rpc(method, params, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'intent-rescue', method, params }),
      signal: controller.signal,
    });
    const json = await response.json();
    if (!response.ok || json.error) throw new Error(JSON.stringify(json.error || { http: response.status }));
    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

const startedAt = new Date().toISOString();
const block = await rpc('block', { finality: 'final' });
let chosen = null;
for (const c of block.chunks) {
  const chunk = await rpc('chunk', { chunk_id: c.chunk_hash });
  if (chunk.transactions?.length) {
    chosen = chunk.transactions[0];
    break;
  }
}
if (!chosen) throw new Error('No transaction found in finalized block chunks');
const tx = await rpc('tx', {
  tx_hash: chosen.hash,
  sender_account_id: chosen.signer_id,
  wait_until: 'FINAL',
});
const proof = {
  endpoint,
  started_at: startedAt,
  verified_at: new Date().toISOString(),
  block_height: block.header.height,
  block_hash: block.header.hash,
  tx_hash: chosen.hash,
  signer_id: chosen.signer_id,
  receiver_id: chosen.receiver_id,
  final_execution_status: tx.final_execution_status,
  status: tx.status,
  receipt_outcomes: tx.receipts_outcome?.length ?? 0,
};
await fs.writeFile(out, JSON.stringify(proof, null, 2));
console.log(JSON.stringify(proof, null, 2));
