// service-worker.js

// Nombre del caché
const CACHE_NAME = 'loteria-app-cache';

// Archivos a cachear
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caché abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Interceptar solicitudes y responder desde el caché si está disponible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devolver la respuesta desde el caché o desde la red
                return response || fetch(event.request);
            })
    );
});
