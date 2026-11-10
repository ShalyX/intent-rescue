# PRODUCT-COVERAGE — 2026-11-09 final integrated audit

Original approval: user selected Idea 1 / Intent Rescue, PRODUCT_LOCK revision 1, 2026-10-25. Customer-facing brand **OSIALI** explicitly approved by the user on 2026-11-09; Docketrail remains a legacy unapproved label in older release assets.

| Locked ID | User value / workflow | Integrated implementation | Acceptance evidence | Status | Boundary |
|---|---|---|---|---|---|
| P0-01 | Deposit address, source/NEAR/destination hash, NEAR Intents Explorer URL, correlation ID, official status payload; matching JSON fallback when gated APIs unavailable | src/intake.mjs, identifier form, api/incident.js, src/public-explorer.mjs | 35/35 tests; unit tests cover deposit address, correlation ID, source/destination identifier matching and status normalization; live production Playwright verified matching correlation-ID payload accepted provisionally and mismatched payload rejected; public Explorer URL lookup | VERIFIED — supported public page + credential-independent matching manual evidence fallback | No private historical lookup for arbitrary IDs. User-supplied evidence remains provisional and must contain the searched identifier. |
| P0-02 | Five-leg source → 1Click → intent/solver → destination or refund | src/lifecycle.mjs, route canvas | F1/F2/F3 browser and exported lifecycle | VERIFIED | Evidence bounded to supplied/public snapshots. |
| P0-03 | Deterministic first unresolved leg and conflict classification | src/classifier.mjs, src/analyze.mjs | 37/37 tests; 9/9 red-team; false success/refund, empty and contradictory evidence rejected | VERIFIED | No root cause inferred from absence. |
| P0-04 | OBSERVED / INFERRED / UNKNOWN and assurance | UI provenance, src/evidence-bundle.mjs | Production browser showed public snapshot vs user-supplied/unverified; mismatch rejected; export assurance | VERIFIED | Public HTML is not signed or independent chain finality. |
| P0-05 | Conservative next action, including do-not-retry | classifier + recovery rail | F1 failed-unresolved, F2 refund, F3 complete; red-team conflicts | VERIFIED | Recheck live status before irreversible action. |
| P0-06 | Export identifiers, links, lifecycle, missing proof and escalation | src/evidence-bundle.mjs, download UI | Live production browser downloaded osiali-F1.json (4,414 bytes); export tests; assurance preserved | VERIFIED | Support dossier, not signed attestation. |
| P0-07 | Source, destination, NEAR and refund links when chain and hash known | src/explorer-links.mjs, src/public-explorer.mjs, fixtures | 35/35 tests; live F1 Litecoin + NEAR; F2 Base origin + Base refund; no invented destination | VERIFIED — evidence-conditional links | Unknown chain or missing hash intentionally has no generated link. |

## PRODUCT INTEGRITY
approved_product: Intent Rescue, Idea 1 / lock rev 1.
name_lock: PASS — OSIALI user-approved 2026-11-09 and deployed across current product surfaces. Legacy Docketrail video files are ignored local QA artifacts, excluded from the submission pack.
P0_verified: [P0-01,P0-02,P0-03,P0-04,P0-05,P0-06,P0-07].
P0_missing_or_blocked: [] within approved supported-input contract.
out_of_scope: universal automatic private-history lookup; partner JWT ingestion; automatic refunds.
verdict: PASS for locked P0 acceptance; no universal live-tracing claim.


## 2026-11-09 — brand-only release note
The customer-facing brand is OSIALI. The support export filename prefix was changed from the historical Docketrail prefix to osiali- in the name-alignment commit. This does not change the JSON schema or any P0 behavior. Visual QA reverified the current OSIALI export as osiali-F1.json (4,414 bytes) on the current production release.
