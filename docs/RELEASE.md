# Release verification — 12 November 2026

## 12 November — merged-production audit closure

This entry supersedes earlier open-gate statements below where they conflict with the final merged-production verification.

The application-code release was verified at commit `b73147b05e682207c7165b13a76f095b880b41e1`. The documentation-only closure PR #11 merged as `d655a4c1d003686bb57d2271e0e34ba3557a0551`; Vercel production deployment `dpl_7QkPqUcVYD2GszNnPYDy6ouR66YM` for that commit reached READY and serves `https://osiali.vercel.app`; the incident desk is `https://osiali.vercel.app/app/`.

### Final verification

- PR #10 was merged into `main`; the production deployment points to that merged commit.
- GitHub Actions Verify run `43142957056` passed on both Node 22 and Node 24; the post-merge documentation/evidence refresh run `43226248879` also passed on both versions.
- Each CI matrix job reported **103 tests passed, 0 failed**, all nine red-team scenarios passed, and the static build completed.
- The user confirmed that the Android keyboard opens correctly when the identifier field is tapped on the Redmi Note 13. The physical-device keyboard sign-off is closed.
- The live read-only 1Click lookup returned HTTP 200 with the provider-reported `REFUNDED` / `NO_LIQUIDITY` state. A deliberately mismatched memo returned HTTP 422 and did not fall back to a historical Explorer capture.
- Mobile navigation and evidence touch targets, F1/F2/F3 flows, Explorer lookup, and Android JSON export were included in the merged audit.

### Evidence boundaries and remaining limitations

- Provider and Explorer snapshots are source-attributed observations, not independent proof of NEAR settlement finality.
- OSIALI does not move funds, execute refunds, or guarantee recovery. No independent NEAR settlement-finality or recipient-wallet-balance verification is claimed.
- Full screen-reader certification and trademark clearance have not been completed; no adoption or user-impact claims are made.
- The checked-in `evidence/test-output.txt` and `evidence/red-team-output.txt` are refreshed from the successful Node 22 job in run `43226248879`; the test artifact records 103 passed and 0 failed, and the red-team artifact records all nine scenarios passing.
- The original 84.8-second local demo cut predates the final evidence/export changes. It is superseded by the production-matched demo recorded below.

The production audit is closed. Public demo publication and the official NEAR HACKATHON submission are separate remaining release steps; see [SUBMISSION.md](SUBMISSION.md).

## 12 November — production-matched demo production and QA

The final local demo file is `OSIALI-NEAR-Hackathon-Demo.mp4`. It was recorded against the current production app at `https://osiali.vercel.app/app/` and finalized on 12 November. The MP4 is 102.28 seconds, 1600×900 (16:9), 25 fps, H.264 video with AAC stereo audio at 48 kHz. Captions are burned in; narration uses the previously approved neutral `en-US-AndrewNeural` voice. The local MP4 is not committed to this repository.

### Demo evidence checks

- A live public NEAR Intents Explorer transaction lookup returned **Insufficient evidence**, with source-response / not-on-chain-verified provenance. The demo shows OSIALI failing closed instead of guessing.
- The captured F1 failed-swap case rendered **Failed unresolved**, with destination delivery as the first unresolved step and historical-snapshot assurance.
- F2 rendered **Refund reported**, with refund as the first unresolved step; it was not described as independently verified.
- F3 rendered **Delivery reported**, with destination delivery as the first unresolved step; it was not described as complete.
- The export action generated a 5,446-byte JSON payload with schema `osiali-evidence/v1`, classification `FAILED_UNRESOLVED`, verification `SNAPSHOT_ONLY`, assurance `CAPTURED_PUBLIC_SNAPSHOT`, and five lifecycle entries. The demo previews this actual export payload.
- The recording completed with zero browser page, console, or failed-request errors. The finalized MP4 passed a full decode check. Audio level check: mean `-19.1 dB`, peak `-1.5 dB`.

The demo video is ready for the human to attach to the required public X post. No public demo-post URL or official NEAR HACKATHON submission receipt has been recorded yet.
