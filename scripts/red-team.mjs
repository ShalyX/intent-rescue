import fs from 'node:fs/promises';
import { classifyIncident } from '../src/classifier.mjs';
import { exportBundle } from '../src/analyze.mjs';

const cases = [
  ['empty', {}, 'INSUFFICIENT_EVIDENCE'],
  ['fake-success-flag', { reported_status:'SUCCESS', destination_verified:true }, 'INSUFFICIENT_EVIDENCE'],
  ['fake-refund-flag', { reported_status:'REFUNDED', refund_verified:true }, 'INSUFFICIENT_EVIDENCE'],
  ['conflict', { reported_status:'SUCCESS', destination_evidence:['withdrawn'], refund_evidence:['refunded'] }, 'CONFLICTED_EVIDENCE'],
  ['observed-success', { reported_status:'SUCCESS', destination_evidence:['withdrawn'] }, 'COMPLETE'],
  ['observed-refund', { reported_status:'REFUNDED', refund_evidence:['refunded'] }, 'REFUND_VERIFIED'],
];
let failed = 0;
for (const [name, input, expected] of cases) {
  const out = classifyIncident(input);
  const pass = out.classification === expected;
  console.log(`${pass?'PASS':'FAIL'}\t${name}\t${out.classification}\t${out.confidence}\t${out.safe_action}`);
  if (!pass) failed++;
}
for (const file of ['f1-failed.json','f2-refunded.json','f3-success.json']) {
  const evidence = JSON.parse(await fs.readFile(new URL(`../fixtures/${file}`, import.meta.url)));
  const bundle = exportBundle(evidence);
  const raw = JSON.stringify(bundle);
  const pass = !raw.includes('fixture-present') && bundle.lifecycle.length === 5 && bundle.diagnosis.safe_action;
  console.log(`${pass?'PASS':'FAIL'}\tbundle:${file}\t${bundle.diagnosis.classification}\tlifecycle=${bundle.lifecycle.length}`);
  if (!pass) failed++;
}
if (failed) process.exit(1);
