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
import { usePathname, useRouter } from "next/navigation";
import { useSnap } from "@/context/SnapContext";
import { PresentationMode } from "../types/presentation";
import {
  DEFAULT_PRESENTATION_MODE,
  normalizePresentationMode,
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

const WHIRLPOOL_SPIRAL_PATH = `M 500 500
C 500 470, 530 470, 530 500
C 530 545, 455 545, 455 500
C 455 425, 575 425, 575 500
C 575 605, 395 605, 395 500
C 395 365, 635 365, 635 500
C 635 665, 335 665, 335 500
C 335 305, 695 305, 695 500
C 695 725, 275 725, 275 500
C 275 245, 755 245, 755 500
C 755 785, 215 785, 215 500
C 215 185, 815 185, 815 500
C 815 845, 155 845, 155 500
C 155 125, 875 125, 875 500
C 875 905, 95 905, 95 500
C 95 65, 935 65, 935 500
C 935 965, 35 965, 35 500
C 35 5, 995 5, 995 500
C 995 1025, -25 1025, -25 500`;

const RESOLVED_LAYOUTS: Partial<Record<PresentationMode, React.ComponentType>> = {};

export function getResolvedModeLayout(targetMode: PresentationMode): React.ComponentType | undefined {
  return RESOLVED_LAYOUTS[targetMode];
}

export async function preloadModeLayout(targetMode: PresentationMode): Promise<void> {
  try {
    if (targetMode === "default") {
      const [layoutMod] = await Promise.all([
        import("../modes/default/DefaultModeLayout"),
        import("@/components/LandscapeFooter"),
        import("@/components/NavigationDock"),
        import("@/features/side-drawers/SideDrawerProvider"),
        import("@/features/music-drawer"),
        import("@/features/resources-drawer"),
      ]);
      RESOLVED_LAYOUTS.default = layoutMod.DefaultModeLayout;
    } else if (targetMode === "focus") {
      const [layoutMod] = await Promise.all([
        import("../modes/focus/FocusModeLayout"),
        import("@/components/LandscapeFooter"),
      ]);
      RESOLVED_LAYOUTS.focus = layoutMod.FocusModeLayout;
    } else if (targetMode === "minimal") {
      const [layoutMod] = await Promise.all([
        import("../modes/minimal/MinimalModeLayout"),
        import("@/components/LandscapeFooter"),
      ]);
      RESOLVED_LAYOUTS.minimal = layoutMod.MinimalModeLayout;
    }
  } catch {
    // Ignore preload errors
  }
}

export function preloadAllModeLayouts(): void {
  void preloadModeLayout("default");
  void preloadModeLayout("focus");
  void preloadModeLayout("minimal");
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
  const [storedMode, setModeState] = useState<PresentationMode>(initialMode);
  const mode = normalizePresentationMode(storedMode);
  const [starsEnabled, setStarsEnabledState] = useState<boolean>(initialStarsEnabled);
  const [gridEnabled, setGridEnabledState] = useState<boolean>(initialGridEnabled);
  const [previousMode, setPreviousMode] = useState<PresentationMode | null>(null);
  const [whirlpoolKey, setWhirlpoolKey] = useState<number>(0);
  const transitionTimersRef = useRef<{
    mid?: ReturnType<typeof setTimeout>;
    end?: ReturnType<typeof setTimeout>;
  }>({});
  const transitionRunIdRef = useRef(0);
  const { isSnapped, isSnapping, isRestoring, resetSnapState } = useSnap();

  const pathname = usePathname();
  const router = useRouter();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const timers = transitionTimersRef.current;
    return () => {
      transitionRunIdRef.current += 1;
      if (timers.mid) clearTimeout(timers.mid);
      if (timers.end) clearTimeout(timers.end);
    };
  }, []);

  // Warm-preload inactive layout chunks after initial idle so layout switching is instantaneous
  useEffect(() => {
    const timer = setTimeout(() => {
      preloadAllModeLayouts();
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Normalize stale client state before consumers render; then repair its cookie.
  useEffect(() => {
    if (storedMode === mode) return;
    setModeState(mode);
    document.cookie = `${PRESENTATION_COOKIE_NAME}=${mode}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;
    router.replace("/");
  }, [storedMode, mode, router]);

  // When navigating between different routes, clear previousMode so deep pages don't re-trigger mode switch animations
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setPreviousMode(null);
    }
  }, [pathname]);

  // When visiting /artisan directly, ensure mode in context reflects "agent"
  useEffect(() => {
    if (pathname === "/artisan" && mode !== "agent") {
      setModeState("agent");
    }
  }, [pathname, mode]);

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

  const commitModeSwitch = useCallback(
    (requestedMode: PresentationMode, newMode: PresentationMode) => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }

      setPreviousMode(mode);
      setModeState(newMode);
      if (requestedMode !== newMode) router.replace("/");

      // If entering Focus or Minimal mode, immediately clear and reset any active Default snap state
      if (newMode === "focus" || newMode === "minimal") {
        resetSnapState();
      }

      try {
        // 1. Authoritative Server-Readable Cookie Persistence
        document.cookie = `${PRESENTATION_COOKIE_NAME}=${newMode}; path=/; max-age=${PRESENTATION_COOKIE_MAX_AGE}; SameSite=Lax`;

        // 2. Clean URL Synchronization & One-Page Minimal Redirect
        if (typeof window !== "undefined") {
          // If on /artisan and choosing a different presentation mode, route to / with the selected mode
          if (window.location.pathname === "/artisan" && newMode !== "agent") {
            router.replace(newMode === DEFAULT_PRESENTATION_MODE ? "/" : `/?mode=${newMode}`);
            return;
          }

          if (
            newMode === "minimal" &&
            window.location.pathname !== "/" &&
            !window.location.pathname.startsWith("/notes")
          ) {
            router.replace("/");
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
    [mode, resetSnapState, router]
  );

  const setMode = useCallback(
    (requestedMode: PresentationMode) => {
      const newMode = normalizePresentationMode(requestedMode);
      if (newMode === mode) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const runId = ++transitionRunIdRef.current;
      if (transitionTimersRef.current.mid) clearTimeout(transitionTimersRef.current.mid);
      if (transitionTimersRef.current.end) clearTimeout(transitionTimersRef.current.end);

      const startSingleWhirlpool = () => {
        if (transitionRunIdRef.current !== runId) return;

        if (prefersReducedMotion) {
          commitModeSwitch(requestedMode, newMode);
          return;
        }

        setWhirlpoolKey(runId);

        // Commit the new layout at 460ms right inside the 42%-58% solid coverage plateau
        transitionTimersRef.current.mid = setTimeout(() => {
          if (transitionRunIdRef.current !== runId) return;
          commitModeSwitch(requestedMode, newMode);
        }, 460);

        transitionTimersRef.current.end = setTimeout(() => {
          if (transitionRunIdRef.current !== runId) return;
          setWhirlpoolKey(0);
        }, 1060);
      };

      // If the target layout is already in memory, start immediately on this frame; otherwise resolve it first
      if (newMode === "agent" || RESOLVED_LAYOUTS[newMode]) {
        startSingleWhirlpool();
      } else {
        void preloadModeLayout(newMode).then(startSingleWhirlpool);
      }
    },
    [mode, commitModeSwitch]
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
      {whirlpoolKey > 0 && (
        <div
          key={`layout-whirlpool-${whirlpoolKey}`}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
        >
          <svg
            viewBox="0 0 1000 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="layout-whirlpool-svg w-[135vmax] h-[135vmax] min-w-[135vmax] min-h-[135vmax] pointer-events-none will-change-transform"
          >
            <path
              d={WHIRLPOOL_SPIRAL_PATH}
              pathLength={1}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              strokeDashoffset={1}
              strokeWidth={2}
              fill="none"
              className="layout-whirlpool-path text-[#0a0a0a] dark:text-[#fafafa]"
            />
          </svg>
        </div>
      )}
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
