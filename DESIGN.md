# OSIALI — Landing Page Design & Implementation Specification

**Status:** ART DIRECTION + IMPLEMENTATION SPEC LOCKED
**Reference:** Tenderly — https://tenderly.co/
**Product:** OSIALI — evidence-first incident response for NEAR Intents
**Canonical domain:** https://osiali.vercel.app
**Scope:** Public marketing homepage and route separation only. The existing investigation application and its product semantics remain intact.

---

## 1. Objective

Build a high-conviction public landing page that makes OSIALI feel like a credible, investment-worthy developer/operations product. It must communicate the product's value in the first screen, demonstrate the actual working product, explain its evidence discipline, and move visitors into the existing investigation workflow.

This is a presentation and information-architecture layer around the existing product. It is not permission to invent product capabilities, expand the P0 scope, or redesign the investigation application.

**Primary conversion:** open the existing OSIALI incident desk and investigate a swap.
**Secondary conversion:** inspect the three captured example cases and the evidence standard.
**Primary audience:** NEAR Intents swap users, integrators, and support operators.

## 2. Product reality — binding

OSIALI helps a swap user, NEAR Intents integrator, or support operator investigate a delayed, failed, incomplete, or unrefunded swap.

The supported workflow is:

1. Enter a supported identifier or matching evidence payload.
2. Reconstruct source deposit → 1Click intake → intent/solver → destination delivery or refund.
3. Identify the unresolved evidence boundary.
4. Recommend a conservative next step.
5. Export a support-ready case.

The five lifecycle stages are Source deposit, 1Click intake, Intent / solver, Destination delivery, and Refund. Destination and Refund are terminal alternatives.

### Claims and limitations that must remain explicit

- Public Explorer reads are source-attributed page snapshots, not independent chain-finality verification.
- User-supplied evidence is provisional and unauthenticated.
- Missing evidence is not proof of loss, failure, protocol fault, or refund.
- OSIALI does not custody funds, execute swaps, execute refunds, guarantee recovery, or infer root cause from missing evidence.
- There is no universal historical lookup, live refund tracking, or real-time monitoring claim.
- No adoption, customer, TVL, volume, uptime, or impact statistics unless separately evidenced and approved.
- No implication that OSIALI is an official NEAR Protocol product or endorsed service.

The three approved captured examples remain the only landing-page outcome demonstrations:
- **F1:** LTC → ETH; reported failed; destination and refund evidence unresolved.
- **F2:** USDC → xDAI; source-reported refund.
- **F3:** ZEC → ETH; source-reported successful withdrawal.

Use source-bounded language such as “captured snapshot reports” and “evidence observed in this case.” Never imply that historical snapshots establish current chain state.

## 3. Tenderly reference analysis

Tenderly is the primary reference for page hierarchy, product-led storytelling, interface demonstration, technical credibility, and conversion structure. It is not a visual template to clone.

### Observed reference hierarchy

1. Compact navigation with clear product/resource paths and a primary action.
2. Strong positioning hero paired with a detailed, believable product visualization.
3. Credibility strip.
4. A simple operating-model explanation.
5. Large product demonstrations with real-looking technical context.
6. Diagnostic/deep-dive sections that make the product tangible.
7. Operational workflow / response explanation.
8. Collaboration and use-case context.
9. Evidence of scale and ecosystem credibility.
10. Closing conversion CTA and structured footer.

### Actual demonstrations inspected

- **Homepage Network Mirror:** mainnet head, virtual-network head, sync state and state-drift rows. The interface is the hero's counterweight to the headline.
- **Simulator page:** a dependent three-step transaction bundle, forked-state context, simulation state and end-state diff. The visitor can understand what the product does without reading a long explanation.
- **Console page:** a failed transaction, decoded execution trace, call sequence, revert reason, gas context and human-readable failure. This is particularly relevant to OSIALI's investigation narrative.
- **Monitor page:** an operations center, protocol status, alert builder, conditions and destinations.
- **Incident Management page:** a clear detect → inspect → respond → review story, paired with an operational war-room demonstration.

### Principles to adopt

- Product interface is the primary proof asset, not decorative artwork.
- Copy and interface are composed together; neither is an afterthought.
- Demonstrations reveal real workflow states and explain why they matter.
- The visitor is moved from the problem to the product's operating model, then to deeper proof.
- Repeated CTAs appear at meaningful decision points.
- Navigation and footer make the product feel like a real, complete service.
- Technical detail is presented with enough context for a non-specialist to understand it.

