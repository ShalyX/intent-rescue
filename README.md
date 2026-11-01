# Intent Rescue

**Live demo:** https://intent-rescue.vercel.app
**Public repo:** https://github.com/ShalyX/intent-rescue

**Evidence-first incident response for NEAR Intents.**

[Evidence pack](./EVIDENCE.md) · 10 public cases · 17/17 tests · 9/9 red-team scenarios · 30,000 deterministic repeat classifications

Intent Rescue reconstructs a swap from source-attributed evidence, identifies the first unresolved lifecycle leg, explains what the evidence does and does not prove, recommends a conservative next action, and exports a support-ready incident bundle.

## Why it exists

A cross-chain swap can expose a single terminal label such as `FAILED` while the useful evidence is scattered across the source chain, NEAR Intents execution, destination delivery, and refund path. Intent Rescue turns that evidence into one trace:

`Source deposit → 1Click intake → Intent / solver → Destination delivery or Refund`

Every stage carries both a state and provenance: `OBSERVED`, `INFERRED`, or `UNKNOWN`. Missing evidence is never treated as proof of loss or protocol fault.

## Demo cases

The project ships with three captured public NEAR Intents cases:

- **F1 — failed / unresolved:** LTC → ETH, deposit and NEAR intent execution observed, no destination or refund evidence. Result: `FAILED_UNRESOLVED` at destination delivery.
- **F2 — refunded:** Base USDC → Gnosis xDAI with an observed refund transaction. Result: `REFUND_VERIFIED`.
- **F3 — complete:** ZEC → ETH with the Explorer explicitly reporting a successful withdrawal. Result: `COMPLETE`.

The source Explorer URL is retained in each fixture so a judge can inspect the original public evidence.

## Judge quickstart

Use the deployed build; no account or credentials are required:

1. Open https://intent-rescue.vercel.app/?demo=F1 — see FAILED_UNRESOLVED, with **Destination delivery** as the first unresolved leg and a conservative recovery action.
2. Open https://intent-rescue.vercel.app/?demo=F2 — see REFUND_VERIFIED from concrete refund evidence.
3. Open https://intent-rescue.vercel.app/?demo=F3 — see COMPLETE from concrete destination evidence.
4. Run 
pm test and 
pm run red-team to reproduce classifier and adversarial checks.

## NEAR technology used

- **NEAR Intents** is the core product surface: Intent Rescue reconstructs the source deposit, 1Click intake, intent/solver execution, destination delivery, and refund path from source-attributed evidence.
- **NEAR mainnet RPC** is used as an independent chain-verification primitive. During technical de-risking, a fresh mainnet transaction was verified through a public RPC at final execution status; historical hero evidence remains snapshot-backed because free public providers are not guaranteed archival.
- Partner JWT APIs and solver-relay access are optional enrichments, not requirements for the judge path.

**Submission track:** Open Innovation.

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

## Safety contract

Intent Rescue does **not** custody funds, trigger refunds, or claim a protocol root cause without evidence. Terminal success/refund classifications require concrete transaction evidence or a direct captured observation; caller-supplied `*_verified` flags alone are not enough.

## Architecture

- `src/classifier.mjs` — deterministic incident classification and safe-action rules.
- `src/lifecycle.mjs` — five-stage reconstruction with provenance labels.
- `src/evidence-bundle.mjs` — portable support-ready incident export.
- `fixtures/` — frozen public evidence cases.
- `public/` — judge-facing incident console.
- `scripts/red-team.mjs` — adversarial runtime checks.
- `scripts/verify-near-rpc.mjs` — NEAR RPC verification spike.
- `test/` — Node test suite.

## Reliability choices

Partner JWT APIs and solver-relay access are optional enrichments, not demo-critical dependencies. The core path can run from a source-attributed evidence envelope. Historical incident proof is snapshot-backed because free public NEAR RPC providers are not guaranteed archival; a current mainnet `tx` RPC call was separately verified during technical de-risking.

## Hackathon

Built during the NEAR Hackathon build window beginning **November 1, 2026 00:00 UTC**.
