const CACHE = 'level-up-v5';
const STATIC_CACHE = 'level-up-static-v5';
const PAGE_CACHE = 'level-up-pages-v5';
const API_CACHE = 'level-up-api-v5';

const PRECACHE_PUBLIC = [
  '/', '/login', '/register', '/download',
  '/offline.html', '/manifest.json', '/level-up.apk',
];

const KEEP_CACHES = [CACHE, STATIC_CACHE, PAGE_CACHE, API_CACHE];

const ASSET_PATTERNS = [/\/icons\//, /\/_next\/static\//, /\/favicon\.svg$/];

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(PRECACHE_PUBLIC).catch(() => {})
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !KEEP_CACHES.includes(k)).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (ASSET_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (url.pathname.startsWith('/api/') && request.method === 'GET') {
    if (url.pathname === '/api/auth/session') {
      event.respondWith(networkWithSessionCache(request));
      return;
    }
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, PAGE_CACHE));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return caches.match('/offline.html');
  }
}

async function networkWithSessionCache(request) {
  try {
    const res = await fetch(request);
    // Only cache session responses that contain a user (authenticated)
    const clone = res.clone();
    const body = await clone.json();
    if (body?.user) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      // Only serve cached session if it has a user
      const body = await cached.clone().json();
      if (body?.user) return cached;
    }
    return new Response('{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName || CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return caches.match('/offline.html');
    return new Response('Offline', { status: 503 });
  }
}
