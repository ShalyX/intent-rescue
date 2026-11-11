# Release verification — 10 November 2026

OSIALI 0.1.0 preserves the incident-investigation purpose. This release validates manual evidence, labels manual outcomes as reported, preserves fallback identifiers in exported cases, protects newer selections from delayed lookups, and improves mobile action/case navigation.

The public repository and canonical domain are `ShalyX/osiali` and `osiali.vercel.app`. The public homepage is `/`; the incident application is `/app/`. Export schema is `osiali-evidence/v1`; manual terminal classifications are REFUND_REPORTED or DELIVERY_REPORTED, with provisional assurance and SUPPLIED lifecycle provenance. Integrations consuming the old schema/name should update their expectations.

Verification before publication:

- 40 automated tests passed; nine red-team scenarios passed; build passed.
- Browser F1/F2/F3, actual manual case download, malformed terminal hashes, flag-only refund and identifier-preserving provisional export passed.
- A deliberately delayed simulated API response did not overwrite a newer F3 selection.
- Desktop/mobile screenshots refreshed; no overflow at widths 390, 760, 761, 1024, 1440.
- Fresh machine-readable test output and repeatability output retained under evidence/.

Public docs were consolidated. Original working notes/checkpoints were preserved locally outside tracking rather than published as current product documentation. Git history was not rewritten. MIT licensing and Node 22/24 CI were added.

Remaining limits: active pending public pages require matching manual evidence; no universal history lookup, independent chain finality, refund execution or impact/adoption claim. No fresh full screen-reader certification or trademark clearance is claimed. Older videos predate the new address/export semantics and need a consistency check before publication. No X post or hackathon submission is included in this release.

## 11 November — landing and lookup integration

The landing page remains at /; the incident desk at /app/ now includes current deposit-address lookup and the JSON-free guided form. Legacy demo links redirect to /app/. Integrated verification: 46 tests, nine red-team scenarios and build pass. Local browser passed landing-to-app navigation, real provider lookup, real Explorer lookup, guided export, simulated provider outage, F1/F2/F3 deep links, landing case links and mobile checks. Production is verified separately after deployment.


## 11 November - P1 evidence-integrity audit

The F2 deposit address was resolved against the live, read-only 1Click status endpoint (HTTP 200). The response reported REFUNDED, NO_LIQUIDITY, 996.733867 USDC deposited and 996.731467 USDC refunded, with a 0.0024 USDC refund fee. The provider's last state update is 18 August 2026; the response was freshly retrieved on 11 November. Its correlation ID varied between repeated reads and is therefore retained as request metadata, not treated as a stable case identifier.

Both referenced Base transactions were independently queried through Base RPC. Each receipt returned status 0x1. The deposit receipt contains a 996.733867 USDC transfer to the 1Click deposit address. The refund receipt contains a 996.731467 USDC transfer to the refund address in the original quote. This corroborates the source deposit and returned USDC on Base; it does not establish NEAR intent finality, destination delivery, or the root cause of the failed route.

The live 1Click response reports NO_LIQUIDITY, while the earlier captured NEAR Explorer F2 snapshot reports Deadline passed. These are distinct source assertions. Both are preserved with their own provenance; neither is silently substituted for the other.

The live browser regression returned HTTP 200, rendered REFUND_REPORTED with the refund as the first unresolved step, marked the export SNAPSHOT_ONLY, and downloaded the JSON evidence bundle. No browser JavaScript errors or horizontal overflow were observed at viewport widths 320, 360, 390, 768 and 1024 pixels.

Final local validation: 62 automated tests passed; all nine red-team scenarios passed; the evidence benchmark classified three fixtures across 10,000 rounds (30,000 classifications) deterministically; static build passed. Provider and Explorer snapshots remain reported rather than independently verified in the exported diagnosis.

This audit does not claim production deployment verification or NEAR Hackathon submission. See SUBMISSION.md for submission status and required public demo evidence.


## 11 November - branch review before merge

The branch review found and corrected a lifecycle hash-validation mismatch, a source-snapshot default that was too permissive, duplicated 1Click intake/intent attribution, unsafe historical fallback when a memo is supplied, ambiguous raw fee labels, an incorrect lifecycle evidence link and Base58 NEAR hash routing to the wrong provider. Full findings and residual gates are recorded in BRANCH-REVIEW.md.

Post-review validation: 60 tests passed (fresh rerun on the reviewed branch); nine red-team scenarios passed; 30,000 deterministic classifications passed; build and syntax checks passed. Live F2 browser lookup returned HTTP 200 and exported a SNAPSHOT_ONLY case. A deliberately incorrect memo returned HTTP 422 and opened the guided form without historical fallback. Explicit Explorer URLs containing Base58 NEAR hashes now bypass 1Click address lookup; bare ambiguous hashes fall back to Explorer when 1Click has no status. Mobile viewport checks at 320 to 1024 px showed no horizontal overflow.

Vercel Firewall is enabled with a valid active per-IP rule for GET /api/incident: 30 requests per 60-second window, deny on excess. This is a basic abuse control, not a complete bot or abuse-monitoring strategy.

The branch remains unmerged. The merged production-candidate audit and production deployment verification are outstanding and must be completed separately.
