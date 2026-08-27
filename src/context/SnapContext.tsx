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

export interface SectionBounds {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

interface SnapContextType {
  isSnapped: boolean;
  isSnapping: boolean;
  isRestoring: boolean;
  currentStep: number;
  totalSteps: number;
  snappingSectionIds: string[];
  snappedSectionIds: string[];
  snappingDockItems: string[];
  snappedDockItems: string[];
  restoringSectionIds: string[];
  activeDustBounds: SectionBounds[];
  triggerSnap: () => void;
  triggerRestore: () => void;
  registerSection: (id: string, el: HTMLElement | null) => void;
  registerDockItem: (name: string, el: HTMLElement | null) => void;
}

const SnapContext = createContext<SnapContextType | undefined>(undefined);

export function SnapProvider({ children }: { children: React.ReactNode }) {
  const { playSnap, playRestore } = useUISound();

  const [isSnapped, setIsSnapped] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(4);

  const [snappingSectionIds, setSnappingSectionIds] = useState<string[]>([]);
  const [snappedSectionIds, setSnappedSectionIds] = useState<string[]>([]);
  const [snappingDockItems, setSnappingDockItems] = useState<string[]>([]);
  const [snappedDockItems, setSnappedDockItems] = useState<string[]>([]);
  const [restoringSectionIds, setRestoringSectionIds] = useState<string[]>([]);
  const [activeDustBounds, setActiveDustBounds] = useState<SectionBounds[]>([]);

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const dockRefs = useRef<Map<string, HTMLElement>>(new Map());

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
        await new Promise((resolve) => setTimeout(resolve, 250));
        setSnappedSectionIds((prev) => [...prev, id]);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setSnappedDockItems(selectedDock);
      window.scrollTo({ top: 0, behavior: "instant" });
      setIsSnapped(true);
      setIsSnapping(false);
      setCurrentStep(0);
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

      // Trigger original dissolution animation on this section
      setSnappingSectionIds([id]);

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

      setSnappingDockItems(selectedDock);

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

    // 6. Smoothly scroll back to hero / top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for scroll back to finish (~800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSnapped(true);
    setIsSnapping(false);
    setCurrentStep(0);
  }, [isSnapping, isRestoring, isSnapped, playSnap]);

  const triggerRestore = useCallback(async () => {
    if (isSnapping || isRestoring || !isSnapped) return;

    setIsRestoring(true);
    playRestore();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep/return viewport at hero/top
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "instant" : "smooth",
    });

    if (prefersReduced) {
      setSnappedSectionIds([]);
      setSnappedDockItems([]);
      setIsSnapped(false);
      setIsRestoring(false);
      setCurrentStep(0);
      return;
    }

    const previouslySnappedSections = [...snappedSectionIds];
    setRestoringSectionIds(previouslySnappedSections);
    setSnappedSectionIds([]); // instantly bring back section DOM
    setSnappedDockItems([]); // instantly restore dock items

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
    return () => {
      sRefs.clear();
      dRefs.clear();
    };
  }, []);

  return (
    <SnapContext.Provider
      value={{
        isSnapped,
        isSnapping,
        isRestoring,
        currentStep,
        totalSteps,
        snappingSectionIds,
        snappedSectionIds,
        snappingDockItems,
        snappedDockItems,
        restoringSectionIds,
        activeDustBounds,
        triggerSnap,
        triggerRestore,
        registerSection,
        registerDockItem,
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
      currentStep: 0,
      totalSteps: 4,
      snappingSectionIds: [],
      snappedSectionIds: [],
      snappingDockItems: [],
      snappedDockItems: [],
      restoringSectionIds: [],
      activeDustBounds: [],
      triggerSnap: () => {},
      triggerRestore: () => {},
      registerSection: () => {},
      registerDockItem: () => {},
    };
  }
  return context;
}
