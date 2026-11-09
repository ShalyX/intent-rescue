# OSIALI â€” Evidence Pack

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

| Fixture | Public outcome | OSIALI result |
|---|---|---|
| F1 | Failed; deposit observed; no destination/refund observed | `FAILED_UNRESOLVED`, first unresolved leg = destination delivery |
| F2 | Refunded | `REFUND_VERIFIED` |
| F3 | Successful withdrawal | `COMPLETE` |

Each fixture retains its original Explorer URL and capture timestamp.

## 4. Independent NEAR technical proof

During technical de-risking, OSIALI executed a public NEAR mainnet RPC transaction-status query against a current transaction and observed:

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
- missing evidence is never translated into â€œfunds lostâ€ or protocol fault

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

### Preserved proof artifacts

The repository also preserves the observed command outputs used for this evidence pass:

- `evidence/test-output.txt` â€” 17/17 automated test result
- `evidence/red-team-output.txt` â€” adversarial safety scenarios
- `evidence/benchmark-output.txt` â€” 30,000-repeat determinism benchmark
- `evidence/mainnet-rpc-proof.json` â€” captured public NEAR mainnet `tx` proof with `FINAL` execution status and receipt outcomes

These files are supporting evidence, not substitutes for the live product workflow.

## 7. What we do NOT claim

OSIALI does not claim to:

- automatically recover or refund funds;
- identify a protocol root cause when the evidence only shows a missing lifecycle leg;
- prove that every historical Explorer record is independently archival-RPC verified;
- replace NEAR support or custody assets.

The product claim is narrower: **given source-attributed evidence, reconstruct the lifecycle, identify the first unresolved leg, expose provenance, recommend an evidence-bounded next action, and export a support-ready case bundle.**

## 8. November 8 â€” newest Operator Product Integrity re-audit

Current local revision is **not yet certified as the production deployment**. New proof covers captured-identifier intake and support handoff; prior November 1 figures above are historical, not the latest local test totals.

| Claim ID | Critical claim | Status | Reproducible proof | Limitation / judge-facing location |
|---|---|---|---|---|
| C1 | Real F1/F2/F3 captured outcomes reconstruct correctly | VERIFIED locally | `npm test`; `?demo=F1/F2/F3`; `fixtures/` | Source-attributed snapshots, not live changing status |
| C2 | Known Explorer URL/hash can load a captured case | VERIFIED locally | `src/intake.mjs` tests + `scripts/operator-integrity-check.js` run | Three captured cases only; unknown inputs do not automatically resolve |
| C3 | Unknown ID cannot be misreported as verified | VERIFIED locally | Resolver test and Playwright unknown-ID regression | No partner API / archival universal search |
| C4 | Arbitrary manual JSON is not authenticated | VERIFIED UI safeguard | Playwright provisional warning and exported `source.assurance` | Human must verify original chain/explorer evidence |
| C5 | Support JSON contains missing evidence and escalation request | VERIFIED locally | Playwright actual downloaded JSON, `src/evidence-bundle.mjs` | No custody/refund action |
| C6 | Automated regression coverage | MEASURED locally | **23/23 Node tests** on Nov 8, `npm test` | Local Windows Node 24 revision; must rerun on published commit |
| C7 | Desktop + mobile forensic desk displays | OBSERVED locally | `qa/operator-F1-desktop.png`, `qa/operator-F1-mobile.png` at 1440Ã—1000 and 390Ã—844 | Browser captures not yet proof of public deployment |
| C8 | Current production alias matches the audited repository revision | VERIFIED | Vercel production deployment dpl_CxeQQAnsZcXve62MMskuq6ZCT9Xz is READY on commit f667036e932ee638ef1aba57da4d234e00d47ee5; alias intent-rescue.vercel.app assigned; live Playwright manual-fallback regression passed | Branding is still provisional; deployment correctness does not approve Docketrail |
| C9 | Current demo video matches November 8 UI and export | STALE | November 1 screenshot sequence exists | Re-record required; see DEMO.md |
| C10 | Universal automatic private-history lookup for arbitrary deposit/source-chain/correlation identifiers | BLOCKED / OUT OF P0 SCOPE | Partner historical API access is unavailable; the approved P0 fallback is source-attributed manual evidence JSON, not universal auto-indexing | Never claim universal auto-tracing; supported P0 manual fallback is separately verified |
| C11 | External impact/adoption validated by NEAR users | UNPROVEN | No independent feedback artifact yet | Do not invent endorsements |

Evidence rules: preserve input source, date, freshness, environment and limitations. Do not present provisional analysis as independently verified, or the previous UI/demo as current production.
## 9. November 9 â€” conditional chain reference upgrade
- **C12 (VERIFIED in current production):** the F1 evidence bundle exposes its explicit Litecoin-origin transaction and two NEAR transaction records as external verification links; synthetic Base/Ethereum/refund examples validate chain-specific routing; malformed hashes, token-only ambiguous chains and absent destination/refund IDs never receive fabricated links.
- Proof: `test/explorer-links.test.mjs` (3 new acceptance cases); 26/26 Node tests passing on 2026-11-09; static build succeeded. `src/explorer-links.mjs` is a format-safe link builder, **not live-chain verification or proof the external URL serves historical data**.
- C8 is now VERIFIED on production commit f667036; the current alias is assigned and the production manual-fallback regression passed. C9 remains STALE and is not final submission media. C10 universal automatic private-history lookup remains BLOCKED and is not a locked P0; the source-attributed manual fallback is the P0 path.

