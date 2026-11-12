# Release verification — 12 November 2026

## 12 November — merged-production audit closure

This entry supersedes earlier open-gate statements below where they conflict with the final merged-production verification.

The current production candidate is `main` at commit `b73147b05e682207c7165b13a76f095b880b41e1`. Vercel deployment `dpl_69fdFUsACNDonwtX4XuqCZCzbyQb` reached READY and serves `https://osiali.vercel.app`; the incident desk is `https://osiali.vercel.app/app/`.

### Final verification

- PR #10 was merged into `main`; the production deployment points to that merged commit.
- GitHub Actions Verify run `43142957056` passed on both Node 22 and Node 24.
- Each CI matrix job reported **103 tests passed, 0 failed**, all nine red-team scenarios passed, and the static build completed.
- The user confirmed that the Android keyboard opens correctly when the identifier field is tapped on the Redmi Note 13. The physical-device keyboard sign-off is closed.
- The live read-only 1Click lookup returned HTTP 200 with the provider-reported `REFUNDED` / `NO_LIQUIDITY` state. A deliberately mismatched memo returned HTTP 422 and did not fall back to a historical Explorer capture.
- Mobile navigation and evidence touch targets, F1/F2/F3 flows, Explorer lookup, and Android JSON export were included in the merged audit.

### Evidence boundaries and remaining limitations

- Provider and Explorer snapshots are source-attributed observations, not independent proof of NEAR settlement finality.
- OSIALI does not move funds, execute refunds, or guarantee recovery. No independent NEAR settlement-finality or recipient-wallet-balance verification is claimed.
- Full screen-reader certification and trademark clearance have not been completed; no adoption or user-impact claims are made.
- `evidence/test-output.txt` is an older 46-test artifact. The authoritative 103-test result is GitHub Actions run `43142957056` (both Node matrix jobs); refresh the checked-in output before treating it as the latest machine-readable evidence.
- The 84.8-second local demo cut was produced on 10 November, before the latest evidence/export changes. It must be checked against the current production build and updated or re-recorded before public release. A local video is not a public demo post.

The production audit is closed. Public demo publication and the official NEAR HACKATHON submission are separate remaining release steps; see [SUBMISSION.md](SUBMISSION.md).
