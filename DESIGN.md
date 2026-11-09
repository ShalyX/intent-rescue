# DESIGN — OSIALI / newest Operator
Status: **ART_DIRECTION PASS (2026-11-09); DESIGN_LOCK remains OPEN.** The older revision-1 label is historical and is not accepted as the current v0.5.0 Design Lock because the reference board, asset strategy and formal visual QA gates are still incomplete. Original approved Pass 3 forensic incident-desk direction retained. Actual production commit 6b1abb5 inspected at desktop 1440×1000 and mobile 390×844; new name/route/safe-action rendered correctly, F1/F2/F3 outcomes checked and mobile horizontal overflow measured false.

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
