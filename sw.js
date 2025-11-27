// sw.js - M3U Editor (Dynamic Version)

const CACHE_NAME = 'm3u-editor-dynamic-v3';

// نخزن الملفات المحلية الأساسية فقط لضمان التثبيت السريع والناجح
const urlsToCache = [
  './',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // تفعيل التحديث فوراً
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching critical files');
        return cache.addAll(urlsToCache);
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
            return caches.delete(cacheName); // تنظيف الكاش القديم
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. إذا الملف موجود في الكاش (سواء كان html أو مكتبة خارجية)، ارجعه فوراً
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. إذا لم يكن موجوداً، اطلبه من الشبكة
        return fetch(event.request).then(networkResponse => {
          // التحقق من صحة الاستجابة
          // نسمح بـ 'cors' و 'basic' لأنك تستخدم مكتبات خارجية
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }

          // 3. تخزين النسخة الجديدة في الكاش للمستقبل
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            // نتأكد من عدم تخزين طلبات غير مدعومة (مثل بث الفيديو المباشر الطويل جداً أو POST)
            // لكن نخزن ملفات JS/CSS الخارجية
            if (event.request.method === 'GET' && !event.request.url.startsWith('chrome-extension')) {
                cache.put(event.request, responseToCache);
            }
          });

          return networkResponse;
        });
      })
  );
});