"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useSnap } from "@/context/SnapContext";
import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  PRESENTATION_COOKIE_NAME,
  PRESENTATION_COOKIE_MAX_AGE,
  PRESENTATION_QUERY_PARAM,
} from "../types/config";

interface PresentationModeContextValue {
  mode: PresentationMode;
  setMode: (mode: PresentationMode) => void;
}

const PresentationModeContext = createContext<PresentationModeContextValue | null>(null);

export interface PresentationModeProviderProps {
  children: ReactNode;
  initialMode: PresentationMode;
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
}: PresentationModeProviderProps) {
  const [mode, setModeState] = useState<PresentationMode>(initialMode);
  const { isSnapped, isSnapping, isRestoring, resetSnapState } = useSnap();

  // If initial mode is focus or active mode becomes focus while snapped, normalize immediately
  useEffect(() => {
    if (mode === "focus" && (isSnapped || isSnapping || isRestoring)) {
      resetSnapState();
    }
  }, [mode, isSnapped, isSnapping, isRestoring, resetSnapState]);

  const setMode = useCallback((newMode: PresentationMode) => {
    setModeState(newMode);

    // If entering Focus mode, immediately clear and reset any active Default snap state
    if (newMode === "focus") {
      resetSnapState();
    }

    try {
      // 1. Authoritative Server-Readable Cookie Persistence
      document.cookie = `${PRESENTATION_COOKIE_NAME}=${newMode}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;

      // 2. Clean URL Synchronization
      if (typeof window !== "undefined") {
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
  }, [resetSnapState]);

  const value = useMemo<PresentationModeContextValue>(
    () => ({
      mode,
      setMode,
    }),
    [mode, setMode]
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
