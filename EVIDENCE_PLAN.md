# EVIDENCE PLAN

Defined: 2026-10-25T23:53:45+01:00

| Claim | Required proof | Owner | Method | Deadline | Status |
|---|---|---|---|---|---|
| Failed NEAR Intents swaps can leave users without a clear recovery path | Public incident + wallet/support docs | Research | Cite public forum incident and official/partner documentation | Before build | OBSERVED |
| OSIALI reconstructs the lifecycle correctly | Test matrix across status combinations | Engineering | Deterministic fixture + integration tests | Before vertical-slice exit | PLANNED |
| Product uses real NEAR evidence | At least one public/live NEAR tx and NEAR Intents status/explorer record | Engineering | Verify F1 NEAR deposit + swap tx with public `tx_status` and preserve raw response | Before vertical-slice exit | SOURCE IDENTIFIERS PROVEN / RUNTIME PENDING |
| Advice is safe and evidence-bounded | Rule table + negative tests | Engineering + QA | Test retry/wait/escalate conditions | Before RED_TEAM | PLANNED |
| Hero incident is not fabricated | Public source identifier + timestamp + source link | Research | F1 public Explorer + NearBlocks evidence recorded in TECHNICAL_DERISK.md; re-snapshot during build | Before demo recording | OBSERVED |
| Product works without a newly executed financial transaction | Repeatable judge path | QA | Cold-start demo from identifier/payload | Before RED_TEAM | PLANNED |
| Live ingestion works if API credential is available | API response capture and integration test | Engineering | Authorized partner API call | During build window | OPTIONAL / OPEN |
| Judges can understand value rapidly | 60–90 sec demo rehearsal | Pitch + Judge | Timed run and critique | Before FEATURE_FREEZE | PLANNED |

## Evidence rules

- Never imply a refund occurred unless a refund transaction is observed.
- Never infer a root cause when only a missing stage is proven.
- Snapshot/demo fixtures must carry source and capture timestamp.
- Synthetic fixtures are valid for test coverage, not for claims of real-world incidents.
- A real financial transaction is optional evidence, not a mandatory dependency.


## Frozen real-case fixture set

- F1 FAILED / no refund observed: `Lh8noxsXRWxJLg6hsxYRVuYD5iiWSNz9Bc`
- F2 REFUNDED: `0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32`
- F3 SUCCESS: `c90a6a3eaa0b2bbdf79d56f734d6fc68c854c9e479377d0ef051b86b65c9b9d3`

These are public historical incidents/transactions, not fabricated product output. Capture fresh source snapshots during the official build window before committing fixture files.
## 2026-11-09 current proof status refresh

| Original claim | Current status | Proof / boundary |
|---|---|---|
| Failed NEAR Intents swaps can leave users without a clear recovery path | OBSERVED | NEAR Forum incident, partner help documentation, and 10 public Explorer cases. No user interview/adoption claim. |
| OSIALI reconstructs lifecycle correctly | VERIFIED | 35/35 current Node tests, F1/F2/F3 integrated browser path and export. |
| Product uses real NEAR evidence | VERIFIED AS SOURCE-ATTRIBUTED SNAPSHOTS; historical F1 RPC proof NOT VERIFIED | 10 public Explorer records parsed against Explorer-reported outcomes. Separate NEAR RPC FINAL proof is for an unrelated transaction and proves the RPC primitive only. F1 is explicitly snapshot-backed. |
| Advice is safe and evidence-bounded | VERIFIED | 9/9 red-team plus false-success/refund, conflict and empty-evidence tests. |
| Hero incident is not fabricated | OBSERVED | F1 public Explorer URL, captured timestamp, public fixture and source link. Not independent archival-chain verification. |
| Product works without a newly executed financial transaction | VERIFIED | Live production F1/F2/F3 path, matching manual evidence fallback, mismatch rejection and actual JSON export. |
| Live ingestion with partner credential | REMOVED FROM P0 / OPTIONAL P1 | No partner JWT required for judge path. |
| Judges understand value rapidly | NOT YET VERIFIED | Existing 46.44-second recording decodes and shows interactions, but original 60–90-second target, script/voice/caption package and approved brand are not met. |

The original plan is preserved above; this addendum updates proof status without rewriting the original decision.


## 2026-11-09 — post-name-lock revalidation

The customer-facing brand is now OSIALI. This is a brand rename only; it introduces no new technical or product-performance claims. The original seven P0 capabilities, proof methods, evidence standards and explicit limitations remain unchanged. This evidence plan is revalidated for the approved name. Current release identity and demo artifacts still require OSIALI alignment and fresh verification.
