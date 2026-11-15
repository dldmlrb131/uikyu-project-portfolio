const CACHE = "cookloop-pages-e30bc32d4e272952";
const PRECACHE = ["/uikyu-project-portfolio/cookloop/","/uikyu-project-portfolio/cookloop/index.html","/uikyu-project-portfolio/cookloop/cookloop.webmanifest","/uikyu-project-portfolio/cookloop/cookloop-icons/icon-192.png","/uikyu-project-portfolio/cookloop/cookloop-icons/icon-512.png","/uikyu-project-portfolio/cookloop/_next/static/S6PYiCWhSiV5dBs5a60ip/_buildManifest.js","/uikyu-project-portfolio/cookloop/_next/static/S6PYiCWhSiV5dBs5a60ip/_clientMiddlewareManifest.js","/uikyu-project-portfolio/cookloop/_next/static/S6PYiCWhSiV5dBs5a60ip/_ssgManifest.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/0cz1d0mv5g_q7.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/1hgu46cy34mib.css","/uikyu-project-portfolio/cookloop/_next/static/chunks/2hddzataa-2-j.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/2hdkj9-m4rx9t.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/3-48-xnc5ld8i.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/3qlmvkuz9qwrm.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/3s7i4mbmdd1-a.js","/uikyu-project-portfolio/cookloop/_next/static/chunks/turbopack-2u1d16houkiyo.js"];
/* global CACHE, PRECACHE */
const assets = new Set(PRECACHE);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(PRECACHE.map(path => new Request(path, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key =>
      key !== CACHE && (key.startsWith('cookloop-pages-') || key === 'cookloop-mvp-v1'),
    ).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !assets.has(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE);
      return await cache.match(url.pathname) ?? Response.error();
    }));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => await cache.match(url.pathname) ?? fetch(request)));
});
