import { analyzeEvidence, exportBundle } from '/src/analyze.mjs';
import { findCapturedCase, parseEvidenceEnvelope, validTransactionHash } from '/src/intake.mjs';

const evidenceInput = document.querySelector('#evidence');
const result = document.querySelector('#result');
const emptyState = document.querySelector('#empty-state');
const inputStatus = document.querySelector('#input-status');
const fixtureButtons = [...document.querySelectorAll('[data-fixture]')];
let currentEvidence = null;
let evidenceAssurance = 'CAPTURED_PUBLIC_SNAPSHOT';
const isSourceSnapshot = () => evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' || evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT' || evidenceAssurance === 'OFFICIAL_STATUS_SNAPSHOT';
const demoFiles = ['f1-failed.json','f2-refunded.json','f3-success.json'];
const fixtureCache = new Map();
async function getFixture(name) {
  if (fixtureCache.has(name)) return fixtureCache.get(name);
  const response = await fetch('/fixtures/' + name);
  if (!response.ok) throw new Error('Could not load captured case ' + name);
  const value = await response.json();
  fixtureCache.set(name,value);
  return value;
}
for (const name of demoFiles) getFixture(name).catch(() => {});
let pendingIdentifier = null;
let investigationRevision = 0;

document.querySelector('#identifier-form').addEventListener('submit', async event => {
  event.preventDefault();
  const revision = ++investigationRevision;
  const input = document.querySelector('#identifier').value.trim();
  clearView();
  pendingIdentifier = input;
  try {
    inputStatus.textContent = 'Checking captured public evidence…';
    const captures = (await Promise.allSettled(demoFiles.map(getFixture))).filter(item => item.status === 'fulfilled').map(item => item.value);
    if (revision !== investigationRevision) return;
    const match = findCapturedCase(input, captures);
    if (match.kind === 'invalid' || match.kind === 'ambiguous') { clearView(); inputStatus.textContent = match.reason; return; }
    inputStatus.textContent = 'Reading public Explorer page, without partner credentials…';
    const response = await fetch('/api/incident?reference=' + encodeURIComponent(input) + '&memo=' + encodeURIComponent(document.querySelector('#deposit-memo')?.value || ''), {cache: 'no-store'});
    const payload = await response.json();
    if (revision !== investigationRevision) return;
    if (!response.ok || !['public_explorer_snapshot','official_status_snapshot'].includes(payload.kind) || !payload.evidence) {
      if (match.kind === 'captured') { pendingIdentifier=null; evidenceInput.value=JSON.stringify(match.evidence); evidenceAssurance='CAPTURED_PUBLIC_SNAPSHOT'; traceCurrent(); inputStatus.textContent='Live lookup unavailable. Showing historical capture from '+match.evidence.captured_at; return; }
      clearView();
      document.querySelector('#guided-reference').value=input;
      document.querySelector('#guided-report').open=true;
      inputStatus.textContent = (payload.error || 'Public Explorer lookup unavailable.') + ' Tell us what you know below; no JSON needed.';

      return;
    }
    pendingIdentifier = null;
    evidenceInput.value = JSON.stringify(payload.evidence, null, 2);
    evidenceAssurance = payload.kind === 'official_status_snapshot' ? 'OFFICIAL_STATUS_SNAPSHOT' : 'PUBLIC_EXPLORER_SNAPSHOT';
    selectFixture(null);
    traceCurrent();
  } catch (err) { if (revision !== investigationRevision) return; clearView(); document.querySelector('#guided-reference').value=input; document.querySelector('#guided-report').open=true; inputStatus.textContent='Lookup is unavailable. You can still build a support case below.'; }
});
function clearView() {
  currentEvidence = null;
  renderCase({});
  [result, document.querySelector('#protocol-body'), document.querySelector('#case-file')].forEach(el => el.classList.add('hidden'));
  emptyState.classList.remove('hidden');
  document.querySelector('#investigation').removeAttribute('data-kind');
  document.querySelector('.recovery-rail').removeAttribute('data-kind');
  document.querySelector('#guided-report').open = false;
  for (const selector of ['#classification','#protocol-classification','#confidence','#unresolved','#safe-action',
    '#mobile-action','#predicates','#boundary-handoff','#lifecycle','#evidence-list','#preview']) {
    document.querySelector(selector)?.replaceChildren();
  }
  selectFixture(null);
}

