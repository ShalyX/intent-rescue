# IDEATION — HUMAN IDEA GATE CANDIDATES

Scores are internal planning proxies (1–10 per factor), not official hackathon scores.

Factors: severity, evidence, rubric fit, NEAR fit, differentiation, demo strength, feasibility, evidence potential, time-to-magic.

## 1. Intent Rescue — NEAR Intents failure observability + recovery layer
A watchdog for cross-chain payments that turns opaque intent states into a clear lifecycle, detects stalls/failures, explains the likely failure domain, packages evidence, and proposes a safe next action or reroute when possible.

Magic moment: paste/open an intent → see exactly where it failed → get a verified recovery/reroute action instead of “FAILED”.

Tracks: Unstoppable DeFi + Open Innovation.
Planning score: 80/90.
Strength: unusually current, NEAR-specific real pain; high originality and judge relevance.
Risk: must frame recovery honestly; cannot promise refunds it does not control.

## 2. Agent Firewall — portable policy engine for AI-controlled money
A NEAR-native policy layer that any AI agent can transact through. Humans define spend, contract, asset, chain, frequency, and expiry limits. Transactions outside policy are blocked or escalated; every decision produces an auditable receipt.

Magic moment: same agent attempts two payments → one executes → one is cryptographically/policy blocked.

Tracks: AI Security & Defense + Agent Economy.
Planning score: 81/90 before originality penalty; 76/90 after competitive pressure.
Strength: perfect track fit, simplest reliable demo, high feasibility.
Risk: MetaMask/Binance already ship similar controls; differentiation must be cross-agent / NEAR-native / portable rather than “another wallet.”

## 3. Borderless AP — autonomous accounts-payable for cross-border suppliers
Upload/forward an invoice, approve company policy once, and an agent selects an allowed stablecoin route, pays the supplier in the requested asset, and returns settlement proof and an accounting-ready record.

Magic moment: invoice → policy check → cross-chain settlement → proof/receipt.

Tracks: Real-World Money + Autonomous Business.
Planning score: 76/90.
Strength: very large credible market and obvious real-world story.
Risk: external payment/off-ramp/compliance dependencies can kill the demo; scope must keep the critical path on testable rails.

## 4. Human-Backed Agent Credential — privacy-preserving agent identity and quotas
A credential proving an AI agent is delegated by a unique verified human without revealing that human, enabling per-human rate limits/reputation and reducing sybil abuse.

Magic moment: two agents present credentials → legitimate delegated agent passes quota/reputation check → unbacked/sybil agent fails.

Tracks: AI Security & Defense + Open Innovation.
Planning score: 66/90.
Strength: highest originality and aligned with a brand-new NEAR ecosystem RFC.
Risk: ZK/attestation scope is too technically aggressive unless sharply reduced.

## Operator recommendation
Pick **1 — Intent Rescue**.

Why: it has the strongest combination of fresh real pain, NEAR-native necessity, originality, judge-facing demo clarity, and evidence potential. It avoids directly cloning the agent-wallet controls that major incumbents already launched this year.