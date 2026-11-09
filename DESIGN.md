# DESIGN — Docketrail / newest Operator
Status: **DESIGN_LOCK revision 1 (2026-11-09)**. Original approved Pass 3 forensic incident-desk direction retained. Actual production commit 6b1abb5 inspected at desktop 1440×1000 and mobile 390×844; new name/route/safe-action rendered correctly, F1/F2/F3 outcomes checked and mobile horizontal overflow measured false.

## Product / experience map
User: person/integrator facing ambiguous NEAR Intents swap status. First 30 seconds: load captured case or known identifier → inspect branched route → see evidence break and safe action. Primary surface: incident desk, with captured-case left rail, central evidence route, attached recovery rail, and support ledger/export. Account/wallet/auth N/A: read-only diagnostic tool. Loading, no-capture, manual provisional, error, refund and complete states exist.

## Art direction
Forensic operations instrument, never generic crypto/AI dashboard. Compact top command bar, left case queue, dominant dark investigation canvas, narrower light protocol rail. Route evidence, not a hero image, is the primary visual asset. Nodes 1–3 depict source/intake/solver, branching to alternative destination/refund terminal outcomes. The first unresolved leg is an actual break in the line and a red annotation; observed data is not invented.

## Reference synthesis
- Stripe-like chronological operational legibility, not visual cloning.
- Sentry-like localization of what failed / where evidence ends.
- Cloudflare-like restraint and compact systematic controls.
- Internal approved `DESIGN-PASS3.md` remains an internal working reference; earlier rejected redesigns are anti-references.
No arbitrary generated imagery, floating widgets, gradient effects or fake chain motion.

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