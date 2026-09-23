"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useCreativeMode } from "../context/CreativeModeContext";
import { CreativeAnnotation, type CreativeNote } from "./CreativeAnnotation";
import styles from "../creativeNotes.module.css";

type AnchorNote = CreativeNote & { selector: string };
const notes: AnchorNote[] = [
  { number: "01", side: "left", selector: '[data-creative-note="hero"], section[aria-label="Identity and candidate overview"]', title: "Start with the person", description: "A little context before the projects and code." },
  { number: "02", side: "right", selector: '[aria-label="Toggle Creative mode"]', title: "Make it your own", description: "Try a different rhythm of type, space and motion." },
  { number: "03", side: "left", selector: '[data-creative-note="projects"], section[aria-label="Selected Projects"], section[aria-label="Selected projects"]', title: "Built to be explored", description: "Real projects, thoughtful decisions. Take a closer look." },
  { number: "04", side: "right", selector: '[data-creative-note="activity"], section[aria-label="Now and Activity"]', title: "Progress leaves traces", description: "A quiet record of building, learning and shipping." },
  { number: "05", side: "right", selector: '[data-creative-note="tools"], section[aria-label="Tech Stack"], section[aria-label="Technologies used"]', title: "Tools behind the work", description: "Different pieces, brought together to make things work." },
];

interface Placement { note: AnchorNote; top: number }

/** Read section geometry only on layout changes; never run a scroll/animation loop. */
export function CreativeNotes({ contentRef }: { contentRef: RefObject<HTMLElement | null> }) {
  const { active, state, effectiveMotion } = useCreativeMode();
  const { mode } = usePresentationMode();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);

  useEffect(() => {
    const content = contentRef.current;
    const layer = layerRef.current;
    const shell = layer?.parentElement;
    if (!active || !content || !layer || !shell) return;

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
      // Full note + curved connector + a safe distance from the viewport edge.
      const room = { left: bounds.left >= 236, right: viewport - bounds.right >= 236 };
      const occupied: Record<CreativeNote["side"], number[]> = { left: [], right: [] };
      const next: Placement[] = [];
      if (viewport >= 1024) {
        for (const note of notes) {
          if (!room[note.side]) continue;
          const anchor = Array.from(content.querySelectorAll<HTMLElement>(note.selector))
            .find(element => element.getClientRects().length && element.getBoundingClientRect().height > 0);
          if (!anchor) continue;
          const target = anchor.querySelector<HTMLElement>("h1, h2") ?? anchor;
          const top = layoutTop(target);
          // Omit a note rather than move its arrow away from the section it describes.
          if (occupied[note.side].some(other => Math.abs(other - top) < 190)) continue;
          occupied[note.side].push(top);
          next.push({ note, top });
          if (viewport < 1280 && next.length === 3) break;
        }
      }
      setPlacements(previous => previous.length === next.length && previous.every((item, index) =>
        item.note.number === next[index].note.number && item.top === next[index].top
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
  }, [active, contentRef, mode, pathname, state]);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <AnimatePresence>
        {active && placements.map(({ note, top }, index) => (
          <CreativeAnnotation key={`${mode}:${pathname}:${note.number}`} note={note} top={top} index={index} quiet={!!reducedMotion || effectiveMotion === "off"} />
        ))}
      </AnimatePresence>
    </div>
  );
}
