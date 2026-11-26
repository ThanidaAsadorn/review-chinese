const PREFIX='review-chinese-'+self.registration.scope+'-';
const CACHE=PREFIX+'v2.1-r1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(new URL(u,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;
 const url=new URL(e.request.url);
 if(url.pathname.endsWith('/release.json')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}
 if(e.request.mode==='navigate'){e.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(e.request,{cache:'no-store'});if(r.ok){try{await c.put('./index.html',r.clone());}catch(_){}return r;}return await c.match('./index.html')||r;}catch(err){return await c.match('./index.html')||Response.error();}})());return;}
 e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request);return hit||fetch(e.request);}));
});