### Principles not to copy

Tenderly is a broad platform with several products, customer logos, testimonials, large-scale metrics, team workflows, and monitoring/simulation capabilities. OSIALI does not have those things. Do not reproduce its product breadth, logo wall, customer proof, testimonials, metrics, or multi-product navigation.

OSIALI has one focused job. Its credibility must come from its actual investigation interface, real captured cases, evidence provenance, and transparent limitations.

**Reference sources inspected:**
- https://tenderly.co/
- https://tenderly.co/products/simulator
- https://tenderly.co/products/console
- https://tenderly.co/products/monitor
- https://tenderly.co/solutions/incident

## 4. Current OSIALI implementation audit

Repository: https://github.com/ShalyX/osiali
Local project: `C:\Users\USER\Documents\intent-rescue`
Canonical production URL: https://osiali.vercel.app

### Existing application

The current `public/index.html` is the incident application, not a marketing homepage. It contains:
- Top bar and OSIALI mark.
- Incident intake, identifier lookup, captured F1/F2/F3 selectors, and manual evidence JSON.
- Dark investigation canvas with route reconstruction and provenance.
- Recovery protocol, exact predicates, and OBSERVED / INFERRED / UNKNOWN legend.
- Support-ready case file and JSON export.

The current visual system uses a restrained pale-paper shell, ink typography, a dark charcoal investigation canvas, semantic red/green/amber, and locally bundled IBM Plex Sans / IBM Plex Mono. The route interruption and evidence ledger are distinctive product assets.

The current product screenshot at `docs/images/desktop.png` is an authentic OSIALI-branded investigation state. Use it as an initial reference only; capture fresh landing-specific assets from the final application before release.

### Important implementation finding

`public/styles.css` contains a dormant “Pass 4” group of selectors for `.site-header`, `.landing`, `.proof-strip`, `.explainer-section`, `.demo-intro`, `.closing-cta`, and `.site-footer`. The current `public/index.html` does not contain the corresponding landing-page markup. These styles are not a completed page and must not be treated as an approved composition. Audit and remove unused/obsolete rules after the new implementation is rendered and verified.

The app-specific Pass 3 design brief explicitly rejects a marketing hero inside the investigation workspace. That constraint remains binding for the app. The public marketing homepage is a separate surface and must not be inserted into or visually compromise the incident desk.

## 5. Three materially different art directions considered

### Direction A — Product-led operations narrative (RECOMMENDED / LOCKED)

**Concept:** A confident editorial landing page whose hero is paired with an authentic OSIALI investigation capture. The visitor sees the evidence break immediately. The rest of the page explains how the same workflow moves from intake to reconstruction to safe handoff.

- Focal point: authentic F1 investigation preview, with the destination evidence boundary visible.
- Composition: asymmetric copy + large product visual; the dark investigation canvas is the counterweight to the pale editorial shell.
- Story: problem → product demonstration → operating method → three case outcomes → evidence standard → handoff → launch.
- Reference rationale: Tenderly homepage/Console for product-led hero and detailed demonstration; Tenderly Incident Management for workflow narrative.
- Advantage: highest clarity and credibility; shows the actual product and its distinctive moment.
- Risk: screenshot must be recaptured from current OSIALI build and cropped carefully; stale legacy screenshots would damage trust.

### Direction B — Incident editorial / case-story

**Concept:** A long-form, editorial narrative follows F1 from the user's initial uncertainty through the evidence boundary and safe recommendation.

- Focal point: a large, typeset incident timeline with evidence excerpts.
- Composition: sequential, asymmetric editorial panels and annotated product crops.
- Story: “A swap reports failure. What can actually be established?” → evidence trail → unknown terminal outcomes → safe next action → export.
- Reference rationale: Tenderly's incident use-case page and Console's failure explanation.
- Advantage: strong empathy and a memorable, concrete story.
- Risk: over-centres F1, can make OSIALI appear to be a single-case postmortem rather than a reusable investigation tool.

### Direction C — Forensic route atlas

**Concept:** The five-stage NEAR Intents lifecycle becomes a large, diagram-led hero. Evidence junctions and terminal alternatives create a unique visual map.

- Focal point: the branching route diagram and evidence break.
- Composition: wide route visualization with concise annotations; product UI appears later as proof.
- Story: lifecycle → where evidence can stop → how OSIALI classifies the state → case export.
- Reference rationale: OSIALI's own route motif, with Tenderly's technical visualizations as inspiration.
- Advantage: highly product-specific and visually memorable.
- Risk: duplicates the app's central visual and can make the landing feel like documentation rather than a product introduction.

