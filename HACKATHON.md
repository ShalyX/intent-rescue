# HACKATHON — verified constraints

Event: NEAR HACKATHON 2026. Official: https://nearhackathon.com/
Checked at: 2026-11-10 UTC.
Window: 2026-11-01 00:00 UTC through **2026-11-14 23:59 UTC**.
Submission: public repository, public demo on X explicitly saying built at NEAR HACKATHON, tagging @NEARProtocol, including #NEARHackathon and attaching demo video or screenshots. Submit both repository and X post links through the official form; NEAR account address required for payout. No signup wall to start. One submission per project.
Official site lists 13 tracks and says multiple tracks may be selected when the project genuinely fits. Claude Code and Codex screen projects for running and README fidelity; human judges select winners. Prior criteria: technical implementation, design, impact, originality and sustainability. Official 2026 weights: UNKNOWN.
Track decision — USER CONFIRMED 2026-11-10: Unstoppable DeFi is primary; Open Innovation is secondary. The official FAQ explicitly says: “Select every track your project fits in the submission form.” This permits both categories in one project submission; the FAQ also states one submission per project. Select both if both are available as multi-select options. The site does not describe a ranked primary/secondary field, so those labels are the project's internal framing order.
Fit and risk: OSIALI is an evidence-first incident-response layer for NEAR Intents cross-chain swap settlement. This supports operational reliability around the Unstoppable DeFi swap surface, but OSIALI is not itself an exchange, perps product, lending market, vault, or trading agent. That makes Unstoppable DeFi an adjacent rather than direct fit and creates a possible track-specific judging deduction. Open Innovation is the broader category fit for the novel evidence/provenance/safe-action/support-handoff workflow. Do not overclaim either fit.
Source: https://nearhackathon.com/ and https://nearhackathon.com/HACKATHON.md
Disqualification risks: private repository, missing X demo requirements, missed UTC deadline, fake claims, or incomplete submission.
Freeze recommendation: 2026-11-12 12:00 UTC, reserving two days for fresh demo, links, X post, final portal submission and confirmation. This is planning, not a published rule.

## Submission form audit ? 2026-11-10

Live official sources checked:
- Rules and API contract: https://nearhackathon.com/HACKATHON.md (HTTP 200).
- Form: https://nearhackathon.com/#apply; actual server-rendered form markup inspected.
- API: POST https://nearhackathon.com/api/applications.

Required payload fields, exactly: requestId (UUID), projectName (2?80 chars), leadName (2?80 chars), email (valid, max 160 chars), size (one of 1 / 2 - 4 / 4 - 6 / 6 - 8 / 8+), tracks (one or more unique official track IDs), nearAddress (lowercase NEAR mainnet account, 2?64 chars), projectUrl (public repo URL, max 300 chars), demoUrl (public X demo post URL, max 300 chars), idea (20?2,000 chars), consent (true only after explicit agreement to the contact notice). Do not add fields. The form includes a hidden website honeypot; leave it empty and omit it from the API payload.

User-confirmed tracks: Unstoppable DeFi = defi; Open Innovation = open. The official rule says select every track the project fits; both belong in one submission, not two. There is no primary/secondary ranking field in the API.

The form's contact notice must be shown verbatim: "I agree that the organizers may use these details to review our submission and contact us about this hackathon."

The form cannot be edited directly after submission. One repository can be submitted once; mistakes go through https://nearhackathon.com/request-changes. Generate requestId only after the complete payload is ready; reuse the same ID on any retry after an uncertain network/503 response.

Human-only values still required: lead name, contact email, NEAR mainnet payout address, public X post URL, and explicit contact-consent approval. Team size working assumption is 1 (solo builder) and must be confirmed before submission. No submission request has been sent.
