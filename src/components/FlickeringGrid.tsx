"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./FlickeringGrid.module.css";
import { useCreativeMode } from "@/features/creative-mode";

/** One document-anchored drafting surface; independent of stars and content layout. */
export function FlickeringGrid() {
  const { gridEnabled } = usePresentationMode();
  const { resolvedTheme } = useTheme();
  const { active: creativeActive, state: creative, effectiveMotion } = useCreativeMode();
  const patternId = useId();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [isPresent, setIsPresent] = useState(gridEnabled);

  useEffect(() => {
    if (gridEnabled) {
      setIsPresent(true);
      return;
    }
    const timeout = window.setTimeout(() => setIsPresent(false), 500);
    return () => window.clearTimeout(timeout);
  }, [gridEnabled]);

  useEffect(() => {
    if (!isPresent) return;
    const surface = surfaceRef.current;
    if (!surface) return;

    // Measure normal-flow body height, not scrollHeight: the overlay must never
    // keep a previous long page artificially tall after navigation or collapse.
    const syncHeight = () => {
      surface.style.height = `${Math.max(document.body.offsetHeight, document.documentElement.clientHeight)}px`;
    };
    const syncVisibility = () => {
      surface.dataset.paused = String(document.hidden);
    };
    syncHeight();
    syncVisibility();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(document.body);
    window.addEventListener("resize", syncHeight);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [isPresent]);

  if (!isPresent && !gridEnabled) return null;

  return (
    <div
      ref={surfaceRef}
      className={styles.surface}
      data-theme={resolvedTheme}
      data-enabled={gridEnabled}
      data-creative-grid={creativeActive ? creative.gridStyle : undefined}
      data-creative-motion={creativeActive ? effectiveMotion : undefined}
      aria-hidden="true"
    >
      <div className={styles.atmosphere} />
      <div className={styles.lattice} />
      <div className={styles.guides} />

      {/* Fixed-size pattern units share the lattice's center / 72px origin.
          SVG patterns repeat without adding DOM nodes as the document grows. */}
      <svg className={styles.drafting} width="100%" height="100%" focusable="false">
        <defs>
          <pattern id={`${patternId}-marks`} x="50%" y="72" width="576" height="576" patternUnits="userSpaceOnUse">
            <path d="M 281 288 H 295 M 288 281 V 295 M 1 0 H 6 M 0 1 V 6 M 570 0 H 575" />
            <circle cx="288" cy="288" r="1.25" fill="currentColor" stroke="none" />
          </pattern>
          <pattern id={`${patternId}-arcs`} x="50%" y="72" width="1440" height="1152" patternUnits="userSpaceOnUse">
            <circle cx="720" cy="216" r="216" />
            <path d="M 360 648 A 360 360 0 0 0 1080 648 M 504 216 H 936 M 720 0 V 432 M 432 504 L 1008 1080" />
            <path d="M 710 216 H 730 M 720 206 V 226" />
          </pattern>
        </defs>
        <rect className={styles.marks} width="100%" height="100%" fill={`url(#${patternId}-marks)`} />
        <rect className={styles.arcs} width="100%" height="100%" fill={`url(#${patternId}-arcs)`} />
      </svg>

      <div className={`${styles.note} ${styles.topLeft}`}>
        <span>FIELD / 01</span>
        <span>DOCUMENT STUDY</span>
        <span className={styles.noteRule} />
      </div>
      <div className={`${styles.note} ${styles.topRight}`}>
        <span>FORM</span><span>FUNCTION</span><span>CONTINUITY</span>
      </div>
      <div className={`${styles.note} ${styles.coordinate}`}>
        <span className={styles.crosshair} />
        <span>X −576 / Y 216</span>
        <span>REFERENCE PLANE</span>
      </div>
      <div className={`${styles.note} ${styles.sideNote}`}>
        <span>01 / ALIGN</span><span>02 / REFINE</span><span>03 / ITERATE</span>
        <span className={styles.noteRule} />
      </div>
      <div className={`${styles.note} ${styles.bottomLeft}`}>
        <span>STRUCTURE</span><span>IN PROGRESS</span>
      </div>
      <div className={`${styles.note} ${styles.bottomRight}`}>
        <span className={styles.crosshair} /><span>END / FIELD</span>
      </div>

      {/* Only these small margin details animate, never the full-page surface. */}
      <span className={`${styles.signal} ${styles.signalLeft}`} />
      <span className={`${styles.signal} ${styles.signalRight}`} />
      <span className={styles.trace} />
    </div>
  );
}

export default FlickeringGrid;
