const CACHE_NAME = 'language-cards-v1';
const urlsToCache = [
  '/csv-to-flashcards/',
  '/csv-to-flashcards/index.html',
  '/csv-to-flashcards/manifest.json',
  '/csv-to-flashcards/icons/icon-192x192.png',
  '/csv-to-flashcards/icons/icon-512x512.png',
  '/csv-to-flashcards/assets/index-CuUdiMgF.css',
  '/csv-to-flashcards/assets/index-Cvg-CsW9.js',
  '/csv-to-flashcards/screenshots/screenshot-desktop.png',
  '/csv-to-flashcards/screenshots/screenshot-mobile.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
