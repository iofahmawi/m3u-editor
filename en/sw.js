const CACHE_NAME = 'm3u-editor-en-cache-v1';
const urlsToCache = [
  '/m3u-editor/en/',
  '/m3u-editor/en/index.html',
  '/m3u-editor/en/manifest.json',
  '/m3u-editor/en/icon-1024.png',
  'https://cdn.plyr.io/3.7.8/plyr.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js',
  'https://cdn.plyr.io/3.7.8/plyr.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.error('Failed to cache one or more EN resources during install:', err);
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});