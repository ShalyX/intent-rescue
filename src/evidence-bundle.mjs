import { explorerReferences } from './explorer-links.mjs';
export function makeEvidenceBundle(evidence, analysis, options = {}) {
  const assurance = ['CAPTURED_PUBLIC_SNAPSHOT', 'PUBLIC_EXPLORER_SNAPSHOT'].includes(options.assurance) ? options.assurance : 'USER_SUPPLIED_UNVERIFIED';
  const unknown = analysis.lifecycle.filter(s => s.status !== 'VERIFIED').map(s => ({ step:s.label, state:s.status, basis:s.basis }));
  const source = typeof evidence.source_url === 'string' && /^https:\/\//i.test(evidence.source_url) ? evidence.source_url : null;
  const links = explorerReferences(evidence);
  const caution = assurance === 'USER_SUPPLIED_UNVERIFIED'
    ? 'This diagnosis is provisional: supplied evidence is not independently authenticated. Confirm transactions with the original explorer or support.'
    : 'Source-attributed public Explorer snapshot, not independently verified on-chain. Confirm latest destination/refund status before acting.';
  const summary = 'Reported ' + (evidence.reported_status || 'UNKNOWN') + ' for ' + (evidence.source_asset || 'unknown source') + ' to ' + (evidence.destination_asset || 'unknown destination') +
    '. Classification based on available evidence: ' + analysis.classification + '. First unresolved leg: ' + (analysis.first_unresolved_step || 'none') + '.';
  return {
    schema: 'intent-rescue-evidence/v1',
    generated_at: new Date().toISOString(),
    source: { url: source, captured_at: evidence.captured_at || null, assurance, independently_chain_verified: false },
    incident: { id: evidence.id || null, reported_status: evidence.reported_status || null, source_asset: evidence.source_asset || null, destination_asset: evidence.destination_asset || null },
    diagnosis: { classification: analysis.classification, first_unresolved_step: analysis.first_unresolved_step, confidence: assurance === 'USER_SUPPLIED_UNVERIFIED' ? 'UNVERIFIED' : analysis.confidence, verification_status: assurance === 'USER_SUPPLIED_UNVERIFIED' ? 'PROVISIONAL' : 'SNAPSHOT_ONLY', safe_action: assurance === 'USER_SUPPLIED_UNVERIFIED' ? 'Confirm transaction, destination and refund from trusted sources before any retry or financial action.' : analysis.safe_action, evidence_predicates: analysis.evidence_predicates },
    lifecycle: analysis.lifecycle,
    observations: { deposit:evidence.deposit_evidence || [], destination:evidence.destination_evidence || [], refund:evidence.refund_evidence || [] },
    identifiers: {
      origin_tx_hashes:evidence.origin_tx_hashes || [], intent_hashes:evidence.intent_hashes || [],
      near_deposit_tx_hashes:evidence.near_deposit_tx_hashes || [], near_swap_tx_hashes:evidence.near_swap_tx_hashes || [],
      destination_tx_hashes:evidence.destination_tx_hashes || [], refund_tx_hashes:evidence.refund_tx_hashes || []
    },
    source_links: links,
    unresolved_evidence: unknown,
    escalation: { subject:'NEAR Intents incident — '+(evidence.id || 'unidentified'), summary, request:'Please verify destination delivery and any refund against the transaction identifiers provided, and advise on next steps. Do not assume funds were lost or returned from missing evidence alone.', caution },
    limitations: ['Missing evidence is not proof of loss or protocol fault.','Historical third-party data can be snapshot-backed and must be checked for freshness.',caution]
  };
}
