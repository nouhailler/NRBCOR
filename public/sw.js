// NRBCOR Service Worker - Cache-First App Shell & Offline Sentinel
const CACHE_NAME = 'nrbcor-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/fonts/material-symbols-outlined.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non GET ou externes aux APIs d'alerte
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Pour les appels d'APIs publiques (Géorisques / geo.api.gouv.fr) : Network-First avec fallback
  if (url.hostname.includes('georisques.gouv.fr') || url.hostname.includes('geo.api.gouv.fr')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || new Response(JSON.stringify({ data: [], error: 'Mode hors-ligne' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Pour les assets statiques & bundle local : Cache-First avec Network Fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // En arrière plan, rafraîchir le cache si connecté
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Si ressource HTML demandée et hors ligne
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Hors ligne', { status: 503, statusText: 'Service Unavailable' });
        });
    })
  );
});
