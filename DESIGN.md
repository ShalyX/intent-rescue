# DESIGN — OSIALI / newest Operator
Status: **DESIGN_LOCK revision 2 PASS (2026-11-09); DESIGN_ENGINEERING is next.** Visual QA and asset production remain separate open gates. Original approved Pass 3 forensic incident-desk direction retained. Actual production commit 6b1abb5 inspected at desktop 1440×1000 and mobile 390×844; new name/route/safe-action rendered correctly, F1/F2/F3 outcomes checked and mobile horizontal overflow measured false.

## Product / experience map
User: person/integrator facing ambiguous NEAR Intents swap status. First 30 seconds: load captured case or known identifier → inspect branched route → see evidence break and safe action. Primary surface: incident desk, with captured-case left rail, central evidence route, attached recovery rail, and support ledger/export. Account/wallet/auth N/A: read-only diagnostic tool. Loading, no-capture, manual provisional, error, refund and complete states exist.

## Art direction
Forensic operations instrument, never generic crypto/AI dashboard. Compact top command bar, left case queue, dominant dark investigation canvas, narrower light protocol rail. Route evidence, not a hero image, is the primary visual asset. Nodes 1–3 depict source/intake/solver, branching to alternative destination/refund terminal outcomes. The first unresolved leg is an actual break in the line and a red annotation; observed data is not invented.

## Reference synthesis
See the source-captured 2026-11-09 REFERENCE_BOARD below: NEAR Intents Explorer, Sentry Issue Details, Honeycomb Trace Explorer and incident.io Timeline. Each reference has a specific contribution and explicit anti-copy rules.

## Visual assets
MUST: authentic desktop and mobile captures of real F1/F2/F3 states. Present evidence: `qa/operator-F1-desktop.png` (1440×1000), `qa/operator-F1-mobile.png` (390×844) captured Nov 8 from localhost 4174. Social: current screenshot `public/og-preview.png` pending production verification. Fonts: local IBM Plex Sans/Mono with OFL license files in `public/fonts/`.
MUST fallback: text-based lifecycle leg and exact labels if route illustration/animation fails.

## Motion
Only discreet focus, hover and selected-state transition (140ms). No fake real-time network activity, pulsing statuses or animated transfers. Reduced-motion media query must turn transitions off. Mobile uses vertically legible route fallback, not desktop shrink.

## Local visual QA
Observed: title/header and intake present; first unresolved destination leg is focal; fixed 3-column desktop and stacked mobile; no horizontal overflow at 390px measured via Playwright. Current browser regression also verified F2 source URL entry, unrecognized ID, provisional manual analysis and exported JSON. Exact verification: `qa/operator-integrity-check.js`.
Pending: visual reread of fully deployed commit, keyboard-only full path, recorded motion/reduced-motion sequence, social preview fetched publicly.

## Hard vetoes
Misleading live API claim; generic AI styling; screenshot/capture substitutes presented as independent transaction verification; fake data; absent follow-through/export; broken layout; uncontrolled root-cause or refund guarantees.

## 2026-11-09 — OSIALI Art Direction / Phase 16

### Product reality map (revalidated)
- **User:** swap user, NEAR Intents wallet/dApp integrator, or support operator investigating a delayed, failed, incomplete or unrefunded swap.
- **Job:** establish the evidenced lifecycle, locate the first unresolved leg, decide the safest next step, and hand a source-attributed record to support.
- **Emotional promise:** clarity without false reassurance. The user should feel informed and in control, not alarmed or sold a recovery fantasy.
- **First 30 seconds:** load a public Explorer URL or captured case → read the five-leg route → see the first unresolved step and the OBSERVED / UNKNOWN boundary → understand the conservative action.
- **Strongest functional moment:** the route reaches the last evidenced step, then visibly stops at the missing destination/refund proof; the adjacent recovery rail explains why retrying blindly is unsafe.
- **Primary action:** investigate a supported identifier or load a captured case; fallback is source-attributed evidence JSON, clearly marked provisional.
- **Critical states:** loading; captured public snapshot; failed/unresolved; refunded; complete; insufficient evidence; conflicted evidence; user-supplied provisional; error/no capture.
- **Surface inventory:** public marketing landing page is not part of the locked P0 journey; main incident desk is primary. No wallet connection, account creation or OAuth is required. Mobile is a first-class responsive incident workflow, not a shrunk desktop dashboard.

