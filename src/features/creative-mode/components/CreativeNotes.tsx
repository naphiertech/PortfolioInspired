"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { focusNavItems } from "@/features/presentation-modes/modes/focus/components/FocusNavigation";
import { useCreativeMode } from "../context/CreativeModeContext";
import { CreativeAnnotation, type CreativeNote } from "./CreativeAnnotation";
import styles from "../creativeNotes.module.css";

type AnchorNote = Omit<CreativeNote, "number"> & { selector: string; sectionTop?: boolean };
// Each set follows its page's reading order. Project outcomes provide the lower
// evidence anchor; the contribution graph precedes projects in Minimal mode.
const annotationSets: Record<"default" | "focus" | "minimal", AnchorNote[]> = {
  default: [
    { side: "left", selector: '[data-creative-note="about"]', title: "Start with me", description: "A quick introduction before the systems, projects and experiments." },
    { side: "right", selector: '[aria-label="Toggle Creative mode"]', title: "Shape the experience", description: "Change the rhythm, spacing and motion. Make the interface yours." },
    { side: "left", selector: 'section[aria-label="Now and Activity"]', title: "What I'm building", description: "Current work, experiments and things still taking shape." },
    { side: "right", selector: 'section[aria-label="Selected Projects"]', title: "Follow the process", description: "Projects, tools and experience connected through the way I build." },
    { side: "left", selector: '[data-creative-note="moments"]', title: "Keep exploring", description: "There are details, interactions and small surprises throughout the page." },
  ],
  focus: [
    { side: "left", selector: '[data-creative-note="about"]', title: "Context first", description: "Who I am, what I work on, and where I'm heading." },
    { side: "right", selector: '[aria-label="Toggle Creative mode"]', title: "Tune the system", description: "Adjust type, spacing and motion without changing the content." },
    { side: "left", selector: 'section[aria-label="Selected projects"]', title: "Work with intent", description: "Experience and projects organized around practical engineering." },
    { side: "right", selector: 'section[aria-label="Selected projects"] article:last-child', title: "Evidence matters", description: "Progress, tools and outcomes leave a technical record." },
    { side: "left", selector: 'section[aria-label="Technologies used"]', title: "Details support decisions", description: "Stack, credentials and project context are here when you need them." },
  ],
  minimal: [
    { side: "left", selector: '[data-creative-note="about"]', title: "Start with the person", description: "A little context before the projects and code." },
    { side: "right", selector: '[aria-label="Toggle Creative mode"]', title: "Make it your own", description: "Try a different rhythm of type, space and motion." },
    { side: "left", selector: '[data-creative-note="projects"]', title: "Built to be explored", description: "Real projects, thoughtful decisions. Take a closer look." },
    { side: "right", selector: '[data-creative-note="projects"] article:last-child', title: "Progress leaves traces", description: "A quiet record of building, learning and shipping." },
    { side: "left", selector: '[data-creative-note="tools"]', title: "Tools behind the work", description: "Different pieces brought together to make things work." },
  ],
};

interface Placement { note: CreativeNote; top: number; targetTop: number; targetLeft?: number }

/** Read section geometry only on layout changes; never run a scroll/animation loop. */
export function CreativeNotes({ contentRef }: { contentRef: RefObject<HTMLElement | null> }) {
  const { active, state, effectiveMotion } = useCreativeMode();
  const { mode } = usePresentationMode();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);

  // Focus Home route resolution from existing navigation configuration
  const focusHomeRoute = focusNavItems.find((item) => item.name === "Home")?.href ?? "/";
  const cleanPathname = pathname ? pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/" : "/";
  const isFocusHome = mode === "focus" ? cleanPathname === focusHomeRoute : true;
  const notes = mode === "agent" ? null : annotationSets[mode];
  const showNotes = active && notes !== null && isFocusHome;

  useEffect(() => {
    const content = contentRef.current;
    const layer = layerRef.current;
    const shell = layer?.parentElement;
    if (!showNotes || !notes || !content || !layer || !shell) return;

    let frame = 0;
    let disposed = false;
    const layoutTop = (element: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = element;
      while (current && current !== shell) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }
      return top;
    };
    const measure = () => {
      frame = 0;
      const bounds = shell.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      // Keep the full set in the margins; never squeeze it into page content.
      const noteWidth = Math.min(168, bounds.left - 68, viewport - bounds.right - 68);
      layer.style.setProperty("--creative-note-width", `${Math.max(120, noteWidth)}px`);
      const next: Placement[] = [];
      if (viewport >= 1024 && noteWidth >= 120) {
        const targets = notes.map((note, index) => {
          const anchor = Array.from(content.querySelectorAll<HTMLElement>(note.selector))
            .find(element => element.getClientRects().length && element.getBoundingClientRect().height > 0);
          if (!anchor) return null;
          const target = note.sectionTop ? anchor : anchor.querySelector<HTMLElement>("h1, h2, h3") ?? anchor;
          const rect = target.getBoundingClientRect();
          const targetTop = layoutTop(target) + (index === 0 ? 14 : Math.min(16, rect.height / 2));
          const targetLeft = rect.left - bounds.left;
          return { note, targetTop, targetLeft };
        });
        // Wait for async page content rather than displaying a broken partial sequence.
        if (targets.every(target => target !== null)) {
          const occupied = { left: -Infinity, right: -Infinity };
          let previousTop = 12;
          targets.forEach(({ note, targetTop, targetLeft }, index) => {
            const number = String(index + 1).padStart(2, "0");
            let top: number;
            if (index === 0) {
              // Annotation #01 is attached directly to the about paragraph block
              top = Math.max(targetTop - 52, occupied[note.side]);
            } else {
              // Notes #02–#05 preserve their exact original calculation and placement
              const preferredTop = targetTop - 27;
              top = Math.max(preferredTop, previousTop + 64, occupied[note.side]);
              previousTop = top;
            }
            const height = layer.querySelector<HTMLElement>(`[data-annotation-number="${number}"]`)?.offsetHeight ?? 180;
            next.push({ note: { ...note, number }, top, targetTop, targetLeft });
            occupied[note.side] = top + height + 24;
          });
        }
      }
      setPlacements(previous => previous.length === next.length && previous.every((item, index) =>
        item.note.title === next[index].note.title && item.note.description === next[index].note.description &&
        item.note.side === next[index].note.side && item.top === next[index].top && item.targetTop === next[index].targetTop &&
        item.targetLeft === next[index].targetLeft
      ) ? previous : next);
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    const observeSections = () => {
      resize.disconnect();
      resize.observe(content);
      resize.observe(shell);
      content.querySelectorAll("section, header").forEach(element => resize.observe(element));
      schedule();
    };
    // Async sections and route content can mount after the shell.
    const mutations = new MutationObserver(observeSections);
    mutations.observe(content, { childList: true, subtree: true });
    observeSections();
    window.addEventListener("resize", schedule);
    content.addEventListener("load", schedule, true);
    document.fonts.addEventListener("loadingdone", schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
      content.removeEventListener("load", schedule, true);
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, [showNotes, notes, contentRef, mode, pathname, state]);

  // Remove the entire Home annotation layer immediately on Focus subpages.
  if (!isFocusHome) return null;

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <AnimatePresence>
        {showNotes && placements.map(({ note, top, targetTop, targetLeft }, index) => {
          return (
            <CreativeAnnotation
              key={`${mode}:${pathname}:${note.number}`}
              note={note}
              top={top}
              targetTop={targetTop}
              targetLeft={targetLeft}
              index={index}
              quiet={!!reducedMotion || effectiveMotion === "off"}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
