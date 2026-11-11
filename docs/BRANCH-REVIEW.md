# Branch review - fix/audit-p1-integrity

**Review date:** 11 November 2026
**Base:** origin/main at b275b79
**Initial branch head reviewed:** dd7046a
**Current state:** review fixes are local; not merged.

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

The Vercel Firewall is now enabled for the OSIALI project. An active custom rule matches GET /api/incident and limits each IP to **30 requests per 60-second fixed window**, denying excess requests. The active configuration was read back and confirmed valid. This protects the unauthenticated read-only proxy from simple per-IP request bursts; it is not a substitute for abuse monitoring or a broader bot strategy.

## Remaining gates - deliberately not claimed complete

- This branch has **not** been merged.
- The complete audit against the merged production candidate has **not** been run.
- The production deployment has **not** been verified as part of this branch review.
- The empty-state case-navigation affordance remains a small UX follow-up.
- No fresh full screen-reader certification or trademark clearance is claimed.
- Provider and Explorer snapshots remain source-reported. The application does not claim independent NEAR private-settlement finality or wallet-balance confirmation.

**Decision:** code-level findings identified in this review are corrected and PR #2 is open for review. Do not merge until required checks are green; do not mark OSIALI product-ready. The merged production-candidate audit remains a separate gate.
