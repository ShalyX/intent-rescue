import test from 'node:test';
import assert from 'node:assert/strict';
import { unresolvedEvidenceMessage } from '../src/recovery-copy.mjs';

test('source-reported refund references are not described as absent', () => {
  const message = unresolvedEvidenceMessage({ evidence: ['0x' + 'a'.repeat(64)] }, 4, true);
  assert.match(message, /source-reported/i);
  assert.match(message, /returned funds/i);
  assert.doesNotMatch(message, /absent|not present/i);
});

test('source-reported withdrawal observations remain explicitly unverified', () => {
  const message = unresolvedEvidenceMessage({ evidence: ['Explorer reports withdrawn'] }, 3, true);
  assert.match(message, /source-reported/i);
  assert.match(message, /destination wallet/i);
  assert.doesNotMatch(message, /absent|not present/i);
});

test('missing terminal evidence is accurately described as missing', () => {
  assert.match(unresolvedEvidenceMessage({ evidence: [] }, 3, true), /no destination transaction or receipt/i);
  assert.match(unresolvedEvidenceMessage({ evidence: [] }, 4, true), /no refund transaction or receipt/i);
});

test('user-supplied terminal evidence is described as provisional, not source-verified', () => {
  const message = unresolvedEvidenceMessage({ evidence: ['0x' + 'b'.repeat(64)] }, 4, false);
  assert.match(message, /provisional/i);
  assert.match(message, /original chain source/i);
  assert.doesNotMatch(message, /source-reported/i);
});
