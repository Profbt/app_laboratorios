const CACHE_NAME = 'portal-vicente-rijo-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/images/logos/logo.png',       
  '/assets/images/logos/paralax.png',    
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png'
];

// ... (restante do service worker permanece igual) ...

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Ignora requisições que não sejam GET
  if (event.request.method !== 'GET') return;
  
  // Estratégia: Cache Falling Back to Network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Retorna resposta em cache se existir
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Caso contrário, busca na rede
        return fetch(event.request)
          .then(response => {
            // Se a resposta é válida, adiciona ao cache
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta para adicionar ao cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Se offline e a requisição é HTML, retorna página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_PAGE);
            }
          });
      })
  );
});