### Three materially distinct visual territories

#### A. Witness Desk — selected
- **Story:** a calm investigation instrument that puts the evidence trail and its stopping point in front of the user.
- **Composition:** asymmetric three-column workspace; compact command bar; left incident intake/case queue; large dark central lifecycle canvas; attached light recovery/evidence rail.
- **Hero/product moment:** a real F1 route with observed source/intent legs, a visible break at destination delivery, and the conservative next action in the adjacent rail.
- **Assets:** real F1/F2/F3 route states and source-linked evidence; the product itself carries the story.
- **Type / motion:** IBM Plex Sans + Mono; near-static evidence line; only meaningful focus/selection/state transitions.
- **Strengths:** the magic moment is visible immediately; provenance and unknowns are spatially legible; no decorative asset dependency; robust for a live demo.
- **Risks:** can become a generic admin dashboard if the route is reduced to another card or the central canvas lacks hierarchy.

#### B. Evidence Ledger
- **Story:** an archival case record with the precision of an audit ledger.
- **Composition:** bright paper-first editorial page; one strong case masthead; vertical chronology with marginal annotations; evidence references and actions arranged as a structured record rather than three dashboard columns.
- **Hero/product moment:** the timeline reaches a clearly annotated gap, with a “what is known / what remains unknown” evidence panel.
- **Assets:** source links, compact transaction extracts, case annotations and a printable/exportable dossier.
- **Type / motion:** editorial sans plus mono identifiers; almost no motion.
- **Strengths:** exceptional reading clarity and credibility; natural relationship to support handoff and exported evidence.
- **Risks:** the branching destination-versus-refund outcome can be flattened into a linear report; slower to communicate the unresolved fork in a short demo.

#### C. Signal Room
- **Story:** an operational control room for cross-chain transaction health.
- **Composition:** full dark topology canvas, dense telemetry sidebars, route graph as a wide map, state summaries and live-looking signal indicators.
- **Hero/product moment:** branching paths illuminate the confirmed route and terminate at a missing destination/refund signal.
- **Assets:** route topology and state visualization, with animated transitions between observed and unknown states.
- **Type / motion:** mono-heavy operational labels; stronger spatial movement and state transitions.
- **Strengths:** immediate technical spectacle and strong spatial representation of branching.
- **Risks:** easily resembles a generic crypto monitoring dashboard; motion can imply real-time monitoring or data the product does not actually possess; heavier demo and mobile risk.

### Art direction decision
**Select A — Witness Desk.** It is the most faithful expression of OSIALI's witness concept and the locked product workflow. It makes the missing evidence boundary, safe action and support handoff visible in one composition. It also preserves the proven existing implementation rather than spending time rebuilding a functioning P0 path for cosmetic novelty.

B is rejected as the primary direction because it weakens the route fork and the immediate first-unresolved-leg moment. C is rejected because its visual grammar risks suggesting live telemetry, universal chain coverage or autonomous recovery that OSIALI does not provide.

### Locked visual thesis
**OSIALI should feel like a forensic instrument built for calm decisions under uncertainty.** The interface does not dramatize failure; it makes the evidence boundary impossible to miss. The transaction route is the main visual story, while typography, surfaces and restrained annotations make the proof readable.

- **Hierarchy:** case identity/status → lifecycle route and first unresolved leg → safe next action → source evidence and export.
- **Density:** information-dense but not compressed; one dominant route, not a grid of equal cards.
- **Composition:** compact top bar; intake/queue rail; dominant central evidence canvas; attached protocol/action rail. Preserve deliberate asymmetry and strong alignment.
- **Color:** retain the current paper/ink/graphite palette. Warning and resolved colors are reserved for evidence states and always paired with labels.
- **Signature motif:** a branched route with a single witness marker at the last observed point; the line stops where evidence stops.
- **Imagery:** product-led and evidence-led. No stock imagery, generic chain art, invented transaction screens or arbitrary generated backgrounds.
- **Motion:** restrained, functional state transitions only. No fake transfers, pulsing “live” states, auto-scanning theatrics or decorative particles.
- **Mobile:** convert the route to a vertical, readable sequence; preserve the break, provenance labels, safe action and export access. Never shrink the desktop three-column layout into illegibility.

