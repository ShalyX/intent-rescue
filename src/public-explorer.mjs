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
export function parsePublicExplorer(html,sourceUrl,capturedAt=new Date().toISOString()){
  const u=new URL(sourceUrl);
  if(u.protocol!=='https:'||u.hostname!=='explorer.near-intents.org'||!/^\/transactions\/[A-Za-z0-9_-]{16,150}\/?$/.test(u.pathname))throw Error('Unsupported Explorer URL');
  if(typeof html!=='string'||html.length<3000||html.length>300000)throw Error('Explorer document unavailable');
  const start=html.indexOf('<body');
  if(start<0)throw Error('Explorer page body missing');
  const end=html.indexOf('</body>',start);
  const visible=html.slice(start,end<0?undefined:end)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi,'')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,'')
    .replace(/<!--[\s\S]*?-->/g,'');
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
