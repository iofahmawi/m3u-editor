const CACHE_NAME = 'm3u-editor-v1';

// تم تحديث اسم الأيقونة هنا
const urlsToCache = [
    '/',
    'index.html',
    'icon-1024.png' 
    // إذا كان لديك ملفات CSS أو JS أخرى، أضف أسماءها هنا
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache for M3U Editor');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
