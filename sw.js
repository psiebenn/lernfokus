// Netzwerk zuerst, damit Updates sofort ankommen; Cache nur als Offline-Fallback.
const CACHE='lernfokus-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith((same?fetch(e.request.url,{cache:'no-cache'}):fetch(e.request)).then(r=>{
    if(r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
});
