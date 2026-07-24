/* eigen.forum THESEUS shell — service worker.
   Caches the SHELL ONLY: this page, its manifest, its icons. It never touches
   api.github.com and never caches ledger, snapshot, or token bytes — those
   transit authenticated reads and live in memory/localStorage, nowhere in the
   cache. Same discipline as the book shell. */
'use strict';
var VERSION = 'theseus-shell-v2'; /* bumped for the svg-artifact renderer (structured +
  fenced-```svg write path) -- cache-first sw.js needs a manual VERSION bump on every
  dome-shell change until it moves to network-first / stale-while-revalidate (see report) */
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  /* The API and anything non-GET or cross-origin goes straight to the network,
     unhandled and uncached — the ledger and the token never enter the cache. */
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      });
    })
  );
});