## 10. November 9 â€” public Explorer page retrieval (commit 99d8257)
- **C13 VERIFIED / bounded:** a read-only Vercel endpoint at `/api/incident?reference=...` reads server-rendered public NEAR Intents Explorer transaction pages without a partner JWT, extracts outcome and explicit transaction references, and **rejects ambiguous/unparseable pages**. Fixed-host URL allowlist and redirect refusal; no wallet interaction or automatic refund.
- **10/10 OBSERVED:** the parser's outcome category matched 10 distinct public Explorer records in `evidence/real-world-corpus.json` on November 9. This is **agreement with Explorer-reported outcome**, *not* independent chain verification, accuracy on all historical cases, or a statistical generalization.
- **30/30 MEASURED** automated Node tests passed including four new public-page/API safety scenarios and a clean static build.
- **Historical deployment proof:** Vercel was READY on Git commit `99d8257`. The current production alias has since advanced to `f667036e932ee638ef1aba57da4d234e00d47ee5` and is READY. HTTP 200 for uncaptured failed case `221c8aa1...`, refunded case `XmTZSEy...`, and completed case `6c57a1c...`. Browser loaded the uncaptured failed case as `PUBLIC_EXPLORER_SNAPSHOT`, classified FAILED_UNRESOLVED, and visibly stated `Not independently verified on-chain`. Unknown ID removed the prior result and supplied the manual JSON fallback.
- **Known limitations:** partner-authenticated status APIs are not used; direct source-chain hash, deposit address and unrelated correlation-ID resolution do not auto-resolve through the public page endpoint; a public HTML page can change or lag, and reported status is not chain-finality proof. The approved manual evidence JSON fallback requires a matching searched identifier and remains provisional. Safe fallback refuses diagnosis rather than inventing missing evidence. Proof status for **universal automatic lookup = BLOCKED / not P0**.

## 2026-11-09 Proof Engine close
- C01a approved product thesis: VERIFIED by the original PRODUCT.md revision 1 and current product-coverage audit.
- C01b customer-facing brand identity: OSIALI explicitly approved by the user on 2026-11-09; current production deployment and OG preview still require OSIALI alignment and verification.
- C02 supported multi-identifier intake: VERIFIED within the documented manual-fallback contract. Unit tests cover deposit address, correlation ID, source/destination identifiers and status-payload normalization. A live production browser run verified matching correlation-ID evidence is accepted only as provisional/unverified and mismatched evidence is rejected. Do not claim automatic private-history lookup for every identifier.
- C03 public Explorer lookup: VERIFIED for 10/10 corpus outcomes as Explorer-reported categories, plus live FAILED/REFUNDED/SUCCESS endpoint cases. Not independent chain-finality verification.
- C04 five-leg route + conservative diagnosis: VERIFIED by F1/F2/F3 integrated browser + 9/9 red-team.
- C05 chain-specific links: VERIFIED by F1 Litecoin + NEAR and F2 Base origin + refund; missing destination remains unlinked.
- C06 support handoff: VERIFIED by live browser download of public Explorer case JSON.
- C07 local reproducibility: VERIFIED via npm start, local /api/incident HTTP 200, 35 tests, 9 red-team, static build.
- C08 reliability benchmark: MEASURED 30,000 deterministic classifications across 10,000 rounds; machine-local microbenchmark, not user-facing latency.


## 11. November 9 â€” production and manual-fallback proof reconciliation
- **C14 VERIFIED in production:** current deployment dpl_CxeQQAnsZcXve62MMskuq6ZCT9Xz is READY, commit f667036e932ee638ef1aba57da4d234e00d47ee5, with alias intent-rescue.vercel.app. Vercel deployment metadata confirms commit and alias; live browser opened the alias and exercised the manual-evidence path.
- **C15 VERIFIED in production:** a searched correlation ID with matching source-attributed JSON was accepted only as provisional/unverified; a payload containing a different correlation ID was rejected; corrected matching evidence was accepted; support JSON download succeeded; F2 refund and F3 completion contrasts rendered; 390px mobile viewport had no horizontal overflow. Reproducible script: scripts/operator-integrity-check.js.
- **C16 F1 historical RPC status: BLOCKED / NOT CLAIMED:** evidence/mainnet-rpc-proof.json is a different current transaction, not either F1 transaction. It proves the public RPC tx_status response path only. F1 is an Explorer-reported public snapshot and is not independently archival-RPC verified.
- **C17 brand identity: BLOCKED:** Docketrail is present in deployed HTML/OG/video but was never user-approved. OSIALI product thesis remains locked; final customer-facing name remains open. Do not publish the provisional brand.
