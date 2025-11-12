
// v8-2025-11-12 - network-first HTML + cache busting
const CACHE_VERSION = 'v8-2025-11-12';
const CACHE_NAME = 'cctv-diff-cache-' + CACHE_VERSION;
const VQ = '?v=' + CACHE_VERSION;
const ASSETS = [
  './index.html' + VQ,
  './manifest.webmanifest' + VQ,
  './icons/icon-192.png' + VQ,
  './icons/icon-512.png' + VQ,
  './sw.js' + VQ
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE_NAME).then(c => c.put('./index.html' + VQ, res.clone()));
        return res;
      }).catch(() => caches.match('./index.html' + VQ))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => { caches.open(CACHE_NAME).then(c => c.put(req, r.clone())); return r; }))
      .catch(() => caches.match('./index.html' + VQ))
  );
});
