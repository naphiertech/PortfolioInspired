"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useUISound } from "./SoundContext";
import {
  getSnappedDockIdForPathname,
  RouteSnapStatus,
} from "@/lib/snapRouteMap";

export const ELIGIBLE_SECTION_IDS = [
  "about",
  "now",
  "currently-building",
  "latest-activity",
  "recent-projects",
  "tech-stack",
  "experience",
  "certifications",
  "recommendations",
  "gallery",
] as const;

export type EligibleSectionId = (typeof ELIGIBLE_SECTION_IDS)[number];

export const ELIGIBLE_DOCK_IDS = [
  "Work",
  "Projects",
  "Tech",
  "Certs",
] as const;

export type EligibleDockId = (typeof ELIGIBLE_DOCK_IDS)[number];

export const ELIGIBLE_TEXT_FRAGMENT_IDS = [
  "focus-qualifiers", // ", performant, and polished"
  "focus-realworld", // "real-world "
  "terminal-iterate", // " · iterate"
  "how-modularity", // " & modularity"
  "how-accessible", // ", accessible"
  "how-continuous", // " & continuous learning"
  "header-eyebrow-student", // " & it student"
  "header-bio-uiux", // " & UI/UX"
  "build-portals", // " & Portals"
  "build-integrations", // " & Integrations"
  "build-tooling", // " & Tooling"
  "build-fullstack", // "Full-Stack "
  "build-responsive", // "Responsive "
  "build-db", // "Database "
] as const;

export type EligibleTextFragmentId = (typeof ELIGIBLE_TEXT_FRAGMENT_IDS)[number];

