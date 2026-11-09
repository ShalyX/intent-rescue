import { analyzeEvidence, exportBundle } from '/src/analyze.mjs';
import { findCapturedCase, parseEvidenceEnvelope } from '/src/intake.mjs';

const evidenceInput = document.querySelector('#evidence');
const result = document.querySelector('#result');
const emptyState = document.querySelector('#empty-state');
const inputStatus = document.querySelector('#input-status');
const fixtureButtons = [...document.querySelectorAll('[data-fixture]')];
let currentEvidence = null;
let evidenceAssurance = 'CAPTURED_PUBLIC_SNAPSHOT';
const isSourceSnapshot = () => evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' || evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT';
const demoFiles = ['f1-failed.json','f2-refunded.json','f3-success.json'];

document.querySelector('#identifier-form').addEventListener('submit', async event => {
  event.preventDefault();
  const input = document.querySelector('#identifier').value.trim();
  try {
    inputStatus.textContent = 'Checking captured public evidence…';
    const captures = await Promise.all(demoFiles.map(async f => {
      const response = await fetch('/fixtures/' + f);
      if (!response.ok) throw new Error('Captured-case source unavailable');
      return response.json();
    }));
    const match = findCapturedCase(input, captures);
    if (match.kind === 'captured') {
      evidenceInput.value = JSON.stringify(match.evidence, null, 2);
      evidenceAssurance = 'CAPTURED_PUBLIC_SNAPSHOT';
      selectFixture(fixtureButtons.find(b => b.dataset.fixture === demoFiles[captures.indexOf(match.evidence)]) ?? null);
      traceCurrent();
      return;
    }
    if (match.kind !== 'uncaptured') {
      clearView();
      inputStatus.textContent = match.reason;
      return;
    }
    clearView();
    inputStatus.textContent = 'Reading public Explorer page, without partner credentials…';
    const response = await fetch('/api/incident?reference=' + encodeURIComponent(input), {cache: 'no-store'});
    const payload = await response.json();
    if (!response.ok || payload.kind !== 'public_explorer_snapshot' || !payload.evidence) {
      clearView();
      inputStatus.textContent = (payload.error || 'Public Explorer lookup unavailable.') + ' You can paste a source-attributed evidence JSON instead.';
      return;
    }
    evidenceInput.value = JSON.stringify(payload.evidence, null, 2);
    evidenceAssurance = 'PUBLIC_EXPLORER_SNAPSHOT';
    selectFixture(null);
    traceCurrent();
  } catch (err) { clearView(); inputStatus.textContent = 'Identifier lookup unavailable: ' + err.message; }
});
function clearView() {
  currentEvidence = null;
  renderCase({});
  [result, document.querySelector('#protocol-body'), document.querySelector('#case-file')].forEach(el => el.classList.add('hidden'));
  emptyState.classList.remove('hidden');
  selectFixture(null);
}

for (const button of fixtureButtons) {
  button.addEventListener('click', async () => {
    try { await loadFixture(button.dataset.fixture, button); traceCurrent(); }
    catch (error) { inputStatus.textContent = `Case load failed: ${error.message}`; }
  });
}
evidenceInput.addEventListener('input', () => { evidenceAssurance = 'USER_SUPPLIED_UNVERIFIED'; selectFixture(null); });
document.querySelector('#trace').addEventListener('click', traceCurrent);
document.querySelector('#export').addEventListener('click', exportCurrentBundle);

