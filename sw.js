const CACHE_NAME = "aprender-ia-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=3",
  "./app.js?v=3",
  "./manifest.webmanifest?v=3",
  "./data/week-1.json?v=3",
  "./assets/icon.svg",
  "./assets/week-1/005-machine-learning.webp",
  "./assets/week-1/006-deep-learning.webp",
  "./assets/week-1/007-ia-generativa.webp",
  "./assets/week-1/008-predictiva-generativa.webp",
  "./assets/week-1/009-componentes.webp",
  "./assets/week-1/010-modelos-abiertos-cerrados.webp",
  "./assets/week-1/011-multimodalidad.webp",
  "./assets/week-1/012-cuando-usar-ia.webp",
  "./assets/week-1/013-riesgos.webp",
  "./assets/week-1/practica-distribuidora.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      })
  );
});
