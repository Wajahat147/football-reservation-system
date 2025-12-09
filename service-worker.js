// Service Worker for PWA - Offline Support & Caching
const CACHE_NAME = 'frs-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/grounds.html',
    '/booking.html',
    '/owner-submit.html',
    '/admin.html',
    '/styles.css',
    '/booking-styles.css',
    '/app.js',
    '/grounds.js',
    '/booking.js',
    '/owner-submit.js',
    '/admin.js',
    '/otp-service.js',
    '/supabase-config.js',
    '/init-supabase.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch from cache first, then network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Push Notification Support
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New booking update!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Football Reservation', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