### Composition targets for the next gates
1. **First fold:** OSIALI wordmark and descriptor; identifier intake; a real case preview that reveals the unresolved leg without scrolling through a generic hero.
2. **Core app:** F1 evidence route dominates; side rails support rather than compete; source snapshot assurance remains visible.
3. **Magic moment:** animate nothing unless it explains a real user-triggered state change; show the evidence line ending at the unresolved destination and the exact safe action beside it.

### Pass / remaining work
- **ART_DIRECTION: PASS.** Three materially distinct territories compared; Witness Desk selected with explicit rationale and rejection risks.
- **REFERENCE_BOARD:** next. Source-captured references must be decomposed by composition, hierarchy, typography, density, route visualization, interaction and motion; no wholesale cloning.
- **VISUAL_ASSET_STRATEGY:** still open. OG preview replacement and desktop/mobile/F1/F2/F3 asset inventory must be specified.
- **DESIGN_LOCK:** still open. Do not authorize substantial design engineering until reference synthesis, asset strategy and static composition are complete.


## 2026-11-09 — REFERENCE_BOARD / Phase 17

References were selected by purpose and inspected as product UI, not as templates to copy.

### 1. NEAR Intents Explorer — transaction lifecycle and route summary
- **Source:** https://explorer.near-intents.org/ and the transaction-details screenshot documented at https://support.zodl.com/article/11-checking-swap-status
- **Capture:** https://d33v4339jhl8k0.cloudfront.net/docs/assets/6961731bd18eeb0ec6f3e679/images/69836b25c16be90554eee2a6/file-nmX1uHIy9c.png
- **Observed value:** a clear vertical progression (Created → Deposit Completed → Processing), followed by paired From / To asset panels.
- **Borrow:** explicit stage ordering and a compact source/destination summary tied to the same transaction.
- **Do not copy:** the success-oriented progress treatment or any implication that every stage is known. OSIALI must make missing evidence and uncertainty visible.

### 2. Sentry Issue Details — triage hierarchy and progressive disclosure
- **Source:** https://docs.sentry.io/product/issues/issue-details/ and https://sentry.io/changelog/new-issue-details-ui-now-available/
- **Capture:** https://cslswue7zohm4cat.public.blob.vercel-storage.com/us_okE0-diagram.png
- **Observed value:** high-level issue identity and actions, event context, main evidence detail, tags/breadcrumbs and a separate sidebar/activity area. Sentry explicitly describes strong information hierarchy and progressive disclosure as design principles.
- **Borrow:** group workflow actions separately from evidence; keep a stable case header; let secondary provenance/details expand without obscuring the primary failure boundary.
- **Do not copy:** event frequency graphs, stack-trace presentation, Sentry-specific AI/root-cause panels or its exact layout.

### 3. Honeycomb Trace Explorer — nested route inspection
- **Source:** https://docs.honeycomb.io/investigate/analyze/explore-traces/
- **Captures:** https://docs.honeycomb.io/images/explore-traces/error-highlighting.png and https://docs.honeycomb.io/images/explore-traces/slow-api-trace.png
- **Observed value:** nested spans make parent/child relationships legible; selecting a span reveals a focused attribute pane; error states are visibly highlighted in context.
- **Borrow:** clear hierarchy between route stages and their evidence; selecting a stage should expose its identifiers, source and observed facts without losing the overall route.
- **Do not copy:** duration-scaled bars or timing claims unless OSIALI has real, comparable timestamps/durations. The five Intents legs are workflow stages, not necessarily timed spans.

### 4. incident.io — curated incident chronology
- **Source:** https://incident.io/changelog/tell-the-full-story-with-your-incident-timeline
- **Captures:** https://cdn.sanity.io/images/oqy5aexb/production/432a7ab751895c5a9091e2569aef6f9714853a18-1652x922.png and https://cdn.sanity.io/images/oqy5aexb/production/1483f216bb35569018332e7cd17b7a5c41daa85f-2954x2090.png
- **Observed value:** the main timeline surfaces key incident moments while a separate activity log retains the full noisy history. The changelog explains the design goal as reducing noise and making important events easier to identify.
- **Borrow:** keep the primary case story concise and evidence-bearing; preserve access to the full underlying activity/evidence when needed.
- **Do not copy:** manual narrative editing or timestamp adjustment. OSIALI's timeline must remain source-attributed and must not let users rewrite observed chain events as facts.

