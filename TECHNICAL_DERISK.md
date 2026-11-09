# TECHNICAL DE-RISK — Intent Rescue

Checked: 2026-10-26T00:24:44+01:00
Phase owner: Engineering under Hackathon Operator / HQ

## Objective

Remove any dependency that could make the judge path fail because of partner approval, a private API, or an unstable live service. Preserve the locked product thesis: reconstruct a NEAR Intents incident, identify the first unresolved leg, recommend a safe next action, and export evidence.

## Exit condition

TECHNICAL_DERISK does **not** exit before the build window. Pre-build research can prove or remove dependency risk, but runtime parsing/RPC/classifier behavior must still be executed after 2026-11-01 00:00 UTC.

The Nov 1 spike is allowed to be tiny and ugly; it exists only to turn the remaining runtime assumptions into observed proof.

---

## Risk register

| Risk / assumption | Evidence | Decision | Status before Nov 1 | Nov 1 proof |
|---|---|---|---|---|
| P0 needs 1Click status API or Explorer API credentials | Intents Explorer API docs require JWT; current 1Click SDK material also treats execution-status access as protected, while newer NEAR agent-skill material is less strict about auth. Auth behavior is therefore not stable enough to be existential. | Required judge path must not call either API. Live authenticated ingestion is P1 only. | **REPLACED** | None required for P0 |
| P0 needs solver-relay `get_status` | NEAR tutorial shows unauthenticated `get_status`, but newer SDK material describes partner key auth. | Solver relay becomes optional enrichment only. Never required to classify the demo incidents. | **REMOVED** as existential dependency | Try once if convenient; failure does not block vertical slice |
| Public incident evidence exists without partner credentials | Public NEAR Intents Explorer transaction pages expose lifecycle state, amounts, intent hashes, NEAR tx hashes, and refund/destination evidence. Three stable cases recorded below. | Use public Explorer evidence as the canonical incident fixture source. | **PROVEN** | Re-open fixture URLs and snapshot during build window |
| Judge path must live-scrape Explorer HTML | Public pages are readable, but browser CORS / server-side parsing stability is not yet proven. | URL ingestion is an adapter, not the core. Guaranteed fallback is import/paste of a captured evidence envelope that carries source URL + capture timestamp. | **REMOVED** as existential dependency | Try URL adapter first; if brittle, keep import path and label snapshot mode visibly |
| Product needs a permissionless NEAR verification primitive | Current NEAR RPC docs list public mainnet endpoints and `tx_status`; `tx_status` returns receipts and supports `wait_until: FINAL`. Known fixture NEAR txs and sender accounts are available. | Verify NEAR-side bridge/deposit/swap legs through public RPC when live. If RPC is temporarily unavailable in demo, retain source links and captured response snapshot. | **DOC-PROVEN; runtime pending** | Execute `tx_status` against hero NEAR txs through one public provider and save response |
| We need independent APIs for every origin/destination chain | Explorer already links origin/destination/refund chain transactions; implementing every chain adapter would explode scope. | P0 independently verifies the NEAR leg only. Other-chain evidence is explicitly labeled `OBSERVED_FROM_EXPLORER` unless an adapter exists. | **REMOVED** | None |
| A real failed, refunded, and successful case can exercise one classifier | Stable public cases exist below with materially different outcomes. | Freeze these as initial golden real-world fixtures. | **PROVEN** | Capture normalized evidence envelopes and expected classifier outputs |
| Classifier could overclaim root cause | The Explorer can prove state/transactions but not always internal root cause. | Classifier outputs `first_unresolved_step` and confidence, not unsupported causality. | **REPLACED** by conservative semantics | Run golden tests + negative cases |

---

## Credential-independent P0 architecture

### Adapter A — Evidence envelope (mandatory, guaranteed)
User can paste/import a normalized evidence JSON captured from a public NEAR Intents Explorer transaction or an authorized 1Click status response.

Minimum normalized fields:

```text
source_url
captured_at
reported_status
created_at?
deposit_address_or_id?
origin_tx_hashes[]
intent_hashes[]
near_deposit_tx_hashes[]
near_swap_tx_hashes[]
destination_tx_hashes[]
refund_tx_hashes[]
refund_amount?
refund_reason?
refund_to?
source_asset?
destination_asset?
```

Every field retains provenance. Missing arrays are empty, not inferred.

### Adapter B — Public Explorer URL (preferred UX, optional dependency)
Attempt to ingest a public `explorer.near-intents.org/transactions/...` URL. If parsing is not robust on Nov 1, cut this adapter from the vertical slice rather than weakening reliability.

### Verifier — Public NEAR RPC (P0 technical proof)
For each NEAR transaction for which hash + signer are known, query `tx_status` at `FINAL` and record:
- transaction status;
- signer / receiver;
- receipt outcomes;
- logs relevant to the evidence;
- RPC endpoint and verification timestamp.

