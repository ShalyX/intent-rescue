# Consumer lookup and guided case creation — 10 November 2026

Purpose unchanged: reconstruct a NEAR Intents swap, identify unresolved evidence, recommend a conservative next step and export a support case.

Changes: read-only 1Click deposit-address status with response/address binding and optional memo; recognized active Explorer stages; fresh lookup before historical fallback; guided reference/status/optional transaction/network/notes form; exported source timestamp, notes, reference and memo. Default entry is empty rather than a preloaded historical incident. No wallet connection or spending is required.

Real-data verification: ten public historical swap records fetched again over HTTP 200, covering failed, refunded and delivered outcomes. Their classifications matched the historical corpus. A real Base deposit address returned current 1Click REFUNDED status with a provider correlation ID and original state-update time; verified through the browser and exported as OFFICIAL_STATUS_SNAPSHOT, not independently chain verified. Python's initial HTTP 403 was not representative of the server Node path. See evidence/consumer-real-swaps.json.

Contract tests cover waiting/processing/terminal provider statuses and mismatched addresses. They are not evidence of a newly created live pending swap. No swap, transfer or paid API call was initiated. No independent normal-user study or faster support resolution is claimed.

Boundaries: arbitrary source-chain hashes and private correlation IDs cannot always be resolved automatically. The receipt's deposit address or Explorer URL is preferable. Memo-dependent routes without a matching memo response are rejected. Provider failures remain recoverable through the guided form. Manual receipt details are supplied claims, not verification.

Integrated with the landing page: the incident desk and guided form are at /app/. The public root remains the landing page. The existing demo predates the guided form and should be updated after the landing/app route is final.

Validation: 43 automated tests, nine red-team checks and build passed. Browser checks passed for a real 1Click address, an uncaptured public record, guided actual JSON download, empty default, a simulated provider outage and 390px no-overflow. No normal-user study is claimed.
