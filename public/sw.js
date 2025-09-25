// Minimal Service Worker (no-op)
// This file is served statically from /sw.js to avoid 404 and build warnings.
// Add your caching logic here if needed.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', () => {
  // no-op: passthrough network requests
});
