const PRECACHE_URIS = ['index.css', 'index.js', 'assets/robo-sleep.png', 'assets/offline.html']
const PRECACHE = 'todown-precache-v1'
const RUNTIME = 'todown-runtime'

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(PRECACHE)
			.then(cache => cache.addAll(PRECACHE_URIS))
			.then(() => self.skipWaiting())
	)
})

// clean up old caches
// https://googlechrome.github.io/samples/service-worker/basic/
self.addEventListener('activate', event => {
	const currentCaches = [PRECACHE, RUNTIME]
	event.waitUntil(
		caches.keys()
			.then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
			.then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))))
			.then(() => self.clients.claim())
	)
})

self.addEventListener('fetch', event => {
	const path = event.request.url.replace(`${self.location.origin}/`, '')
	if (event.request.url.startsWith(self.location.origin)) {
		event.respondWith(
			fetch(event.request)
				.then(response => {
					// Network is available, put response in cache if it's not a precached asset
					if (PRECACHE_URIS.includes(path)) {
						return response
					} else {
						return caches.open(RUNTIME)
							.then(cache => cache.put(event.request, response.clone()).then(() => response))
					}
				})
				.catch(() => caches.match(event.request))
				.then(response => {
					if (!response) {
						return caches.match('assets/offline.html')
					}
					return response
				})
		)
	}
})
