# OSIALI — NEAR Hackathon pitch

**Status:** PITCH PASS — 2026-11-10  
**Primary track:** Unstoppable DeFi  
**Secondary track:** Open Innovation  
**Product lock:** Original Idea 1 / Intent Rescue; customer-facing brand OSIALI  
**Live product:** https://intent-rescue.vercel.app/  
**Public repository:** https://github.com/ShalyX/intent-rescue  
**Final demo:** `C:\Users\USER\Videos\OSIALI-Demo\osiali-demo-final.mp4` (84.8 seconds; DEMO_QA passed)

## One-line description

**OSIALI turns a stalled NEAR Intents swap into an evidence-bounded incident: it reconstructs the route, marks the first unresolved leg, recommends a safe next step, and exports a support-ready case.**

## 30-second pitch

A cross-chain swap can show `FAILED` without telling anyone where the evidence stopped. OSIALI is an incident-response desk for NEAR Intents swaps. It rebuilds the five-stage lifecycle from supported public Explorer records or matching source-attributed evidence, labels what is observed and what remains unknown, and highlights the first unresolved leg. It then recommends a conservative next action and exports a real JSON support case. In our F1 case, the source deposit, 1Click intake and NEAR intent execution are observed; destination delivery and refund are not. OSIALI makes the evidence usable without pretending it can recover funds.

## Extended spoken pitch

When a cross-chain swap stalls, a terminal status does not answer the question users and support teams actually have: what happened, and what is safe to do next?

OSIALI reconstructs a NEAR Intents swap across source deposit, 1Click intake, intent/solver execution, destination delivery and refund. Every stage is labelled OBSERVED, INFERRED or UNKNOWN. The product identifies the first unresolved leg, explains the evidence boundary, and recommends a conservative action — including when not to retry.

Then it exports a support-ready JSON bundle with identifiers, evidence links, missing proof and an escalation summary. The demo shows a real public Explorer snapshot, not a claim of independent chain verification. F1 remains unresolved, F2 shows a verified refund, and F3 shows a completed transfer.

OSIALI does not custody funds or issue refunds. It gives the next person an evidence-backed incident they can investigate and resolve responsibly.

## Track positioning

The official NEAR Hackathon FAQ says: “Select every track your project fits in the submission form.” It also states one submission per project. The event site does not specify a ranked primary/secondary field; the order below is the project's internal framing. If the form offers both categories, select both in the same submission.

### Primary — Unstoppable DeFi

Position OSIALI as an operational reliability and incident-response layer around NEAR Intents-powered cross-chain swap settlement. When a swap route has incomplete or failed evidence, OSIALI helps users, integrators and support operators distinguish execution progress from destination delivery or refund, avoid blind retries, and produce a structured support handoff.

**Fit boundary:** OSIALI is not itself an exchange, perpetuals product, lending market, vault, or trading agent. The Unstoppable DeFi fit is adjacent to the track's core build examples, not a claim that OSIALI implements those primitives. Judges may apply a track-fit deduction.

### Secondary — Open Innovation

Position OSIALI as a new incident-response workflow for cross-chain intent execution: provenance-aware lifecycle reconstruction, explicit evidence boundaries, conservative next-action guidance, and a portable support case. This is the broader category fit for the product's cross-cutting workflow.

## Claim-to-evidence map

| Pitch claim | Evidence source | Safe wording / boundary |
|---|---|---|
| OSIALI reconstructs the five-stage swap lifecycle | `PRODUCT.md`, `PRODUCT-COVERAGE.md`, `src/lifecycle.mjs`, final demo | Source deposit → 1Click intake → intent/solver → destination delivery or refund |
| It identifies the first unresolved leg | `PRODUCT-COVERAGE.md` P0-02/P0-03; F1 fixture and demo | In F1, destination delivery is the first unresolved leg; do not infer root cause or loss |
| It distinguishes observed, inferred and unknown evidence | P0-04 coverage; F1 public snapshot and exported `source.assurance` | A public HTML snapshot is not independent chain-finality proof |
| It recommends a conservative action | P0-05; classifier and red-team tests; F1 UI/demo | Preserve evidence and verify destination delivery or refund before creating a fresh quote; no automatic retry |
| It creates a real support handoff | P0-06; downloaded `osiali-F1.json`; final demo | Export contains identifiers, evidence references, missing proof and escalation context; it is not a signed attestation |
| F2 is refunded and F3 is complete | Captured public fixtures, `EVIDENCE.md`, final demo | These are the captured case outcomes; do not generalize to universal tracking |
| Core checks are reproducible | `EVIDENCE.md`, `HYGIENE.md`, `PRODUCT-COVERAGE.md` | 37/37 local tests, 9/9 red-team scenarios, 30,000 deterministic classifications; benchmark is machine-local, not user-facing latency |
| Public Explorer lookup works without partner JWT | `EVIDENCE.md` C13/C14/C15; final demo | Read-only, fixed-host public page snapshot; 10/10 matched Explorer-reported categories in one corpus pass, not independent on-chain verification |

## Explicit non-claims

- No custody, automatic refund, automatic funds recovery, or guarantee of recovery.
- No independent archival-RPC verification of F1's historical transaction.
- No universal private-history lookup for arbitrary deposit addresses, unrelated source-chain hashes or correlation IDs.
- Matching user-supplied evidence JSON remains provisional/unverified.
- No external adoption, user count, customer testimonial, or operating-partner claim.
- No claim that OSIALI is an exchange, perps market, lending protocol, vault, or trading agent.

## Demo alignment

The final 84.8-second OSIALI recording shows, in order:
1. F1 public Explorer identifier intake and snapshot limitation.
2. Observed source deposit, 1Click intake and NEAR intent execution; destination/refund unknown.
3. The conservative recovery recommendation.
4. The actual downloaded `osiali-F1.json` export.
5. F2 refund-verified and F3 transfer-complete contrast.
6. OSIALI branded end card.

The narration, product, README, evidence pack and submission description must retain the same claim boundaries.

## Judge-facing opening line

**“A FAILED label is not an incident explanation. OSIALI shows where the evidence stops — and what is safe to do next.”**

## Remaining presentation work

- Four-lens JUDGE_SIMULATION passed on 2026-11-10. A later P0 terminal-evidence consistency defect was fixed, covered by regression tests and verified against the live production modules.
- Feature freeze remains active; no feature additions or demo redesigns.
- The human publishes the final video on X, saying it was built at NEAR HACKATHON, tagging @NEARProtocol and including #NEARHackathon.
- Complete one official form submission with the public repository and X demo-post links; select both defi and open. The full field contract and remaining human-owned values are in SUBMISSION.md.