### Synthesis for OSIALI
- **Center:** Honeycomb's inspectable hierarchy, adapted to the fixed five-leg transaction lifecycle.
- **Case framing:** Sentry's separation of case identity, actions, evidence details and secondary context.
- **Chronology:** incident.io's low-noise event story, but with immutable source provenance and visible unknown gaps.
- **Domain semantics:** NEAR Intents Explorer's source/destination asset pairing and recognizable stage names.
- **Final composition remains:** Witness Desk — intake/case rail, dominant route canvas, attached safe-action/evidence rail.

### Reference-board verdict
**REFERENCE_BOARD: PASS.** Four relevant source products and their UI captures were decomposed by purpose, with explicit borrow/reject decisions. No product is being cloned. The board supports the selected Witness Desk direction.

### Next
VISUAL_ASSET_STRATEGY must inventory the OSIALI wordmark/mark, replacement OG preview, authentic F1/F2/F3 captures, responsive screenshots and final demo video. The legacy Docketrail OG preview and old demo recordings are not approved assets.


## 2026-11-09 — VISUAL_ASSET_STRATEGY / Phase 18

### Asset inventory

| Asset | Purpose / judge-facing surface | Source and format | Priority / owner | Current status | Variants / budget |
|---|---|---|---|---|---|
| OSIALI wordmark + witness-point mark | App header, README, OG, video end-card | Custom vector/SVG built from the locked wordmark direction; no generated logo | MUST / Design Engineering | Wordmark text is present; dedicated mark not yet built | SVG, monochrome; mark legible at 16–24 px; target <10 KB |
| Favicon / app icon | Browser tab, bookmark, social avatar | Same route-line/witness-point SVG mark | MUST / Design Engineering | Inline route glyph exists in public/index.html; refine and validate at small sizes | 32×32 and 48×48 favicon; 512×512 avatar; SVG <10 KB |
| OSIALI OG preview | X/social link preview and repo share | Real OSIALI product screenshot + vector wordmark/layout; no stock or generated background | MUST / Design Engineering | public/og-preview.png is a legacy Docketrail image; replace | 1200×630 PNG/WebP; target <300 KB; verify publicly after deployment |
| F1 desktop hero capture | Shows failed/unresolved magic moment | Fresh capture of deployed OSIALI F1 path | MUST / Visual QA | Existing qa/operator-F1-desktop.png is pre-rename and stale | 1440×1000 PNG/WebP; target <300 KB |
| F2 refunded capture | Proves refund classification contrast | Fresh capture of deployed OSIALI F2 path | MUST / Visual QA | Not confirmed current-brand | 1440×1000; same scale/crop as F1 |
| F3 complete capture | Proves healthy completion contrast | Fresh capture of deployed OSIALI F3 path | MUST / Visual QA | Not confirmed current-brand | 1440×1000; same scale/crop as F1 |
| F1 mobile capture | Proves responsive primary workflow | Fresh deployed OSIALI F1 mobile capture | MUST / Visual QA | Existing qa/operator-F1-mobile.png is pre-rename and stale | 390×844; route converts to vertical sequence; target <250 KB |
| Final judge demo | Shows intake → evidence route → safe action → real export → F2/F3 contrast | Actual deployed UI screen recording, H.264 MP4 with voiceover and readable captions | MUST / Demo Director | Planned; old Docketrail recordings are backup only | 1440×900, 60–90 seconds, 25/30 fps; target <25 MB; audio clear, captions on-screen |
| Evidence export proof | Makes support handoff tangible | Actual JSON file produced by current app; optional cropped screenshot of opened JSON | SHOULD / Proof + Demo Director | Prior export proof exists; new OSIALI filename requires fresh check | JSON preserved unmodified; screenshot 1440 px wide if used |
| Route diagram | Explains five-leg journey and missing boundary | Real UI SVG/CSS diagram driven by case evidence | MUST / Design Engineering | Existing UI route is implemented; preserve behavior | Inline SVG/CSS, no external image request; text fallback |
| Fonts | Maintains brand and identifier hierarchy | Existing locally hosted IBM Plex Sans 400/500/600 and IBM Plex Mono 400 | MUST / Design Engineering | Present under public/fonts/ | WOFF2; no remote font dependency |