### Direction decision

Lock **Direction A**. Borrow Direction C's route-break motif for the hero product crop and Direction B's concise incident storytelling for the first explanatory section. Do not blend the three into a cluttered hybrid. Direction A remains the governing composition.

## 6. Art direction lock

**Visual thesis:** An evidence-first operations product, presented with the calm authority of a technical instrument. The visitor sees a real incident being reconstructed, not a fictional crypto dashboard.

**Character:** precise, forensic, composed, technically literate, quietly confident.
**First-impression goal:** “This is a serious tool that shows what is known, what is missing, and what to do safely next.”
**Signature visual:** the transfer route visibly stops at the first unresolved evidence boundary.
**Visual hierarchy:** product demonstration first; concise positioning second; evidence and method third.
**Brand continuity:** retain OSIALI's existing mark, IBM Plex families, paper/ink/charcoal palette, and semantic evidence colors.

Do not use:
- Neon, crypto gradients, glassmorphism, glowing nodes, generic 3D coins, token illustrations, stock people, AI sparkle motifs, or cyberpunk decoration.
- Fake dashboards, invented transaction values, fake live activity, fake status monitors, or animated “live network” indicators.
- Generic rounded feature-card grids, arbitrary bento layouts, fake customer logo walls, testimonials, or fabricated statistics.
- Decorative animation that implies real-time chain activity or a verified outcome.

## 7. Page hierarchy and content specification

### 7.1 Global navigation

**Composition:** restrained sticky header, light paper surface, OSIALI mark left, a small number of anchor links in the middle/right, one high-contrast action at the far right.

**Items:**
- OSIALI mark / home.
- How it works → `#how-it-works`.
- Example cases → `#cases`.
- Evidence standard → `#evidence-standard`.
- GitHub → `https://github.com/ShalyX/osiali`.
- Primary CTA: **Open OSIALI** → `/app/`.

No mega-menu, sign-in, pricing, book-a-demo, or empty resource links. Mobile navigation must remain compact and keyboard accessible; use a simple menu only if the full link set cannot fit.

### 7.2 Hero — “When a swap stalls, see where the evidence stops.”

**Communication goal:** immediately explain the problem and prove that OSIALI is a working product.

**Recommended copy:**
- Eyebrow: `NEAR INTENTS · EVIDENCE-FIRST INCIDENT RESPONSE`
- Headline: **When a swap stalls, see where the evidence stops.**
- Supporting copy: “Reconstruct the transfer route, identify the first unresolved step, and prepare a support-ready case — without guessing what happened to the funds.”
- Primary CTA: **Investigate a swap** → `/app/`.
- Secondary CTA: **See how it works** → `#how-it-works`.
- Trust line: “Read-only investigation · No wallet connection · No funds moved.”

**Composition:** asymmetric two-column layout. Copy occupies the left 5/12; a large authentic product capture occupies the right 7/12 and may extend toward the page edge. The image should feel like an intentional window into the working product, not a floating generic dashboard card. Use a subtle frame, deliberate crop, and real F1 route break. A small caption may identify “Captured case F1 · Historical public snapshot · Failed / unresolved”; it must not imply live monitoring.

**Primary asset:** fresh OSIALI-branded F1 screenshot captured from the actual application after route migration. It must show the lifecycle and first unresolved destination boundary. Do not use older Docketrail or pre-brand Intent Rescue captures.

**Mobile:** headline and CTAs first; then a carefully cropped, legible product preview. Do not shrink the desktop two-column composition into an unreadable thumbnail.

### 7.3 Credibility strip — capabilities, not vanity metrics

A slim typographic band immediately after the hero. Use four factual proof points:
- NEAR Intents-specific workflow.
- Source-attributed evidence.
- Explicit unknown-state handling.
- Portable JSON case export.

These are product truths, not adoption claims. Do not add numbers, partner logos, or customer names.

### 7.4 Problem / value section — “A status is not an explanation.”

**Communication goal:** show why a failed/success/refunded status alone is insufficient.

**Composition:** one large editorial statement paired with a real F1 evidence excerpt or screenshot crop. The evidence visual must show what is present and where the record stops. Use actual fixture values, not invented examples.

