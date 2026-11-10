# SCORECARD - current evidence and judge simulation history

## 2026-11-10 ? post-simulation terminal-evidence QA correction (not a re-score)

- A P0 reliability inconsistency was found after the four-lens review: terminal verified booleans could mark Refund or Destination delivery VERIFIED in the lifecycle despite the classifier correctly rejecting missing terminal evidence.
- Both outputs now share the exact same evidence predicates; JSON export is covered by regression tests. Unsupported flags leave the relevant terminal stage NOT_OBSERVED / UNKNOWN. Concrete transaction/evidence records continue to produce VERIFIED / OBSERVED.
- Latest local verification: 37/37 automated tests, 9/9 red-team scenarios, static build PASS. The pre-existing four-lens scores and track-fit assessment are unchanged; this is a reliability correction, not a product feature or a new score.
- The earlier 35/35 test references below describe the inspected pre-fix revision. The new local result supersedes them for current source; production deployment verification remains pending.


## 2026-11-10 - final demo evidence update (not a re-score)

- The current OSIALI demo has been produced and passed DEMO_QA.
- 84.8 seconds, 1600x900, H.264 at 25 fps, AAC stereo 48 kHz, -18 LUFS.
- Visible proof: F1 identifier lookup and snapshot-only boundary; source deposit / 1Click / NEAR intent observations; safe no-duplicate-retry recommendation; actual downloaded `osiali-F1.json`; F2 refund-verified and F3 complete contrast; current OSIALI end card.
- Final 16 pt captions are split into short cues to preserve visibility of the JSON evidence. Full decode and audio checks passed.
- Track selection is user-confirmed: Unstoppable DeFi primary, Open Innovation secondary; official FAQ permits selecting every fitting track in one submission. Track-fit risk: Unstoppable DeFi is adjacent because OSIALI is swap-settlement incident-response tooling, not a trading venue, lending market, vault or trading agent. Open Innovation is the broader fit. The previous November 9 numeric estimates are historical; the fresh four-lens review below supersedes them.

## 2026-11-10 — fresh four-lens Judge Simulation (Hackathon Operator v0.5.0)

**Scope actually inspected:** current production OSIALI page and public assets; F1/F2/F3 demo routes; one live read-only public Explorer API result; final 84.8-second OSIALI recording and its DEMO_QA record; README, PITCH.md, PRODUCT.md, PRODUCT-COVERAGE.md, EVIDENCE.md, HYGIENE.md and current source tests/build.

**Scoring note:** official 2026 weights are UNKNOWN. Scores below are internal judge-simulation estimates, not official weights, results or predictions.

| Lens | Internal estimate | Confidence | What lands | Doubt / deduction |
|---|---:|---|---|---|
| Product judge | 8/10 | Medium-high | Specific incident job; five-stage reconstruction; first unresolved leg; explicit OBSERVED / INFERRED / UNKNOWN boundary; conservative action; real JSON support handoff; F1/F2/F3 contrast | No external operator adoption or customer interview evidence; supported public snapshots and matching manual evidence are bounded, not universal private-history lookup |
| Technical judge | 8/10 | High | 35/35 tests, 9/9 red-team, static build PASS on commit 65dd208; live production endpoint HTTP 200; fixed-host read-only Explorer snapshot; strict evidence rules and real export | Public HTML snapshot is not independent chain-finality proof; no archival verification for historical F1; partner-authenticated private history is not implemented |
| Sponsor judge | 7/10 | Medium | NEAR Intents is the actual incident surface, not a decorative logo; route reconstruction and explorer references depend on NEAR Intents lifecycle evidence | OSIALI is read-only incident-response tooling, not a new swap venue or settlement primitive; Unstoppable DeFi's examples focus on exchanges, perps, lending, vaults and trading agents |
| 30-second judge | 7.5/10 | Medium | The opening frames the problem, identifies OSIALI, then shows the public record and where evidence stops; the export and three outcomes provide a memorable payoff | “1Click” and “intent/solver” may be unfamiliar to a generalist; the Unstoppable DeFi track fit may confuse judges if not described honestly |

### 30-second cold read

- **What I think the product is:** an evidence-first incident-response desk for NEAR Intents cross-chain swaps.
- **What I think is special:** it shows the first unresolved lifecycle leg and distinguishes missing evidence from verified refund or delivery, then produces a real support case.
- **What I do not believe yet:** that it independently verifies every historical chain leg, searches all private partner history, automatically recovers funds, or has proven adoption.
- **What confused me:** why an incident-response product is primarily in Unstoppable DeFi when the official track examples name trading and liquidity products; the meaning of 1Click/solver terminology without NEAR context.
- **What I would remember tomorrow:** “A FAILED label is not an incident explanation — OSIALI shows where the evidence stops.”

### Track-fit assessment (internal, not official)

- **Unstoppable DeFi — 5.5/10 fit:** defensible as operational reliability and incident-response tooling around NEAR Intents-powered DeFi swap settlement, but adjacent to the track's stated exchange/perps/lending/vault/trading-agent build examples. A track-specific deduction is plausible.
- **Open Innovation — 8/10 fit:** the stronger category fit for a cross-cutting evidence/provenance/safe-action/support-handoff workflow.
- User selection remains binding: Unstoppable DeFi primary; Open Innovation secondary. Do not silently switch or claim OSIALI implements a DEX, perps, lending, vault or trading agent.

