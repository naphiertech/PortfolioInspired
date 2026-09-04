"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme, event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const activeTransitionRef = React.useRef(0);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("naphier_theme") as Theme | null;
    if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  // Update DOM classes and resolve theme on initial mount and system changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let resolved: "light" | "dark";

      if (theme === "system") {
        resolved = mediaQuery.matches ? "dark" : "light";
      } else {
        resolved = theme;
      }

      setResolvedTheme(resolved);

      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      if (resolved === "dark" && !isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else if (resolved === "light" && isDark) {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme, event?: React.MouseEvent) => {
    const isAppearanceTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const targetResolved: "light" | "dark" =
      newTheme === "system"
        ? mediaQuery.matches
          ? "dark"
          : "light"
        : newTheme;

    if (newTheme === theme && targetResolved === resolvedTheme) {
      return;
    }

    const applyThemeUpdate = () => {
      setThemeState(newTheme);
      try {
        localStorage.setItem("naphier_theme", newTheme);
      } catch {
        // Ignore localStorage errors
      }

      setResolvedTheme(targetResolved);
      const root = document.documentElement;
      if (targetResolved === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    // If visual theme does not change, update state without animating the screen
    if (targetResolved === resolvedTheme) {
      applyThemeUpdate();
      return;
    }

    if (!isAppearanceTransition) {
      applyThemeUpdate();
      return;
    }

    // Determine coordinates (x, y) for origin of circular reveal
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event?.currentTarget && (event.currentTarget as HTMLElement).getBoundingClientRect) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (event && (event.clientX || event.clientY)) {
      x = event.clientX;
      y = event.clientY;
    } else if (typeof document !== "undefined") {
      const toggles = document.querySelectorAll<HTMLElement>('[aria-label="Theme selector"]');
      for (const el of toggles) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
          break;
        }
      }
    }

    const maxW = Math.max(window.innerWidth, document.documentElement.clientWidth);
    const maxH = Math.max(window.innerHeight, document.documentElement.clientHeight);
    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, maxW - x),
        Math.max(y, maxH - y)
      )
    ) + 32;

    const transitionId = ++activeTransitionRef.current;

    // Suppress all DOM CSS transitions so the GPU compositor exclusively animates the snapshot
    document.documentElement.style.setProperty("--theme-clip-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-clip-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-clip-radius", `${endRadius}px`);
    document.documentElement.classList.add("theme-transitioning");

    const cleanup = () => {
      if (activeTransitionRef.current === transitionId) {
        document.documentElement.classList.remove("theme-transitioning");
        document.documentElement.style.removeProperty("--theme-clip-x");
        document.documentElement.style.removeProperty("--theme-clip-y");
        document.documentElement.style.removeProperty("--theme-clip-radius");
      }
    };

    try {
      const transition = (
        document as unknown as {
          startViewTransition: (cb: () => void) => {
            ready: Promise<void>;
            finished: Promise<void>;
          };
        }
      ).startViewTransition(() => {
        try {
          flushSync(() => {
            applyThemeUpdate();
          });
        } catch {
          applyThemeUpdate();
        }
      });

      transition.ready
        .then(async () => {
          try {
            const anim = document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 480,
                easing: "cubic-bezier(0.32, 0.72, 0, 1)",
                pseudoElement: "::view-transition-new(root)",
                fill: "forwards",
              }
            );
            await anim.finished;
          } catch {
            // In browsers where WAAPI on pseudoElement is unsupported (e.g. Safari 18),
            // the CSS animation @keyframes theme-reveal in globals.css takes over seamlessly.
          }
        })
        .catch(() => {
          // Gracefully handled if browser transition gets canceled
        });

      transition.finished
        .finally(() => {
          cleanup();
        });
    } catch {
      cleanup();
      applyThemeUpdate();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeProvider;
