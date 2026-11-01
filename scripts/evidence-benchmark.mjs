import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { analyzeEvidence } from '../src/analyze.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const fixtures = ['f1-failed.json','f2-refunded.json','f3-success.json'].map(name => JSON.parse(fs.readFileSync(path.join(root, 'fixtures', name), 'utf8')));
const expected = ['FAILED_UNRESOLVED','REFUND_VERIFIED','COMPLETE'];
const runs = 10000;
const timings = [];

for (let r = 0; r < runs; r++) {
  const start = performance.now();
  for (let i = 0; i < fixtures.length; i++) {
    const out = analyzeEvidence(fixtures[i]);
    if (out.classification !== expected[i]) throw new Error(`nondeterministic classification at run ${r}, fixture ${i}`);
  }
  timings.push(performance.now() - start);
}

timings.sort((a,b) => a-b);
const q = p => timings[Math.min(timings.length - 1, Math.floor(timings.length * p))];
console.log(JSON.stringify({fixture_count: fixtures.length, rounds: runs, classifications: runs * fixtures.length, deterministic: true, p50_ms_per_three_cases: q(0.50), p95_ms_per_three_cases: q(0.95), max_ms_per_three_cases: timings.at(-1)}, null, 2));
