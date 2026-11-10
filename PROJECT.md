# PROJECT — OSIALI / original approved concept: Intent Rescue

## CURRENT CHECKPOINT - 2026-11-10
- **Authoritative phase:** FEATURE_FREEZE (Hackathon Operator v0.5.0). DEMO_PRODUCTION, DEMO_QA, PITCH and JUDGE_SIMULATION passed on 2026-11-10. New features are frozen; only reliability, evidence, hygiene, demo, pitch, links and submission fixes are allowed.
- **Final demo:** `C:\Users\USER\Videos\OSIALI-Demo\osiali-demo-final.mp4`; 84.8 seconds, H.264 1600x900 at 25 fps, AAC stereo 48 kHz, -18 LUFS, 5,912,118 bytes; SHA-256 `9d29aade7b85d3b404fdc0d4bb7e061298dad8db2879202c9210155d3b1d95f2`. Karaxis render source: `/tmp/osiali-demo/osiali-demo-final-v4.mp4`.
- **DEMO_QA:** PASS on revised v4. Full decode passed; audio is neutral US English (`en-US-AndrewNeural`), 48 kHz stereo, -18 LUFS. Only the pronunciation aside in narration segment 2 was removed; the other seven sections, eight scene timings, screen recording, demo script, evidence, end card and 84.8-second duration remain unchanged. Captions now use the correct 1600x900 subtitle canvas, small bottom-centred type, thin outline and no opaque panel. Frames at 3/18/50/65 seconds and the contact sheet were inspected.
- **Product integrity:** original Idea 1 / Intent Rescue thesis and all seven locked P0s remain unchanged. Existing 35/35 tests, 9/9 red-team scenarios, build, and Product Hygiene evidence remain the recorded baseline; this demo pass does not replace those proofs.
- **Brand:** OSIALI remains explicitly user-approved. Docketrail recordings remain historical and excluded from submission.
- **Track decision:** USER-CONFIRMED 2026-11-10 — Unstoppable DeFi primary; Open Innovation secondary. Official FAQ permits selecting every track the project fits in one submission. Select both if offered. The Unstoppable DeFi fit is adjacent (swap-settlement reliability tooling, not a DEX/perps/lending/vault/trading agent); Open Innovation is the broader category fit.
- **Submission:** NOT READY / NOT SUBMITTED. The final video is local and has not yet been attached to a public X post or official form. No receipt exists.
- **Pitch:** `PITCH.md` now contains the one-line, 30-second and extended narrative, track positioning, claim-to-evidence map, and explicit non-claims; README and submission pack are aligned. PITCH phase passed on 2026-11-10.
- **Fresh judge simulation:** PASS with explicit limitations. Product 8/10, technical 8/10, sponsor 7/10, 30-second 7.5/10 (internal estimates; official weights UNKNOWN). Main deductions: adjacent Unstoppable DeFi fit, no external adoption evidence, and public Explorer snapshots are not independent chain-finality proof. Full review and ranked actions are in SCORECARD.md.
- **Live verification:** current commit 65dd208 passed 35/35 tests, 9/9 red-team and static build. Production homepage/assets/F1-F3 routes returned HTTP 200; live public Explorer API returned a bounded FAILED snapshot with explicit non-verification notice. Final video SHA-256 recorded in DEMO.md/EVIDENCE.md.
- **Prioritized fixes:** no new product features or P0/P1 code changes recommended. Remaining work is public demo post, one official form submission with both selected tracks where offered, and receipt verification. Optional external operator feedback is non-blocking.
- **Feature freeze:** active from 2026-11-10. No feature expansion; only reliability, proof, hygiene, demo, pitch, links and submission corrections.
- **Next:** prepare/publish the required X demo post, then complete SUBMISSION_AUDIT against the actual portal fields and final public links before any submission.

Historical checkpoints follow. Earlier notes that say the product name or production identity is unresolved are superseded by the current checkpoint above.

