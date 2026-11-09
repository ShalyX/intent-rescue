# PRODUCT-COVERAGE — 2026-11-09 final integrated audit

Original approval: user selected Idea 1 / Intent Rescue, PRODUCT_LOCK revision 1, 2026-10-25. Separate brand/name lock remains OPEN; Docketrail is an unapproved assistant-proposed label.

| Locked ID | User value / workflow | Integrated implementation | Acceptance evidence | Status | Boundary |
|---|---|---|---|---|---|
| P0-01 | Deposit address, source/NEAR/destination hash, Explorer URL, correlation ID, official status payload; matching JSON fallback when gated APIs unavailable | src/intake.mjs, identifier form, api/incident.js, src/public-explorer.mjs | 35/35 tests; exact matching/ambiguous rejection; live browser deposit address, source hash, correlation ID and status JSON; mismatched payload rejected; public Explorer URL lookup | VERIFIED — supported public page + credential-free manual evidence fallback | Arbitrary address/hash does not independently retrieve private partner history. Manual evidence visibly provisional and must contain searched identifier. |
| P0-02 | Five-leg source → 1Click → intent/solver → destination or refund | src/lifecycle.mjs, route canvas | F1/F2/F3 browser and exported lifecycle | VERIFIED | Evidence bounded to supplied/public snapshots. |
| P0-03 | Deterministic first unresolved leg and conflict classification | src/classifier.mjs, src/analyze.mjs | 35/35 tests; 9/9 red-team; false success/refund, empty and contradictory evidence rejected | VERIFIED | No root cause inferred from absence. |
| P0-04 | OBSERVED / INFERRED / UNKNOWN and assurance | UI provenance, src/evidence-bundle.mjs | Browser showed public snapshot vs user-supplied/unverified; mismatch rejected; export assurance | VERIFIED | Public HTML is not signed or independent chain finality. |
| P0-05 | Conservative next action, including do-not-retry | classifier + recovery rail | F1 failed-unresolved, F2 refund, F3 complete; red-team conflicts | VERIFIED | Recheck live status before irreversible action. |
| P0-06 | Export identifiers, links, lifecycle, missing proof and escalation | src/evidence-bundle.mjs, download UI | Live download docketrail-PUBLIC-221c8aa1a8ac.json; export tests; assurance preserved | VERIFIED | Support dossier, not signed attestation. |
| P0-07 | Source, destination, NEAR and refund links when chain and hash known | src/explorer-links.mjs, src/public-explorer.mjs, fixtures | 35/35 tests; live F1 Litecoin + NEAR; F2 Base origin + Base refund; no invented destination | VERIFIED — evidence-conditional links | Unknown chain or missing hash intentionally has no generated link. |

## PRODUCT INTEGRITY
approved_product: Intent Rescue, Idea 1 / lock rev 1.
name_lock: OPEN. Docketrail not user-approved.
P0_verified: [P0-01,P0-02,P0-03,P0-04,P0-05,P0-06,P0-07].
P0_missing_or_blocked: [] within approved supported-input contract.
verdict: PASS for locked P0 acceptance; no universal live-tracing claim.
