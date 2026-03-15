// Service Worker for VIP Command Center
const CACHE_NAME = 'vip-command-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Simple fetch handler to satisfy PWA criteria
self.addEventListener('fetch', (event) => {
  // Pass-through
  event.respondWith(fetch(event.request));
});
