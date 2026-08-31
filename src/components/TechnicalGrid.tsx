import React from "react";

/**
 * TechnicalGrid
 *
 * Document-scoped architectural & technical grid layer.
 * Positioned absolute within the PortfolioShell container to track the
 * full scrollable document height, moving naturally with page content.
 *
 * - Zero React state / Zero runtime scroll overhead
 * - pointer-events: none (completely un-interactive)
 * - Layered behind content (-z-10)
 * - Dual-theme compatible (low-contrast dark & light tokens)
 */
export function TechnicalGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 select-none"
      aria-hidden="true"
    >
      {/* 1. Extended Outer Blueprint Margin Guides (Large Desktops ≥1024px & ≥1280px) */}
      <div className="absolute inset-y-0 -left-12 -right-12 xl:-left-24 xl:-right-24 hidden lg:block">
        {/* Outer Left Blueprint Line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-grid-guide-subtle" />

        {/* Outer Right Blueprint Line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-grid-guide-subtle" />

        {/* Top Header Horizon Line Extension (48px / pt-12 baseline) */}
        <div className="absolute top-12 left-0 right-0 h-px bg-grid-guide-subtle" />

        {/* Faint Architectural Dot Grid in Outer Margin Gutters (Desktop ≥1280px) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />

        {/* CAD Crosshairs at Outer Horizon Intersections */}
        <span className="absolute -left-[4.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>
        <span className="absolute -right-[4.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
          +
        </span>
      </div>

      {/* 2. Main Reading Measure / Content Envelope */}
      <div className="w-full h-full relative">
        {/* Outer Left Guide Line (Aligns with shell outer edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-grid-guide" />

        {/* Outer Right Guide Line (Aligns with shell outer edge) */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-grid-guide" />

        {/* Top Header Horizon Line (48px / pt-12 baseline) */}
        <div className="absolute top-12 left-0 right-0 h-px bg-grid-guide" />

        {/* CAD Drafting Intersection Reticles (+) at Horizon */}
        {/* Outer Left (+) */}
        <span className="absolute -left-[4.5px] top-[43.5px] font-mono text-[9px] text-grid-crosshair leading-none">
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