**Copy direction:** “A reported status tells you what a system said. It does not show which parts of the transfer are supported by evidence.” Follow with the exact boundary: missing destination or refund evidence does not establish loss, cause, or refund.

**Visual proof:** real F1 case; source deposit, 1Click intake, and intent/solver evidence present; destination and refund not observed in that evidence set.

### 7.5 How it works — “From identifier to support-ready case.”

**Communication goal:** explain the one primary workflow in three steps, without inventing a separate product feature.

1. **Trace the swap** — enter a supported Explorer identifier or matching evidence payload.
2. **Reconstruct the route** — inspect source deposit, 1Click intake, intent/solver, and the destination/refund alternatives; see where evidence stops.
3. **Prepare the handoff** — read the bounded next action and export the evidence bundle for support.

**Composition:** a continuous, editorial three-stage flow, not three generic rounded cards. Use cropped authentic UI states or a single wide product strip with callouts tied to actual controls. Each step links to the same existing app workflow.

### 7.6 Example cases — “Three outcomes. One evidence standard.”

**Communication goal:** demonstrate that the same investigation model handles different terminal outcomes.

Use three selectable case panels or tabs. The active state may change a real screenshot and its caption; every CTA must open the corresponding existing fixture route.

- **F1 · Failed / unresolved · LTC → ETH:** destination and refund evidence are not observed in this captured evidence set. CTA: “Inspect unresolved case” → `/app/?demo=F1`.
- **F2 · Source-reported refund · USDC → xDAI:** refund evidence is present in the captured snapshot; destination evidence is not observed. CTA: “Inspect refund case” → `/app/?demo=F2`.
- **F3 · Source-reported completion · ZEC → ETH:** successful withdrawal is reported in the captured snapshot; refund is not observed. CTA: “Inspect completed case” → `/app/?demo=F3`.

Use screenshots freshly captured from the current OSIALI UI for all three cases. Label all as historical/captured examples. The interactive selector is a presentation of existing fixtures, not a new analysis capability.

### 7.7 Evidence standard — “Known, supported, and unknown are different things.”

**Communication goal:** explain OSIALI's strongest differentiator: evidence provenance and honest uncertainty.

Show the actual three evidence states:
- **OBSERVED:** direct identifier or transaction evidence in the evidence set.
- **INFERRED:** supported by related evidence, but not directly seen.
- **UNKNOWN:** no evidence observed; no conclusion drawn.

**Signature composition:** a large horizontal or branching lifecycle fragment with solid, dotted, and open/dashed route treatments, labelled in text. The distinction must remain clear in grayscale and without relying on color alone.

Prominent statement: **Missing evidence is not proof of loss, protocol fault, or refund.**

Explain that public Explorer snapshots are not independent chain verification and manual input is provisional. This section is a trust asset, not a disclaimer buried in the footer.

### 7.8 Support handoff — “Leave with a case, not just a screenshot.”

**Communication goal:** show the tangible output of the workflow.

Use a fresh crop of the actual case-file ledger and/or a carefully typeset excerpt from a real exported F1 bundle. Show source provenance, evidence references, unresolved proof, and escalation context only when those fields are present in the actual export.

CTA: **Open OSIALI and export a case** → `/app/`.

Do not invent a sample support ticket, support response, or successful escalation.

### 7.9 Closing CTA

**Headline:** “Start with the evidence you have.”
**Supporting copy:** “Trace a captured case or investigate a supported NEAR Intents identifier. Unknowns stay unknown.”
**Primary CTA:** **Open OSIALI** → `/app/`.
Secondary link: **Explore the source** → GitHub.

### 7.10 Footer

Include OSIALI mark, one-line product descriptor, links to Open OSIALI, GitHub, product explanation, evidence limitations, and relevant NEAR Intents reference. Include the read-only/evidence-bounded nature of the product. No invented company address, contact details, partner badges, or social accounts.

## 8. Visual system and composition rules

- Maximum content width: approximately 1,360–1,440px.
- Desktop grid: 12 columns with consistent gutters; use intentional asymmetric spans.
- Desktop page margins: 56–72px; tablet 32px; mobile 18–22px.
- Spacing rhythm: 4px base, 8px primary rhythm.
- Reuse existing IBM Plex Sans and IBM Plex Mono assets; do not add a font dependency.
- Preserve the existing paper, ink, charcoal, steel, and restrained semantic colors. Use the red only for unresolved evidence and green only for supported positive/refund outcomes.
- Landing display type may be larger than app type, but it must remain controlled, readable, and OSIALI-specific.
- Prefer fine rules, indexed labels, carefully cropped interface imagery, and generous but purposeful whitespace.
- Use square or modestly rounded geometry consistent with the existing instrument aesthetic; avoid endless pill and card patterns.
- Do not redesign the incident app's current dark canvas, lifecycle route, recovery rail, or case file while implementing the landing page.

