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


## 11 November — branch review and production release

The branch review found and corrected a lifecycle hash-validation mismatch, an unsafe source-snapshot default, duplicated 1Click intake/intent attribution, unsafe historical fallback when a memo is supplied, ambiguous raw fee labels, an incorrect lifecycle evidence link and Base58 NEAR hash routing to the wrong provider. Full findings and residual gates are recorded in BRANCH-REVIEW.md.

Post-review local validation: **60 tests passed, 0 failed**; nine red-team scenarios passed; 30,000 deterministic classifications passed across 10,000 rounds; static build, JavaScript syntax checks and git diff checks passed.

PR #2 was merged into main as `35b8dd09d0ab4d5b90d75da44eaef91afd643f7f`. The production deployment `dpl_Ap1pgCzVMeMWJzQHvrcf6QD4C57t` reached READY and assigned `osiali.vercel.app`. Both the homepage and `/app/` returned HTTP 200.

Production browser audit:
- F1, F2 and F3 fixture flows rendered FAILED_UNRESOLVED, REFUND_REPORTED and DELIVERY_REPORTED. F3 was not promoted to COMPLETE from source-reported evidence.
- Live F2 1Click lookup returned HTTP 200. It reported REFUNDED / NO_LIQUIDITY; the UI and JSON export preserved REFUND_REPORTED, REFUND as the first unresolved step, OFFICIAL_STATUS_SNAPSHOT provenance and SNAPSHOT_ONLY verification.
- The live F2 JSON export downloaded and was inspected. Provider details and raw fee units were retained; transaction identifiers whose lifecycle roles were not independently established remained unassigned.
- A deliberately incorrect memo returned HTTP 422, cleared the previous case and opened the guided form without historical fallback.
- An explicit F1 Explorer URL returned HTTP 200 as a public_explorer_snapshot.
- Viewports at 320, 360, 390, 768 and 1024 px showed no horizontal overflow. Successful flows had no browser console errors; the deliberate 422 regression produced only the expected failed-resource console entry.

The Vercel Firewall rule was re-read after merge. It is live and valid for GET `/api/incident`: 30 requests per 60-second fixed window per IP, deny on excess; no draft changes remain.

Remaining limits: no fresh full screen-reader certification or trademark clearance; no independent NEAR private-settlement finality or wallet-balance confirmation; no complete abuse-monitoring or bot strategy; no adoption/impact claim. The production build used Node 26 because the package engine range `>=22` overrides the configured Node 24.x setting; build and smoke checks passed, but pinning the engine is a non-blocking reproducibility follow-up. Production deployment readiness does not mean OSIALI is fully product-ready or that a hackathon submission has been completed.


## 11 November — post-merge integrity follow-up

The current production deployment is READY at `b76e1c6` and serves `osiali.vercel.app`; fresh HTTP checks returned 200 for both the homepage and `/app/`. The original PR #2 was already merged and its production audit is recorded above.

A separate review found four additional defects in the merged code: broad Base58 fallback after any 1Click failure, unstable case IDs derived from provider correlation IDs, contradictory terminal source assertions being silently overridden, and public Explorer parsing that could accept comment-only status text or account/address links as transaction hashes. The follow-up branch corrects these by allowing fallback only after a memo-free provider 404, deriving a stable hashed case ID from address/memo, preserving conflicting outcomes as CONFLICTED_EVIDENCE, and requiring heading-scoped status text plus chain-valid transaction-path links.

Follow-up local validation: **72 automated tests passed, 0 failed**; nine red-team scenarios passed; 30,000 deterministic classifications passed; static build and `git diff --check` passed. Provider HTTP 503, network failure and mismatched payloads no longer fall through to Explorer; memo-bound 404/503 responses remain distinct; incomplete-deposit refunds retain their separate outcome.

GitHub Verify passed (both matrix jobs), the Vercel preview deployment is READY for this branch head, and authenticated preview smoke checks confirmed the `/app/` shell and a live F2 1Click API response. The full interactive browser click-through remains outstanding. The follow-up branch is not yet merged or deployed; production remains on `b76e1c6`. After merge, rerun the complete production-candidate audit across investigation intake, evidence provenance, recovery safety, case-file export/escalation, and error/accessibility/mobile behavior. Production deployment readiness is not a product-ready declaration.
