"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
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

      // Register service worker after window load to avoid blocking main thread assets
      if (document.readyState === "complete") {
        handleRegister();
      } else {
        window.addEventListener("load", handleRegister);
        return () => window.removeEventListener("load", handleRegister);
      }
    }
  }, []);

  return null;
}
