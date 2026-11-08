# PRODUCT — Intent Rescue (original lock preserved)

Original decision: selected **Idea 1 / Intent Rescue** at the NEAR Hackathon human idea gate; PRODUCT_LOCK revision 1, 2026-10-25. The original full approved text is retained in the earlier operator handoff. This is the project-root working copy, **not a new approval or a scope cut**.

## Target user
A swap user, NEAR Intents wallet/dApp integrator, or support operator investigating a delayed, failed, incomplete, or unrefunded 1Click swap.

## Locked promise
Reconstruct a NEAR Intents swap from verifiable/source-attributed evidence, identify the first missing/failed lifecycle leg, distinguish what is observed versus unknown, recommend an evidence-bounded safe action, and export a support-ready incident record. It does **not** execute or guarantee refunds, custody funds, replace the Explorer, or assign unproven root cause.

## Approved journey
1. Enter deposit address, source/NEAR/destination transaction hash, Explorer URL, correlation ID, or official status payload; fallback to manually supplied evidence JSON when gated APIs are unavailable.
2. Normalize evidence as Source deposit → 1Click intake → Intent/solver → Destination delivery OR Refund.
3. Mark stage status and provenance; point to last verified step and first unresolved leg.
4. Give conservative next action (including do-not-retry cases).
5. Export case with identifiers, evidence references, timestamps, missing proof, and escalation summary.

## Original P0 inventory — NOT NEGOTIABLE
- P0-01: Multi-identifier intake, with credential-independent manual payload fallback.
- P0-02: Canonical lifecycle reconstruction.
- P0-03: Deterministic failure/missing-leg classification.
- P0-04: Observed / inferred / unknown evidence confidence labels.
- P0-05: Safe next-action card, including explicit do-not-retry conditions.
- P0-06: Incident evidence bundle export.
- P0-07: Available source, destination, and NEAR Intents explorer links.

P1 only after P0: partner-key ingestion, history, shareable read-only incident URL. P2: notifications, integrator SDK, AI paraphrase. These were **not** promoted to P0.

## Distinctiveness / forbidden drift
Not a generic block explorer, swap interface, wallet, ticket-only form, AI chatbot, or fantasy refund button. The distinguishing journey is evidence boundary → safe decision → support handoff.

## Integrity audit
See PRODUCT-COVERAGE.md. No missing P0 is silently marked complete. The current runtime is a source-attributed snapshot/manual evidence instrument; broad auto-lookup is not yet proven.