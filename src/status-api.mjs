import {validTransactionHash} from './intake.mjs';
export function normalizeStatus(payload,address,memo){
 const statuses=['PENDING_DEPOSIT','KNOWN_DEPOSIT_TX','INCOMPLETE_DEPOSIT','PROCESSING','SUCCESS','REFUNDED','FAILED'];
 if(!payload||!statuses.includes(payload.status))throw Error('Unrecognized status response');
 const q=payload.quoteResponse?.quote||{};
 if(typeof q.depositAddress!=='string'||(/^0x[0-9a-fA-F]{40}$/.test(address)?q.depositAddress.toLowerCase()!==address.toLowerCase():q.depositAddress!==address))throw Error('Status does not match the requested deposit address');
 if(memo && String(q.depositMemo||'')!==memo)throw Error('Status memo does not match');
 const details=payload.swapDetails||{};
 const hashes=items=>(Array.isArray(items)?items:[]).map(x=>x?.hash).filter(validTransactionHash);
 return {id:payload.correlationId||address,deposit_address:address,deposit_memo:memo||null,correlation_id:payload.correlationId||null,origin_asset_id:payload.quoteResponse?.quoteRequest?.originAsset||null,destination_asset_id:payload.quoteResponse?.quoteRequest?.destinationAsset||null,reported_status:payload.status,captured_at:new Date().toISOString(),source_updated_at:payload.updatedAt||null,source_url:'https://1click.chaindefuser.com/v0/status?depositAddress='+encodeURIComponent(address)+(memo?'&depositMemo='+encodeURIComponent(memo):''),origin_tx_hashes:hashes(details.originChainTxHashes),destination_tx_hashes:hashes(details.destinationChainTxHashes),intent_hashes:(details.intentHashes||[]).filter(validTransactionHash),unassigned_near_tx_hashes:(details.nearTxHashes||[]).filter(validTransactionHash),deposit_evidence:details.depositedAmount&&Number(details.depositedAmount)>0?['1Click API reports deposited amount '+details.depositedAmount]:[],destination_evidence:payload.status==='SUCCESS'?['1Click API reports delivery; not independently verified on chain']:[],refund_evidence:payload.status==='REFUNDED'?['1Click API reports refund; not independently verified on chain']:[],refund_reason:details.refundReason||null};
}
export async function readStatus(address,memo){
 const url=new URL('https://1click.chaindefuser.com/v0/status');url.searchParams.set('depositAddress',address);
 if(memo)url.searchParams.set('depositMemo',memo);
 const headers={Accept:'application/json'};if(process.env.ONECLICK_API_KEY)headers.Authorization='Bearer '+process.env.ONECLICK_API_KEY;
 const response=await fetch(url,{headers,redirect:'error',signal:AbortSignal.timeout(6000)});
 if(!response.ok)throw Error('Status provider returned '+response.status);
 const text=await response.text();if(text.length>250000)throw Error('Status response too large');
 const evidence=normalizeStatus(JSON.parse(text),address,memo);
 try {const tokens=await fetch('https://1click.chaindefuser.com/v0/tokens',{signal:AbortSignal.timeout(3000)}).then(r=>r.json());if(Array.isArray(tokens)){const origin=tokens.find(t=>t.assetId===evidence.origin_asset_id);const dest=tokens.find(t=>t.assetId===evidence.destination_asset_id);evidence.source_asset=origin?.symbol||null;evidence.destination_asset=dest?.symbol||null;evidence.source_chain=origin?.blockchain||null;evidence.destination_chain=dest?.blockchain||null;}}catch{}
 return evidence;
}
