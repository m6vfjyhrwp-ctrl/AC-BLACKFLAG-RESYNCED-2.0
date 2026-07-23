const CACHE_NAME="black-flag-resynced-v4-animus-test-1";
const APP_SHELL=[
 "./","./index.html","./styles.css","./touch-map.css","./animus.css",
 "./version.js","./database.js","./app.js","./planner.js","./interface.js",
 "./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith(caches.match(event.request).then(cached=>{
   const network=fetch(event.request).then(response=>{
     if(response&&response.ok)caches.open(CACHE_NAME).then(cache=>cache.put(event.request,response.clone()));
     return response;
   }).catch(()=>cached||caches.match("./index.html"));
   return cached||network;
 }));
});
