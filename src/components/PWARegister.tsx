"use client";

import { useEffect } from "react";

/**
 * PWARegister
 *
 * Manages Service Worker lifecycle for offline capabilities and caching.
 *
 * - Production: Registers /sw.js after window load for offline support and asset caching.
 * - Development: STRICTLY DISABLED. Automatically unregisters any existing service workers
 *   and clears CacheStorage on localhost to prevent stale/outdated Next.js chunks and Fast Refresh conflicts.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.endsWith(".local");

    const isDevelopment =
      process.env.NODE_ENV !== "production" || isLocalhost;

    if (isDevelopment) {
      // In development: unregister all service workers and clear cache storage
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log(
                "[PWA Dev] Unregistered development service worker:",
                registration.scope,
              );
            }
          });
        }
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key).then(() => {
              console.log("[PWA Dev] Cleared stale CacheStorage:", key);
            });
          }
        });
      }

      return;
    }

    // In production: register service worker for offline caching
    const handleRegister = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log(
          "[PWA] Service Worker registered successfully at scope:",
          registration.scope,
        );
      } catch (error) {
        console.error("[PWA] Service Worker registration failed:", error);
      }
    };

    if (document.readyState === "complete") {
      handleRegister();
    } else {
      window.addEventListener("load", handleRegister);
      return () => window.removeEventListener("load", handleRegister);
    }
  }, []);

  return null;
}

export default PWARegister;
