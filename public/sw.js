const CACHE_VERSION = "v3";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/projects",
  "/tech-stack",
  "/certifications",
  "/offline.html",
  "/profile/ezgif-frame-001.png",
  "/icon/apple-touch-icon.png",
  "/icon/favicon-96x96.png",
  "/icon/favicon.ico",
  "/icon/favicon.svg",
  "/icon/site.webmanifest",
  "/icon/web-app-manifest-192x192.png",
  "/icon/web-app-manifest-512x512.png",
  "/certificates/BuildWithAIZampen.jpg",
  "/certificates/DICT-NotebookLM.png",
  "/certificates/GoogleIOExtended.jpg",
  "/certificates/BuildWithAI_2026.png",
];

// Install Event - Pre-cache the App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Pre-caching App Shell");
      return cache.addAll(APP_SHELL);
    }),
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log("[SW] Deleting stale cache:", name);
            return caches.delete(name);
          }),
      );
    }),
  );
  // Take control immediately
  self.clients.claim();
});

// Fetch Event - Handle Caching Strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle standard GET requests on the same origin
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // Exclude API requests (like /api/chat) from cache first strategies
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkOnly(request));
    return;
  }

  // Exclude Next.js RSC (React Server Component) and prefetch data requests from cache
  const isRSCRequest =
    url.searchParams.has("_rsc") ||
    request.headers.has("RSC") ||
    request.headers.has("Next-Router-State-Tree") ||
    request.headers.has("Next-Router-Prefetch") ||
    request.headers.get("Purpose") === "prefetch";

  if (isRSCRequest) {
    event.respondWith(networkOnly(request));
    return;
  }

  // Strategy 1: Network-First for main page HTML documents (fresh, falls back to cache/offline page)
  if (request.headers.get("Accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategy 2: Cache-First for static assets (CSS, JS, Fonts, Images)
  if (
    url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|gif|woff|woff2|ico)$/) ||
    url.pathname.startsWith("/_next/")
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
});

// ─── Caching Strategy Implementations ────────────────────────────────────────

async function networkOnly(request) {
  return fetch(request);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    // Cache the fresh HTML page dynamically
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    console.log("[SW] Network failed, looking in cache:", request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Fall back to offline page if completely disconnected
    return caches.match("/offline.html");
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    // If fetching static asset failed offline, return offline response
    return new Response("Offline asset unavailable", { status: 503 });
  }
}
