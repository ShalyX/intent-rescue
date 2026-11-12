// Conservative best-effort extraction from the public, server-rendered NEAR Intents Explorer.
// This is a source-attributed snapshot, NOT a signed status, wallet proof or partner API response.
import { chainTransactionUrl } from './explorer-links.mjs';
const strip = s => s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
const unique = xs => [...new Set(xs)];
const refs = (s,pattern) => unique([...s.matchAll(/href="(https?:[^"]+)"/g)]
  .map(x=>x[1].replace(/&amp;/g,'&')).map(x=>{try {return new URL(x)}catch{return null}})
  .filter(u=>u && pattern(u)).map(u=>u.pathname.split('/').filter(Boolean).at(-1))
  .filter(Boolean));
function segment(html,headings,name){
  const index=headings.findIndex(x=>x.title===name);
  if(index<0)return '';
  const start=headings[index].end;
  return html.slice(start, headings[index+1]?.start ?? Math.min(start+5000,html.length));
}

const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const HIDDEN_CLASSES = new Set(['hidden','d-none','invisible','sr-only','visually-hidden']);

function removeHiddenSubtrees(html) {
  const tokens = /<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  let output = '';
  let cursor = 0;
  const hiddenStack = [];
  for (const match of html.matchAll(tokens)) {
    const token = match[0];
    const index = match.index;
    if (!hiddenStack.length) output += html.slice(cursor, index);
    if (token.startsWith('<!--')) {
      if (!hiddenStack.length) output += token;
      cursor = index + token.length;
      continue;
    }
    const parsed = token.match(/^<\s*(\/?)\s*([A-Za-z][\w:-]*)/);
    if (!parsed) {
      if (!hiddenStack.length) output += token;
      cursor = index + token.length;
      continue;
    }
    const closing = parsed[1] === '/';
    const name = parsed[2].toLowerCase();
    if (hiddenStack.length) {
      if (closing) {
        const at = hiddenStack.lastIndexOf(name);
        if (at >= 0) hiddenStack.length = at;
      } else if (!VOID_TAGS.has(name) && !/\/\s*>$/.test(token)) hiddenStack.push(name);
      cursor = index + token.length;
      continue;
    }
    if (closing) output += token;
    else {
      const attrs = token.slice(parsed[0].length, -1);
      const classValue = attrs.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/i);
      const classes = (classValue?.[1] || classValue?.[2] || classValue?.[3] || '').split(/\s+/);
      const styleValue = attrs.match(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/i);
      const style = styleValue?.[1] || styleValue?.[2] || styleValue?.[3] || '';
      const hidden = /(?:^|\s)hidden(?:\s|=|$)/i.test(attrs) ||
        /\baria-hidden\s*=\s*(?:"true"|'true'|true)(?=\s|$)/i.test(attrs) ||
        /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/i.test(style) ||
        classes.some(value => HIDDEN_CLASSES.has(value.toLowerCase()));
      if (hidden) {
        if (!VOID_TAGS.has(name) && !/\/\s*>$/.test(token)) hiddenStack.push(name);
      } else output += token;
    }
    cursor = index + token.length;
  }
  if (!hiddenStack.length) output += html.slice(cursor);
  return output;
}

