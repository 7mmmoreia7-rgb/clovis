const CACHE_NAME = 'nem-eu-v1';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/instalar.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalação: Guarda os ficheiros essenciais na cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: A carregar cache de ativos');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigas e assume o controlo
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SW: A remover cache antiga:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceção de pedidos (Fetch)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. IGNORAR tudo o que possa contaminar o canvas
  if (
    url.hostname.includes('workers.dev') ||   // Cloudflare Worker
    url.pathname.startsWith('/proxy') ||      // Proxy de imagens
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.webm')
  ) {
    // Deixa ir direto à rede SEM cache
    return;
  }

  // 2. Rede primeiro, cache depois
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

