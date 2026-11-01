import { analyzeEvidence, exportBundle } from '/src/analyze.mjs';

const evidenceInput = document.querySelector('#evidence');
const result = document.querySelector('#result');
const emptyState = document.querySelector('#empty-state');
const inputStatus = document.querySelector('#input-status');
let currentEvidence = null;
let traceTimer = null;

const fixtureButtons = [...document.querySelectorAll('[data-fixture]')];
for (const button of fixtureButtons) {
  button.addEventListener('click', async () => {
    await loadFixture(button.dataset.fixture, button);
    traceCurrent();
  });
}

document.querySelector('#trace').addEventListener('click', traceCurrent);

document.querySelector('#export').addEventListener('click', () => {
  if (!currentEvidence) return;
  const bundle = exportBundle(currentEvidence);
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `intent-rescue-${currentEvidence.id || 'incident'}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

async function loadFixture(name, activeButton) {
  const response = await fetch(`/fixtures/${name}`);
  if (!response.ok) throw new Error(`Could not load ${name}`);
  const data = await response.json();
  evidenceInput.value = JSON.stringify(data, null, 2);
  inputStatus.textContent = `Loaded ${data.id}`;
  fixtureButtons.forEach(button => button.classList.toggle('fixture-active', button === activeButton));
}

function traceCurrent() {
  try {
    currentEvidence = JSON.parse(evidenceInput.value);
    const analysis = analyzeEvidence(currentEvidence);
    renderCase(currentEvidence);
    render(analysis);
    result.classList.remove('hidden');
    emptyState.classList.add('hidden');
    inputStatus.textContent = `Traced ${currentEvidence.id || 'incident'}`;
  } catch (error) {
    inputStatus.textContent = `Invalid evidence JSON: ${error.message}`;
    result.classList.add('hidden');
    emptyState.classList.remove('hidden');
  }
}

function renderCase(evidence) {
  document.querySelector('#case-id').textContent = evidence.id ? `CASE ${evidence.id}` : 'CUSTOM CASE';
  document.querySelector('#route-source').textContent = evidence.source_asset || 'Unknown';
  document.querySelector('#route-destination').textContent = evidence.destination_asset || 'Unknown';
  document.querySelector('#reported-status').textContent = String(evidence.reported_status || 'UNKNOWN').replaceAll('_', ' ');
  document.querySelector('#case-basis').textContent = evidence.source_url ? 'Captured public evidence' : 'Submitted evidence';
  document.querySelector('#captured-at').textContent = formatTimestamp(evidence.captured_at);
  const link = document.querySelector('#source-link');
  if (evidence.source_url) {
    link.href = evidence.source_url;
    link.classList.remove('disabled');
  } else {
    link.href = '#';
    link.classList.add('disabled');
  }
}

function render(analysis) {
  const kind = classificationKind(analysis.classification);
  result.dataset.kind = kind;
  const classification = document.querySelector('#classification');
  classification.textContent = friendlyClassification(analysis.classification);
  classification.dataset.kind = kind;
  document.querySelector('.break-symbol').textContent = kind === 'resolved' ? '✓' : '!';
  document.querySelector('#confidence').textContent = `${analysis.confidence} confidence`;
  document.querySelector('#unresolved').textContent = analysis.first_unresolved_step
    ? `First unresolved: ${analysis.first_unresolved_step.replaceAll('_', ' ')}`
    : analysis.classification === 'COMPLETE' ? 'Transfer complete' : 'No unresolved recovery step';
  document.querySelector('#safe-action').textContent = analysis.safe_action;

  const predicates = document.querySelector('#predicates');
  predicates.replaceChildren(...analysis.evidence_predicates.map(predicate => {
    const item = document.createElement('code');
    item.textContent = predicate;
    return item;
  }));

  const unresolvedIndex = unresolvedStageIndex(analysis.first_unresolved_step);
  const lifecycle = document.querySelector('#lifecycle');
  lifecycle.classList.remove('trace-ready');
  lifecycle.replaceChildren(...analysis.lifecycle.map((stage, index) => stageNode(stage, index, unresolvedIndex)));
  clearTimeout(traceTimer);
  traceTimer = setTimeout(() => lifecycle.classList.add('trace-ready'), 40);

  const bundle = exportBundle(currentEvidence);
  renderEvidence(bundle);
  document.querySelector('#preview').textContent = JSON.stringify(bundle, null, 2);
}

function stageNode(stage, index, unresolvedIndex) {
  const node = document.createElement('article');
  const unresolved = index === unresolvedIndex;
  node.className = `stage stage-${stage.status.toLowerCase()} basis-${stage.basis.toLowerCase()}${unresolved ? ' stage-unresolved' : ''}`;
  node.style.setProperty('--stage-order', index);
  const evidenceCount = stage.evidence.length;
  node.innerHTML = `
    <div class="stage-node" aria-hidden="true"><span>${unresolved ? '!' : index + 1}</span></div>
    <div class="stage-copy">
      <span class="stage-step">Step ${String(index + 1).padStart(2, '0')}</span>
      <strong>${escapeHtml(stage.label)}</strong>
      <div class="stage-status-row"><span class="stage-status">${escapeHtml(statusLabel(stage.status))}</span><span class="basis-stamp">${escapeHtml(stage.basis)}</span></div>
      <small>${evidenceCount ? `${evidenceCount} evidence item${evidenceCount === 1 ? '' : 's'}` : 'No evidence observed'}</small>
    </div>`;
  return node;
}

function renderEvidence(bundle) {
  const entries = [
    ['Source transaction', bundle.identifiers.origin_tx_hashes.length ? bundle.identifiers.origin_tx_hashes : bundle.observations.deposit, (bundle.identifiers.origin_tx_hashes.length || bundle.observations.deposit.length) ? 'OBSERVED' : 'UNKNOWN'],
    ['Intent', bundle.identifiers.intent_hashes, bundle.identifiers.intent_hashes.length ? 'OBSERVED' : 'UNKNOWN'],
    ['NEAR deposit', bundle.identifiers.near_deposit_tx_hashes, bundle.identifiers.near_deposit_tx_hashes.length ? 'OBSERVED' : 'UNKNOWN'],
    ['NEAR intent execution', bundle.identifiers.near_swap_tx_hashes, bundle.identifiers.near_swap_tx_hashes.length ? 'OBSERVED' : 'UNKNOWN'],
    ['Destination evidence', bundle.identifiers.destination_tx_hashes.length ? bundle.identifiers.destination_tx_hashes : bundle.observations.destination, (bundle.identifiers.destination_tx_hashes.length || bundle.observations.destination.length) ? 'OBSERVED' : 'UNKNOWN'],
    ['Refund evidence', bundle.identifiers.refund_tx_hashes.length ? bundle.identifiers.refund_tx_hashes : bundle.observations.refund, (bundle.identifiers.refund_tx_hashes.length || bundle.observations.refund.length) ? 'OBSERVED' : 'UNKNOWN']
  ];
  const list = document.querySelector('#evidence-list');
  list.replaceChildren(...entries.map(([label, values, basis]) => {
    const row = document.createElement('div');
    row.className = 'evidence-row';
    const value = values.length ? values.join('\n') : 'Not observed in this evidence set';
    row.innerHTML = `
      <div class="evidence-key"><span>${escapeHtml(label)}</span><em>${basis}</em></div>
      <code title="${escapeHtml(value)}">${escapeHtml(value)}</code>`;
    return row;
  }));
}

function unresolvedStageIndex(step) {
  return ({ source_deposit: 0, intent_execution: 2, destination_delivery: 3, refund: 4, outcome: 3 })[step] ?? -1;
}
function classificationKind(value) {
  if (value === 'COMPLETE' || value === 'REFUND_VERIFIED' || value === 'INCOMPLETE_REFUNDED') return 'resolved';
  if (value === 'FAILED_UNRESOLVED' || value === 'CONFLICTED_EVIDENCE' || value === 'INCOMPLETE_REFUND_UNRESOLVED') return 'unresolved';
  return 'attention';
}
function friendlyClassification(value) { return String(value || '').replaceAll('_', ' '); }
function statusLabel(value) { return String(value || '').replaceAll('_', ' '); }
function formatTimestamp(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toISOString().replace('T', ' ').replace('.000Z', 'Z');
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

const demoParam = new URLSearchParams(window.location.search).get('demo');
const demoMap = { F1: 'f1-failed.json', F2: 'f2-refunded.json', F3: 'f3-success.json' };
if (demoMap[demoParam]) {
  const index = { F1: 0, F2: 1, F3: 2 }[demoParam];
  loadFixture(demoMap[demoParam], fixtureButtons[index])
    .then(traceCurrent)
    .catch(error => { inputStatus.textContent = `Demo load failed: ${error.message}`; });
}
