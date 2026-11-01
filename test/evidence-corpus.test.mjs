import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(fs.readFileSync(path.join(here, '..', 'evidence', 'real-world-corpus.json'), 'utf8'));

test('public corpus contains at least 10 unique real-world cases', () => {
  assert.ok(corpus.length >= 10);
  assert.equal(new Set(corpus.map(x => x.source_url)).size, corpus.length);
});

test('public corpus covers failed, refunded and complete outcomes', () => {
  const counts = corpus.reduce((m, x) => (m[x.status] = (m[x.status] || 0) + 1, m), {});
  assert.ok(counts.FAILED_UNRESOLVED >= 3);
  assert.ok(counts.REFUND_VERIFIED >= 3);
  assert.ok(counts.COMPLETE >= 3);
});

test('every corpus case is source-attributed and capture-dated', () => {
  for (const item of corpus) {
    assert.match(item.source_url, /^https:\/\/explorer\.near-intents\.org\/transactions\//);
    assert.equal(item.captured_on, '2026-11-01');
    assert.ok(item.observed.length > 10);
  }
});
