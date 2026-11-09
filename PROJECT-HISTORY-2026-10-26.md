# PROJECT

## Current milestone
TECHNICAL_DERISK — pre-build dependency de-risk complete; runtime proof waits for official build opening.

## Completed work
- INTAKE: official event, dates, rules, tracks, submission requirements verified.
- RUBRIC_DECODE: current official weights are unpublished; mandatory proof and historical planning criteria separated.
- RESEARCH: current NEAR / intent-failure opportunity research completed.
- IDEATION: four candidates ranked.
- HUMAN_IDEA_GATE: user selected **1 — Intent Rescue**.
- VALIDATION: MODIFY → PASS after narrowing “rescue” to evidence-backed diagnosis/recovery assistance.
- PRODUCT_LOCK: PRODUCT.md revision 1 locked.
- DEMO_DEFINITION: 5-scene judge path defined; Scenes 1–4 are vertical-slice mandatory.
- EVIDENCE_PLAN: major claims mapped to proof.
- TECHNICAL_DERISK (pre-build portion): approval-gated API and solver-relay dependencies removed from P0; public real-world fixtures frozen; exact Nov 1 spike defined in `TECHNICAL_DERISK.md`.

## Active work
No implementation before the official build window opens on 2026-11-01 00:00 UTC. TECHNICAL_DERISK remains open only for runtime proof that cannot honestly be observed before implementation starts.

## Known blockers
- **Build-window blocker only:** executable classifier/RPC proof cannot begin before 2026-11-01 00:00 UTC.
- Partner JWT is no longer a product blocker.
- Solver relay access is no longer a product blocker.

## Technical risks
1. Runtime parser/classifier behavior is unexecuted until build opening.
2. Public Explorer URL ingestion may be brittle; the mandatory evidence-envelope fallback removes this as existential.
3. Public NEAR RPC must be exercised against known F1 txs once implementation is allowed.
4. Advice must remain conservative when a transaction has a successful NEAR swap tx but no destination/refund evidence.

## Design risks
The product must visually communicate “where did the money go?” in seconds. Avoid generic dashboard-card sprawl; the lifecycle must be the visual focal point.

## Demo risks
- Live third-party/API availability: mitigated by source-attributed evidence envelope.
- Partner JWT unavailable: removed from P0.
- Solver relay unavailable/restricted: removed from P0.
- Hero incident changes state: primary hero is a stable historical public failure; capture build-window snapshot.
- Advice appears to promise recovery: classifier contract forbids unsupported causality/refund claims.
- Demo looks like a block explorer rather than an incident-response product.

## Evidence gaps
- No implementation yet by rule.
- No executable classifier tests yet.
- No raw public NEAR RPC response captured by project code yet.
- No deployed build or user test yet.

## Deployment state
NOT STARTED — build window has not opened.

## Submission state
NOT STARTED

## Next recommended action
At 2026-11-01 00:00 UTC, Engineering runs the exact spike in `TECHNICAL_DERISK.md`:
1. normalize F1/F2/F3 evidence;
2. run pure classifier + negative cases;
3. call public NEAR `tx_status` for F1 deposit and swap txs;
4. save raw responses;
5. try Explorer URL ingestion once and cut it if brittle;
6. only then advance to BUILD_VERTICAL_SLICE.

## Evidence register
- Current ~$193K public 1Click failure remains problem evidence: NEAR Forum, observed 2026-10-25/26.
- F1 public failed/no-refund fixture: NEAR Intents Explorer `Lh8noxsXRWxJLg6hsxYRVuYD5iiWSNz9Bc`.
- F1 NEAR deposit tx: `9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF`; public explorer shows successful bridge deposit into `intents.near`.
- F1 NEAR swap tx: `HFnNzz8w5UQ6Mfga3oeKza4MiziDjASHk57fLxW3RMxT`; public explorer shows successful `execute_intents` transaction.
- F2 public refunded fixture: `0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32`.
- F3 public successful fixture: `c90a6a3eaa0b2bbdf79d56f734d6fc68c854c9e479377d0ef051b86b65c9b9d3`.
- NEAR RPC docs currently expose public providers and `tx_status`, including receipt details and `FINAL` wait mode.
- Explorer API JWT requirement observed; authenticated API is P1 only.
- Solver relay auth expectations conflict across current materials; relay is optional only.

## Decision log and lock revisions
- 2026-10-25T23:53:45+01:00: Human selected Idea 1 — Intent Rescue.
- 2026-10-25T23:53:45+01:00: Validation MODIFY → PASS; product promise narrowed to diagnosis + recovery assistance, never guaranteed refunds.
- 2026-10-25T23:53:45+01:00: PRODUCT.md locked at revision 1.
- 2026-10-25T23:53:45+01:00: DEMO.md defined.
- 2026-10-26T00:24:44+01:00: Partner JWT removed as P0 dependency; mandatory fallback is source-attributed evidence-envelope ingestion.
- 2026-10-26T00:24:44+01:00: Solver-relay status removed as P0 dependency due contradictory current auth expectations.
- 2026-10-26T00:24:44+01:00: F1/F2/F3 frozen as failed/refunded/success real-world fixtures; F1 becomes primary hero.
- 2026-10-26T00:24:44+01:00: DEMO fixture list revised without changing product thesis or core scene sequence.

## Specialist handoffs
- Research -> Product Critic: validation evidence complete.
- Product Critic -> HQ: PASS after scope tightening.
- HQ -> Engineering: technical de-risk packet prepared.
- Engineering -> HQ: pre-build dependency de-risk complete; runtime verification remains the only open technical gate.

## Pending human gate
None.

## Freeze time and deadline buffer
- Feature freeze: **2026-11-14 12:00 UTC**.
- Submission deadline: **2026-11-14 23:59 UTC**.
- Buffer reserved for reliability, recording, public repo/X post, and one-shot submission audit.

## Checkpoint revision and last verified time
Revision 10 — 2026-10-26T00:24:44+01:00