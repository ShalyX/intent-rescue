import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

const endpoint = process.env.NEAR_RPC_URL || 'https://rpc.mainnet.near.org';
const outDir = fileURLToPath(new URL('../fixtures/rpc/', import.meta.url));
const checks = [
  ['deposit', '9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF', 'bridge-mng.near'],
  ['swap', 'HFnNzz8w5UQ6Mfga3oeKza4MiziDjASHk57fLxW3RMxT', 'intents.near']
];

await fs.mkdir(outDir, { recursive: true });
for (const [label, txHash, senderAccountId] of checks) {
  const body = {
    jsonrpc: '2.0', id: 'osiali', method: 'tx',
    params: { tx_hash: txHash, sender_account_id: senderAccountId, wait_until: 'FINAL' }
  };
  const startedAt = new Date().toISOString();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  const envelope = { endpoint, verified_at: new Date().toISOString(), started_at: startedAt, request: body, http_status: response.status, response: json };
  const file = path.join(outDir, `f1-${label}.json`);
  await fs.writeFile(file, JSON.stringify(envelope, null, 2));
  const status = json?.result?.final_execution_status || JSON.stringify(json?.result?.status || json?.error || 'unknown');
  console.log(`${label}\tHTTP ${response.status}\t${status}\t${file}`);
}
