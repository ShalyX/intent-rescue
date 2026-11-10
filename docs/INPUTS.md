# Supported inputs

Use an HTTPS `explorer.near-intents.org/transactions/<record>` URL or record ID for public terminal-page lookup. Captured examples also match their recorded transaction identifiers. Case-sensitive identifiers retain their case; hexadecimal identifiers compare without case.

For pending transfers or unsupported identifiers, submit a matching evidence object using the in-app template. `deposit_address`, `correlation_id`, source/NEAR/destination/refund transaction arrays, chain context and source URL are retained when supplied. A searched identifier must occur in the supplied evidence.

Transaction arrays must contain syntactically valid identifiers. Observations are arrays of nonempty strings. Private keys and credentials do not belong in an incident report. A valid format does not prove that a transaction exists or settled.

Manual evidence is displayed as supplied/reported and exported as provisional. Confirm source records before acting. Public snapshots are source-reported, not independently chain-verified. Active pending pages currently require manual evidence; automatic pending-page reconstruction is not claimed.

Only conditional, supported explorer links are generated. Unknown chain or absent/malformed identifiers do not produce invented links.
