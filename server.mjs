import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import incidentHandler from './api/incident.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const mounts = { '/public/': path.join(root,'public'), '/src/': path.join(root,'src'), '/fixtures/': path.join(root,'fixtures') };
const mime = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2' };

const server = http.createServer((req,res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/incident') {
    const apiRes = {
      setHeader(key,value){ res.setHeader(key,value); return this; },
      status(code){ res.statusCode=code; return this; },
      json(value){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(value));return this;}
    };
    return Promise.resolve(incidentHandler({method:req.method, query:{reference:url.searchParams.get('reference')}},apiRes))
      .catch(() => { if(!res.headersSent) apiRes.status(500).json({error:'The public evidence reader is temporarily unavailable.'}); });
  }
  if (url.pathname === '/') return send(path.join(root,'public','index.html'),res);
  for (const [prefix,dir] of Object.entries(mounts)) {
    if (url.pathname.startsWith(prefix)) {
      const rel = url.pathname.slice(prefix.length);
      const file = path.normalize(path.join(dir,rel));
      if (!file.startsWith(dir + path.sep)) return res.writeHead(403).end('Forbidden');
      return send(file,res);
    }
  }
  res.writeHead(404).end('Not found');
});

function send(file,res) {
  fs.readFile(file,(err,data) => {
    if (err) return res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
    res.writeHead(200,{ 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-store' });
    res.end(data);
  });
}
server.listen(port,'127.0.0.1',() => console.log(`OSIALI incident desk: http://127.0.0.1:${port}`));
