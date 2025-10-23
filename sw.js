// اسم الكاش الخاص بتطبيقك
const CACHE_NAME = 'm3u-editor-v1';

// قائمة الملفات التي سيتم تخزينها للعمل بدون انترنت
const urlsToCache = [
    '/',
    'index.html',
    'icon-1440.png'
    // إذا كان لديك ملفات CSS أو JS أخرى، أضف أسماءها هنا
    // مثال: 'style.css', 'app.js'
];

// عند تثبيت الـ Service Worker، قم بتخزين الملفات
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache for M3U Editor');
                return cache.addAll(urlsToCache);
            })
    );
});

// عند طلب أي ملف، ابحث عنه في الكاش أولاً
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وُجد في الكاش، قم بإرجاعه مباشرة
                if (response) {
                    return response;
                }
                // إذا لم يوجد، اطلبه من الشبكة
                return fetch(event.request);
            })
    );

});
