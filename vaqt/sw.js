/* Vaqt service worker: the app works offline after the first visit. Bump CACHE when files change. */
var CACHE = 'vaqt-2026-11-26';
var SHELL = ['./', 'index.html', 'vaqt.css', 'vaqt.js', 'icon.svg', 'icon-192.png', 'icon-512.png', 'manifest.webmanifest',
  '../assets/css/core.css', '../assets/js/core.js', '../assets/js/i18n.js', '../assets/js/garden.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('vaqt-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); return r; }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match('index.html'); }); }));
    return;
  }
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(function (m) {
      var net = fetch(req).then(function (r) { if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); } return r; }).catch(function () { return m; });
      return m || net;
    }));
  }
});
