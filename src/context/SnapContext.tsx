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
   * Universal 3-state resolution for route snap status:
   * - "normal": Route is not snap-eligible (e.g. "/") or item is not currently snapped
   * - "unknown": Snap-eligible route whose session state has not been verified from sessionStorage yet
   * - "snapped": Snap-eligible route that was disintegrated in the active session
   */
  const getRouteSnapStatus = useCallback(
    (pathname: string): RouteSnapStatus => {
      const dockId = getSnappedDockIdForPathname(pathname);
      // Non-snap-eligible routes are never blocked
      if (!dockId) return "normal";

      // If browser session state has not been checked from sessionStorage yet
      if (!isSessionInitialized) return "unknown";

      // If active session is snapped and not restoring, and the dock item is snapped
      if (isSnapped && !isRestoring && snappedDockItems.includes(dockId)) {
        return "snapped";
      }

      return "normal";
    },
    [isSessionInitialized, isSnapped, isRestoring, snappedDockItems]
  );

  /**
   * Boolean helper for convenience.
   */
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

  const triggerSnap = useCallback(async () => {
    if (isSnapping || isRestoring || isSnapped) return;

    setIsSnapping(true);
    setCurrentStep(0);
    playSnap();

    // 1. Initial dramatic pause (~650ms) after snap sound
    await new Promise((resolve) => setTimeout(resolve, 650));

    // 2. Randomly select either 4 or 5 UNIQUE eligible sections
    const targetSectionCount = Math.random() < 0.5 ? 4 : 5;
    setTotalSteps(targetSectionCount);

    const shuffledSections = [...ELIGIBLE_SECTION_IDS].sort(
      () => Math.random() - 0.5
    );
    const selectedSections = shuffledSections.slice(0, targetSectionCount);

    // Randomly select 1 or 2 eligible dock items
    const targetDockCount = Math.random() < 0.5 ? 1 : 2;
    const shuffledDock = [...ELIGIBLE_DOCK_IDS].sort(() => Math.random() - 0.5);
    const selectedDock = shuffledDock.slice(0, targetDockCount);

    // Randomly select 3 to 5 semantic text fragments
    const targetTextCount = Math.floor(Math.random() * 3) + 3;
    const shuffledText = [...ELIGIBLE_TEXT_FRAGMENT_IDS].sort(
      () => Math.random() - 0.5
    );
    const selectedTextIds = shuffledText.slice(0, targetTextCount);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Reduced motion: Fast cycle with simple opacity fade
      for (let i = 0; i < selectedSections.length; i++) {
        const id = selectedSections[i];
        setCurrentStep(i + 1);
        const el =
          sectionRefs.current.get(id) ||
          document.getElementById(`section-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "center" });
        }
        if (el?.isConnected) playDissolve(0.7, 0.4);
        await new Promise((resolve) => setTimeout(resolve, 250));
        setSnappedSectionIds((prev) => [...prev, id]);
        await new Promise((resolve) => setTimeout(resolve, 100));
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
      saveToSession(selectedSections, selectedDock, selectedTextIds);
      return;
    }

    // 3. Cinematic Sequence: Process sections ONE AT A TIME with original timing
    for (let i = 0; i < selectedSections.length; i++) {
      const id = selectedSections[i];
      setCurrentStep(i + 1);

      const el =
        sectionRefs.current.get(id) ||
        document.getElementById(`section-${id}`);

      if (el) {
        // Smoothly scroll that section into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Pause so user sees the section clearly
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Capture section bounding box for the Canvas dust simulation
      if (el) {
        const rect = el.getBoundingClientRect();
        const bounds: SectionBounds[] = [
          {
            id,
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          },
        ];
        setActiveDustBounds(bounds);
      }

      // Trigger original dissolution animation on this section AND start dissolve audio simultaneously
      setSnappingSectionIds([id]);
      if (el?.isConnected) playDissolve(1, 1.35);

      // Original dust dissolution duration (1400ms)
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Collapse and hide section after dust completes
      setSnappedSectionIds((prev) => [...prev, id]);
      setSnappingSectionIds([]);
      setActiveDustBounds([]);

      // Short pause before moving to next section (350ms)
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    // 4. Navigation Dock Snap (Fixed on screen without scrolling away)
    if (selectedDock.length > 0) {
      const dockBounds: SectionBounds[] = [];
      selectedDock.forEach((dockName) => {
        const dockEl =
          dockRefs.current.get(dockName) ||
          document.getElementById(`dock-item-${dockName.toLowerCase()}`);
        if (dockEl) {
          const rect = dockEl.getBoundingClientRect();
          dockBounds.push({
            id: `dock-${dockName}`,
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });
        }
      });

      if (dockBounds.length > 0) {
        setActiveDustBounds(dockBounds);
      }

      // Trigger dock dust animation AND start dock dissolve audio simultaneously
      setSnappingDockItems(selectedDock);
      selectedDock.forEach(() => playDissolve(0.55 / selectedDock.length, 1.1));

      // Dock dust timing (1100ms)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      setSnappedDockItems(selectedDock);
      setSnappingDockItems([]);
      setActiveDustBounds([]);

      // Wait 500ms for smooth dock collapse animation to settle
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 5. Short pause before returning to top (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 6. Smoothly scroll back to hero / top if on home page
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // 7. Secondary Text Disintegration (Semantic-preserving word/phrase dust dissolution)
    const textBounds: SectionBounds[] = [];
    selectedTextIds.forEach((id) => {
      const el =
        textRefs.current.get(id) || document.getElementById(`snap-text-${id}`);
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
    }

    setSnappingTextFragmentIds(selectedTextIds);
    setSnappedTextFragmentIds(selectedTextIds);
    playDissolve(0.35, 0.7);

    // Quick text dust timing (650ms)
    await new Promise((resolve) => setTimeout(resolve, 650));

    setSnappingTextFragmentIds([]);
    setActiveDustBounds([]);

    setIsSnapped(true);
    setIsSnapping(false);
    setCurrentStep(0);

    // Persist active session state
    saveToSession(selectedSections, selectedDock, selectedTextIds);
  }, [isSnapping, isRestoring, isSnapped, playSnap, playDissolve]);

  const triggerRestore = useCallback(async () => {
    if (isSnapping || isRestoring || !isSnapped) return;

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
