import { readStatus } from '../src/status-api.mjs';
import { parsePublicExplorer } from '../src/public-explorer.mjs';

// Fixed-host, read-only public snapshot lookup. Not the authenticated Explorer API.
function publicReference(value) {
  if (typeof value !== 'string' || value.length > 350) return null;
  let token = value.trim();
  if (/^https?:\/\//i.test(token)) {
    const url = new URL(token);
    if (url.protocol !== 'https:' || url.hostname !== 'explorer.near-intents.org') return null;
    const match = url.pathname.match(/^\/transactions\/([A-Za-z0-9_-]{16,150})\/?$/);
    if (!match) return null;
    token = match[1];
  }
  return /^[A-Za-z0-9_-]{16,150}$/.test(token)
    ? 'https://explorer.near-intents.org/transactions/' + token : null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET required' });
  const rawReference = req.query?.reference;
  const explicitExplorerUrl = typeof rawReference === 'string' && /^https?:\/\//i.test(rawReference);
  let url = null;
  try { url = publicReference(rawReference); } catch {}
  if (!url) return res.status(400).json({ error: 'Provide a NEAR Intents Explorer transaction URL or supported record identifier.' });
  if (req.query?.memo && (typeof req.query.memo !== 'string' || req.query.memo.length > 150)) {
    return res.status(400).json({ error: 'Deposit memo must be at most 150 characters.' });
  }

  const address = new URL(url).pathname.split('/').at(-1);
  const depositAddressPattern = /^(?:0x[0-9a-fA-F]{40}|[1-9A-HJ-NP-Za-km-z]{26,60}|G[A-Z2-7]{55}|(?:bc1|ltc1)[a-z0-9]{20,90})$/;
  if (!explicitExplorerUrl && depositAddressPattern.test(address)) {
    try {
      const evidence = await readStatus(address, req.query?.memo);
      return res.status(200).json({ kind: 'official_status_snapshot', evidence });
    } catch (error) {
      const memoFailure = /memo/i.test(error?.message || '');
      if (memoFailure) return res.status(422).json({ error: error.message });
      // A bare Base58 identifier is ambiguous. Only a definitive provider 404
      // means no 1Click deposit record exists; outages, malformed payloads and
      // address mismatches must never be reinterpreted as a NEAR transaction hash.
      if (error?.status !== 404) {
        return res.status(502).json({
          error: '1Click status lookup failed. Try again later or use the guided case form; Explorer fallback was not attempted.'
        });
      }
      if (req.query?.memo) {
        return res.status(422).json({
          error: 'No 1Click status matches this deposit address and memo. Check the receipt or create a provisional case.'
        });
      }
      // No 1Click status exists for this identifier; try the public Explorer record.
    }
  }

  let html;
  try {
    const response = await fetch(url, {
      redirect: 'error',
      signal: AbortSignal.timeout(9000),
      headers: { Accept: 'text/html', 'User-Agent': 'OSIALI-public-evidence-reader/1.0' }
    });
    if (response.status === 404) return res.status(404).json({ error: 'No public Explorer record at that identifier. Use the guided case form.' });
    if (!response.ok) return res.status(502).json({ error: 'Public Explorer did not return a usable record. Use the guided case form.' });
    const size = Number(response.headers.get('content-length') || 0);
    if (size > 350000) return res.status(502).json({ error: 'Public evidence document exceeded the safe reader size.' });
    if (!(response.headers.get('content-type') || '').includes('text/html')) {
      return res.status(502).json({ error: 'Explorer did not return an HTML transaction page.' });
    }
    html = await response.text();
    if (html.length > 350000) return res.status(502).json({ error: 'Public evidence document exceeded the safe reader size.' });
  } catch (error) {
    console.error('[OSIALI] public Explorer fetch failed', {
      name: error?.name || 'Error',
      message: String(error?.message || '').slice(0, 160),
      code: error?.cause?.code || null
    });
    return res.status(502).json({ error: 'Could not retrieve the public Explorer page safely. Try again or use the guided case form.' });
  }

  let evidence;
  try {
    evidence = parsePublicExplorer(html, url, new Date().toISOString());
  } catch (error) {
    console.error('[OSIALI] public Explorer parse failed', {
      name: error?.name || 'Error',
      message: String(error?.message || '').slice(0, 160),
      htmlLength: html.length,
      hasTransactionDetails: html.includes('Transaction Details'),
      hasStreamSegments: /<div hidden id=["']S:/.test(html),
      hasStreamReveal: /\$RC\(\s*["']B:/.test(html)
    });
    return res.status(422).json({ error: 'Could not safely reconstruct this public Explorer page. No diagnosis was invented. Use the guided case form below.' });
  }

  return res.status(200).json({
    kind: 'public_explorer_snapshot',
    evidence,
    notice: 'Read-only source-attributed Explorer page snapshot. NOT independently verified on-chain, not an authenticated partner API status, and not a refund guarantee.'
  });
}