This verifies the NEAR leg independently from the Intents Explorer presentation.

### Optional enrichments (never judge-path blockers)
- authenticated 1Click `/v0/status`;
- authenticated Intents Explorer API;
- solver-relay `get_status`;
- chain-specific origin/destination RPC adapters.

---

## Frozen real-world fixtures

### F1 — FAILED / no refund observed — primary hero
NEAR Intents Explorer:
`https://explorer.near-intents.org/transactions/Lh8noxsXRWxJLg6hsxYRVuYD5iiWSNz9Bc`

Observed public evidence:
- 4,000 LTC -> ETH;
- deposit completed;
- overall state: **Failed**;
- Explorer explicitly says deposit was not refunded;
- origin deposit transaction is present;
- intent hash present: `HW6fpeeFmdj3QxgAaBo2M3WN3rk78dJ38PSPKA8G7hgp`;
- NEAR deposit tx: `9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF`;
- NEAR swap tx: `HFnNzz8w5UQ6Mfga3oeKza4MiziDjASHk57fLxW3RMxT`.

Independent NEAR evidence already visible through NearBlocks:
- NEAR deposit tx is successful, from `bridge-mng.near` to `omft.near`, and transfers 4,000 LTC into `intents.near`;
- NEAR swap tx is successful, from `intents.near` to `intents.near`, executes intents and burns the ETH withdrawal asset.

Expected Intent Rescue diagnosis:
- Source/bridge deposit: VERIFIED
- 1Click/Intents intake: VERIFIED
- Intent execution: VERIFIED
- Destination delivery: NOT_OBSERVED
- Refund: NOT_OBSERVED
- First unresolved step: destination withdrawal/delivery
- Confidence: HIGH for observed stages, LOW/UNKNOWN for exact causal root cause
- Safe action: **Do not duplicate-retry with the same funds. Escalate with evidence; verify destination/refund before creating a fresh quote.**

Why this fixture is better than using the ~$193K forum incident as the hero: it is directly reproducible from a public Explorer URL and contains full intent/NEAR transaction evidence. The ~$193K case remains strong problem evidence.

### F2 — REFUNDED — contrast case
NEAR Intents Explorer:
`https://explorer.near-intents.org/transactions/0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32`

Observed public evidence:
- Base USDC -> Gnosis xDAI;
- deposit completed;
- overall state: **Refunded**;
- reason: deadline passed;
- refund amount and refund transaction are present;
- intent and NEAR transaction evidence are present.

Expected diagnosis:
- Deposit: VERIFIED
- Swap outcome: TERMINAL_NON_SUCCESS
- Refund: VERIFIED
- Safe action: **Refund confirmed. The original quote is spent; create a fresh quote if retrying.**

### F3 — SUCCESS — healthy control
NEAR Intents Explorer:
`https://explorer.near-intents.org/transactions/c90a6a3eaa0b2bbdf79d56f734d6fc68c854c9e479377d0ef051b86b65c9b9d3`

Observed public evidence:
- ZEC -> ETH;
- deposit completed;
- processed successfully;
- withdrawn successfully;
- destination recipient shown;
- intent hash and NEAR swap transaction present.

Expected diagnosis:
- Expected lifecycle stages: VERIFIED
- Safe action: **Complete — no recovery action required.**

### Additional public failed/no-refund fixture
`https://explorer.near-intents.org/transactions/221c8aa1a8ac320aa58174f9ff57d0fbc36316d7dc469f630e05e1b34f9e4d80`

Use as a secondary negative case so F1 is not the only failed fixture.

---

## Conservative classifier contract

The classifier may only emit facts from evidence predicates.

| Evidence condition | Classification | Safe action |
|---|---|---|
| destination delivery observed / SUCCESS | COMPLETE | No recovery action |
| refund tx observed / REFUNDED | REFUND_VERIFIED | Fresh quote may be created if user wants to retry |
| deposit verified + terminal FAILED + no destination + no refund | FAILED_UNRESOLVED | Do not duplicate-retry; escalate with evidence |
| deposit verified + PROCESSING + no terminal evidence | IN_PROGRESS | Wait; do not duplicate-retry |
| PENDING_DEPOSIT + no deposit evidence | DEPOSIT_NOT_OBSERVED | Verify source transaction/address/memo |
| INCOMPLETE_DEPOSIT + refund observed | INCOMPLETE_REFUNDED | Refund verified; fresh quote required for retry |
| INCOMPLETE_DEPOSIT + refund not observed | INCOMPLETE_REFUND_UNRESOLVED | Track refund / escalate; do not assume funds are returned |
| evidence conflicts | CONFLICTED_EVIDENCE | Show conflict, make no retry-safe claim |
| missing required evidence | INSUFFICIENT_EVIDENCE | Ask for specific missing identifier/payload |