export interface SectionBounds {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export const SNAP_SESSION_STORAGE_KEY = "naphier_snap_session_v1";

interface SnapContextType {
  isSnapped: boolean;
  isSnapping: boolean;
  isRestoring: boolean;
  isSessionInitialized: boolean;
  currentStep: number;
  totalSteps: number;
  snappingSectionIds: string[];
  snappedSectionIds: string[];
  snappingDockItems: string[];
  snappedDockItems: string[];
  snappingTextFragmentIds: string[];
  snappedTextFragmentIds: string[];
  restoringSectionIds: string[];
  activeDustBounds: SectionBounds[];
  isSnappedText: (id: string) => boolean;
  isRouteSnapped: (pathname: string) => boolean;
  getRouteSnapStatus: (pathname: string) => RouteSnapStatus;
  triggerSnap: () => void;
  triggerRestore: () => void;
  resetSnapState: () => void;
  registerSection: (id: string, el: HTMLElement | null) => void;
  registerDockItem: (name: string, el: HTMLElement | null) => void;
  registerTextRef: (id: string, el: HTMLElement | null) => void;
}

const SnapContext = createContext<SnapContextType | undefined>(undefined);

export function SnapProvider({ children }: { children: React.ReactNode }) {
  const { playSnap, playRestore, playDissolve } = useUISound();

  const [isSnapped, setIsSnapped] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(4);

  const [snappingSectionIds, setSnappingSectionIds] = useState<string[]>([]);
  const [snappedSectionIds, setSnappedSectionIds] = useState<string[]>([]);
  const [snappingDockItems, setSnappingDockItems] = useState<string[]>([]);
  const [snappedDockItems, setSnappedDockItems] = useState<string[]>([]);
  const [snappingTextFragmentIds, setSnappingTextFragmentIds] = useState<string[]>([]);
  const [snappedTextFragmentIds, setSnappedTextFragmentIds] = useState<string[]>([]);
  const [restoringSectionIds, setRestoringSectionIds] = useState<string[]>([]);
  const [activeDustBounds, setActiveDustBounds] = useState<SectionBounds[]>([]);

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const dockRefs = useRef<Map<string, HTMLElement>>(new Map());
  const textRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isAbortedRef = useRef<boolean>(false);

  // Restore session-only snap state upon client initialization
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const rawSession = sessionStorage.getItem(SNAP_SESSION_STORAGE_KEY);
        if (rawSession) {
          const data = JSON.parse(rawSession);
          if (data && data.isSnapped) {
            setIsSnapped(true);
            if (Array.isArray(data.snappedSectionIds)) {
              setSnappedSectionIds(data.snappedSectionIds);
            }
            if (Array.isArray(data.snappedDockItems)) {
              setSnappedDockItems(data.snappedDockItems);
            }
            if (Array.isArray(data.snappedTextFragmentIds)) {
              setSnappedTextFragmentIds(data.snappedTextFragmentIds);
            }
          }
        }
      }
    } catch {
      // Safely ignore storage serialization errors
    } finally {
      setIsSessionInitialized(true);
    }
  }, []);

  /**
   * Immediate silent reset of all snap states.
   * Cancels in-flight snap animations, clears sessionStorage, and restores navigation dock.
   */
  const resetSnapState = useCallback(() => {
    isAbortedRef.current = true;
    clearSession();

    setIsSnapped(false);
    setIsSnapping(false);
    setIsRestoring(false);
    setCurrentStep(0);
    setSnappingSectionIds([]);
    setSnappedSectionIds([]);
    setSnappingDockItems([]);
    setSnappedDockItems([]);
    setSnappingTextFragmentIds([]);
    setSnappedTextFragmentIds([]);
    setRestoringSectionIds([]);
    setActiveDustBounds([]);
  }, []);

  const registerSection = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  const registerDockItem = useCallback((name: string, el: HTMLElement | null) => {
    if (el) {
      dockRefs.current.set(name, el);
    } else {
      dockRefs.current.delete(name);
    }
  }, []);

  const registerTextRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      textRefs.current.set(id, el);
    } else {
      textRefs.current.delete(id);
    }
  }, []);

  const isSnappedText = useCallback(
    (id: string) => {
      return snappedTextFragmentIds.includes(id);
    },
    [snappedTextFragmentIds]
  );

  /**
   * Universal 3-state resolution for route snap status
   */
  const getRouteSnapStatus = useCallback(
    (pathname: string): RouteSnapStatus => {
      const dockId = getSnappedDockIdForPathname(pathname);
      if (!dockId) return "normal";

      if (!isSessionInitialized) return "unknown";

      if (isSnapped && !isRestoring && snappedDockItems.includes(dockId)) {
        return "snapped";
      }

      return "normal";
    },
    [isSessionInitialized, isSnapped, isRestoring, snappedDockItems]
  );

  const isRouteSnapped = useCallback(
    (pathname: string): boolean => {
      return getRouteSnapStatus(pathname) === "snapped";
    },
    [getRouteSnapStatus]
  );

  const saveToSession = (
    sections: string[],
    dockItems: string[],
    textIds: string[]
  ) => {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.setItem(
        SNAP_SESSION_STORAGE_KEY,
        JSON.stringify({
          isSnapped: true,
          snappedSectionIds: sections,
          snappedDockItems: dockItems,
          snappedTextFragmentIds: textIds,
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const clearSession = () => {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.removeItem(SNAP_SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  /**
   * Dynamically filters eligible section IDs to only those currently mounted,
   * connected in the DOM, and with non-zero dimensions.
   */
  const getAvailableSnapSections = useCallback((): string[] => {
    return ELIGIBLE_SECTION_IDS.filter((id) => {
      const el =
        sectionRefs.current.get(id) ||
        (typeof document !== "undefined"
          ? document.getElementById(`section-${id}`)
          : null);
      if (!el || !el.isConnected) return false;
      const rect = el.getBoundingClientRect();
      return rect.height > 10;
    });
  }, []);

  /**
   * Smoothly scrolls to target element and waits for scroll motion to stabilize
   * using requestAnimationFrame delta checks rather than blind fixed timeouts.
   */
  const waitForScrollStabilization = useCallback(
    (el: HTMLElement, maxWaitMs = 1500): Promise<boolean> => {
      if (!el || !el.isConnected) return Promise.resolve(false);

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      return new Promise((resolve) => {
        let lastTop = el.getBoundingClientRect().top;
        let stableFrames = 0;
        const startTime = performance.now();

        const checkStability = () => {
          if (isAbortedRef.current || !el.isConnected) {
            resolve(false);
            return;
          }

          const currentTop = el.getBoundingClientRect().top;
          if (Math.abs(currentTop - lastTop) < 0.5) {
            stableFrames++;
          } else {
            stableFrames = 0;
          }
          lastTop = currentTop;

          const elapsed = performance.now() - startTime;

          // Require at least 3 consecutive stable frames AND minimum 300ms for visual comfort
          if ((stableFrames >= 3 && elapsed >= 300) || elapsed >= maxWaitMs) {
            resolve(true);
          } else {
            requestAnimationFrame(checkStability);
          }
        };

        requestAnimationFrame(checkStability);
      });
    },
    []
  );

  /**
   * Captures fresh bounding coordinates after scroll stabilization with retry safety.
   */
  const getFreshBounds = useCallback(
    async (id: string, el: HTMLElement): Promise<SectionBounds | null> => {
      if (!el || !el.isConnected) return null;

      let rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        await new Promise((r) => requestAnimationFrame(r));
        if (!el.isConnected) return null;
        rect = el.getBoundingClientRect();
      }

      if (rect.width <= 0 || rect.height <= 0) return null;

      return {
        id,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      };
    },
    []
  );

  const triggerSnap = useCallback(async () => {
    if (isSnapping || isRestoring || isSnapped) return;

    // Reset abort flag for this run
    isAbortedRef.current = false;
    setIsSnapping(true);
    setCurrentStep(0);
    playSnap();

    // 1. Initial dramatic pause (~650ms) after snap sound
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (isAbortedRef.current) return;

    // 2. Select ONLY from currently mounted and available sections in the DOM
    const availableSections = getAvailableSnapSections();
    if (availableSections.length === 0) {
      setIsSnapping(false);
      return;
    }

    const targetSectionCount = Math.min(
      availableSections.length,
      Math.random() < 0.5 ? 4 : 5
    );
    setTotalSteps(targetSectionCount);

    const shuffledSections = [...availableSections].sort(
      () => Math.random() - 0.5
    );
    const selectedSections = shuffledSections.slice(0, targetSectionCount);

    // Select eligible dock items that are mounted in the DOM
    const availableDock = ELIGIBLE_DOCK_IDS.filter((name) => {
      const dockEl =
        dockRefs.current.get(name) ||
        (typeof document !== "undefined"
          ? document.getElementById(`dock-item-${name.toLowerCase()}`)
          : null);
      return dockEl && dockEl.isConnected;
    });

    const targetDockCount = Math.min(
      availableDock.length,
      Math.random() < 0.5 ? 1 : 2
    );
    const shuffledDock = [...availableDock].sort(() => Math.random() - 0.5);
    const selectedDock = shuffledDock.slice(0, targetDockCount);

    // Select eligible text fragments that are mounted in the DOM
    const availableText = ELIGIBLE_TEXT_FRAGMENT_IDS.filter((id) => {
      const el =
        textRefs.current.get(id) ||
        (typeof document !== "undefined"
          ? document.getElementById(`snap-text-${id}`)
          : null);
      if (!el || !el.isConnected) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    const targetTextCount = Math.min(
      availableText.length,
      Math.floor(Math.random() * 3) + 3
    );
    const shuffledText = [...availableText].sort(() => Math.random() - 0.5);
    const selectedTextIds = shuffledText.slice(0, targetTextCount);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Reduced motion: Fast cycle with simple opacity fade
      const reducedSnapped: string[] = [];
      for (let i = 0; i < selectedSections.length; i++) {
        if (isAbortedRef.current) return;
        const id = selectedSections[i];
        setCurrentStep(i + 1);
        const el =
          sectionRefs.current.get(id) ||
          document.getElementById(`section-${id}`);
        if (el && el.isConnected) {
          el.scrollIntoView({ behavior: "instant", block: "center" });
          playDissolve(0.7, 0.4);
          await new Promise((resolve) => setTimeout(resolve, 250));
          reducedSnapped.push(id);
          setSnappedSectionIds((prev) => [...prev, id]);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      selectedDock.forEach((dockName) => {
        const dockEl =
          dockRefs.current.get(dockName) ||
          document.getElementById(`dock-item-${dockName.toLowerCase()}`);
        if (dockEl?.isConnected) playDissolve(0.5 / selectedDock.length, 0.4);
      });
      setSnappedDockItems(selectedDock);
      setSnappedTextFragmentIds(selectedTextIds);

      window.scrollTo({ top: 0, behavior: "instant" });
      setIsSnapped(true);
      setIsSnapping(false);
      setCurrentStep(0);

      // Persist active session
      saveToSession(reducedSnapped, selectedDock, selectedTextIds);
      return;
    }

    // 3. Cinematic Sequence: Process sections ONE AT A TIME with synchronized scroll & bounds
    const successfullySnappedSections: string[] = [];

    for (let i = 0; i < selectedSections.length; i++) {
      if (isAbortedRef.current) return;

      const id = selectedSections[i];
      const el =
        sectionRefs.current.get(id) ||
        document.getElementById(`section-${id}`);

      if (!el || !el.isConnected) {
        // Target is not available; skip safely
        continue;
      }

      setCurrentStep(i + 1);

      // Step A: Smoothly scroll and wait for physical stabilization
      const isStabilized = await waitForScrollStabilization(el);
      if (!isStabilized || isAbortedRef.current) return;

      // Step B: Measure fresh bounds from stabilized element
      const bounds = await getFreshBounds(id, el);
      if (!bounds || isAbortedRef.current) {
        continue;
      }

      // Step C: Trigger dust simulation on canvas & start dissolution audio
      setActiveDustBounds([bounds]);
      setSnappingSectionIds([id]);
      if (el.isConnected) playDissolve(1, 1.35);

      // Step D: Dust dissolution animation duration (1400ms)
      await new Promise((resolve) => setTimeout(resolve, 1400));
      if (isAbortedRef.current) return;

      // Step E: Transition section to snapped state and begin height collapse
      successfullySnappedSections.push(id);
      setSnappedSectionIds((prev) => [...prev, id]);
      setSnappingSectionIds([]);
      setActiveDustBounds([]);

      // Step F: Wait for height collapse transition (500ms) to settle DOM layout
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (isAbortedRef.current) return;

    // 4. Navigation Dock Snap (Fixed on screen without scrolling away)
    if (selectedDock.length > 0) {
      const dockBounds: SectionBounds[] = [];
      selectedDock.forEach((dockName) => {
        const dockEl =
          dockRefs.current.get(dockName) ||
          document.getElementById(`dock-item-${dockName.toLowerCase()}`);
        if (dockEl && dockEl.isConnected) {
          const rect = dockEl.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            dockBounds.push({
              id: `dock-${dockName}`,
              top: rect.top + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
              height: rect.height,
            });
          }
        }
      });

      if (dockBounds.length > 0) {
        setActiveDustBounds(dockBounds);
        setSnappingDockItems(selectedDock);
        selectedDock.forEach(() =>
          playDissolve(0.55 / selectedDock.length, 1.1)
        );

        await new Promise((resolve) => setTimeout(resolve, 1100));
        if (isAbortedRef.current) return;

        setSnappedDockItems(selectedDock);
        setSnappingDockItems([]);
        setActiveDustBounds([]);

        // Wait 500ms for dock collapse animation to settle
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (isAbortedRef.current) return;

    // 5. Short pause before returning to top (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (isAbortedRef.current) return;

    // 6. Smoothly scroll back to hero / top if on home page
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Wait for viewport to reach top with RAF
      await new Promise((resolve) => {
        const startTime = performance.now();
        const checkTop = () => {
          if (
            isAbortedRef.current ||
            window.scrollY <= 10 ||
            performance.now() - startTime >= 800
          ) {
            resolve(true);
          } else {
            requestAnimationFrame(checkTop);
          }
        };
        requestAnimationFrame(checkTop);
      });
    }

    if (isAbortedRef.current) return;

    // 7. Secondary Text Disintegration (Semantic-preserving word/phrase dust dissolution)
    if (selectedTextIds.length > 0) {
      const textBounds: SectionBounds[] = [];
      selectedTextIds.forEach((id) => {
        const el =
          textRefs.current.get(id) ||
          document.getElementById(`snap-text-${id}`);
        if (el && el.isConnected) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            textBounds.push({
              id: `text-${id}`,
              top: rect.top + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
              height: rect.height,
            });
          }
        }
      });

      if (textBounds.length > 0) {
        setActiveDustBounds(textBounds);
        setSnappingTextFragmentIds(selectedTextIds);
        setSnappedTextFragmentIds(selectedTextIds);
        playDissolve(0.35, 0.7);

        // Quick text dust timing (650ms)
        await new Promise((resolve) => setTimeout(resolve, 650));
        if (isAbortedRef.current) return;

        setSnappingTextFragmentIds([]);
        setActiveDustBounds([]);
      }
    }

    if (!isAbortedRef.current) {
      setIsSnapped(true);
      setIsSnapping(false);
      setCurrentStep(0);

      // Persist active session state
      saveToSession(
        successfullySnappedSections,
        selectedDock,
        selectedTextIds
      );
    }
  }, [
    isSnapping,
    isRestoring,
    isSnapped,
    playSnap,
    playDissolve,
    getAvailableSnapSections,
    waitForScrollStabilization,
    getFreshBounds,
  ]);

  const triggerRestore = useCallback(async () => {
    if (isSnapping || isRestoring || !isSnapped) return;

    isAbortedRef.current = true;
    setIsRestoring(true);
    playRestore();

    // Clear session storage on restore
    clearSession();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Return viewport to top if on home page
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? "instant" : "smooth",
      });
    }

    if (prefersReduced) {
      setSnappedSectionIds([]);
      setSnappedDockItems([]);
      setSnappedTextFragmentIds([]);
      setSnappingTextFragmentIds([]);
      setIsSnapped(false);
      setIsRestoring(false);
      setCurrentStep(0);
      return;
    }

    const previouslySnappedSections = [...snappedSectionIds];
    setRestoringSectionIds(previouslySnappedSections);
    setSnappedSectionIds([]); // instantly bring back section DOM
    setSnappedDockItems([]); // instantly restore dock items
    setSnappedTextFragmentIds([]); // instantly trigger text rematerialization
    setSnappingTextFragmentIds([]);

    // Allow rematerialization transition to settle (850ms)
    setTimeout(() => {
      setRestoringSectionIds([]);
      setIsSnapped(false);
      setIsRestoring(false);
      setCurrentStep(0);
    }, 850);
  }, [
    isSnapping,
    isRestoring,
    isSnapped,
    snappedSectionIds,
    playRestore,
  ]);

  // Clean up on unmount
  useEffect(() => {
    const sRefs = sectionRefs.current;
    const dRefs = dockRefs.current;
    const tRefs = textRefs.current;
    return () => {
      sRefs.clear();
      dRefs.clear();
      tRefs.clear();
    };
  }, []);

  return (
    <SnapContext.Provider
      value={{
        isSnapped,
        isSnapping,
        isRestoring,
        isSessionInitialized,
        currentStep,
        totalSteps,
        snappingSectionIds,
        snappedSectionIds,
        snappingDockItems,
        snappedDockItems,
        snappingTextFragmentIds,
        snappedTextFragmentIds,
        restoringSectionIds,
        activeDustBounds,
        isSnappedText,
        isRouteSnapped,
        getRouteSnapStatus,
        triggerSnap,
        triggerRestore,
        resetSnapState,
        registerSection,
        registerDockItem,
        registerTextRef,
      }}
    >
      {children}
    </SnapContext.Provider>
  );
}

export function useSnap() {
  const context = useContext(SnapContext);
  if (!context) {
    return {
      isSnapped: false,
      isSnapping: false,
      isRestoring: false,
      isSessionInitialized: true,
      currentStep: 0,
      totalSteps: 4,
      snappingSectionIds: [],
      snappedSectionIds: [],
      snappingDockItems: [],
      snappedDockItems: [],
      snappingTextFragmentIds: [],
      snappedTextFragmentIds: [],
      restoringSectionIds: [],
      activeDustBounds: [],
      isSnappedText: () => false,
      isRouteSnapped: () => false,
      getRouteSnapStatus: () => "normal" as RouteSnapStatus,
      triggerSnap: () => {},
      triggerRestore: () => {},
      resetSnapState: () => {},
      registerSection: () => {},
      registerDockItem: () => {},
      registerTextRef: () => {},
    };
  }
  return context;
}
