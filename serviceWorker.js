const CACHE_NAME = 'v1';
/**
 * An array of local resources that we want to cache.
 * @const {Array<string>} cacheFiles - Files to be cached for offline use.
 */
const cacheFiles = [
    'fallback.html',
    'fallback-js.js',
];

/**
 * Handles the 'install' event for the service worker.
 * Caches necessary files specified in `cacheFiles`.
 * 
 * @param {Event} event - The install event.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(cacheFiles);
        })
    );
});

/**
 * Handles the 'activate' event for the service worker.
 * Clears old caches that do not match the current cache name.
 * 
 * @param {Event} event - The activate event.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

/**
 * Handles 'fetch' events by trying to respond with cached files.
 * If a network request fails, falls back to a cached offline page.
 * 
 * @param {Event} event - The fetch event.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                return caches.match('fallback.html');
            });
        })
    );
});
