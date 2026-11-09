# VALIDATION — Intent Rescue

Checked: 2026-10-25T23:53:45+01:00

## Verdict

**MODIFY → PASS**

The selected opportunity survives adversarial validation after tightening the product promise. “Rescue” means **failure observability + recovery assistance**, not forced refunds or custody.

## Problem reality

- A current NEAR Forum incident reports a 575,830 TRX (~$193K) 1-Click swap where the source deposit succeeded, the official 1-Click status became `FAILED`, `refundedAmount` remained 0, there was no destination transaction, and the user reported no refund after weeks.
- Gem Wallet documents that failed NEAR Intents deposits can require manual handling and may take longer to settle.
- NEAR/1Click exposes multiple lifecycle states (`PENDING_DEPOSIT`, `KNOWN_DEPOSIT_TX`, `PROCESSING`, `SUCCESS`, `INCOMPLETE_DEPOSIT`, `REFUNDED`, `FAILED`), which means there is enough structure to provide more useful diagnosis than a single generic failure badge.
- NEAR’s terms explicitly state that refunds are not guaranteed to be complete, timely, or successful, so the product must not imply it can compel recovery.

## Existing alternatives

- NEAR Intents Explorer exposes transaction history/status and links.
- Wallets such as Gem Wallet expose high-level Pending/Completed/Refunded/Failed states and send users to the explorer/support.
- Support flows can process manual cases.
- The public search completed for this validation did **not** reveal a user-facing tool whose primary job is to reconstruct the failed path, classify the missing leg, explain the evidence, and package a recovery/escalation case. This is an observed search result, not proof that no such tool exists.

## Differentiated thesis

Intent Rescue is **not another swap UI and not another explorer**. It is an incident-response layer for NEAR Intents:

1. ingest a swap identifier / official status payload;
2. reconstruct the cross-chain lifecycle;
3. identify the last verified successful step and first missing/failed step;
4. classify what can and cannot be concluded from evidence;
5. present the safest next action;
6. export a support-ready incident bundle.

## Technology fit

NEAR Intents / 1Click is integral to the product because its statuses, source/destination transactions, refund fields, and intent lifecycle are the object being diagnosed. NEAR is not decorative infrastructure.

## Existential dependency check

### Risk A — official 1Click / Explorer APIs may require partner JWT
Status: **OPEN — must be de-risked during the official build window.**

Evidence:
- Public documentation for the Explorer API states JWT authentication is mandatory.
- Current integration references show partner authentication for 1Click status access.

Required fallback:
- The judge-facing diagnosis path must accept a pasted/exported official status payload and source transaction identifier so it can function without an approval-gated credential.
- A permissionless NEAR RPC / solver-relay read may be used where available to verify on-chain evidence.
- A partner key, if obtained, upgrades live ingestion but must not be the only way the product can demonstrate value.

### Risk B — no NEAR Intents testnet deployment for the exact mainnet failure path
Status: **OPEN / planned around.**

Required fallback:
- Use public real incidents and read-only verification for failure diagnosis.
- If a live swap is needed for proof, use only a deliberately tiny authorized mainnet transaction during the hackathon; never make this mandatory for the core product flow.

## Demo feasibility

PASS, conditional on the credential-independent ingestion path. A judge can understand the core value in under a minute:

> paste/open failed swap → see lifecycle → see the exact missing leg → get safe next action + evidence bundle.

## Evidence potential

Strong. The project can show:
- public real incident evidence;
- official status taxonomy;
- live/public chain verification where possible;
- deterministic diagnosis tests across known state combinations;
- a repeatable judge-facing failure replay.

## Product Critic handoff

completed: problem, alternatives, differentiation, technology fit, demo potential, and existential dependencies challenged.
remaining: prove the data-ingestion path during TECHNICAL_DERISK after the official build window opens.
blocking issues: none for product lock; live API credential remains a technical risk, not a thesis blocker because fallback is defined.
strategic concerns: do not market “recovery” as guaranteed fund return.
recommended next action: lock the narrowed product thesis and define the demo.
requires_operator_decision: false

## Sources

- https://gov.near.org/t/failed-near-intents-1-click-swap-575-830-trx-193k-stuck-failed-status-zero-refund-no-support-response/42664
- https://docs.gemwallet.com/faq/near-intents/
- https://explorer.near-intents.org/
- https://github.com/near/agent-skills/blob/main/skills/near-intents/references/concepts.md
- https://github.com/defuse-protocol/gitbook-docs/blob/main/integration/distribution-channels/intents-explorer-api.md
- https://near.com/terms
## 2026-11-09 competitive kill-search refresh

The original validation search is now refreshed against current public materials. This is an adjacent-solution kill-search, not a claim that no competitor exists.

| Alternative / substitute | What it already does | What remains distinct in Intent Rescue | Threat |
|---|---|---|---|
| NEAR Intents Explorer | Search by deposit address, wallet or tx hash; show transaction status and transaction references | A user-facing diagnosis that joins the lifecycle, points to the first unresolved leg, explains evidence limits, chooses a conservative next action and exports a support dossier | HIGH as the default substitute; the product must not present itself as a prettier Explorer |
| Gem Wallet support/docs | Shows Pending/Completed/Refunded/Failed and directs users to Explorer/support; notes failed deposits may need manual handling | Cross-source lifecycle reconstruction and evidence-bounded support handoff | MEDIUM |
| Zodl support docs | Explains Explorer lookup, manual refund cases, deposit-address/TXID evidence and support escalation | Structured route diagnosis and export are not shown in the searched support guides | MEDIUM |
| NEAR Intents Agent API status/errors docs | Correlation IDs, terminal status, error codes, idempotency and safe retry guidance for agent API actions | Consumer/wallet-side cross-chain incident dossier with source evidence and lifecycle visualization | HIGH adjacent technical substitute, different user/workflow |
| intents.work CLI | Deposit-address status check, polling and status history for agent swaps | Visual incident analysis, evidence confidence, first-unresolved-leg reasoning and portable support bundle | MEDIUM adjacent tool |
| Wallet/partner help flows (LOBSTR, Mask and similar) | Transaction status in wallet and direct support/partner escalation | Independent evidence reconstruction across source/NEAR/destination/refund, with explicit provenance and no false recovery claims | MEDIUM |

### Kill-search verdict
- The NEAR Intents Explorer itself is the strongest substitute for status lookup. We do not compete on search or status display.
- Wallet/partner products provide status labels and human support instructions. That confirms the user problem and also means the product must prove more than a help page.
- Agent-oriented status APIs and CLI tools provide correlation IDs, status history and safe retry/idempotency semantics; they are relevant adjacent solutions, but their documented user is an agent/API integrator rather than the affected swap user/support operator.
- No direct product whose primary workflow is the complete evidence-first incident dossier was identified in this search set. This is **not proof of uniqueness or absence**.
- Differentiation survives only if the product demonstrates the joined route, provenance boundary, conservative action and export. If it only shows status and links, the thesis is not differentiated.

Sources checked 2026-11-09:
- NEAR Intents Explorer: https://explorer.near-intents.org/
- Gem Wallet NEAR Intents help: https://docs.gemwallet.com/faq/near-intents/
- Zodl swap status: https://support.zodl.com/article/11-checking-swap-status
- Zodl refund guidance: https://support.zodl.com/article/10-refunding-a-swap
- NEAR Intents Agent API status/errors: https://docs.agentsonintents.com/integration/agent-api/status-and-errors
- intents.work CLI: https://www.intents.work/
- NEAR Terms: https://near.com/terms

No product scope change is authorized by this research refresh.
