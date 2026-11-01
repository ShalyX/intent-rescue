# Intent Rescue — Evidence Pack

This file separates **what we observed** from **what the product infers**. It is intended for judges, reviewers, and anyone auditing the demo claims.

## 1. Real problem evidence

A current NEAR Forum incident reports a 575,830 TRX (~$193K) 1-Click swap that reached `FAILED` with zero refund, no destination transaction, and no clear recovery path after multiple support attempts:

- https://gov.near.org/t/failed-near-intents-1-click-swap-575-830-trx-193k-stuck-failed-status-zero-refund-no-support-response/42664

That incident is not used as a fabricated demo transaction. It is problem evidence showing why a failure label alone is insufficient for a user deciding what to do next.

## 2. Public real-world corpus

`evidence/real-world-corpus.json` contains **10 public NEAR Intents Explorer cases** captured from real transaction pages:

- 3 failed / unresolved cases
- 4 refunded cases
- 3 complete cases
- routes spanning Litecoin, Ethereum, Tron, TON, Base/Gnosis, Dash/Bitcoin, Stellar, Solana, Zcash and NEAR Intents assets
- observed input values ranging from sub-$1 tests to roughly $225K

The corpus is observational evidence. We do not claim independent archival-chain verification for every historical record.

## 3. Canonical product fixtures

Three cases are frozen as reproducible product fixtures:

| Fixture | Public outcome | Intent Rescue result |
|---|---|---|
| F1 | Failed; deposit observed; no destination/refund observed | `FAILED_UNRESOLVED`, first unresolved leg = destination delivery |
| F2 | Refunded | `REFUND_VERIFIED` |
| F3 | Successful withdrawal | `COMPLETE` |

Each fixture retains its original Explorer URL and capture timestamp.

## 4. Independent NEAR technical proof

During technical de-risking, Intent Rescue executed a public NEAR mainnet RPC transaction-status query against a current transaction and observed:

- final execution status: `FINAL`
- transaction status payload returned successfully
- receipt outcomes returned

The raw proof was captured locally during the build. Historical F1 verification remains snapshot-backed because free public RPC providers were not reliably archival for that older transaction.

## 5. Safety / false-positive proof

Automated tests and red-team cases explicitly reject unsafe conclusions:

- a caller-supplied `destination_verified=true` without concrete evidence does **not** become `COMPLETE`
- a caller-supplied `refund_verified=true` without concrete evidence does **not** become `REFUND_VERIFIED`
- conflicting destination + refund evidence becomes `CONFLICTED_EVIDENCE`
- empty evidence remains low-confidence and insufficient
- missing evidence is never translated into “funds lost” or protocol fault

Run:

```bash
npm test
npm run red-team
```

## 6. Reproducibility

Current reproducibility proof on November 1, 2026:

- **17/17 automated tests passing**
- **9/9 red-team scenarios passing**
- **10 unique public Explorer cases** in the evidence corpus
- **30,000 repeated classifications** across the three canonical fixtures with zero classification drift
- benchmark p50 for all three fixture classifications: ~0.009 ms on the development machine (performance is secondary; determinism is the claim)

Run `npm run evidence:benchmark` to reproduce the determinism check.

The repository contains deterministic fixtures, classifier rules, lifecycle reconstruction, evidence-bundle generation, adversarial tests, a static deployment build, and three judge URLs:

- https://intent-rescue.vercel.app/?demo=F1
- https://intent-rescue.vercel.app/?demo=F2
- https://intent-rescue.vercel.app/?demo=F3

A reviewer can reproduce the core claim without credentials, a funded wallet, or executing a new financial transaction.

## 7. What we do NOT claim

Intent Rescue does not claim to:

- automatically recover or refund funds;
- identify a protocol root cause when the evidence only shows a missing lifecycle leg;
- prove that every historical Explorer record is independently archival-RPC verified;
- replace NEAR support or custody assets.

The product claim is narrower: **given source-attributed evidence, reconstruct the lifecycle, identify the first unresolved leg, expose provenance, recommend an evidence-bounded next action, and export a support-ready case bundle.**
