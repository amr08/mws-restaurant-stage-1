const STATIC_CACHE = 'mws-static-v3';
const cacheUrls =[
  '/',
  '/index.html',
  '/restaurant.html',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',
  '/img/',
  '/css/styles.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => (
      cache.addAll(cacheUrls)
    ))
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => (
      Promise.all(
        cacheNames.filter(cacheName => (
          cacheName.startsWith("mws-") &&
           cacheName !== STATIC_CACHE
        )).map(cacheName => (
          caches.delete(cacheName)
        ))
      )
    ))
  );
});


self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    // if (requestUrl.pathname === '/') {
    //   event.respondWith(caches.match('/skeleton'));
    //   return;
    // }
    if (requestUrl.pathname.startsWith('/restaurant')) {
      event.respondWith(serveRestaurantHtml(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(response => (
      response || fetch(event.request)
    ))
  );
});


function serveRestaurantHtml(request) {
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  return caches.open(cacheUrls).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

self.addEventListener('message', event => {
  if (event.data.update) {
    self.skipWaiting();
  }
});

