// اسم الكاش الخاص بالنسخة الإنجليزية
const CACHE_NAME = 'm3u-editor-en-v1';

// قائمة الملفات التي سيتم تخزينها للعمل بدون انترنت (بالمسارات الصحيحة)
const urlsToCache = [
    '/en/',
    '/en/index.html',
    '/en/icon-1024.png'
    // إذا كان لديك ملفات CSS أو JS أخرى داخل مجلد en، أضفها هنا
    // مثال: '/en/style.css', '/en/app.js'
];

// عند تثبيت الـ Service Worker، قم بتخزين الملفات الجديدة
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache for M3U Editor (English Version)');
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

// (اختياري ولكن موصى به) حذف الكاش القديم
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // إذا كان اسم الكاش ليس هو الاسم الجديد، قم بحذفه
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});