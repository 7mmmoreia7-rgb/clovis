const CACHE_NAME = 'nem-eu-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/instalacao.html',
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

  // 1. IGNORAR WORKER: Se for para o teu worker do Cloudflare, deixa passar direto (Rede)
  // Isso evita que o Service Worker "suje" a resposta com cache e bloqueie o Canvas.
  if (url.hostname.includes('workers.dev')) {
    return;
  }

  // 2. ESTRATÉGIA: Tenta Rede primeiro, se falhar vai à Cache
  // Isso garante que a versão mais nova da app seja sempre carregada se houver internet.
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
