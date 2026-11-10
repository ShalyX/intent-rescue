# Architecture

The browser loads captured public cases or requests a fixed-host public Explorer snapshot through `api/incident.js`. Unsupported or unavailable pages offer manual evidence input.

- `src/intake.mjs`: identifier matching, aliases and evidence-envelope validation.
- `src/public-explorer.mjs`: conservative extraction from supported terminal Explorer pages.
- `src/classifier.mjs` and `src/lifecycle.mjs`: diagnosis and five-stage evidence reconstruction.
- `src/evidence-bundle.mjs`: portable case, source assurance, identifiers and escalation context.
- `public/`: incident desk and locally bundled fonts/assets.
- `server.mjs`: local HTTP server; `scripts/build-static.mjs`: static packaging.

The API accepts GET only, restricts lookup to the official Explorer host, rejects redirects and applies a timeout/document-size bound. No wallet connection, partner JWT, private key or write transaction is required. Source text is rendered as text or escaped HTML.

Public HTML is an external dependency and can change or lag. Parser failure produces no invented diagnosis. Manual evidence is not authenticated; schema validity is not chain verification. The separate RPC spike under scripts/ is research tooling, not part of runtime incident verification.

See [product purpose](PRODUCT.md), [inputs](INPUTS.md) and [evidence limits](EVIDENCE.md).