## 2026-11-09 Product Integrity and release checkpoint
- Original approved product: Idea 1 / **Intent Rescue**, lock revision 1 (2026-10-25). No product thesis drift.
- **Naming correction:** the separate brand/name gate was OPEN in the 2026-11-08 Operator record. Docketrail was an assistant-proposed candidate, not user-approved. The first fresh shortlist (LegSignal, SwapDossier, RouteSift, IntentBeacon, SwapBrief) was rejected by the user as AI-sloppy; its scores are withdrawn. BRAND.md records the reset and binding naming quality constraints. Intent Rescue remains the canonical working title; no name is approved or locked.
- The deployed UI, social preview and final recording currently display Docketrail; these are provisional artifacts and must not be used as final public submission assets until the name is approved and assets aligned.
- P0 acceptance: all 7/7 original P0 capabilities verified within the approved supported-input contract; see PRODUCT-COVERAGE.md. Public NEAR Intents Explorer URL/record lookup and matching source-attributed JSON fallback. Manual evidence is explicitly unverified/provisional. No private history or universal cross-chain indexing is claimed.
- P0-07: chain-specific links verified for F1 Litecoin source + NEAR transactions and F2 Base source + Base refund. Unknown destination/refund records remain unlinked.
- Quality: 35/35 Node tests; 9/9 red-team; static build passes; deterministic benchmark 30,000 classifications / 10,000 rounds; local API and home HTTP 200.
- Production: Vercel current production is READY on commit f667036e932ee638ef1aba57da4d234e00d47ee5; alias https://intent-rescue.vercel.app/ is assigned. The UI still displays unapproved Docketrail; deployment correctness does not close NAME_LOCK.
- Mobile layout: 390px viewport, no horizontal overflow; zero broken images. Manual evidence browser tests and F2 export links inspected.
- Demo: a 46.44-second H.264 recording exists at qa/docketrail-judge-final.mp4 and decodes, but it carries the unapproved Docketrail label. It is NOT final branded demo QA.
- Product Hygiene fallback was executed, but the final PRODUCT_HYGIENE gate is OPEN/BLOCKED pending approved identity and re-run; exact original Product Hygiene skill was not found.
- Judge simulation: four-lens draft exists but is provisional/stale; rerun after name and track decisions and final demo. Official weights UNKNOWN.
- Track decision: OPEN. Original PRODUCT.md revision 1 says primary Unstoppable DeFi / secondary Open Innovation; current HACKATHON.md recommends Open Innovation as stronger fit but records no user-approved switch.
- Current Operator phase: NAME_LOCK. Full 35-state audit and evidence are in OPERATOR-AUDIT.md. Feature Freeze has not been reached.
- Human/external action: no X post or portal submission made; no receipt exists.
- Non-blocking note: no LICENSE file; licensing choice remains owner decision.

## Current gates
- Product lock: PASS â€” original Intent Rescue concept and all seven P0s.
- Name lock: OPEN â€” requires explicit user decision.
- Final brand kit/demo: BLOCKED on name approval and consistent release.
- Submission: NOT READY; no public post or official receipt.

## Exact next action
Resolve the product-name gate. Do not publish the Docketrail-labelled video or use Docketrail in the official submission until explicitly approved.


## 2026-11-09 — second naming research checkpoint
- The collision-first second naming pass is recorded in `BRAND.md` and committed as `0807af81c2181c4e1c2de01032cdb43cc4ada1fc`.
- The pass screened additional route, evidence, archival, navigation, and language-root concepts. Several attractive terms had active exact or adjacent software, fintech, or Web3 uses; the rejection log is in BRAND.md.
- No candidate met the bar for a user-facing shortlist. **Akaebe** (Igbo term used for “witness”) is an exploratory language-root direction only; pronunciation and cultural fit remain unvalidated. It is not shortlisted or approved.
- NAME_LOCK remains OPEN. Intent Rescue remains the canonical working title; Docketrail remains unapproved. Product lock and all seven P0 requirements are unchanged.
- No human naming gate is pending yet; continue Brand specialist research until genuinely strong, screened candidates exist.


## 2026-11-09 — latest Operator checkpoint

