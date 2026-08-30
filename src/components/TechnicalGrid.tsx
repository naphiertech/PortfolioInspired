import React from "react";

/**
 * TechnicalGrid
 *
 * Persistent, architectural/editorial structural grid layer.
 * Creates continuous vertical guidelines, CAD intersection crosshairs (+),
 * and subtle margin drafting elements aligning with the 760px reading measure.
 *
 * - Zero React state / Zero runtime overhead
 * - pointer-events: none (completely un-interactive)
 * - Layered behind content (z-0)
 * - Dual-theme compatible (low-contrast dark & light tokens)
 */
export function TechnicalGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Extended Outer Margin Guides (Desktop ≥1024px & ≥1280px) */}
      <div className="max-w-[1040px] xl:max-w-[1140px] mx-auto w-full h-full relative px-4 sm:px-6 hidden lg:block">
        {/* Outer Left Blueprint Margin Line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-grid-guide-subtle" />

        {/* Outer Right Blueprint Margin Line */}
        <div className="absolute right-4 sm:right-6 top-0 bottom-0 w-px bg-grid-guide-subtle" />

        {/* Top Header Horizon Rail across outer envelope */}
        <div className="absolute top-12 left-4 sm:left-6 right-4 sm:right-6 h-px bg-grid-guide-subtle" />

        {/* Faint Architectural Dot Grid in Outer Margin Gutters (Desktop ≥1280px) */}
        <div className="absolute left-6 top-0 bottom-0 w-[calc((100%-760px)/2-24px)] bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />
        <div className="absolute right-6 top-0 bottom-0 w-[calc((100%-760px)/2-24px)] bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />

        {/* Outer Horizon Intersection Crosshairs */}
        <span className="absolute left-[19.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>
        <span className="absolute right-[19.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>
      </div>

      {/* 2. Main Reading Measure Envelope (760px Anchor) */}
      <div className="max-w-reading mx-auto w-full h-full relative px-4 sm:px-6">
        {/* Outer Left Guide Line (Aligns with 760px container edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-grid-guide" />

        {/* Content Column Left Guide Line (Aligns with inner content margin) */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-grid-guide-subtle hidden sm:block" />

        {/* Secondary / Internal Center Guide Line (Aligns with 2-column project & card splits) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-grid-guide-subtle hidden md:block" />

        {/* Content Column Right Guide Line (Aligns with inner content margin) */}
        <div className="absolute right-4 sm:right-6 top-0 bottom-0 w-px bg-grid-guide-subtle hidden sm:block" />

        {/* Outer Right Guide Line (Aligns with 760px container edge) */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-grid-guide" />

        {/* Top Header Horizon Line (48px / pt-12 baseline) */}
        <div className="absolute top-12 left-0 right-0 h-px bg-grid-guide" />

        {/* CAD Drafting Intersection Reticles (+) at Horizon */}
        {/* Outer Left (+) */}
        <span className="absolute -left-[4.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>

        {/* Content Left (+) */}
        <span className="absolute left-[11.5px] sm:left-[19.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden sm:block">
          +
        </span>

        {/* Center Guide (+) */}
        <span className="absolute left-1/2 -translate-x-1/2 top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden md:block">
          +
        </span>

        {/* Content Right (+) */}
        <span className="absolute right-[11.5px] sm:right-[19.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden sm:block">
          +
        </span>

        {/* Outer Right (+) */}
        <span className="absolute -right-[4.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>
      </div>
    </div>
  );
}

export default TechnicalGrid;
