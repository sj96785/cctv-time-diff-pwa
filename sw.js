const CACHE_NAME = 'cctv-diff-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './sw.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(res => res || fetch(req).then(networkRes => {
      return caches.open(CACHE_NAME).then(cache => {
        // Only cache GET
        if (req.method === 'GET' && (new URL(req.url)).origin === location.origin) {
          cache.put(req, networkRes.clone());
        }
        return networkRes;
      });
    }).catch(() => caches.match('./index.html')))
  );
});