- **Customer-facing name:** OSIALI, explicitly approved by the user on 2026-11-09. Approved demo pronunciation cue: “oh-see-AH-lih”.
- **Original product thesis:** Idea 1 / Intent Rescue, PRODUCT_LOCK revision 1. The rename changes only the brand; target user, approved workflow, scope, boundaries and all seven P0s are unchanged.
- **Name lock:** PASS. Preliminary exact-name public-web collision screen found no obvious exact software/fintech/Web3 competitor. Nearby names Osai Technologies (Lagos software agency) and OSHIAI (Japanese entertainment tech) are noted. Trademark/domain/handle clearance is not complete.
- **Legacy identity:** Docketrail remains an unapproved old label in the previous production build, OG image and old recordings. These are not final public assets.
- **DEMO_ARCHITECTURE:** Revalidated with OSIALI and a 75–85 second voiceover/shot plan. Recording remains pending; see DEMO.md.
- **EVIDENCE_PLAN:** Revalidated. The brand rename adds no new product or technical claim; the original seven P0 claims and their proof standards remain unchanged.
- **Current Operator phase:** DEPENDENCY_ATTACK. Revalidate release dependencies and ensure the approved identity can be deployed and verified without disturbing the locked product workflow.
- **Submission:** NOT READY. Final brand deployment, OG asset, current 60–90 second demo, demo QA and remaining operator phases are still open.


## 2026-11-09 — OSIALI technical revalidation and brand-kit checkpoint

- **DEPLOYMENT:** Vercel production deployment for commit b613f5c8c4cbb47da60a7dcbc6a9b6b6c0e64128 is READY. Existing alias intent-rescue.vercel.app is attached. Build logs show osiali@0.0.1 build, Static build ready: /vercel/path0/dist, and Deployment completed. This proves the release build and alias, not visual/browser QA.
- **DEPENDENCY_ATTACK:** PASS for the approved name change. No new runtime service, credential, wallet, chain adapter or paid dependency was introduced. Existing public Explorer / manual evidence fallback boundaries remain unchanged.
- **TECHNICAL_DERISK:** PASS WITH EXPLICIT BOUNDARIES. Existing 35/35 test, 9/9 red-team, classifier, export and runtime proof remain the evidence base; the latest static production build is READY. Historical F1 archival-RPC proof remains explicitly unclaimed.
- **BUILD_VERTICAL_SLICE:** PASS WITH REVALIDATION LIMIT. PRODUCT-COVERAGE.md still records all seven original P0s as verified. The brand-only edits do not alter lifecycle/classifier logic; the new build passed. A fresh browser regression on the deployed OSIALI build remains required before final QA.
- **PRODUCT_REVIEW:** PASS. The brand rename does not alter the target user, product promise, five-leg workflow, P0 inventory, safety boundaries or follow-through. No product drift.
- **BRAND_KIT:** lightweight identity system is now defined in BRAND.md. Current Operator phase moves to ART_DIRECTION.
- **Outstanding:** OG preview image and old Docketrail recordings remain legacy assets. Live rendered UI still needs browser verification; formal trademark/domain/handle clearance is not complete.


## 2026-11-09 — ART_DIRECTION completed

- Compared three materially distinct territories in DESIGN.md: Witness Desk, Evidence Ledger and Signal Room.
- Selected **Witness Desk** because it makes the evidenced route, first unresolved leg, safe action and support handoff legible without implying live telemetry or automatic recovery.
- Phase 16 ART_DIRECTION: PASS. The prior forensic desk remains the chosen composition language, now explicitly tied to OSIALI's witness concept.
- Current Operator phase: REFERENCE_BOARD. Next work is source-captured reference synthesis by purpose; no major frontend rebuild is authorized before Design Lock.


## 2026-11-09 — REFERENCE_BOARD completed

