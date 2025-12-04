// --- FORCE RESET VERSION ---
// Changing this name forces the browser to treat this as a new app
const CACHE_NAME = 'savings-tracker-v4-force-reset';

// Only cache local files to avoid CORS issues with external CDNs
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 1. INSTALL: Cache core local files immediately
self.addEventListener('install', event => {
  // Force this new service worker to become active immediately
  // bypassing the "waiting" state
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache: ' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ACTIVATE: Aggressively delete OLD caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name doesn't match v4-force-reset, DELETE IT.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// 3. FETCH: Network First strategy
// Try to get the live version from the internet. 
// If offline, fall back to the cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
