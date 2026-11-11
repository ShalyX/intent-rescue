# Branch review - fix/audit-p1-integrity

**Review date:** 11 November 2026
**Base:** origin/main at b275b79
**Initial branch head reviewed:** dd7046a
**Current state:** PR #2 merged into `main` on 11 November 2026 as `35b8dd09d0ab4d5b90d75da44eaef91afd643f7f`; the merged production deployment is READY.

## Review conclusion

The initial branch was **not safe to merge unchanged**. Review found inconsistent lifecycle verification, an unsafe default assurance mode, duplicated attribution between 1Click intake and intent references, and two evidence-presentation issues. These have been corrected in the working branch and covered by regression tests.

## Findings and corrections

1. **Lifecycle accepted malformed transaction identifiers.** The diagnosis validator rejected invalid hashes, but the lifecycle ledger treated any non-empty string as observed evidence. Lifecycle stages now use the same transaction-hash validator; source-reported amount/status observations remain REPORTED, not VERIFIED.
2. **analyzeEvidence() defaulted to source-snapshot assurance.** Calling it without an explicit assurance could elevate user-supplied terminal observations. Its default is now USER_SUPPLIED_UNVERIFIED. Captured fixtures, public Explorer captures and official 1Click responses must opt into their respective source assurance explicitly.
3. **1Click intake duplicated intent evidence.** Intent hashes were displayed as evidence for both 1Click intake and Intent / solver. Intake is now attributed to the 1Click status itself; intent references remain in their own lifecycle stage.
4. **Memo mismatch could fall back to a historical capture.** Historical fallback is now disabled when the user supplied a memo, so a failed memo-specific lookup cannot silently display a different captured record.
5. **Raw provider fee values looked like formatted token amounts.** When the provider supplies no formatted value, the UI now labels fees as raw provider units.
6. **Lifecycle evidence navigation pointed intake at the Intent row.** The intake-stage evidence link now points to the 1Click provider-details row.
7. **Benchmark expectations reflected the old overconfident labels.** Expected snapshot outcomes now use REFUND_REPORTED and DELIVERY_REPORTED.
8. **Base58 NEAR transaction hashes could be mistaken for 1Click deposit addresses.** Explicit Explorer URLs now go directly to the public Explorer reader. Ambiguous bare Base58 identifiers try 1Click first, then fall back to Explorer only when no memo-specific lookup is in play.

## Verification after corrections

- Automated tests: **60 passed, 0 failed** (fresh rerun on the reviewed branch).
- Red-team checks: **9 passed**.
- Evidence benchmark: **30,000 classifications across 10,000 rounds; deterministic**.
- Static build and JavaScript syntax checks: **passed**.
- git diff --check: **passed**.
- Live F2 browser regression: actual 1Click status request returned HTTP 200; rendered REFUND_REPORTED; export was SNAPSHOT_ONLY; JSON download succeeded.
- Wrong-memo regression: provider lookup returned HTTP 422; the case stayed hidden and the guided support form opened instead of falling back to historical evidence.
- Browser viewport checks: no horizontal overflow at 320, 360, 390, 768 or 1024 px; no page JavaScript exceptions on the successful live F2 flow.
- Historical Base deposit and refund receipts were separately checked against Base RPC in the preceding audit.

## Production security configuration

The Vercel Firewall is enabled. A post-merge `vercel firewall rules list --json` readback confirms one live, valid custom rule (`rule_rate_limit_public_osiali_incident_lookup_pvEvmi`) matching GET `/api/incident`, limited to **30 requests per 60-second fixed window per IP**, with deny on excess. The readback reports no draft changes. This protects the unauthenticated read-only proxy from simple per-IP request bursts; it is not a substitute for abuse monitoring or a broader bot strategy.

## Merged production-candidate audit — 11 November 2026

- PR #2 merged successfully as `35b8dd09d0ab4d5b90d75da44eaef91afd643f7f`.
- Vercel production deployment `dpl_Ap1pgCzVMeMWJzQHvrcf6QD4C57t` reached READY and assigned the canonical `osiali.vercel.app` alias.
- Production HTTP smoke checks: `/` and `/app/` both returned HTTP 200.
- Browser F1/F2/F3 fixture flows rendered FAILED_UNRESOLVED, REFUND_REPORTED and DELIVERY_REPORTED respectively. The F3 source-reported success was not promoted to COMPLETE.
- Live F2 1Click lookup returned HTTP 200. The current response reported REFUNDED / NO_LIQUIDITY; the export classified it REFUND_REPORTED with REFUND as the first unresolved step and SNAPSHOT_ONLY verification.
- The live F2 JSON export downloaded successfully and was inspected. It preserves OFFICIAL_STATUS_SNAPSHOT provenance, source update time, provider details and unassigned transaction roles without claiming independent chain verification.
- Wrong-memo UI regression returned HTTP 422, cleared the prior case and exposed the guided support form; no historical record was substituted.
- An explicit F1 NEAR Explorer URL returned HTTP 200 as a public_explorer_snapshot.
- Browser viewport checks at 320, 360, 390, 768 and 1024 px showed no horizontal overflow. Normal successful browser flows had no console errors; the deliberate wrong-memo request produced the expected HTTP 422 resource error, not a JavaScript runtime exception.

## Remaining gates — deliberately not claimed complete

- The empty-state case-navigation affordance remains a small UX follow-up.
- No fresh full screen-reader certification or trademark clearance is claimed.
- Provider and Explorer snapshots remain source-reported. The application does not claim independent NEAR private-settlement finality or wallet-balance confirmation.
- The firewall rule is a basic per-IP throttle, not a complete abuse-monitoring or bot-mitigation strategy.
- Vercel's production build used Node 26 because `package.json` allows `>=22`, overriding the project's configured Node 24.x setting. The build and smoke tests passed; pinning the engine for reproducible builds is a non-blocking follow-up.
- NEAR Hackathon submission evidence and any adoption or impact claims remain separate and are not implied by deployment readiness.

**Decision:** PR #2 is merged and the production deployment has passed the recorded smoke and browser checks. The code-level findings are resolved, but OSIALI is **not** marked fully product-ready; the remaining gates above still apply.
