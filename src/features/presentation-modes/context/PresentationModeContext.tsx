"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSnap } from "@/context/SnapContext";
import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  PRESENTATION_COOKIE_NAME,
  PRESENTATION_COOKIE_MAX_AGE,
  PRESENTATION_QUERY_PARAM,
  STARS_COOKIE_NAME,
  STARS_STORAGE_KEY,
  GRID_COOKIE_NAME,
  GRID_STORAGE_KEY,
} from "../types/config";

interface PresentationModeContextValue {
  mode: PresentationMode;
  previousMode: PresentationMode | null;
  setMode: (mode: PresentationMode) => void;
  clearPreviousMode: () => void;
  starsEnabled: boolean;
  setStarsEnabled: (enabled: boolean) => void;
  toggleStars: () => void;
  gridEnabled: boolean;
  setGridEnabled: (enabled: boolean) => void;
  toggleGrid: () => void;
}

const PresentationModeContext = createContext<PresentationModeContextValue | null>(null);

export interface PresentationModeProviderProps {
  children: ReactNode;
  initialMode: PresentationMode;
  initialStarsEnabled?: boolean;
  initialGridEnabled?: boolean;
}

/**
 * PresentationModeProvider
 *
 * Single authoritative presentation mode state container for the entire application.
 * Initialized directly from the server-resolved initialMode prop in RootLayout.
 * Persists changes to the first-party cookie.
 * Automatically normalizes snap easter egg state when entering Focus mode.
 */
export function PresentationModeProvider({
  children,
  initialMode = DEFAULT_PRESENTATION_MODE,
  initialStarsEnabled = false,
  initialGridEnabled = false,
}: PresentationModeProviderProps) {
  const [mode, setModeState] = useState<PresentationMode>(initialMode);
  const [starsEnabled, setStarsEnabledState] = useState<boolean>(initialStarsEnabled);
  const [gridEnabled, setGridEnabledState] = useState<boolean>(initialGridEnabled);
  const [previousMode, setPreviousMode] = useState<PresentationMode | null>(null);
  const { isSnapped, isSnapping, isRestoring, resetSnapState } = useSnap();

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // When navigating between different routes, clear previousMode so deep pages don't re-trigger mode switch animations
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setPreviousMode(null);
    }
  }, [pathname]);

  // If initial mode is focus/minimal or active mode becomes focus/minimal while snapped, normalize immediately
  useEffect(() => {
    if (
      (mode === "focus" || mode === "minimal") &&
      (isSnapped || isSnapping || isRestoring)
    ) {
      resetSnapState();
    }
  }, [mode, isSnapped, isSnapping, isRestoring, resetSnapState]);

  const clearPreviousMode = useCallback(() => {
    setPreviousMode(null);
  }, []);

  const setMode = useCallback(
    (newMode: PresentationMode) => {
      setPreviousMode(mode);
      setModeState(newMode);

      // If entering Focus or Minimal mode, immediately clear and reset any active Default snap state
      if (newMode === "focus" || newMode === "minimal") {
        resetSnapState();
      }

      try {
        // 1. Authoritative Server-Readable Cookie Persistence
        document.cookie = `${PRESENTATION_COOKIE_NAME}=${newMode}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;

        // 2. Clean URL Synchronization & One-Page Minimal Redirect
        if (typeof window !== "undefined") {
          if (newMode === "minimal" && window.location.pathname !== "/") {
            window.location.href = "/";
            return;
          }

          const url = new URL(window.location.href);
          if (newMode === DEFAULT_PRESENTATION_MODE) {
            url.searchParams.delete(PRESENTATION_QUERY_PARAM);
          } else {
            if (url.searchParams.has(PRESENTATION_QUERY_PARAM)) {
              url.searchParams.set(PRESENTATION_QUERY_PARAM, newMode);
            }
          }
          window.history.replaceState({}, "", url.toString());
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    },
    [mode, resetSnapState]
  );

  // Client-side localStorage synchronization for animation settings
  useEffect(() => {
    try {
      const storedStars = localStorage.getItem(STARS_STORAGE_KEY);
      if (storedStars !== null) {
        setStarsEnabledState(storedStars === "true");
      }
      const storedGrid = localStorage.getItem(GRID_STORAGE_KEY);
      if (storedGrid !== null) {
        setGridEnabledState(storedGrid === "true");
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setStarsEnabled = useCallback((enabled: boolean) => {
    setStarsEnabledState(enabled);
    try {
      document.cookie = `${STARS_COOKIE_NAME}=${enabled}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;
      localStorage.setItem(STARS_STORAGE_KEY, String(enabled));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleStars = useCallback(() => {
    setStarsEnabled(!starsEnabled);
  }, [setStarsEnabled, starsEnabled]);

  const setGridEnabled = useCallback((enabled: boolean) => {
    setGridEnabledState(enabled);
    try {
      document.cookie = `${GRID_COOKIE_NAME}=${enabled}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;
      localStorage.setItem(GRID_STORAGE_KEY, String(enabled));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleGrid = useCallback(() => {
    setGridEnabled(!gridEnabled);
  }, [setGridEnabled, gridEnabled]);

  const value = useMemo<PresentationModeContextValue>(
    () => ({
      mode,
      previousMode,
      setMode,
      clearPreviousMode,
      starsEnabled,
      setStarsEnabled,
      toggleStars,
      gridEnabled,
      setGridEnabled,
      toggleGrid,
    }),
    [
      mode,
      previousMode,
      setMode,
      clearPreviousMode,
      starsEnabled,
      setStarsEnabled,
      toggleStars,
      gridEnabled,
      setGridEnabled,
      toggleGrid,
    ]
  );

  return (
    <PresentationModeContext.Provider value={value}>
      {children}
    </PresentationModeContext.Provider>
  );
}

/**
 * usePresentationMode
 *
 * Hook to access the portfolio-wide presentation mode state.
 * Throws a clear development error if invoked outside PresentationModeProvider.
 */
export function usePresentationMode(): PresentationModeContextValue {
  const context = useContext(PresentationModeContext);
  if (!context) {
    throw new Error("usePresentationMode must be used within PresentationModeProvider");
  }
  return context;
}
