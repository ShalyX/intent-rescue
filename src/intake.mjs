export const validTransactionHash = value => typeof value === 'string' && /^(?:0x[0-9a-fA-F]{64}|[0-9a-fA-F]{64}|[1-9A-HJ-NP-Za-km-z]{32,90})$/.test(value);
const canonicalIdentifier = value => /^(?:0x)?[0-9a-fA-F]+$/.test(value) ? value.toLowerCase() : value;
// A credential-free resolver for local, source-attributed captures only.
// It must never turn an unknown identifier into a "verified" swap.
const FIELDS = ['origin_tx_hashes','intent_hashes','near_deposit_tx_hashes','near_swap_tx_hashes','destination_tx_hashes','refund_tx_hashes','deposit_address','depositAddress','correlation_id','correlationId','recipient','sender','searched_reference'];
export function extractIdentifier(input) {
  const trimmed = String(input ?? '').trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'https:' || u.hostname !== 'explorer.near-intents.org') return null;
    const match = u.pathname.match(/^\/transactions\/([^/]+)\/?$/);
    return match ? canonicalIdentifier(decodeURIComponent(match[1])) : null;
  } catch { return canonicalIdentifier(trimmed); }
}
export function findCapturedCase(input, captures) {
  const needle = extractIdentifier(input);
  if (!needle) return { kind: 'invalid', reason: 'Use a NEAR Intents Explorer transaction link or a transaction / intent hash.' };
  const matches = captures.filter(e => {
    const identifiers = [e.id, e.source_url, ...FIELDS.flatMap(k => Array.isArray(e[k]) ? e[k] : typeof e[k] === 'string' ? [e[k]] : [])];
    return identifiers.some(v => extractIdentifier(v) === needle);
  });
  if (matches.length === 1) return { kind:'captured', evidence:matches[0] };
  if (matches.length > 1) return { kind:'ambiguous', reason:'Multiple captured cases share that identifier. Do not guess.' };
  return { kind:'uncaptured', identifier:String(input).trim(), reason:'No captured evidence for this identifier. Paste a source-attributed evidence JSON envelope to continue.' };
}
export function parseEvidenceEnvelope(input) {
  let value;
  try { value = JSON.parse(input); } catch { throw new Error('Paste a valid JSON evidence object.'); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Evidence must be a JSON object.');
  const data = value.transaction && typeof value.transaction === 'object' && !Array.isArray(value.transaction) ? value.transaction : value;
  const normalized = {...data};
  const validStatuses = ['FAILED','SUCCESS','COMPLETED','REFUNDED','PROCESSING','PENDING','PENDING_DEPOSIT','INCOMPLETE_DEPOSIT'];
  const status = String(data.reported_status || data.status || '').toUpperCase();
  if (!data.reported_status && validStatuses.includes(status)) normalized.reported_status = status;
  const aliases = { deposit_address:'depositAddress', correlation_id:'correlationId', source_url:'sourceUrl',
    origin_tx_hashes:'originTxHashes', destination_tx_hashes:'destinationTxHashes',
    refund_tx_hashes:'refundTxHashes', intent_hashes:'intentHashes' };
  for (const [key,alias] of Object.entries(aliases)) if (normalized[key] == null && data[alias]!=null) normalized[key]=data[alias];
  const recognizable = ['reported_status','source_url','origin_tx_hashes','intent_hashes','deposit_evidence','destination_evidence','refund_evidence','deposit_address','correlation_id','destination_tx_hashes','searched_reference'];
  if (!recognizable.some(key => Object.hasOwn(normalized,key))) throw new Error('This is not an incident evidence envelope. Include a status, transaction evidence, address, correlation ID, or source URL.');
  for (const [key, value] of Object.entries(normalized)) {
    if (key.endsWith('_tx_hashes') || key === 'intent_hashes') {
      if (!Array.isArray(value) || !value.every(validTransactionHash)) throw new Error(key + ' must be an array of valid transaction identifiers.');
    }
    if (['deposit_evidence','destination_evidence','refund_evidence'].includes(key)) {
      if (!Array.isArray(value) || !value.every(item => typeof item === 'string' && item.trim().length > 0 && item.length <= 4000)) throw new Error(key + ' must be an array of nonempty observation strings.');
    }
    if (['id','reported_status','deposit_address','correlation_id','source_url','source_chain','destination_chain','refund_chain','source_asset','destination_asset','captured_at','sender','recipient'].includes(key) && value != null && (typeof value !== 'string' || value.length > 4000)) throw new Error(key + ' must be text.');
    if (key.endsWith('_verified') && typeof value !== 'boolean') throw new Error(key + ' must be boolean.');
  }
  if (status) normalized.reported_status = status;
  return normalized;
}
