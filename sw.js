// Service Worker - 高考语文复习计划
const CACHE_NAME = 'yuwen-review-v1';

const PRECACHE_URLS = [
  '/index.html',
  '/manifest.json',
  '/css/reset.css',
  '/css/variables.css',
  '/css/components.css',
  '/css/style.css',
  '/js/utils.js',
  '/js/store.js',
  '/js/router.js',
  '/js/app.js',
  '/js/data/modules.js',
  '/js/data/knowledge-data.js',
  '/js/data/q01-info-reading.js',
  '/js/data/q02-literary-reading.js',
  '/js/data/q03-classical-chinese.js',
  '/js/data/q04-poetry.js',
  '/js/data/q05-recitation.js',
  '/js/data/q06-idiom.js',
  '/js/data/q07-sick-sentence.js',
  '/js/data/q08-coherence.js',
  '/js/data/q09-rhetoric.js',
  '/js/data/q10-writing.js',
  '/js/views/home.js',
  '/js/views/module-list.js',
  '/js/views/knowledge.js',
  '/js/views/practice.js',
  '/js/views/mock-exam.js',
  '/js/views/mistake-book.js',
  '/js/views/analytics.js',
  '/js/views/record.js'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache first, fallback to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Handle navigation requests (HTML) - network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Handle static assets - cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
