// Service Worker for Lecture cartoon 

const CACHE_NAME = 'lecture-cartoon-v1';

// Enhanced offline support
const OFFLINE_PAGE = 'offline.html';

// Add offline page to cache
const urlsToCache = [
    './',
    'index.html',
    'css/style.css',
    'js/script.js',
    OFFLINE_PAGE
];

// Network-first strategy for HTML pages
const networkFirst = async (request) => {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return offline page if available
        if (request.destination === 'document') {
            return caches.match(OFFLINE_PAGE);
        }
        throw error;
    }
};

// Cache-first strategy for assets
const cacheFirst = async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        throw error;
    }
};

// Install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    // Activate immediately
    self.skipWaiting();
});


// Use appropriate caching strategy based on request type
self.addEventListener('fetch', event => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Use network-first for HTML pages
    if (request.destination === 'document' ||
        request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request));
    }
    // Use cache-first for assets (CSS, JS, images)
    else {
        event.respondWith(cacheFirst(request));
    }
});

// Activate service worker and remove old caches
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
    // Take control immediately
    return self.clients.claim();
});