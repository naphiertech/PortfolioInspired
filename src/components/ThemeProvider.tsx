"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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

    if (!isAppearanceTransition || !event) {
      applyThemeUpdate();
      return;
    }

    let x = event?.clientX ?? 0;
    let y = event?.clientY ?? 0;

    if (event?.currentTarget && (event.currentTarget as HTMLElement).getBoundingClientRect) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (!x && !y) {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Suppress all DOM CSS transitions so the GPU compositor exclusively animates the snapshot
    document.documentElement.classList.add("theme-transitioning");

    try {
      const transition = (
        document as unknown as {
          startViewTransition: (cb: () => void) => {
            ready: Promise<void>;
            finished: Promise<void>;
          };
        }
      ).startViewTransition(() => {
        applyThemeUpdate();
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 1200,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
              fill: "forwards",
            }
          );
        })
        .catch(() => {
          // Gracefully handled if browser transition gets canceled
        });

      transition.finished
        .finally(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              document.documentElement.classList.remove("theme-transitioning");
            });
          });
        });
    } catch {
      document.documentElement.classList.remove("theme-transitioning");
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
