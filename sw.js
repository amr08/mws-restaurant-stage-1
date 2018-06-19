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


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => (
      response || fetch(event.request)
    ))
  );
});


// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys()
//       .then(cacheNames => (
//         Promise.all(cacheNames.filter(cacheName => {
//             return cacheName.startsWith('mws-') && !cacheUrls.includes(cacheName);
//         }).map(cacheName => (
//             caches['delete'](cacheName)
//         )))
//       ))
//   )
// });