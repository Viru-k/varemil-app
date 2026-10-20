// Service worker de "autodestruccion": si queda uno viejo registrado en algun
// movil, cuando el navegador recoja esta version se desregistra solo, borra las
// caches y recarga las pestanas. Asi eliminamos service workers problematicos.
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{
      if (self.caches && caches.keys) {
        var ks = await caches.keys();
        await Promise.all(ks.map(function(k){ return caches.delete(k); }));
      }
      await self.registration.unregister();
      var cs = await self.clients.matchAll();
      cs.forEach(function(c){ try{ c.navigate(c.url); }catch(_){} });
    }catch(_){}
  })());
});
