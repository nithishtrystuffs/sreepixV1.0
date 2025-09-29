// Versioned cache names to manage updates
const SW_VERSION = "v1"
const STATIC_CACHE = `static-${SW_VERSION}`
const RUNTIME_CACHE = `runtime-${SW_VERSION}`

const CORE_ASSETS = [
  "/", // navigation fallback
  "/manifest.json",
  "/icon-192.jpg",
  "/icon-512.jpg",
  "/apple-touch-icon.jpg",
]

// Install: cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {}),
  )
})

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

// Fetch strategy:
// - Non-GET: bypass
// - Navigations: network-first, fallback to cache (keeps app usable offline)
// - Same-origin GET API: network-first (fresh data), fallback to cache if available
// - Same-origin static GET: stale-while-revalidate
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== "GET") return

  // Only handle same-origin requests to avoid CORS surprises
  const isSameOrigin = url.origin === self.location.origin

  // Handle navigations (HTML documents)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          // Optionally cache navigations
          const cache = await caches.open(RUNTIME_CACHE)
          cache.put(request, fresh.clone())
          return fresh
        } catch {
          const cache = await caches.open(RUNTIME_CACHE)
          const cached = await cache.match(request)
          if (cached) return cached
          // Fallback to app shell
          const shell = await caches.match("/")
          return shell || Response.error()
        }
      })(),
    )
    return
  }

  // Only same-origin beyond this point
  if (!isSameOrigin) return

  const isApi = url.pathname.startsWith("/api/")

  if (isApi) {
    // Network-first for API GETs
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          const cache = await caches.open(RUNTIME_CACHE)
          cache.put(request, fresh.clone())
          return fresh
        } catch {
          const cache = await caches.open(RUNTIME_CACHE)
          const cached = await cache.match(request)
          return (
            cached ||
            new Response(JSON.stringify({ error: "Offline" }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            })
          )
        }
      })(),
    )
    return
  }

  // Stale-while-revalidate for static same-origin GETs
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE)
      const cached = await cache.match(request)
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          cache.put(request, networkResponse.clone())
          return networkResponse
        })
        .catch(() => undefined)
      return cached || (await fetchPromise) || Response.error()
    })(),
  )
})
