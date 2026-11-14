# Architecture

The browser loads the captured F1/F2/F3 cases or requests a source-backed lookup through the read-only `GET /api/incident` route.

## Lookup and evidence path

- `src/status-api.mjs`: reads the official NEAR Intents 1Click deposit-address status endpoint, validates the requested address and memo, and preserves provider-reported status, quote context, amounts, fees and transaction references.
- `src/explorer-api.mjs`: queries the documented NEAR Intents Explorer API with an exact transaction-identifier match. The Partner JWT is read only by the server from `NEAR_INTENTS_EXPLORER_JWT`.
- `src/public-explorer.mjs`: conservative, source-attributed HTML fallback when the authenticated Explorer API returns no exact match. It accepts only uniquely identifiable visible status evidence and restores streamed page content only when its matching reveal marker is present.
- `src/intake.mjs`: identifier matching, aliases, transaction-hash validation and evidence-envelope validation.
- `src/classifier.mjs` and `src/lifecycle.mjs`: deterministic diagnosis and five-stage evidence reconstruction.
- `src/evidence-bundle.mjs`: portable case, source assurance, identifiers, provenance and escalation context.
- `api/incident.js`: fixed-host, GET-only lookup orchestration and fail-closed error handling.
- `public/`: marketing homepage, landing assets, incident-desk styles/assets and locally bundled fonts.
- `app/index.html`: incident desk served at `/app/`; its investigation workflow and evidence semantics are preserved.
- `server.mjs`: local HTTP server; `scripts/build-static.mjs`: static packaging.

For a supported deposit address, OSIALI checks 1Click first. A provider response is preserved as a provider snapshot. A bare Base58 identifier can proceed to Explorer only after a definitive 1Click 404 and only when no memo was supplied. Provider outages, malformed or mismatched responses, and memo failures stop rather than being reinterpreted as another identifier type.

For an explicit Explorer transaction URL, OSIALI uses the authenticated Explorer API. If that API returns no exact match, the public Explorer page parser may provide a separate source-attributed snapshot. API errors do not trigger the HTML fallback. Unsupported hosts, redirects, writes, ambiguous matches and unsafe responses fail closed.

## Security and evidence boundaries

The API accepts GET only, restricts lookup to the official Explorer host, rejects redirects and applies request timeouts and response-size bounds. Keep `NEAR_INTENTS_EXPLORER_JWT` server-side in Vercel Project Settings. Never use a `NEXT_PUBLIC_` name or commit the token. The public repository includes only a blank `.env.example`; `.env` and other local environment files are ignored.

No wallet connection, private key, write transaction or custody permission is required. Source responses and captured snapshots are not independent chain verification. Manual reports remain provisional; schema validity does not establish settlement. Missing evidence does not prove loss, protocol fault, refund or destination delivery.

See [product purpose](PRODUCT.md), [inputs](INPUTS.md) and [evidence limits](EVIDENCE.md).