### Surface-by-surface visual mode
- **App first fold:** product-led/interface-first. Real F1 route is the primary asset; no abstract hero illustration.
- **Core investigation canvas:** diagram-led using the actual route and evidence states. The selected leg reveals real source facts in a side pane.
- **Recovery/action rail:** interface-first; exact next action and its predicates are the visual focus.
- **Refund/complete contrasts:** product-led captures with identical framing so judges can compare outcomes.
- **Social preview:** product capture + typographic wordmark; no unrelated hero art.
- **Demo:** motion-led only through real user interaction and state changes; no fake transfer animation.
- **Mobile:** product-led vertical route sequence, not a resized desktop screenshot.

### Asset acceptance rules
- Every screenshot must be captured from the deployed OSIALI build after browser regression; local screenshots are not final production evidence.
- Keep source snapshot/provisional warnings visible where relevant. Never crop away the provenance or assurance boundary to make the screen look cleaner.
- F1/F2/F3 use the same zoom, viewport and visual hierarchy.
- Do not publish the old Docketrail OG preview or old Docketrail demo.
- No external stock images, random gradients, generated blockchain network art, fake metrics, fake live indicators or invented transactions.
- The OG image must be fetched from a public social-preview validator after deployment; local metadata alone is not proof.
- Performance targets above are budgets, not measured results. Record actual file sizes when assets are produced.

**VISUAL_ASSET_STRATEGY: PASS.** Every major visual asset has a purpose, source, priority, owner, status, responsive variant and performance target. Actual asset production and visual QA remain open.

## 2026-11-09 — MOTION_STORYBOARD / Phase 19

The product's story is evidence state, not movement. No decorative or fake network animation is approved.

| Motion | Trigger / state change | Meaning | Timing | Fallback |
|---|---|---|---|---|
| Route focus | User selects a lifecycle leg | Moves attention to the selected evidence and its provenance | 120–160 ms opacity/outline transition | Immediate state change under prefers-reduced-motion |
| Evidence disclosure | User expands a leg or evidence section | Reveals supporting identifiers/details without losing route context | 120–160 ms height/opacity; avoid layout jump | Static expanded content, keyboard accessible |
| Status change | A newly loaded case changes the route state | Communicates actual observed status, not live activity | No simulated travel; direct state render | Text status + route marker |
| Export feedback | User activates JSON export | Confirms the real file handoff | Brief, non-blocking confirmation | Browser download remains the proof |

- No pulsing nodes, progress bars that imply unobserved processing, auto-scanning, flying tokens, animated bridges, or looping network backgrounds.
- Reduced-motion mode removes nonessential transitions.
- Mobile uses the same semantic states and no hover-only meaning.
- Motion performance budget: CSS-only transitions; no animation library or runtime dependency.

**MOTION_STORYBOARD: PASS.** All meaningful motion is tied to a real user-triggered state change; otherwise the interface remains still.


## 2026-11-09 — DESIGN_LOCK / Phase 20

### Locked product surface
OSIALI is a focused incident desk, not a generic crypto dashboard or a marketing-first SaaS site. The primary surface is the working investigation experience. No wallet connection, account creation, OAuth, or onboarding flow is required for the locked P0 journey.