- Phase 17 PASS. Four source products were inspected and decomposed by purpose: NEAR Intents Explorer, Sentry Issue Details, Honeycomb Trace Explorer and incident.io Timeline.
- The board preserves the Witness Desk direction and specifies exactly what to borrow and what not to copy. No clone or product-scope change.
- Current Operator phase: VISUAL_ASSET_STRATEGY. Next: inventory and prioritize the real brand/product assets, including the replacement OSIALI OG preview and fresh F1/F2/F3 captures.


## 2026-11-09 — VISUAL_ASSET_STRATEGY and MOTION_STORYBOARD completed

- Phase 18 PASS. DESIGN.md inventories the wordmark/mark, favicon, OG preview, F1/F2/F3 desktop captures, F1 mobile capture, final demo, export proof, route diagram and local fonts, with purpose/source/priority/owner/status/format/budget.
- Phase 19 PASS. Motion is limited to real selection, disclosure, status and export feedback; no fake transfer or live-telemetry animation.
- Current Operator phase: DESIGN_LOCK. Lock the static first-fold, core investigation canvas and magic-moment composition before any substantial design engineering.


## 2026-11-09 — DESIGN_LOCK completed

- Phase 20 DESIGN_LOCK revision 2: PASS. DESIGN.md freezes the exact desktop/mobile composition, component hierarchy, first-fold priority, interaction contract, evidence boundary, typography/palette, accessibility and acceptance viewports.
- Design Engineering is authorized to implement the locked OSIALI identity and required assets without changing the P0 workflow.
- Current Operator phase: DESIGN_ENGINEERING. Visual QA, current-brand screenshots, OG preview replacement and final demo remain open.


## 2026-11-09 — DESIGN_ENGINEERING completed

- Phase 21 PASS. Implemented and deployed the OSIALI witness-point mark, SVG favicon, 32×32 PNG favicon, 512×512 avatar and new 1200×630 production-screenshot OG preview.
- Added canonical URL, og:site_name, OG dimensions/alt text and Twitter large-image metadata.
- Production commit: `0736576ed155d5e6420bcf0d63219d70817032b6`; Vercel deployment `dpl_ddjoz4LbCZ4ischFANc1SMaZaVtk` READY with canonical alias attached.
- Live browser regression: HTTP 200; all identity assets 200; no Docketrail in rendered HTML; F1/F2/F3 classifications remain Failed unresolved / Refund verified / Complete; 390px mobile no horizontal overflow; zero page errors.
- Public OpenGraph.to validation: 93/100; title, description, site name, canonical URL, image URL, 1200×630 dimensions, alt text and Twitter large-image card detected. Only informational recommendations remain.
- Current Operator phase: VISUAL_QA. The legacy Docketrail demo recording remains blocked from submission; no product scope or P0 behavior changed.


## 2026-11-09 — VISUAL_QA completed

- Phase 22 PASS: six-dimension scorecard 20/24; every category ≥3; no hard veto.
- Live production inspected at 1440×1000, 390×844, full mobile scroll, and breakpoints 761/900/1024. No horizontal overflow at 390/760/761/900/1024/1440.
- Axe WCAG 2.1 AA: 28 desktop passes / 27 mobile passes; zero violations. Six incomplete contrast checks were non-text glyphs or SVG/image-backed backgrounds and manually reviewed.
- Fixed the active fixture caption contrast from 4.31:1 to 5.79:1. Route arrow and “Evidence stops here” contrast measured 7.43:1 and 8.03:1.
- Keyboard skip link first, visible 2px focus, labelled identifier, polite status announcement, and reduced-motion behavior verified.
- F1/F2/F3 classifications and real JSON export reverified; export is valid `osiali-F1.json`, 4,414 bytes.
- Latest production commit `0dff84c60995389111e34db13f2138d5603510de`; tests 35/35 and build pass; browser no errors or failed requests.
- Capture files retained in persistent Vercel QA sandbox `sbx_RGtLONSkbtxObF6HBaqeCIWn2t2I`, under `qa/visual-qa/final/`.
- Current Operator phase: PRODUCT_HYGIENE. Old Docketrail demo remains blocked; full NVDA/VoiceOver and historical secret scans remain outstanding.