Forbidden classifier language unless directly proven:
- "solver stole funds";
- "bridge failed";
- "funds are lost";
- "refund guaranteed";
- "root cause is X" when only a missing leg is known.

---

## Exact Nov 1 technical spike

**Do not scaffold the product before this spike passes.**

1. Capture F1/F2/F3 into the normalized evidence envelope.
2. Implement only the pure classifier and run expected outputs for F1/F2/F3 plus conflicting/missing synthetic cases.
3. Call public NEAR `tx_status` for F1:
   - `9bQSpWs3WNeXLF61CVHjYVZYhi5A6cUnw4aVoou1w5WF`, sender `bridge-mng.near`;
   - `HFnNzz8w5UQ6Mfga3oeKza4MiziDjASHk57fLxW3RMxT`, sender `intents.near`;
   - `wait_until: FINAL`.
4. Save raw RPC responses as build-window evidence fixtures with endpoint + timestamp.
5. Attempt Explorer URL ingestion once.
   - PASS: keep URL adapter.
   - FAIL/brittle: cut it from the vertical slice and use evidence-envelope import.
6. Attempt solver-relay `get_status` only as an enrichment experiment. Any auth/availability failure is non-blocking.
7. Exit TECHNICAL_DERISK only when the classifier + one NEAR RPC verification are actually observed in executable code.

---

## Source register

- NEAR RPC Transactions: https://docs.near.org/api/rpc/transactions
- NEAR RPC Providers: https://docs.near.org/api/rpc/providers
- NEAR Intents tutorial / solver status: https://docs.near.org/tutorials/intents/swap
- Intents Explorer API auth docs: https://github.com/defuse-protocol/gitbook-docs/blob/main/integration/distribution-channels/intents-explorer-api.md
- Current NEAR agent skill for 1Click: https://github.com/near/agent-skills/blob/main/skills/near-intents/SKILL.md
- Public failed/no-refund F1: https://explorer.near-intents.org/transactions/Lh8noxsXRWxJLg6hsxYRVuYD5iiWSNz9Bc
- Public refunded F2: https://explorer.near-intents.org/transactions/0x2f3003AC7A8C8E54eb04abbA1Fd7cA5e4e1a5a32
- Public success F3: https://explorer.near-intents.org/transactions/c90a6a3eaa0b2bbdf79d56f734d6fc68c854c9e479377d0ef051b86b65c9b9d3
- Public secondary failure: https://explorer.near-intents.org/transactions/221c8aa1a8ac320aa58174f9ff57d0fbc36316d7dc469f630e05e1b34f9e4d80
- Current ~$193K user incident: https://gov.near.org/t/failed-near-intents-1-click-swap-575-830-trx-193k-stuck-failed-status-zero-refund-no-support-response/42664
## 2026-11-09 runtime proof and boundary close

### Executed runtime proof
- The fixed-host public NEAR Intents Explorer page reader is implemented in api/incident.js and src/public-explorer.mjs. It is read-only, HTTPS allowlisted, refuses redirects, limits page size/time, and fails closed on ambiguous/unparseable outcomes.
- Public Explorer parser outcome categories matched 10/10 captured public records in the corpus. This is agreement with Explorer-reported pages, not independent chain-finality verification.
- The integrated classifier, lifecycle and evidence export are covered by 35/35 current tests; the adversarial red-team suite passes 9/9.
- The manual evidence envelope fallback is exercised in production: a matching correlation ID is accepted only as USER_SUPPLIED_UNVERIFIED; a mismatched payload is rejected; support JSON export succeeds.
- Vercel production deployment is READY on commit f667036e932ee638ef1aba57da4d234e00d47ee5 with intent-rescue.vercel.app alias.

### NEAR RPC limitation — explicitly bounded
- evidence/mainnet-rpc-proof.json records tx GxgdwWUF3oSm9LBdEcdXQcJ3hE4jRX1tz4tNp7W2sMHJ from abound.near, final_execution_status FINAL, two receipt outcomes, and an AccountAlreadyExists action failure. It is **not** either of the historical F1 transaction hashes.
- This proves the public RPC endpoint and tx_status response path against a current transaction; it does **not** independently verify F1's historical deposit/swap transactions.
- Public free RPC archival access to the older F1 transaction was not reliable. F1 therefore remains an Explorer source snapshot with explicit NOT independently verified on-chain labeling. Do not claim independent F1 RPC proof.
- Partner JWT status APIs and solver relay remain removed as P0 dependencies. Universal source-chain/private-history indexing remains out of scope; the matching manual evidence envelope is the credential-independent P0 fallback.

### Exit verdict
**TECHNICAL_DERISK: PASS WITH EXPLICIT BOUNDARIES.** The judge path works without partner credentials or a new financial transaction; the public page reader and deterministic diagnosis/export are executed. Historical F1 archival-RPC verification is blocked and not claimed. No unresolved existential dependency remains inside the approved product contract.
