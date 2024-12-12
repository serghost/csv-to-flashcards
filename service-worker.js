const CACHE_NAME = 'language-cards-v1';
const urlsToCache = [
  '/csv-to-flashcards/',
  '/csv-to-flashcards/index.html',
  '/csv-to-flashcards/Manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
