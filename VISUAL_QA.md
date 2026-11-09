# OSIALI — Visual QA Report

**Date:** 2026-11-09  
**Target:** https://intent-rescue.vercel.app/  
**Production commit:** `0dff84c60995389111e34db13f2138d5603510de`  
**Operator phase:** 22 — VISUAL_QA  
**Verdict:** PASS — 20/24, no hard veto

## Capture set

Actual browser captures were produced from the live production alias using Playwright/Chromium in the persistent Vercel sandbox session `sbx_RGtLONSkbtxObF6HBaqeCIWn2t2I`, under `/vercel/intent-rescue/qa/visual-qa/final/`.

| Capture | Viewport | Path |
|---|---:|---|
| Desktop entry / incident desk | 1440×1000 | `desktop-entry.webp` |
| Desktop F1 unresolved magic moment | 1440×1000 | `desktop-f1.webp` |
| Desktop F2 refunded contrast | 1440×1000 | `desktop-f2.webp` |
| Desktop F3 complete contrast | 1440×1000 | `desktop-f3.webp` |
| Mobile entry | 390×844 | `mobile-entry.webp` |
| Mobile F1 magic moment | 390×844 | `mobile-f1.webp` |
| Mobile full vertical flow | 390×3598 | `mobile-f1-full.webp` |
| Intermediate breakpoint checks | 761 / 900 / 1024 px | `breakpoint-761.png`, `breakpoint-900.png`, `breakpoint-1024.png` |

The product root is intentionally the incident desk; a separate marketing landing page is outside the approved P0 workflow. The screenshot set is retained in the persistent QA sandbox and is not misrepresented as committed repository assets.

## Verification

- **Live response:** HTTP 200; page title `OSIALI — Incident Desk`; no Docketrail string in rendered HTML; canonical URL and `og:site_name=OSIALI` present.
- **Browser health:** no page errors, console errors or failed requests.
- **Product states:** F1 `Failed unresolved`; F2 `Refund verified`; F3 `Complete`. F1 conservative next-action text remains present.
- **Export:** real download `osiali-F1.json`, 4,414 bytes, valid JSON. Includes schema, source, incident, diagnosis, lifecycle, observations, identifiers, source links, unresolved evidence, escalation and limitations.
- **Axe WCAG 2.1 AA:** desktop 28 passes / 0 violations; mobile 27 passes / 0 violations. Axe reported six incomplete contrast checks because they are non-text glyphs or SVG/image-backed backgrounds; these were manually reviewed.
- **Manual contrast:** active fixture secondary label 5.79:1 after correction; route arrow 7.43:1; “Evidence stops here” 8.03:1. All exceed 4.5:1 for normal text.
- **Keyboard and semantics:** skip link is first focus target; brand, Case file, labelled identifier input, Investigate, F1/F2/F3, evidence disclosure and source link are keyboard reachable. Focus indicator is visible at 2px. Status is `role=status` with polite live announcement.
- **Reduced motion:** `prefers-reduced-motion: reduce` is detected; nonessential transition/animation durations are absent.
- **Responsive:** no horizontal overflow at 390, 760, 761, 900, 1024 or 1440 px.
- **Build/tests:** 35/35 automated tests passed; static build completed.

## Defect and resolution

| Finding | Severity | Resolution |
|---|---|---|
| Selected fixture secondary label contrast was 4.31:1 on its active background | Serious accessibility defect | Darkened only the active small-label color to `#4d585d`; measured contrast is now 5.79:1 |
| Axe contrast incomplete results for arrow glyphs and SVG/image-backed labels | Needs manual review, not a reported violation | Verified relevant route/status text contrast against the actual dark canvas; decorative arrows are aria-hidden |

## Six-dimension scorecard

| Dimension | Score | Rationale |
|---|---:|---|
| Product awareness and task clarity | 4/4 | Case identity, five-leg route, evidence boundary and safe action dominate the first fold |
| Memorability / originality | 3/4 | Witness-point route motif is product-specific; restrained incident-desk grammar is intentionally familiar |
| Visual composition / hierarchy | 3/4 | Dominant evidence canvas with attached intake/action rails; mobile becomes a vertical route; data density remains high but readable |
| Brand coherence | 4/4 | OSIALI wordmark, witness mark, palette, typography, favicon, avatar and OG preview align |
| Interaction / motion intentionality | 3/4 | Real fixture selection and JSON export; keyboard support and reduced motion; no fake transfer animation |
| Completeness / accessibility / responsiveness | 3/4 | Zero axe violations, labelled input, live status, visible focus and no overflow; full NVDA/VoiceOver session remains outstanding |
| **Total** | **20/24** | **PASS: each dimension ≥3 and total ≥20** |

## Hard-veto check

No default AI/SaaS template, missing core navigation, incoherent workflow, major clipping, broken critical interaction, meaningless animation or fake evidence presented as real was observed.

**Remaining after Visual QA:** full assistive-technology review and historical secret scan in PRODUCT_HYGIENE; replace the old Docketrail-labelled demo recording; formal trademark/domain/handle clearance remains outstanding. No overall judge-ready claim is made.
