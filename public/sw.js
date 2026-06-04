const CACHE = 'level-up-v1';
const PRECACHE_URLS = [
  '/', '/dashboard', '/tasks', '/quests', '/achievements',
  '/analytics', '/leaderboard', '/profile', '/login', '/register'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return res;
      }))
    );
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    fetch(request).then((res) => {
      const clone = res.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
      return res;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match('/dashboard')))
  );
});
