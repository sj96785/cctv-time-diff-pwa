
const CACHE_VERSION = 'v8-1762907551';
const CACHE_NAME = 'cctv-diff-cache-' + CACHE_VERSION;
const VQ = '?v=' + CACHE_VERSION;
const ASSETS = [
  './index.html' + VQ,
  './manifest.webmanifest' + VQ,
  './icons/icon-180.png' + VQ,
  './icons/icon-192.png' + VQ,
  './icons/icon-512.png' + VQ,
  './sw.js' + VQ
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method!=='GET' || url.origin!==location.origin) return;
  if (req.mode==='navigate' || (req.headers.get('accept')||'').includes('text/html')) {
    e.respondWith(fetch(req).then(r=>{ caches.open(CACHE_NAME).then(c=>c.put('./index.html'+VQ, r.clone())); return r; }).catch(()=>caches.match('./index.html'+VQ)));
    return;
  }
  e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>{ caches.open(CACHE_NAME).then(cc=>cc.put(req,r.clone())); return r; })).catch(()=>caches.match('./index.html'+VQ)));
});
