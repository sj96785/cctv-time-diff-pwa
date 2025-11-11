// v3 - network-first for HTML to ensure updates; cache-first for static assets
const CACHE_VERSION = 'v3-2025-11-11';
const CACHE_NAME = 'cctv-diff-cache-' + CACHE_VERSION;

// Add a version query to assets to bust old cached entries
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
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k === CACHE_NAME ? null : caches.delete(k)))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET and same-origin
  if (req.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // 1) For navigations/HTML: network-first to get latest, fallback to cache
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        // Put a versioned key for index.html
        const key = './index.html' + VQ;
        caches.open(CACHE_NAME).then(c => c.put(key, copy));
        return res;
      }).catch(() => {
        // Fallback to versioned cached index
        return caches.match('./index.html' + VQ);
      })
    );
    return;
  }

  // 2) For other same-origin GET requests: cache-first, then network
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(networkRes => {
        const resCopy = networkRes.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, resCopy));
        return networkRes;
      });
    }).catch(() => {
      // Final fallback: try versioned index
      return caches.match('./index.html' + VQ);
    })
  );
});