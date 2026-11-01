import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.copyFile(path.join(root, 'public', 'index.html'), path.join(dist, 'index.html'));
await fs.cp(path.join(root, 'public'), path.join(dist, 'public'), { recursive: true });
await fs.cp(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
await fs.mkdir(path.join(dist, 'fixtures', 'rpc'), { recursive: true });
for (const file of ['f1-failed.json', 'f2-refunded.json', 'f3-success.json']) {
  await fs.copyFile(path.join(root, 'fixtures', file), path.join(dist, 'fixtures', file));
}
await fs.copyFile(path.join(root, 'fixtures', 'rpc', 'recent-tx-proof.json'), path.join(dist, 'fixtures', 'rpc', 'recent-tx-proof.json'));
console.log(`Static build ready: ${dist}`);