### Desktop composition — 1440 × 1000 target
- **Top command bar:** 72 px high, 28 px horizontal inset. OSIALI wordmark + route glyph at left; concise “NEAR Intents / evidence-first incident response” descriptor; Case file anchor at right.
- **Workspace:** 3-column grid with 200 px intake rail, flexible central investigation canvas, 280 px recovery rail; 24 px top and 28 px horizontal page inset.
- **Left intake rail:** “Incident intake” heading; identifier form and primary Investigate swap action; three captured-case selectors; expandable source-attributed JSON fallback; capture record and source link; concise snapshot limitation.
- **Center investigation canvas:** dominant graphite surface. Header contains case ID, source → destination, classification, confidence and evidence provenance. The five-leg route occupies the main visual field. Destination and refund are explicit alternative terminals. The first unresolved leg is a real break, with a warning annotation and evidence state; no decorative route motion.
- **Right recovery rail:** classification, first unresolved step, safe next action, exact action predicates, evidence-language legend and safety note. This is attached to the route, not a floating card stack.
- **Evidence handoff:** below the workspace, aligned to the investigation area. Includes export action, source provenance, evidence rows and expandable raw JSON/escalation summary.
- **Footer:** OSIALI, NEAR Hackathon context and truthful “captured cases, not real-time recovery” boundary.

### First-fold hierarchy
1. Case identity and current classification.
2. Five-leg route and first unresolved boundary.
3. Safe action and why it is safe.
4. Evidence basis and provenance.
5. Full evidence ledger and export follow-through.

The judge should understand the failure boundary without opening the raw JSON. The detailed evidence remains one action away.

### Core app and interaction contract
- Captured-case buttons load F1/F2/F3; selected state is visible and keyboard-operable.
- Identifier form accepts supported Explorer URL/hash input; it must show honest lookup/fallback status and must not imply universal private-history access.
- Manual evidence JSON is explicitly provisional/unverified; mismatch or conflict remains visible.
- Selecting a route stage exposes its actual identifiers and source facts; absent proof stays UNKNOWN.
- Recovery rail states the first unresolved step and exact conservative action. Do not retry blindly when the locked predicates require escalation.
- Export downloads the actual OSIALI-prefixed JSON bundle; the evidence schema and provenance are unchanged by the brand rename.

### Mobile composition — 390 × 844 target
At widths ≤760 px, stack the workflow in this order:
1. 60 px top bar with OSIALI mark and Case file anchor.
2. Intake section; captured cases remain a horizontally scrollable selector row.
3. Case header and classification.
4. Vertical lifecycle sequence; the break and destination/refund alternatives remain explicit.
5. Recovery protocol and predicates.
6. Evidence ledger and export.
No desktop three-column shrinking. No horizontal page overflow. Preserve labels, safe action, source provenance and export access.

### Type, color and surface lock
- IBM Plex Sans 400/500/600 for interface and OSIALI wordmark; IBM Plex Mono 400 for hashes, IDs, evidence keys and provenance.
- Existing paper/ink/graphite palette remains locked: paper #f2f3ef, surface #fafbf8, ink #22282c, muted #626b70, line #d7dcd8, canvas #1b2227, chalk #f0f2ed, steel #a6b2b9, warning #f0a49a/#933c32, resolved #accab8.
- Warning/resolved colors are semantic only and are always paired with text labels and line treatment.
- No new decorative gradients, glass surfaces, stock photography, fake live charts, glowing nodes or coin/chain iconography.

### Accessibility and responsive acceptance
- Keep the skip link, semantic headings, form labels, aria-live status, keyboard-accessible details, visible focus rings and descriptive link text.
- Color never carries evidence meaning alone.
- Reduced-motion preference disables nonessential transitions.
- Buttons and primary actions remain comfortably tappable on mobile; no hover-only content.
- Test desktop at 1440×1000 and mobile at 390×844; inspect intermediate 760 px breakpoint and verify no horizontal overflow.

### Design lock proof and limitations
- The static composition is grounded in the current implemented DOM/CSS structure, not an invented mockup: 72 px top bar, 200 px / fluid / 280 px desktop workspace, five-stage route, attached recovery rail, evidence ledger, and explicit ≤760 px mobile stack.
- Existing F1 desktop/mobile captures are pre-rename and may be used only to understand the established composition, not as final branded proof.
- The latest OSIALI HTML title/header source is deployed in a READY Vercel build; browser-level rendered verification is still pending.
- Actual OG preview, dedicated mark, fresh F1/F2/F3 screenshots and final demo remain production tasks in later phases.

**DESIGN_LOCK: PASS — revision 2.** The composition, hierarchy, interactions, responsive behavior, visual tokens and acceptance viewports are implementable without further aesthetic invention. This authorizes Design Engineering to execute the locked identity/assets while preserving the P0 journey; it does not pass Visual QA.
