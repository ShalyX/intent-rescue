export function makeEvidenceBundle(evidence, analysis) {
  return {
    schema: 'intent-rescue-evidence/v1',
    generated_at: new Date().toISOString(),
    source: { url: evidence.source_url || null, captured_at: evidence.captured_at || null },
    incident: { id: evidence.id || null, reported_status: evidence.reported_status || null, source_asset: evidence.source_asset || null, destination_asset: evidence.destination_asset || null },
    diagnosis: { classification: analysis.classification, first_unresolved_step: analysis.first_unresolved_step, confidence: analysis.confidence, safe_action: analysis.safe_action },
    lifecycle: analysis.lifecycle,
    observations: {
      deposit: evidence.deposit_evidence || [],
      destination: evidence.destination_evidence || [],
      refund: evidence.refund_evidence || []
    },
    identifiers: {
      origin_tx_hashes: evidence.origin_tx_hashes || [],
      intent_hashes: evidence.intent_hashes || [],
      near_deposit_tx_hashes: evidence.near_deposit_tx_hashes || [],
      near_swap_tx_hashes: evidence.near_swap_tx_hashes || [],
      destination_tx_hashes: evidence.destination_tx_hashes || [],
      refund_tx_hashes: evidence.refund_tx_hashes || []
    },
    limitations: ['Missing evidence is not proof of loss or protocol fault.','Historical third-party fixture data may be snapshot-backed when public RPC providers are non-archival.']
  };
}