function selectFixture(activeButton) {
  fixtureButtons.forEach(button => {
    button.classList.toggle('fixture-active', button === activeButton);
    button.setAttribute('aria-pressed', String(button === activeButton));
  });
}
async function loadFixture(name, activeButton) {
  fixtureButtons.forEach(button => { button.disabled = true; });
  inputStatus.textContent = 'Loading captured evidence…';
  try {
    const response = await fetch(`/fixtures/${name}`);
    if (!response.ok) throw new Error(`Could not load ${name}`);
    const data = await response.json();
    evidenceInput.value = JSON.stringify(data, null, 2);
    evidenceAssurance = 'CAPTURED_PUBLIC_SNAPSHOT';
    selectFixture(activeButton);
  } finally { fixtureButtons.forEach(button => { button.disabled = false; }); }
}
function traceCurrent() {
  try {
    const evidence = parseEvidenceEnvelope(evidenceInput.value);
    const analysis = analyzeEvidence(evidence);
    currentEvidence = evidence;
    renderCase(evidence);
    renderAnalysis(analysis);
    [result, document.querySelector('#protocol-body'), document.querySelector('#case-file')].forEach(el => el.classList.remove('hidden'));
    emptyState.classList.add('hidden');
    inputStatus.textContent = evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT' ? 'Public Explorer page snapshot · Not independently verified on-chain' : evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' ? `Case ${evidence.id || 'captured'} traced · Historical public snapshot` : 'Provisional analysis · User-supplied evidence is not independently verified';
  } catch (error) {
    currentEvidence = null;
    selectFixture(null);
    renderCase({});
    [result, document.querySelector('#protocol-body'), document.querySelector('#case-file')].forEach(el => el.classList.add('hidden'));
    emptyState.classList.remove('hidden');
    document.querySelector('#classification').textContent = '';
    document.querySelector('#confidence').textContent = '';
    document.querySelector('#investigation').removeAttribute('data-kind');
    document.querySelector('.recovery-rail').removeAttribute('data-kind');
    inputStatus.textContent = `Invalid evidence JSON: ${error.message}`;
  }
}
function exportCurrentBundle() {
  if (!currentEvidence) return;
  const bundle = exportBundle(currentEvidence, { assurance: evidenceAssurance });
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `intent-rescue-${currentEvidence.id || 'incident'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function renderCase(evidence) {
  document.querySelector('#case-id').textContent = evidence.id ? `Case ${evidence.id}` : currentEvidence ? 'Custom case' : 'No case loaded';
  document.querySelector('#route-source').textContent = evidence.source_asset || '—';
  document.querySelector('#route-destination').textContent = evidence.destination_asset || '—';
  document.querySelector('#reported-status').textContent = statusLabel(evidence.reported_status || 'UNKNOWN');
  document.querySelector('#case-basis').textContent = currentEvidence ? (isSourceSnapshot() ? 'Public Explorer snapshot / not on-chain verified' : 'User-supplied / unverified') : 'Awaiting valid input';
  document.querySelector('#captured-at').textContent = formatTimestamp(evidence.captured_at);
  document.querySelector('#canvas-provenance').textContent = `${evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT' ? 'Explorer page snapshot · not chain verified' : evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' ? 'Historical public evidence snapshot' : 'Unverified user input'} · ${formatTimestamp(evidence.captured_at)}`;
  document.querySelector('#file-source').textContent = evidence.source_url || 'No source URL supplied';
  document.querySelector('#file-captured').textContent = evidence.captured_at ? `Captured ${formatTimestamp(evidence.captured_at)}` : 'No capture time supplied';
  const link = document.querySelector('#source-link');
  let safeSource = false;
  try { safeSource = new URL(evidence.source_url).protocol === 'https:'; } catch {}
  link.setAttribute('aria-disabled', String(!safeSource));
  link.tabIndex = safeSource ? 0 : -1;
  link.href = safeSource ? evidence.source_url : '#';
  link.classList.toggle('disabled', !safeSource);
}
function renderAnalysis(analysis) {
  const kind = classificationKind(analysis.classification);
  for (const el of [result, document.querySelector('#investigation'), document.querySelector('.recovery-rail')]) el.dataset.kind = kind;
  const classification = document.querySelector('#classification');
  classification.textContent = statusLabel(analysis.classification);
  classification.dataset.kind = kind;
  document.querySelector('#protocol-classification').textContent = statusLabel(analysis.classification);
  document.querySelector('#confidence').textContent = evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' ? `${statusLabel(analysis.confidence)} / snapshot-based` : 'Provisional / unverified input';
  document.querySelector('#unresolved').textContent = analysis.first_unresolved_step
    ? statusLabel(analysis.first_unresolved_step)
    : analysis.classification === 'COMPLETE' ? 'Transfer complete' : 'No unresolved recovery step';
  document.querySelector('#safe-action').textContent = isSourceSnapshot() ? analysis.safe_action : 'Unverified evidence. Confirm original transactions and any refund/destination record before taking action. Do not retry on the basis of this report alone.';
  document.querySelector('#predicates').replaceChildren(...analysis.evidence_predicates.map(predicate => {
    const item = document.createElement('code'); item.textContent = predicate; return item;
  }));
  const unresolvedIndex = unresolvedStageIndex(analysis.first_unresolved_step);
  const lifecycle = document.querySelector('#lifecycle');
  lifecycle.replaceChildren(routeWires(analysis.lifecycle, unresolvedIndex), ...analysis.lifecycle.map((stage, index) => stageNode(stage, index, unresolvedIndex)));
  const alternatives = document.createElement('p');
  alternatives.className = 'terminal-label';
  alternatives.textContent = 'Terminal alternatives / Destination delivery or refund';
  lifecycle.append(alternatives);
  if (unresolvedIndex >= 0) {
    const boundary = document.createElement('span'); boundary.className = `break-label break-at-${unresolvedIndex}`;
    boundary.textContent = 'Evidence stops here'; lifecycle.append(boundary);
  }
  const boundaryText = document.createElement('span');
  boundaryText.textContent = analysis.first_unresolved_step ? `Evidence boundary / ${statusLabel(analysis.first_unresolved_step)}` : `Observed outcome / ${statusLabel(analysis.classification)}`;
  const protocolLink = document.createElement('a'); protocolLink.href = '#protocol-title'; protocolLink.textContent = 'Recovery protocol →';
  document.querySelector('#boundary-handoff').replaceChildren(boundaryText, protocolLink);
  const bundle = exportBundle(currentEvidence, { assurance: evidenceAssurance });
  renderEvidence(bundle);
  document.querySelector('#preview').textContent = JSON.stringify(bundle, null, 2);
}
function stageNode(stage, index, unresolvedIndex) {
  const node = document.createElement('article');
  const unresolved = index === unresolvedIndex;
  node.className = `stage stage-${index} stage-${stage.status.toLowerCase()} basis-${stage.basis.toLowerCase()}${unresolved ? ' stage-unresolved' : ''}`;
  node.innerHTML = `<div class="stage-copy">
    <span class="stage-step"><span>0${index + 1}</span><span>${unresolved ? 'First unresolved' : index >= 3 ? 'Terminal alternative' : 'Transfer leg'}</span></span>
    <strong class="stage-title">${escapeHtml(stage.label)}</strong>
    <div class="stage-status-row"><span class="stage-status">${escapeHtml(statusLabel(stage.status))}</span><span class="basis-stamp">${escapeHtml(statusLabel(stage.basis))}</span></div>
    </div><div class="stage-records">
    ${stage.evidence.length ? '' : '<small>No evidence observed</small>'}
    ${stage.evidence.map(value => {
      const ledgerIndex = evidenceLedgerIndex(value, index);
      const shortValue = value.length > 26 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;
      return `<a href="#evidence-${ledgerIndex}" title="${escapeHtml(value)}" aria-label="Evidence E0${ledgerIndex + 1}: ${escapeHtml(value)}">E0${ledgerIndex + 1} ${escapeHtml(shortValue)}</a>`;
    }).join('')}
    ${unresolved ? `<p class="evidence-boundary">${index === 3 ? 'Concrete destination evidence is absent from this evidence set' : index === 4 ? 'Concrete refund evidence is absent from this evidence set' : 'The supplied evidence does not resolve this leg'}</p>` : ''}</div>`;
  return node;
}
function evidenceLedgerIndex(value, index) {
  if (index === 0) return currentEvidence.near_deposit_tx_hashes?.includes(value) ? 2 : 0;
  if (index === 1) return 1;
  if (index === 2) return currentEvidence.near_swap_tx_hashes?.includes(value) ? 3 : 1;
  return index === 3 ? 4 : 5;
}
function routeWires(stages, unresolvedIndex) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 1000 480'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('route-wires');
  const wire = (index, full, broken) => `<path class="wire-${stages[index].basis.toLowerCase()}" d="${index === unresolvedIndex ? broken : full}" />`;
  svg.innerHTML = `<defs><marker id="route-arrowhead" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L7 4L1 7" /></marker></defs>
    ${wire(1, 'M280 20H350', 'M280 20H302 M326 20H350')}
    ${wire(2, 'M630 20H700', 'M630 20H652 M676 20H700')}
    <path class="wire-${stages[2].basis.toLowerCase()}" d="M850 20V240" />
    ${wire(3, 'M850 240H490V300', 'M850 240H490V270 M490 290V300')}
    ${wire(4, 'M850 240V300', 'M850 240V270 M850 290V300')}
    ${unresolvedIndex === 0 ? '<path class="wire-unknown" d="M0 0V4 M0 16V20" />' : ''}
    ${unresolvedIndex >= 0 ? `<path class="wire-break" d="${({0:'M-6 7L6 13',1:'M308 14L320 26',2:'M658 14L670 26',3:'M482 276L498 284',4:'M842 276L858 284'})[unresolvedIndex]}" />` : ''}`;
  return svg;
}
function renderEvidence(bundle) {
  const entries = [
    ['Source transaction', [...bundle.identifiers.origin_tx_hashes, ...bundle.observations.deposit]],
    ['Intent', bundle.identifiers.intent_hashes],
    ['NEAR deposit', bundle.identifiers.near_deposit_tx_hashes],
    ['NEAR intent execution', bundle.identifiers.near_swap_tx_hashes],
    ['Destination evidence', [...bundle.identifiers.destination_tx_hashes, ...bundle.observations.destination]],
    ['Refund evidence', [...bundle.identifiers.refund_tx_hashes, ...bundle.observations.refund]]
  ];
  const linkGroups = [bundle.source_links.origin_transactions, [], bundle.source_links.near_deposit_transactions, bundle.source_links.near_swap_transactions, bundle.source_links.destination_transactions, bundle.source_links.refund_transactions];
  const traceJunctions = [1, 3, 1, 3, 4, 5];
  document.querySelector('#evidence-list').replaceChildren(...entries.map(([label, values], index) => {
    const basis = values.length ? 'OBSERVED' : 'UNKNOWN';
    const row = document.createElement('div'); row.id = `evidence-${index}`; row.className = `evidence-row evidence-${basis.toLowerCase()}`;
    const value = values.length ? values.join('\n') : 'Not observed in this evidence set';
    row.innerHTML = `<span class="file-junction" aria-label="Evidence E0${index + 1}, lifecycle step ${traceJunctions[index]}">E0${index + 1}</span><div class="evidence-key"><span>${escapeHtml(label)}</span><em>${statusLabel(basis)}</em></div><code>${escapeHtml(value)}</code>`;
    for (const [n, url] of (linkGroups[index] || []).entries()) {
      const a = document.createElement('a');
      a.className = 'evidence-external'; a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = (linkGroups[index].length > 1 ? `Verify chain record ${n + 1}` : 'Verify on chain explorer') + ' ↗';
      row.querySelector('code').append(document.createTextNode('\n'), a);
    }
    return row;
  }));
}
function unresolvedStageIndex(step) { return ({ source_deposit:0, intent_execution:2, destination_delivery:3, refund:4, outcome:3 })[step] ?? -1; }
function classificationKind(value) {
  if (['COMPLETE', 'REFUND_VERIFIED', 'INCOMPLETE_REFUNDED'].includes(value)) return 'resolved';
  if (['FAILED_UNRESOLVED', 'CONFLICTED_EVIDENCE', 'INCOMPLETE_REFUND_UNRESOLVED'].includes(value)) return 'unresolved';
  return 'attention';
}
function statusLabel(value) { const label = String(value || '').replaceAll('_', ' ').toLowerCase(); return label.charAt(0).toUpperCase() + label.slice(1); }
function formatTimestamp(value) { if (!value) return '—'; const date = new Date(value); return Number.isNaN(date.valueOf()) ? value : date.toISOString().replace('T', ' ').replace('.000Z', 'Z'); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
const demoMap = { F1:'f1-failed.json', F2:'f2-refunded.json', F3:'f3-success.json' };
const requestedDemo = new URLSearchParams(window.location.search).get('demo');
const selectedDemo = demoMap[requestedDemo] ? requestedDemo : 'F1';
loadFixture(demoMap[selectedDemo], fixtureButtons[{F1:0,F2:1,F3:2}[selectedDemo]])
  .then(traceCurrent).catch(error => { inputStatus.textContent = `Case load failed: ${error.message}`; });