## 9. Asset strategy

| Asset | Purpose | Source | Priority |
|---|---|---|---|
| Hero F1 product capture | Prove the core product immediately | Fresh browser capture from current OSIALI app | MUST |
| F1/F2/F3 case captures | Demonstrate distinct outcomes | Fresh captures from current app fixtures | MUST |
| Case-file / JSON export crop | Prove the handoff output | Actual current app and actual export | MUST |
| Evidence route illustration | Explain OBSERVED / INFERRED / UNKNOWN | Purpose-built SVG/CSS using real lifecycle semantics | SHOULD |
| OSIALI wordmark/mark | Brand recognition | Existing `public/osiali-mark.svg` and avatar | MUST |

All product imagery must be real captures of the current OSIALI application or diagrams derived directly from the approved lifecycle. No generative mock dashboards or arbitrary stock images.

Optimize screenshots to AVIF/WebP with a PNG fallback only where necessary. Provide appropriately sized responsive variants. Hero asset should be eager-loaded and dimensioned to prevent layout shift; below-fold imagery should be lazy-loaded.

## 10. Interaction and motion

- Navigation anchors scroll to their sections and retain visible focus states.
- Primary CTA navigates to the real application at `/app/`.
- Case selector changes only among real F1/F2/F3 captures and links to the matching existing app fixture. No simulated transaction execution.
- One restrained route-break reveal may be used to direct attention to the unresolved boundary. It must not look like a live transaction or chain animation.
- Prefer meaningful state transitions over generic fade-up-on-scroll effects.
- Respect `prefers-reduced-motion`; reduced-motion mode must present the complete static composition.
- No autoplay video, looping background animation, cursor-following effects, parallax that harms reading, or animation that obscures text/product state.

## 11. Routing and implementation architecture

### Required information architecture

- `/` — new public marketing landing page.
- `/app/` — existing incident investigation application.
- `/app/?demo=F1`, `/app/?demo=F2`, `/app/?demo=F3` — existing captured-case launch paths.
- `/api/incident`, `/public/*`, `/src/*`, and `/fixtures/*` retain their existing behavior.

### Migration plan

The current static build copies `public/index.html` directly to `dist/index.html`. Split the two surfaces without introducing a new framework or runtime dependency:

1. Move the existing app HTML into a dedicated app source file (recommended: `app/index.html`).
2. Create the new landing page at `public/index.html`.
3. Update `scripts/build-static.mjs` to emit the app shell at `dist/app/index.html` while preserving `dist/index.html` as the landing page.
4. Update `server.mjs` so local `/app` and `/app/` serve the app shell. Keep `/` as the landing page.
5. Ensure Vercel serves `/app/` as a directory index. Add a precise rewrite/redirect only if deployment testing proves it is necessary.
6. Preserve old `/?demo=F1|F2|F3` links by redirecting those legacy query routes to `/app/?demo=F1|F2|F3`. Do not redirect the plain root route.
7. Update README, docs, OG/canonical metadata, demo links, and any submission references so the root domain means “landing” and the app link means `/app/`.
8. Keep the API and static fixture/module paths unchanged.

The application assets currently use absolute `/public/*`, `/src/*`, and `/fixtures/*` paths, so the app route can retain those paths without a frontend asset-prefix rewrite.

### Metadata

Landing page:
- Title: `OSIALI — Evidence-first NEAR Intents incident response`.
- Description: accurately describe swap investigation, evidence boundaries, safe next steps, and support-ready export.
- Canonical: `https://osiali.vercel.app/`.
- OG/Twitter title, description, and a new landing-specific 1200×630 preview.

Application:
- Title: `OSIALI — Incident Desk`.
- Canonical: `https://osiali.vercel.app/app/`.
- Keep the current app-specific description and product screenshot metadata.
- Ensure old `intent-rescue.vercel.app` references are redirected/updated where appropriate.

## 12. Responsive requirements

Capture and inspect the full landing page at:
- Desktop: 1440×1000.
- Laptop: 1280×800.
- Tablet: 768×1024.
- Mobile: 390×844 and 320×740.

