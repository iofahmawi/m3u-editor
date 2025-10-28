const CACHE_NAME = 'm3u-editor-en-v1'; // اسم كاش جديد للنسخة الإنجليزية

// المسارات الكاملة بدءًا من اسم المستودع
const urlsToCache = [
    '/m3u-editor/en/',
    '/m3u-editor/en/index.html',
    '/m3u-editor/en/manifest.json',
    '/m3u-editor/en/icon-1024.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache for English version');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