for (const button of fixtureButtons) {
  button.addEventListener('click', async () => {
    ++investigationRevision;
    try { if (await loadFixture(button.dataset.fixture, button)) traceCurrent(); }
    catch (error) { inputStatus.textContent = `Case load failed: ${error.message}`; }
  });
}
evidenceInput.addEventListener('input', () => { ++investigationRevision; evidenceAssurance = 'USER_SUPPLIED_UNVERIFIED'; pendingIdentifier = null; clearView(); inputStatus.textContent = 'Evidence changed. Trace it again to rebuild the case.'; });
document.querySelectorAll('#guided-form input').forEach(field=>field.addEventListener('input',()=>field.setCustomValidity('')));
document.querySelector('#trace').addEventListener('click', traceCurrent);
document.querySelector('#export').addEventListener('click', exportCurrentBundle);

function selectFixture(activeButton) {
  fixtureButtons.forEach(button => {
    button.classList.toggle('fixture-active', button === activeButton);
    button.setAttribute('aria-pressed', String(button === activeButton));
  });
}
async function loadFixture(name, activeButton) {
  pendingIdentifier = null;
  clearView();
  const revision = investigationRevision;
  pendingIdentifier = null;
  clearView();
  fixtureButtons.forEach(button => { button.disabled = true; });
  inputStatus.textContent = 'Loading captured evidence…';
  try {
    const data = await getFixture(name);
    if (revision !== investigationRevision) return false;
    pendingIdentifier = null;
    evidenceInput.value = JSON.stringify(data, null, 2);
    evidenceAssurance = 'CAPTURED_PUBLIC_SNAPSHOT';
    selectFixture(activeButton);
    return true;
  } finally { fixtureButtons.forEach(button => { button.disabled = false; }); }
}
function traceCurrent() {
  try {
    const evidence = parseEvidenceEnvelope(evidenceInput.value);
    if (pendingIdentifier && evidenceAssurance === 'USER_SUPPLIED_UNVERIFIED'
        && findCapturedCase(pendingIdentifier, [evidence]).kind !== 'captured')
      throw new Error('Supplied evidence does not contain the searched identifier. Match the deposit address, transaction hash, correlation ID, or source URL first.');
    const analysis = analyzeEvidence(evidence, { assurance: evidenceAssurance });
    currentEvidence = evidence;
    renderCase(evidence);
    renderAnalysis(analysis);
    [result, document.querySelector('#protocol-body'), document.querySelector('#case-file')].forEach(el => el.classList.remove('hidden'));
    emptyState.classList.add('hidden');
    inputStatus.textContent = evidenceAssurance === 'OFFICIAL_STATUS_SNAPSHOT'
      ? '1Click status snapshot retrieved ' + formatTimestamp(evidence.captured_at) +
        (evidence.source_updated_at ? '; provider state last changed ' + formatTimestamp(evidence.source_updated_at) : '') +
        '. Not independently verified on-chain.'
      : evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT'
        ? 'Public Explorer page snapshot; not independently verified on-chain.'
        : evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT'
          ? 'Case ' + (evidence.id || 'captured') + ' traced; historical public snapshot.'
          : 'Provisional analysis; user-supplied evidence is not independently verified.';
  } catch (error) {
    clearView();
    document.querySelector('#investigation').removeAttribute('data-kind');
    document.querySelector('.recovery-rail').removeAttribute('data-kind');
    inputStatus.textContent = 'Could not build case: ' + error.message;
  }
}
function exportCurrentBundle() {
  if (!currentEvidence) return;
  const bundle = exportBundle(currentEvidence, { assurance: evidenceAssurance });
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeId = String(currentEvidence.id || 'incident').replace(/[^a-z0-9_-]/gi, '').slice(0, 45) || 'incident';
  a.download = `osiali-${safeId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function renderCase(evidence) {
  document.querySelector('#case-id').textContent = evidence.id ? `Case ${evidence.id}` : currentEvidence ? 'Custom case' : 'No case loaded';
  document.querySelector('#route-source').textContent = evidence.source_asset || '—';
  document.querySelector('#route-destination').textContent = evidence.destination_asset || '—';
  document.querySelector('#reported-status').textContent = statusLabel(evidence.reported_status || 'UNKNOWN');
  document.querySelector('#case-basis').textContent = currentEvidence ? (isSourceSnapshot() ? 'Source response / not on-chain verified' : 'User-supplied / unverified') : 'Awaiting valid input';
  document.querySelector('#captured-at').textContent = formatTimestamp(evidence.captured_at);
  document.querySelector('#canvas-provenance').textContent = `${evidenceAssurance === 'OFFICIAL_STATUS_SNAPSHOT' ? '1Click status response · not chain verified' : evidenceAssurance === 'PUBLIC_EXPLORER_SNAPSHOT' ? 'Explorer page snapshot · not chain verified' : evidenceAssurance === 'CAPTURED_PUBLIC_SNAPSHOT' ? 'Historical public evidence snapshot' : 'Unverified user input'} · ${formatTimestamp(evidence.captured_at)}`;
  document.querySelector('#file-source').textContent = evidence.source_url || 'No source URL supplied';
  document.querySelector('#file-captured').textContent = evidence.captured_at ? 'Retrieved ' + formatTimestamp(evidence.captured_at) : 'No retrieval time supplied';
  document.querySelector('#file-updated').textContent = providerUpdateLabel(evidence.source_updated_at, evidence.captured_at);
  if (!currentEvidence) document.querySelector('#canvas-provenance').textContent='No evidence loaded';
  const link = document.querySelector('#source-link');
  let safeSource = false;
  let sourceHost = '';
  try {
    const url = new URL(evidence.source_url);
    sourceHost = url.hostname;
    const explorer = url.protocol === 'https:' && url.hostname === 'explorer.near-intents.org'
      && /^\/transactions\/[A-Za-z0-9_-]{16,150}\/?$/.test(url.pathname);
    const oneClick = url.protocol === 'https:' && url.hostname === '1click.chaindefuser.com'
      && url.pathname === '/v0/status' && url.searchParams.has('depositAddress')
      && [...url.searchParams.keys()].every(key => ['depositAddress','depositMemo'].includes(key));
    safeSource = explorer || oneClick;
  } catch {}
  link.setAttribute('aria-disabled', String(!safeSource));
  link.tabIndex = safeSource ? 0 : -1;
  link.href = safeSource ? evidence.source_url : '#';
  link.textContent = safeSource ? (sourceHost === '1click.chaindefuser.com' ? 'Open 1Click status source' : 'Open public Explorer evidence') : 'No verified source link available';
  link.classList.toggle('disabled', !safeSource);
}
function renderAnalysis(analysis) {
  const kind = classificationKind(analysis.classification);
  for (const el of [result, document.querySelector('#investigation'), document.querySelector('.recovery-rail')]) el.dataset.kind = kind;
  const classification = document.querySelector('#classification');
  classification.textContent = statusLabel(analysis.classification);
  classification.dataset.kind = kind;
  document.querySelector('#protocol-classification').textContent = statusLabel(analysis.classification);
  document.querySelector('#confidence').textContent = isSourceSnapshot() ? `${statusLabel(analysis.confidence)} / source-reported` : 'Provisional / unverified input';
  document.querySelector('#unresolved').textContent = analysis.first_unresolved_step
    ? statusLabel(analysis.first_unresolved_step)
    : analysis.classification === 'COMPLETE' ? 'Transfer complete' : 'No unresolved recovery step';
  document.querySelector('#safe-action').textContent = isSourceSnapshot() ? analysis.safe_action : 'Unverified evidence. Confirm original transactions and any refund/destination record before taking action. Do not retry on the basis of this report alone.';
  if(evidenceAssurance==='OFFICIAL_STATUS_SNAPSHOT'&&analysis.classification==='REFUND_VERIFIED')document.querySelector('#safe-action').textContent='1Click reports a refund. Confirm it in your wallet before starting another swap.';
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
  document.querySelector('#mobile-action').textContent = document.querySelector('#safe-action').textContent;
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
  const provider = bundle.provider_details || {};
  const providerSummary = [
    ['Deposited', provider.deposited_amount_formatted || provider.deposited_amount],
    ['Refunded', provider.refunded_amount_formatted || provider.refunded_amount],
    ['Refund reason', provider.refund_reason],
    ['Refund fee', provider.refund_fee_formatted || provider.refund_fee],
    ['Withdraw fee', provider.withdraw_fee_formatted || provider.withdraw_fee],
    ['Amount in', provider.amount_in_formatted || provider.amount_in],
    ['Amount out', provider.amount_out_formatted || provider.amount_out],
    ['Recipient', provider.recipient],
    ['Refund to', provider.refund_to],
    ['Quote deadline', provider.deadline]
  ].filter(entry => entry[1] !== null && entry[1] !== undefined && entry[1] !== '')
   .map(entry => entry[0] + ': ' + entry[1]);
  const entries = [
    ['Source deposit evidence', [...bundle.identifiers.origin_tx_hashes, ...bundle.observations.deposit]],
    ['Intent', bundle.identifiers.intent_hashes],
    ['NEAR deposit', bundle.identifiers.near_deposit_tx_hashes],
    ['NEAR intent execution', bundle.identifiers.near_swap_tx_hashes],
    ['Destination evidence', [...bundle.identifiers.destination_tx_hashes, ...bundle.observations.destination]],
    ['Refund evidence', [...bundle.identifiers.refund_tx_hashes, ...bundle.observations.refund]],
    ['Origin-chain transactions (role unassigned)', bundle.identifiers.unassigned_origin_tx_hashes],
    ['NEAR transactions (role unassigned)', bundle.identifiers.unassigned_near_tx_hashes],
    ['1Click provider details', providerSummary]
  ];
  const linkGroups = [
    bundle.source_links.origin_transactions, [], bundle.source_links.near_deposit_transactions,
    bundle.source_links.near_swap_transactions, bundle.source_links.destination_transactions,
    bundle.source_links.refund_transactions, bundle.source_links.unassigned_origin_transactions,
    bundle.source_links.unassigned_near_transactions, []
  ];
  const traceJunctions = [1, 3, 1, 3, 4, 5, 1, 3, 5];
  document.querySelector('#evidence-list').replaceChildren(...entries.map(([label, values], index) => {
    const basis = values.length ? (isSourceSnapshot() ? 'OBSERVED' : 'SUPPLIED') : 'UNKNOWN';
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
function formatTimestamp(value) {
  if (!value) return '?';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? String(value) : date.toISOString().replace('T', ' ').replace('.000Z', 'Z');
}
function providerUpdateLabel(updatedAt, capturedAt) {
  if (!updatedAt) return 'Provider state update time not supplied';
  const updated = new Date(updatedAt).valueOf();
  const captured = capturedAt ? new Date(capturedAt).valueOf() : Date.now();
  if (Number.isNaN(updated) || Number.isNaN(captured)) return 'Provider state last changed ' + formatTimestamp(updatedAt) + '; age unavailable';
  const delta = captured - updated;
  if (delta < 0) return 'Provider state timestamp is later than retrieval; check source clocks';
  return 'Provider state last changed ' + formatTimestamp(updatedAt) + ' (' + formatElapsed(delta) + ' before retrieval)';
}
function formatElapsed(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  if (minutes < 1) return 'less than 1 minute';
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remaining = minutes % 60;
  if (days) return days + 'd ' + hours + 'h';
  if (hours) return hours + 'h ' + remaining + 'm';
  return minutes + 'm';
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
const demoMap = { F1:'f1-failed.json', F2:'f2-refunded.json', F3:'f3-success.json' };
const requestedDemo = new URLSearchParams(window.location.search).get('demo');
if (demoMap[requestedDemo]) {
 loadFixture(demoMap[requestedDemo], fixtureButtons[{F1:0,F2:1,F3:2}[requestedDemo]])
 .then(loaded=>{if(loaded)traceCurrent();}).catch(()=>{clearView();inputStatus.textContent='Example unavailable. You can investigate your own swap.';});
} else {clearView();inputStatus.textContent='Paste the Explorer link or deposit address from your swap receipt. Or create a case with the form below.';}

const guided=document.querySelector('#guided-form');
guided?.addEventListener('submit',event=>{
 event.preventDefault();++investigationRevision;pendingIdentifier=null;
 const value=id=>document.querySelector('#'+id).value.trim();
 const reference=value('guided-reference');
 for(const id of ['guided-source-tx','guided-destination-tx','guided-refund-tx']){const field=document.querySelector('#'+id);field.setCustomValidity(field.value.trim()&&!validTransactionHash(field.value.trim())?'Paste a transaction hash from your wallet receipt, or leave this blank.':'');if(!field.checkValidity())field.closest('details').open=true;if(!field.reportValidity())return;}
 const evidence={deposit_memo:document.querySelector('#deposit-memo')?.value.trim()||null,id:'User-report',searched_reference:reference,reported_status:value('guided-status'),user_notes:value('guided-notes'),captured_at:new Date().toISOString()};
 for(const [field,id] of [['origin_tx_hashes','guided-source-tx'],['destination_tx_hashes','guided-destination-tx'],['refund_tx_hashes','guided-refund-tx']]){const text=value(id);evidence[field]=text?[text]:[];}
 if(value('guided-deposit'))evidence.deposit_address=value('guided-deposit');
 if(value('guided-chain'))evidence.source_chain=value('guided-chain');
 evidenceInput.value=JSON.stringify(evidence);evidenceAssurance='USER_SUPPLIED_UNVERIFIED';selectFixture(null);traceCurrent();
});
