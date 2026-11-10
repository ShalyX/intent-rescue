# Evidence and limitations

Captured public cases:

- F1: LTC → ETH, reported failed; destination and refund unresolved.
- F2: USDC → xDAI, source-reported refund.
- F3: ZEC → ETH, source-reported successful withdrawal.

Each fixture retains its original Explorer URL and capture time. They establish what that source reported at capture time, not current chain state. The wider `evidence/real-world-corpus.json` contains ten public case references; metadata/category coverage is not independent verification of their outcomes.

Run `npm test` for classifications, intake, links and case exports; `npm run red-team` for adversarial scenarios; `npm run evidence:benchmark` for three fixtures repeated 10,000 times. Fresh release outputs are under `evidence/`. These are local reproducibility checks, not adoption or independent chain-verification claims.

Manual input is provisional. Snapshot evidence can be stale. There is no claim of universal historical lookup, automatic refunds, guaranteed recovery, external adoption, loss prevention or support acceptance. The RPC experiment verifies a separate RPC response path, not F1's historical chain finality.

See [release verification](RELEASE.md) for the tested revision and remaining limits.