At mobile widths:
- Keep the hero message and primary CTA above the first product image.
- Use an intentional crop of the actual product capture; preserve the route break and meaningful labels.
- Collapse the workflow into a readable vertical sequence.
- Make case selection horizontally scrollable or vertically stacked with clear selected state.
- Keep evidence-state diagrams legible and accessible.
- Stack the final CTA and footer without horizontal overflow.
- Preserve tap targets of at least 44px and visible keyboard focus.

Do not simply shrink the desktop grid.

## 13. Accessibility, performance, and implementation quality

- Semantic landmarks, one descriptive H1, ordered heading hierarchy, descriptive link labels, and meaningful alt text for every product capture.
- All controls keyboard-operable; focus states visible; no color-only status distinctions.
- Maintain WCAG AA text contrast for body copy and interactive controls.
- No autoplay media; reduced-motion support required.
- Reuse local fonts and avoid unnecessary JavaScript/dependencies.
- Target mobile Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms on a representative connection/device.
- Avoid shipping the full app JavaScript to the landing route unless it is needed for the actual case selector. Prefer a small landing-only script.
- Optimize the hero image; lazy-load below-fold captures; set explicit image dimensions/aspect ratios.
- No tracking scripts or third-party embeds without a product/privacy reason.

## 14. QA and acceptance gates

### Functional
- Root landing loads on production and has correct canonical/OG metadata.
- `/app/` loads the existing incident desk.
- F1/F2/F3 app routes load the correct fixtures and preserve their exact classifications/evidence semantics.
- Legacy `/?demo=F1|F2|F3` routes redirect correctly.
- Identifier lookup, manual evidence, source links, safe-action guidance, and JSON export still work in the app.
- All landing CTAs and nav links resolve.
- Browser console has no errors; no broken images or fonts.

### Visual
- Compare the rendered page to this specification and the Tenderly reference hierarchy.
- Capture all specified viewports and inspect the first fold, product demonstration, case selector, evidence standard, CTA, and footer.
- The hero must show the actual OSIALI product, not a fabricated dashboard.
- The page must be recognizably OSIALI if the logo is hidden: the evidence break, five-stage lifecycle, and source-provenance language should remain distinctive.
- No stale Intent Rescue or Docketrail branding in screenshots or metadata.
- No horizontal overflow, clipped controls, unreadable product preview, generic feature-card grid, or dead empty sections.

### Design-quality score gate
Score 0–4 for:
1. Product awareness and task clarity.
2. Memorability and originality.
3. Visual composition and hierarchy.
4. Brand coherence.
5. Interaction and motion intentionality.
6. Completeness, accessibility, and responsiveness.

Pass requires every category ≥3/4 and overall ≥20/24, with zero blocking usability defects and actual screenshot proof for the landing and app. A score without captures is NOT VERIFIED.

### Release
- Run full existing tests, red-team suite, static build, and current browser regression suite.
- Verify the deployed production domain and all routes after deployment.
- Inspect desktop and mobile production screenshots.
- Update README, docs, and release evidence.
- Preserve the existing app, F1/F2/F3 behavior, demo recording, and submission links.

## 15. Explicit non-goals / feature-freeze guard

- No changes to classifier, lifecycle semantics, intake, evidence schema, API, export contract, fixtures, or core app workflow for the sake of marketing.
- No wallet connect, swap execution, refund execution, live monitoring, notifications, accounts, analytics dashboard, or AI assistant.
- No invented adoption metrics, customer logos, testimonials, guarantees, or chain verification.
- No rebrand, logo redesign, or change to the locked OSIALI name.
- No changes to the approved demo video/script unless a verified correctness issue requires them.
- No changes to hackathon track selection or submission content beyond updating the correct public landing/app URLs.

The feature freeze remains active. This landing page is a presentation/product-discovery surface, not a new product capability.

## 16. Implementation exit definition

The landing page is complete only when:
1. The public root clearly communicates OSIALI and shows its real product.
2. The existing investigation desk is preserved at `/app/`.
3. F1/F2/F3 and legacy links remain correct.
4. All factual claims are traceable to the approved product brief and release evidence.
5. Desktop and mobile visual QA pass the score gate.
6. Functional, accessibility, performance, and production-route checks pass.
7. The deployed production site has been inspected, not merely built locally.

**Locked direction:** Tenderly-inspired product-led operations narrative, expressed through OSIALI's own forensic route-break identity.
