const CACHE = 'nem-eu-v1';
const FILES = [
  '/',
  '/index.html',
  '/instalacao.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // só cache do teu site
  if (!url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
