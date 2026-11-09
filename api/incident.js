import { parsePublicExplorer } from '../src/public-explorer.mjs';

// Fixed-host, read-only public snapshot lookup. Not the authenticated Explorer API.
function publicReference(value){
  if(typeof value!=='string'||value.length>350)return null;
  let token=value.trim();
  if(/^https?:\/\//i.test(token)){
    const u=new URL(token);
    if(u.protocol!=='https:'||u.hostname!=='explorer.near-intents.org')return null;
    const match=u.pathname.match(/^\/transactions\/([A-Za-z0-9_-]{16,150})\/?$/);
    if(!match)return null;
    token=match[1];
  }
  return /^[A-Za-z0-9_-]{16,150}$/.test(token)?'https://explorer.near-intents.org/transactions/'+token:null;
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET')return res.status(405).json({error:'GET required'});
  let url=null;
  try {url=publicReference(req.query?.reference)} catch {}
  if(!url)return res.status(400).json({error:'Provide a NEAR Intents Explorer transaction URL or supported record identifier.'});
  try {
    const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(9000),
      headers:{Accept:'text/html','User-Agent':'OSIALI-public-evidence-reader/1.0'}});
    if(response.status===404)return res.status(404).json({error:'No public Explorer record at that identifier. Try the manual evidence input.'});
    if(!response.ok)return res.status(502).json({error:'Public Explorer did not return a usable record. Use the manual evidence input.'});
    const size=Number(response.headers.get('content-length')||0);
    if(size>350000)return res.status(502).json({error:'Public evidence document exceeded the safe reader size.'});
    if(!(response.headers.get('content-type')||'').includes('text/html'))
      return res.status(502).json({error:'Explorer did not return an HTML transaction page.'});
    const html=await response.text();
    if(html.length>350000)throw Error('Oversized public page');
    const evidence=parsePublicExplorer(html,url,new Date().toISOString());
    return res.status(200).json({kind:'public_explorer_snapshot',evidence,
      notice:'Read-only source-attributed Explorer page snapshot. NOT independently verified on-chain, not an authenticated partner API status, and not a refund guarantee.'});
  } catch {
    return res.status(422).json({error:'Could not safely reconstruct this public Explorer page. No diagnosis was invented. Try the evidence JSON fallback.'});
  }
}