function restoreNextStreamSegmentsOnce(html) {
  const segmentOpen = /<div\b(?=[^>]*\bhidden(?:\s|=|>))(?=[^>]*\bid=["']S:([A-Za-z0-9_-]+)["'])[^>]*>/gi;
  const tagPattern = /<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
  let output = '';
  let cursor = 0;
  let match;

  while ((match = segmentOpen.exec(html))) {
    if (match.index < cursor) continue;
    const id = match[1];
    const reveal = new RegExp('\\$RC\\(\\s*["\']B:' + id + '["\']\\s*,\\s*["\']S:' + id + '["\']\\s*\\)').test(html);
    const placeholder = new RegExp('<template\\b(?=[^>]*\\bid=["\']B:' + id + '["\'])[^>]*>\\s*</template>', 'i').test(html);
    if (!reveal || !placeholder) continue;

    tagPattern.lastIndex = segmentOpen.lastIndex;
    let depth = 1;
    let closing = null;
    let tokenMatch;
    while ((tokenMatch = tagPattern.exec(html))) {
      const token = tokenMatch[0];
      if (token.startsWith('<!--')) continue;
      const parsed = token.match(/^<\s*(\/?)\s*([A-Za-z][\w:-]*)/);
      if (!parsed) continue;
      const isClosing = parsed[1] === '/';
      const name = parsed[2].toLowerCase();

      if (!isClosing && ['script', 'style', 'template', 'noscript'].includes(name)) {
        const rawClose = new RegExp('</' + name + '\\s*>', 'ig');
        rawClose.lastIndex = tagPattern.lastIndex;
        const rawEnd = rawClose.exec(html);
        if (!rawEnd) break;
        tagPattern.lastIndex = rawClose.lastIndex;
        continue;
      }

      if (name === 'div') {
        if (isClosing) depth--;
        else if (!/\/\s*>$/.test(token)) depth++;
        if (depth === 0) {
          closing = { start: tokenMatch.index, end: tagPattern.lastIndex };
          break;
        }
      }
    }

    if (!closing) continue;
    output += html.slice(cursor, match.index) +
      html.slice(segmentOpen.lastIndex, closing.start);
    cursor = closing.end;
    segmentOpen.lastIndex = closing.end;
  }

  return output + html.slice(cursor);
}

function restoreNextStreamSegments(html) {
  let current = html;
  // Reveal outer boundaries first, then process any nested segments exposed by them.
  for (let pass = 0; pass < 64; pass++) {
    const next = restoreNextStreamSegmentsOnce(current);
    if (next === current) return current;
    current = next;
  }
  return current;
}

export function parsePublicExplorer(html,sourceUrl,capturedAt=new Date().toISOString()){
  const u=new URL(sourceUrl);
  if(u.protocol!=='https:'||u.hostname!=='explorer.near-intents.org'||!/^\/transactions\/[A-Za-z0-9_-]{16,150}\/?$/.test(u.pathname))throw Error('Unsupported Explorer URL');
  if(typeof html!=='string'||html.length<3000||html.length>300000)throw Error('Explorer document unavailable');
  const restored=restoreNextStreamSegments(html);
  const start=restored.indexOf('<body');
  if(start<0)throw Error('Explorer page body missing');
  const end=restored.indexOf('</body>',start);
  const visible=removeHiddenSubtrees(restored.slice(start,end<0?undefined:end)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi,'')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,'')
    .replace(/<!--[\s\S]*?-->/g,''));
  if(!visible.includes('Transaction Details'))throw Error('Not a transaction details page');
  const headings=[...visible.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(m=>({title:strip(m[1]),start:m.index,end:m.index+m[0].length}));
  const names=headings.map(x=>x.title.toLowerCase());
  const h3=key => segment(visible,headings,key);
  const failedBlock=h3('Failed');
  const refundedBlock=h3('Refunded');
  const withdrawnBlock=h3('Withdrawn');
  const isFailed=!!failedBlock && /Transaction failed/i.test(strip(failedBlock));
  const isRefund=!!refundedBlock && /Transaction (?:was )?refunded/i.test(strip(refundedBlock));
  const isSuccess=!!withdrawnBlock && /Funds were successfully withdrawn/i.test(strip(withdrawnBlock));
  const total=[isFailed,isRefund,isSuccess].filter(Boolean).length;
  const active=names.includes('processing')?'PROCESSING':names.includes('pending deposit')?'PENDING_DEPOSIT':null;
  if(total>1 || (total===0&&!active))throw Error('Status cannot be uniquely verified from public page');
  const state=isFailed?'FAILED':isRefund?'REFUNDED':isSuccess?'SUCCESS':active;
  const intentHashes=refs(visible,u=>u.hostname==='pikespeak.ai' && u.pathname.startsWith('/intents/'));
  const nearHashes=refs(visible,u=>u.hostname==='nearblocks.io' && u.pathname.startsWith('/txns/'));
  const depositLabel=/Deposit\s*transaction\s*:/i.exec(visible);
  const originBlock=h3('Deposit Transaction')||h3('Deposit Transactions')||(depositLabel?visible.slice(depositLabel.index,depositLabel.index+950):'');
  const refundBlock=h3('Refund Transaction')||h3('Refund Transactions');
  const nearDepositBlock=h3('Near Deposit Transaction')||h3('Near Deposit Transactions');
  const nearSwapBlock=h3('Near Swap Transaction')||h3('Near Swap Transactions');
  const destinationBlock=h3('Destination Transaction')||h3('Withdrawal Transaction')||'';
  const nearOnly=s=>refs(s,u=>u.hostname==='nearblocks.io'&&u.pathname.startsWith('/txns/'));
  const hosts = {'etherscan.io':'ethereum','basescan.org':'base','arbiscan.io':'arbitrum',
    'optimistic.etherscan.io':'optimism','polygonscan.com':'polygon','gnosisscan.io':'gnosis',
    'mempool.space':'bitcoin','litecoinspace.org':'litecoin','solscan.io':'solana'};
  const records = s => [...s.matchAll(/href=["'](https?:[^"']+)["']/gi)].map(x=>{
    try {
      const u=new URL(x[1].replace(/&amp;/g,'&'));
      if (u.protocol !== 'https:') return null;
      const pathParts=u.pathname.split('/').filter(Boolean);
      let chain=hosts[u.hostname] || null;
      let transactionPath=pathParts.length>=2 && pathParts.at(-2)==='tx';
      if (u.hostname==='blockchair.com' && pathParts.length>=3 && pathParts[1]==='transaction' && ['litecoin','bitcoin'].includes(pathParts[0])) {
        chain=pathParts[0];
        transactionPath=true;
      }
      const hash=pathParts.at(-1);
      if (!chain || !transactionPath || !chainTransactionUrl(chain,hash)) return null;
      return {chain,hash};
    } catch {return null;}
  }).filter(Boolean);
  const oneChain = items=>{ const unique=[...new Set(items.map(x=>x.chain))]; return unique.length===1?unique[0]:null; };
  const genericHashes=s=>unique(records(s).map(x=>x.hash));
  const block=(label,next)=>{const m=visible.match(new RegExp('<h2[^>]*>'+label+'<\/h2>','i')); if(!m)return '';const i=m.index+m[0].length;const j=next?visible.indexOf(next,i):-1;return visible.slice(i,j>i?j:i+2400);};
  const from=block('From','>To</h2>'), to=block('To','Transaction Hashes');
  const asset=s=>s.match(/<img[^>]*\balt="([A-Za-z0-9._-]{2,18})"/i)?.[1]||null;
  const e={
    id:'PUBLIC-'+u.pathname.split('/').filter(Boolean).at(-1).slice(0,12),
    source_url:u.origin+u.pathname,
    captured_at:capturedAt,
    reported_status:state,
    source_asset:asset(from),
    destination_asset:asset(to),
    source_chain:oneChain(records(originBlock)),
    destination_chain:oneChain(records(destinationBlock)),
    refund_chain:oneChain(records(refundBlock)),
    origin_tx_hashes:genericHashes(originBlock),
    intent_hashes:intentHashes,
    near_deposit_tx_hashes:nearOnly(nearDepositBlock),
    near_swap_tx_hashes:nearOnly(nearSwapBlock),
    destination_tx_hashes:genericHashes(destinationBlock),
    refund_tx_hashes:genericHashes(refundBlock),
    deposit_evidence:visible.includes('Token deposit has been confirmed.')?['Public Explorer page: Deposit Completed — token deposit has been confirmed']:[],
    destination_evidence:isSuccess?['Public Explorer page: Withdrawn — funds were successfully withdrawn (reported, not independently verified)']:[],
    refund_evidence:isRefund?['Public Explorer page: Refunded — transaction refunded (reported, not independently verified)']:[],
  };
  // Any unidentified NEAR tx remains unassigned. Do not guess which leg it belongs to.
  e.unassigned_near_tx_hashes=nearHashes.filter(x=>![...e.near_deposit_tx_hashes,...e.near_swap_tx_hashes].includes(x));
  return e;
}
