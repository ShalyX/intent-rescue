# Intent Rescue

> Canonical working name from the original user-approved product lock. The deployed UI currently displays Docketrail as an unapproved provisional label; do not treat that rename as approved.

**Live demo:** https://intent-rescue.vercel.app
**Public repo:** https://github.com/ShalyX/intent-rescue

**Evidence-first incident response for NEAR Intents.**

[Evidence pack](./EVIDENCE.md) Â· 10 public cases Â· 35/35 local tests Â· 9/9 red-team scenarios Â· 30,000 deterministic repeat classifications

Intent Rescue reconstructs a swap from source-attributed evidence, identifies the first unresolved lifecycle leg, explains what the evidence does and does not prove, recommends a conservative next action, and exports a support-ready incident bundle.

## Why it exists

A cross-chain swap can expose a single terminal label such as `FAILED` while the useful evidence is scattered across the source chain, NEAR Intents execution, destination delivery, and refund path. Intent Rescue turns that evidence into one trace:

`Source deposit â†’ 1Click intake â†’ Intent / solver â†’ Destination delivery or Refund`

Every stage carries both a state and provenance: `OBSERVED`, `INFERRED`, or `UNKNOWN`. Missing evidence is never treated as proof of loss or protocol fault.

## Demo cases

The project ships with three captured public NEAR Intents cases:

- **F1 â€” failed / unresolved:** LTC â†’ ETH, deposit and NEAR intent execution observed, no destination or refund evidence. Result: `FAILED_UNRESOLVED` at destination delivery.
- **F2 â€” refunded:** Base USDC â†’ Gnosis xDAI with an observed refund transaction. Result: `REFUND_VERIFIED`.
- **F3 â€” complete:** ZEC â†’ ETH with the Explorer explicitly reporting a successful withdrawal. Result: `COMPLETE`.

The source Explorer URL is retained in each fixture so a judge can inspect the original public evidence.

**Identifier intake boundary:** Paste any supported public NEAR Intents Explorer transaction URL or record ID to retrieve a **source-attributed public page snapshot**, or load one of the three captured demo cases. This read-only lookup does not use partner JWTs and is **not independently verified on-chain** or real-time refund tracking. Arbitrary deposit addresses, unrelated source-chain hashes and correlation IDs are not generally resolved. If the page cannot be safely reconstructed, the UI clears its diagnosis and offers manually supplied evidence JSON (marked provisional/unverified).

**Support handoff:** Export a real JSON case bundle with step-by-step evidence, unresolved fields, NEAR transaction links, source assurance and an escalation request. [Product coverage and remaining P0 gaps](./PRODUCT-COVERAGE.md).

## Judge quickstart

Use the deployed build; no account or credentials are required:

1. Open https://intent-rescue.vercel.app/?demo=F1 â€” see FAILED_UNRESOLVED, with **Destination delivery** as the first unresolved leg and a conservative recovery action.
2. Open https://intent-rescue.vercel.app/?demo=F2 â€” see REFUND_VERIFIED from concrete refund evidence.
3. Open https://intent-rescue.vercel.app/?demo=F3 â€” see COMPLETE from concrete destination evidence.
4. Paste an uncaptured public Explorer record such as `https://explorer.near-intents.org/transactions/221c8aa1a8ac320aa58174f9ff57d0fbc36316d7dc469f630e05e1b34f9e4d80` and see a source-attributed public page snapshot; unknown IDs produce no diagnosis.
5. Export the actual JSON incident bundle and inspect assurance, evidence gaps, source links and escalation request.
6. Run `npm test` and `npm run red-team` to reproduce the checks.

## NEAR technology used

- **NEAR Intents** is the core product surface: Intent Rescue reconstructs the source deposit, 1Click intake, intent/solver execution, destination delivery, and refund path from source-attributed evidence.
- **NEAR mainnet RPC** was used separately in a technical de-risking spike to observe a real `FINAL` transaction with receipts. The deployed incident lookup reads public NEAR Intents Explorer pages; it does **not** independently verify each historical transaction on-chain.
- Partner JWT APIs and solver-relay access are optional enrichments, not requirements for the judge path.

**Track decision:** OPEN. Original PRODUCT.md revision 1 records primary Unstoppable DeFi and secondary Open Innovation. Current official track descriptions suggest Open Innovation is the stronger fit, but no explicit track change is recorded. See HACKATHON.md.

## Run locally

Requirements: Node.js 18+.

```bash
npm test
npm run red-team
npm start
```

Open `http://127.0.0.1:4173/`.

Useful demo URLs:

```text
http://127.0.0.1:4173/?demo=F1
http://127.0.0.1:4173/?demo=F2
http://127.0.0.1:4173/?demo=F3
```

## Verified explorer links

The case export and on-screen evidence ledger include source-chain, NEAR, destination and refund explorer references **only when both the chain and transaction hash are explicit and supported**. Unknown chains, absent transaction hashes and missing refund/destination evidence intentionally produce no link. The official NEAR Intents Explorer case is preserved. This is navigation to external records, not independent verification of their current status.

## Safety contract

Intent Rescue does **not** custody funds, trigger refunds, or claim a protocol root cause without evidence. Terminal success/refund classifications require concrete transaction evidence or a direct captured observation; caller-supplied `*_verified` flags alone are not enough.

## Architecture

- `src/classifier.mjs` â€” deterministic incident classification and safe-action rules.
- `src/intake.mjs` â€” captured-identifier matching, strict unsupported-ID behavior, manual JSON evidence validation.
- `src/public-explorer.mjs` and `api/incident.js` â€” conservative parsing and fixed-host, read-only public Explorer snapshot lookup; no partner JWT or automatic refunds.
- `src/lifecycle.mjs` â€” five-stage reconstruction with provenance labels.
- `src/evidence-bundle.mjs` â€” portable support-ready incident export.
- `fixtures/` â€” frozen public evidence cases.
- `public/` â€” judge-facing incident console.
- `scripts/red-team.mjs` â€” adversarial runtime checks.
- `scripts/verify-near-rpc.mjs` â€” NEAR RPC verification spike.
- `test/` â€” Node test suite.

## Reliability choices

Partner JWT APIs and solver-relay access are optional enrichments, not demo-critical dependencies. The hosted product can read a public Explorer page snapshot or work from manually supplied source-attributed evidence. Historical incident proof is snapshot-backed because free public NEAR RPC providers are not guaranteed archival; a current mainnet `tx` RPC call was separately verified during technical de-risking.

## Hackathon

Built during the NEAR Hackathon build window beginning **November 1, 2026 00:00 UTC**.
