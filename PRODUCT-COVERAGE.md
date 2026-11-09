# PRODUCT-COVERAGE — 2026-11-08 / newest Operator

Original approval: Idea 1, product lock revision 1 on 2026-10-25. **Current deliverable: partial product with verified end-to-end captured-case journey**, not fully generalized live incident lookup.

| Locked ID | User value / expected surface | Implementation | Acceptance / proof | Status | Gap |
|---|---|---|---|---|---|
| P0-01 | Paste identifier or official evidence payload, then investigate | `src/intake.mjs`, identifier form, JSON drawer, 3 captured fixtures | 6 intake tests; Playwright known URL + unknown ID + manual input | IN_PROGRESS | Only 3 captured cases resolve from identifier. Arbitrary addresses/hashes require source-attributed JSON; no live historic API without partner JWT. |
| P0-02 | Recognizable 5-leg NEAR Intents path | `src/lifecycle.mjs`, product canvas | F1/F2/F3 + browser rendered route | VERIFIED on captured cases | Not a proof of continuous live ingestion |
| P0-03 | Conservative outcome / missing-leg diagnosis | `src/classifier.mjs` | 23 test suite and red team | VERIFIED on supported evidence schema | Supplied custom evidence can be false; UI now labels as provisional |
| P0-04 | Observed vs inferred vs unknown + assurance | `src/lifecycle.mjs`, canvas, source assurance in export | Playwright manual-provisional and F1 screenshot | VERIFIED on captured/manual flow | Raw source identity is not independently authenticated |
| P0-05 | Safe advice including do-not-retry | `src/classifier.mjs`, recovery rail | F1 no duplicate-retry; F2/F3 contrast; manual caution | VERIFIED on captured; guarded for manual | Live-state change cannot be inferred from snapshot |
| P0-06 | Download actual evidence/escalation handoff | `src/evidence-bundle.mjs`, download UI | Playwright download + escalation fields + 5-leg record | VERIFIED | Destination-network deep links cannot be guessed without chain info |
| P0-07 | Available source/destination/NEAR explorer references | `src/explorer-links.mjs`, on-screen evidence links, `source_links` in export | F1 Litecoin + NEAR links, explicit Base/Ethereum synthetic link checks, no fabricated absent links; 3 link tests | IN_PROGRESS | Known-chain links implemented; arbitrary source/destination paths still require explicit chain and concrete transaction hash. No universal lookup or inferred missing links. |

## PRODUCT INTEGRITY
approved_product: Evidence-first NEAR Intents incident response, original lock rev 1
current_deliverable: PARTIAL_PRODUCT / captured-case integrated slice
mechanism_proven: F1 failed, F2 refunded, F3 success; 23/23 tests; three-case browser regression; actual JSON download
full_user_journey: known Explorer/hash -> captured evidence -> lifecycle -> safe action -> downloadable handoff. Unknown identifier -> honest no-capture message -> manual JSON fallback.
locked_P0_total: 7
P0_verified: [P0-02,P0-03,P0-04,P0-05,P0-06] limited to available evidence mode
P0_missing_or_blocked: [P0-01 general identifier resolution (authenticated historical API), P0-07 unknown-chain / absent-hash links cannot be generated]
differentiators_retained: evidence boundary, provenance, next-action predicates, exported handoff
new_or_replaced_thesis: NO
next_action: Decide practical permitted source coverage without claiming universal live lookups; complete naming, hygiene, re-record final demo, deploy/revalidate and submit
verdict: BLOCKED for FULL_PRODUCT_VERIFIED, PASS for no unauthorized thesis drift

Verification environment: Windows Node 24, Chrome/Playwright CLI, local port 4174. Production deployment of new revision remains UNVERIFIED until republished and inspected.