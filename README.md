# Intent Rescue

**Evidence-first incident response for NEAR Intents.**

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
