import React from "react";
import { GridReticle } from "./GridReticle";

/**
 * TechnicalGrid
 *
 * CAD Drafting Blueprint structural grid layer.
 * Positioned absolute within PortfolioShell, running from top: 0 to bottom: 0
 * for the entire scrollable height of the document.
 *
 * - 1px dashed vertical guide rails
 * - Full-viewport 1px dashed horizon line
 * - Precision 3px circular intersection dots
 */
export function TechnicalGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 select-none overflow-visible"
      aria-hidden="true"
    >
      {/* 1. Extended Outer Blueprint Margin Guides (Large Desktops ≥1024px & ≥1280px) */}
      <div className="absolute inset-y-0 -left-12 -right-12 xl:-left-24 xl:-right-24 hidden lg:block">
        {/* Outer Left Blueprint Guide */}
        <div className="grid-line-v-subtle absolute left-0 top-0 bottom-0" />

        {/* Outer Right Blueprint Guide */}
        <div className="grid-line-v-subtle absolute right-0 top-0 bottom-0" />

        {/* Faint Architectural Dot Grid in Outer Margin Gutters (Desktop ≥1280px) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-technical-dots opacity-40 dark:opacity-20 hidden xl:block" />

        {/* Outer Horizon Intersection Dots */}
        <GridReticle variant="dot" className="left-0 top-0" />
        <GridReticle variant="dot" className="left-full top-0" />
      </div>

      {/* 2. Main Content Envelope */}
      <div className="w-full h-full relative">
        {/* Left Guide Rail (Aligns with shell outer edge) */}
        <div className="grid-line-v absolute left-0 top-0 bottom-0" />

        {/* Right Guide Rail (Aligns with shell outer edge) */}
        <div className="grid-line-v absolute right-0 top-0 bottom-0" />

        {/* Top Document Horizon Line spanning 100vw */}
        <div
          className="grid-line-h absolute top-0"
          style={{
            width: "100vw",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Precision 3px Circular Dots at Top Document Boundary */}
        <GridReticle variant="dot" className="left-0 top-0" />
        <GridReticle variant="dot" className="left-full top-0" />
      </div>
    </div>
  );
}

export default TechnicalGrid;
