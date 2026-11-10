# DEMO - OSIALI final production and QA (2026-11-10)

## CURRENT FINAL RECORDING - 2026-11-10

Status: PRODUCED. The final OSIALI recording has passed DEMO_QA.

- Final local artifact: `C:\Users\USER\Videos\OSIALI-Demo\osiali-demo-final.mp4`
- Render source on Karaxis: `/tmp/osiali-demo/osiali-demo-final-v3.mp4`
- Supporting assets: `osiali-demo-raw.webm`, `voiceover.wav`, final 17-cue `osiali-demo.srt`, `endcard.png`, and QA contact sheets in `C:\Users\USER\Videos\OSIALI-Demo\`
- Duration: 84.8 seconds; within the original 60-90-second demo target.
- Video: H.264, 1600x900, 25 fps, 16:9.
- Audio: AAC stereo, 48 kHz, normalized to -18 LUFS with a -1.5 dBTP ceiling.
- Final local file size: 6,539,434 bytes.
- Final local SHA-256: `215d410cdee3a9e7fa2815d7c1d7efc09315723ecd93205211b9efd505cf4071`.
- Full video decode: PASS. Audio loudness measurement: PASS. Final visual review: PASS.

### Final scene and proof review

1. F1 investigation: public Explorer identifier intake, captured public snapshot, and explicit evidence boundary. The JSON records `independently_chain_verified: false`; the narration does not claim independent on-chain verification.
2. Route reconstruction: source deposit, 1Click intake, and NEAR intent execution are observed; destination delivery and refund remain unknown.
3. Safe recovery: preserve evidence, escalate with identifiers, and verify destination delivery or refund before creating a fresh quote. No duplicate retry or automatic recovery is claimed.
4. Actual export: the recording shows the real downloaded `osiali-F1.json` support bundle, including source links, observed steps, missing evidence, and snapshot limitation.
5. Contrast: F2 is shown as refund verified; F3 is shown as transfer complete.
6. Ending: OSIALI wordmark, "Know what happened", evidence-before-action descriptor, and NEAR Hackathon 2026 attribution.

### DEMO_QA - PASS

- Current deployed OSIALI identity is consistent throughout; no Docketrail label appears.
- The opening establishes the problem without requiring prior context.
- The real JSON download is visible, not a mock export button or static illustration.
- F1/F2/F3 states and the evidence boundary are legible in the final 16 pt, 17-cue subtitle treatment.
- Captions are burned in; the initial oversized treatment was rejected and replaced before this final render.
- Full-file decode passed after the final render. Audio measures -18 LUFS at 48 kHz stereo; no clipping was reported by the normalization pass.
- Inspected final frames at 62, 66, 74, and 82 seconds, plus the full contact sheet. No credentials or personal notifications were visible in the inspected frames.
- Format and duration are 16:9, H.264, 1600x900, 25 fps, 84.8 seconds.

### Remaining claim limits

The public Explorer result is a captured public page snapshot, not independent chain-finality verification. Unknown destination/refund evidence remains unknown. The product does not custody funds, automatically recover funds, or guarantee a refund. The final video is a local artifact and is not yet attached to a public X post or official submission.

---


## Historical recording and architecture notes

Original approved goal: 60â€“90-second judge demo. The movie must prove: failed swap identifier â†’ canonical trace â†’ first unresolved leg â†’ conservative action â†’ actual support bundle â†’ refunded/success contrast. Do not claim automatic funds recovery.

## Current recording status
The 2026-11-01 F1â†’F2â†’F3 screenshot-based MP4 is technically decoded, but **STALE**: the UI and identifier intake changed November 8. It does not show the current identifier field or an actual download. **DEMO_PRODUCTION / DEMO_QA NOT PASSED on current build.**

## Updated exact shot list (proposal for recording)
- 00:00â€“00:07 Hook: open current deployed desk on F1; on-screen explanation: a "FAILED" label hides the actual evidence boundary.
- 00:07â€“00:20 Enter known F1 Explorer transaction URL in the identifier box; click "Find captured case" (clearly a lookup against captured public cases, not live arbitrary API).
- 00:20â€“00:35 Show source deposit + 1Click + intent observed; destination and refund not observed. Highlight first unresolved destination leg.
- 00:35â€“00:50 Read conservative no-duplicate-retry action and visible exact predicates.
- 00:50â€“01:02 Click Export evidence, show JSON with original links, first missing leg, escalation request, limitations and snapshot assurance.
- 01:02â€“01:14 Select refunded F2 and complete F3 in turn; show the contrasted classification.
- 01:14â€“01:22 Show source repo EVIDENCE.md and public NEAR Explorer source; end on "Evidence, not guesswork."

## Preflight / reset
Fresh browser, 1440Ã—900 or 1440Ã—1000, zoom 100%, neutral profile, no private accounts, terminal tabs or notifications. F1 URL:
https://explorer.near-intents.org/transactions/Lh8noxsXRWxJLg6hsxYRVuYD5iiWSNz9Bc
F2 and F3 via captured buttons. Show snapshot indicator. Keep backup captured page and case JSON available if network is slow. Validate full continuous recording, audio/subtitles, 30-second comprehensibility, format, no secrets, and the *currently deployed commit* before marking DEMO_QA PASSED.

## Demo claim limits
Unknown historical identifiers cannot be automatically resolved without partner access, though users can supply source-attributed JSON. Proof of actual mainnet RPC transaction-status call is separate from the captured case classifier. Never say real-time refund tracking or universal recovery.
## November 9 recording evidence
- Prior to the newest lookup release, a **real-interaction** Docketrail walkthrough was captured from live production: `qa/docketrail-judge-demo-final.mp4`, 68.92 s / 1440Ã—900 / H.264 / 25 fps / full decode PASS. Frame sheet inspected; shows known F1 identifier entry, genuine evidence JSON download, F2 refunded and F3 complete, then F1 reset. No simulated buttons or fabricated data.
- The endpoint/label was expanded after that capture in commit `99d8257`, so the video is useful **backup proof but NOT final-current-demo QA**. Re-record the final version showing public *uncaptured* Explorer URL/ID lookup with the explicit snapshot warning, plus actual support export and F2/F3 contrast. Include voice/captions or a concise explanatory overlay only if legible; do not misstate independent chain verification.
# DEMO â€” final production / 2026-11-09

- File: qa/docketrail-judge-final.mp4; source: qa/docketrail-judge-final.webm.
- 46.44 seconds; H.264; 1440Ã—900; 25 fps; 1,867,363 bytes; ffmpeg full decode PASS.
- Captured from https://intent-rescue.vercel.app/.
- Scenes: F1 context â†’ uncaptured public Explorer URL â†’ read-only source snapshot and visible evidence boundary â†’ recovery protocol â†’ actual JSON handoff download â†’ F2 refunded / F3 complete / F1 return.
- Chapter overlays embedded. No narration; silent UI walkthrough. Not a screenshot-only or simulated-button video.
- Contact sheet inspected; browser download event recorded for docketrail-PUBLIC-221c8aa1a8ac.json.
- Recording technical checks: PASS for H.264 decode, actual UI interactions, chapter overlays and JSON export. **Operator DEMO_QA: NOT PASSED.** The 46.44-second recording is below the original 60–90-second target, has no voiceover/script or complete caption/audio plan, and carries the unapproved Docketrail label.
- Limits: public Explorer snapshot is not independently verified on-chain; manual evidence is user-supplied/unverified; no private partner history, automatic refund, custody or universal address indexing; missing chain/hash has no fabricated link.


## Naming gate correction — 2026-11-09
The 46.44-second legacy recording carries the unapproved Docketrail label. The current production UI, metadata, wordmark and OG preview use approved OSIALI. The legacy recording is technically decoded/inspected but is NOT final submission media; it is ignored under qa/ and excluded from SUBMISSION.md. Record a fresh OSIALI version in DEMO_PRODUCTION.


## 2026-11-09 — OSIALI name lock / demo architecture revalidation

The user has approved **OSIALI** as the customer-facing product name. The approved English voiceover cue is **“oh-see-AH-lih”**. Use it consistently; do not improvise alternate pronunciations during recording. The underlying Igbo form *osialị* is tonal, so this cue is a practical English-language demo guide, not a complete phonetic transcription of Igbo.

The earlier Docketrail recordings remain historical backup evidence only. They are not final media because they show an unapproved legacy label. The OSIALI title/header source is now in a READY Vercel production deployment. Browser-render verification is still pending; the OG preview and older recordings remain Docketrail legacy assets and must be replaced before final recording.

### Revised judge-facing movie — 75–85 seconds

**Story:** A FAILED label is not an explanation. OSIALI reconstructs the evidence, identifies where it stops, recommends a safe next step, and produces a real support handoff.

| Time | Screen action | Voiceover |
|---|---|---|
| 00:00–00:08 | Open OSIALI on F1. Show the failed case and branched lifecycle. | “A cross-chain swap can say FAILED without telling you where the transaction actually stopped.” |
| 00:08–00:16 | Show identifier intake; enter the known public NEAR Intents Explorer URL. | “OSIALI — pronounced oh-see-AH-lih — reconstructs the swap from source-attributed evidence.” |
| 00:16–00:30 | Show the captured public snapshot, source deposit, 1Click intake and NEAR intent. | “Here, the source deposit and intent are observed. Destination delivery and refund are not observed.” |
| 00:30–00:42 | Focus the first unresolved destination leg and the OBSERVED / UNKNOWN labels. | “That distinction matters. Missing proof is not proof of lost funds, and it is not a reason to retry blindly.” |
| 00:42–00:53 | Show conservative next action and do-not-retry condition. | “OSIALI identifies the first unresolved step and gives an evidence-bounded next action.” |
| 00:53–01:05 | Export the JSON evidence bundle; open the downloaded file and show identifiers, links, missing proof and assurance. | “Then it creates a real support handoff, with the evidence, the gaps, and the limits clearly recorded.” |
| 01:05–01:17 | Switch to F2 refunded and F3 complete. | “The same workflow distinguishes a verified refund from a completed delivery — without guessing.” |
| 01:17–01:23 | Return to OSIALI wordmark and evidence route. | “OSIALI. Know what happened. Evidence before action.” |

**Truth constraints:** Keep the public snapshot warning visible. Do not claim private partner-history access, live arbitrary cross-chain indexing, independent archival verification of historical cases, automatic recovery, or guaranteed refunds. The downloaded JSON must be the real file produced by the current build. Keep the original 60–90-second target. The final recording must show the currently deployed approved brand and the real product path.

### Phase 9 status

Architecture and story beats are revalidated against the approved name and original locked product. The recording itself is **NOT PRODUCED**; final UI/OG alignment, recording, and DEMO_QA remain downstream work.


### Deployment checkpoint — 2026-11-09
The OSIALI production release has since been browser-verified: title, metadata, mark, favicon, avatar and 1200×630 OG preview are current; Visual QA passed 20/24 with zero axe violations. Legacy Docketrail videos remain local ignored QA artifacts only and are excluded from submission. A fresh OSIALI 60–90-second recording remains the next phase.


## 2026-11-09 — hygiene disposition
Legacy Docketrail recordings are not tracked by Git, are covered by the qa/ ignore rule, and are explicitly excluded from SUBMISSION.md. They are historical backup artifacts only. The next recording must be produced from the current OSIALI production UI; do not reuse or publish the legacy files.