### Prior-criteria proxy (weights UNKNOWN; internal estimates only)

| Prior-criteria area | Internal estimate | Evidence / main deduction |
|---|---:|---|
| Technical implementation | 8/10 | 35/35 tests, 9/9 red-team, build, live read-only endpoint; deduction for snapshot rather than independent historical chain proof |
| Design | 8/10 | Visual QA 20/24, zero axe violations, responsive desktop/mobile, current OSIALI identity and demo |
| Impact | 6/10 | Real NEAR incident problem evidence and public case corpus; no external adoption, operator interview or usage metric |
| Originality | 7.5/10 | Distinctive combination of evidence boundary, conservative action and support export; avoid claiming no competitors |
| Sustainability | 5.5/10 | Clear potential integrator/support use; no validated operating partner, business model or usage proof |

### Judge verdict

**Credible and coherent product; not yet submission-ready.** No new P0/P1 product defect was found in this review. The strongest strengths are the bounded evidence model, real support export and reliable deterministic behavior. The biggest weaknesses are the adjacent Unstoppable DeFi category fit, lack of external adoption validation, and the explicitly limited public-snapshot evidence source.

### Ranked improvements

1. **Preserve truthful track framing** in README, pitch and submission: Unstoppable DeFi primary as user-selected operational reliability tooling; Open Innovation secondary as the broader fit. This is already recorded; no product rewrite is authorized.
2. **Complete the mandatory public demo post** with the final OSIALI video, a clear “built at NEAR HACKATHON” statement, @NEARProtocol and #NEARHackathon.
3. **Complete one official project submission** with repository and public X post links; select both track options if shown. The official FAQ permits selecting every track the project fits; it remains one submission per project.
4. **Optional, non-blocking:** seek one short external NEAR Intents integrator/support-operator review if available before submission. Do not invent feedback or delay mandatory submission steps.
5. **No new features recommended.** Keep the seven locked P0s unchanged; only reliability, evidence, hygiene, demo, pitch, links and submission fixes remain.




Official 2026 scoring weights: UNKNOWN. Internal estimates, not official scores.

| Lens | Estimate | Visible proof | Deduction |
|---|---:|---|---|
| Product judge | 8/10 | Public Explorer record â†’ five-leg route â†’ first unresolved boundary â†’ conservative action â†’ support export; failed/refunded/complete contrasts | Private history requires user-supplied evidence; state this in first 30 seconds. |
| Technical judge | 8/10 | 35/35 tests, 9/9 red-team, fixed-host public HTML reader, strict identifier matching, chain-specific links, local reproducibility | HTML snapshots are not signed chain-finality proof. |
| Sponsor judge | 7/10 | NEAR Intents is the actual incident surface; NEAR Explorer records and NEAR tx refs integral to route reconstruction | No authenticated partner API; explain credential-independent public evidence path. |
| 30-second judge | 8/10 | Interrupted five-leg rail, unresolved boundary, failed/refund/success contrast, OSIALI user-approved and deployed across UI/mark/favicon/avatar/OG; Visual QA and fresh demo remain open | No narration; chapter overlays carry story. |

## Criterion estimate (weights UNKNOWN)
- Technical implementation 8/10: endpoint, tests, red-team, local reproduction. Deduction: public HTML/manual data not independently authenticated chain history.
- Design 8/10: custom forensic route canvas and mobile no-overflow. Deduction: screen-reader/contrast audit not exhaustive.
- Impact 7/10: concrete incident support problem and 10 public cases. Deduction: no external support operator interview or adoption metric.
- Originality 8/10: provenance boundary + conservative action + support handoff. Deduction: explain insight quickly.
- Sustainability 6/10: useful to wallets/integrators/support; low-auth public intake. Deduction: no operating partner, usage or business validation.

## 30-second cold read
what_i_think_the_product_is: A NEAR Intents incident desk turning swap records into a route diagnosis and support-ready case.
what_i_think_is_special: It shows where evidence ends instead of guessing why funds are missing or telling users to retry.
what_i_do_not_believe_yet: That it retrieves every private/historical swap or independently proves every chain leg.
what_confused_me: Public Explorer snapshot vs on-chain verified state.
what_i_would_remember_tomorrow: The broken rail at the first unresolved leg and â€œEvidence, not guesswork.â€

## Recommendation
This is a provisional judge simulation, not a final judge-ready verdict. The OSIALI identity is now approved and aligned in production; Visual QA passed at 20/24; Product Hygiene and fresh demo gates remain open, and track assignment conflicts with the original product lock. Rerun the four lenses against the final artifact. Do not publish the legacy Docketrail-labelled recording.


## Naming correction
OSIALI was explicitly approved by the user on 2026-11-09. The current UI, mark, favicon, avatar and OG preview are deployed and browser-verified. Docketrail remains only in old demo recordings and must not be used in the public pitch or submission. The original product thesis remains Idea 1 / Intent Rescue.
