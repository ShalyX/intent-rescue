# NEAR Hackathon submission pack — OSIALI

## Status
**SUBMISSION_AUDIT IN PROGRESS ? DEMO_QA, PITCH, four-lens JUDGE_SIMULATION, terminal evidence consistency correction and production regression verification passed. Public X demo post, human-owned form values, final payload approval and receipt remain outstanding.** The mark, favicon, avatar and 1200?630 OG preview are live and browser-verified. Visual QA passed 20/24 with zero axe violations.

## Current public assets
- Public repo: https://github.com/ShalyX/intent-rescue
- Live app: https://intent-rescue.vercel.app/ (OSIALI identity and social preview verified)
- Demo video: final OSIALI recording produced and DEMO_QA passed. Local artifact: `C:\Users\USER\Videos\OSIALI-Demo\osiali-demo-final.mp4` (84.8 seconds, H.264 1600x900, 25 fps, AAC stereo 48 kHz). It is not public yet; attach this current-brand video to the X demo post. Older Docketrail-labelled recordings remain ignored local QA artifacts under qa/ and are explicitly excluded.
- Latest release QA: terminal refund/destination lifecycle claims require the same concrete evidence as the classifier. npm test 37/37, red-team 9/9 and static build pass. Production deployment dpl_5ErUfDtVucj9BCJgdsugVR6yUHiN is READY on commit b250d2c032045f776c50b3f0cf6ed930cbf144f7; served modules and live negative/positive/export-parity regression checks passed.

## Track decision
User-confirmed 2026-11-10: **Unstoppable DeFi primary; Open Innovation secondary.** The official FAQ says to select every track the project fits in the submission form, so select both in the same project submission if both checkboxes/options are available. The FAQ specifies one submission per project and does not describe a ranked primary/secondary field; the primary/secondary order is our internal framing. Track-fit caveat: OSIALI supports reliability and incident response for NEAR Intents swap settlement but is not an exchange, perps, lending, vault or trading agent. Open Innovation is the broader category fit. See HACKATHON.md and PITCH.md.

## Remaining before submission
- [x] Align app title, wordmark, social metadata, favicon, avatar and OG preview.
- [x] Deploy and verify the approved identity.
- [x] Record/QA the final demo using that identity.
- [ ] Publish X demo post tagging @NEARProtocol and including #NEARHackathon.
- [ ] Submit repository, public X post URL and demo URL through the official form: https://nearhackathon.com/
- [ ] Verify receipt / confirmation.
- [ ] Keep payout NEAR account address private; enter only in official form if required.

Status: NOT SUBMITTED. No public post URL or official receipt recorded.


## Official form audit ? 2026-11-10

**Official form inspected:** https://nearhackathon.com/#apply
**Official API contract:** https://nearhackathon.com/HACKATHON.md
**API endpoint:** POST https://nearhackathon.com/api/applications
**Deadline:** 2026-11-14 23:59 UTC.
**Submission policy:** one submission per project/repository; after sending, corrections go through the organizer's Request changes page. No submission has been sent.

### Field mapping

| Official field | Prepared value / status |
|---|---|
| projectName | OSIALI |
| leadName | Awaiting user's exact confirmation |
| email | Awaiting user's exact contact email |
| size | 1 (solo-builder working assumption; confirm before sending) |
| tracks | ["defi", "open"] ? user-confirmed Unstoppable DeFi + Open Innovation |
| nearAddress | Awaiting user's NEAR mainnet payout account |
| projectUrl | https://github.com/ShalyX/intent-rescue |
| demoUrl | Awaiting the public X post URL |
| idea | Prepared below (848 characters) |
| consent | Awaiting explicit agreement to the exact contact notice |
| requestId | Generate once only after every field is confirmed; reuse on retries |
| website | Hidden honeypot; keep blank and omit from the API payload |

### Prepared project description

OSIALI is an evidence-first incident-response desk for NEAR Intents cross-chain swaps. When a swap stalls or reports failure, it reconstructs the supported five-stage lifecycle?source deposit, 1Click intake, intent/solver execution, destination delivery, and refund?from source-attributed public Explorer snapshots or matching user-supplied evidence. It labels each stage OBSERVED, INFERRED, or UNKNOWN, identifies the first unresolved leg, recommends a conservative next step, and exports a support-ready JSON case with identifiers, evidence references, missing proof, and escalation context. OSIALI supports operational reliability around NEAR Intents-powered cross-chain swap settlement. It is read-only: it does not custody funds, execute refunds, guarantee recovery, or claim independent on-chain verification of historical Explorer snapshots.

### Exact consent notice

"I agree that the organizers may use these details to review our submission and contact us about this hackathon."

Do not set consent=true until the user explicitly agrees. The official API accepts only the documented fields; do not add website or other extras. The final JSON payload must be shown to the user and receive explicit approval before the single POST.
