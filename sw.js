// Service worker de Varemil: permite instalar la app y usarla sin conexion.
// Estrategia "red primero": siempre intenta la version nueva; si no hay internet,
// tira de la copia guardada.
var CACHE = 'varemil-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(function (res) {
      try {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      } catch (_) {}
      return res;
    }).catch(function () { return caches.match(req); })
  );
});
