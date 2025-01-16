const CACHE_NAME = 'flashcards-v1';
const BASE_PATH = '/csv-to-flashcards';

const APP_FILES = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/assets/index.css`,
  `${BASE_PATH}/assets/index.js`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        Promise.all(
          APP_FILES.map(url =>
            cache.add(url).catch(error => {
              console.error(`Failed to cache: ${url}`, error);
              return Promise.resolve();
            })
          )
        )
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            return caches.match(`${BASE_PATH}/index.html`);
          });
      })
  );
});
