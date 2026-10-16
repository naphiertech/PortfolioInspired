import React from "react";
import { GridReticle } from "./GridReticle";

/**
 * TechnicalGrid
 *
 * Clean Editorial / Architectural Layout Grid System.
 * Inspired by Swiss editorial design and architectural drafting frameworks.
 *
 * Visual Hierarchy:
 * 1. Main Structural Framing Rails (1px tapered vertical lines, --grid-guide)
 *    - Anchored to the outer shell container edges (left-0, right-0)
 * 2. Outer Blueprint Margin Guides (1px dashed lines, --grid-guide-subtle)
 *    - Framing outer margins on desktop (-left-12 -right-12 on lg, -left-24 -right-24 on xl)
 * 3. Horizontal Structural Horizon Lines
 *    - Top document horizon (top-0) spanning 100vw
 *    - Content entry horizon (top-12) spanning 100vw (aligns with hero card top)
 * 4. Precision CAD Intersection Crosshairs (+)
 *    - Anchored at vertical rail and horizon intersections
 * 5. 45° Architectural Diagonal Hatch Accents
 *    - Positioned in outer margin gutters and subtle side ruler strips on desktop
 */
export function TechnicalGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 select-none overflow-visible transition-opacity duration-[250ms] ease-out motion-reduce:transition-none"
      style={{ opacity: "var(--creative-grid-opacity, 1)" }}
      aria-hidden="true"
    >
      {/* 1. Outer Viewport Margin Guides (Desktops ≥1024px and ≥1280px) */}
      <div className="absolute inset-y-0 -left-12 -right-12 xl:-left-24 xl:-right-24 hidden lg:block">
        {/* Far Outer Left Architectural Guide */}
        <div className="grid-line-v-subtle absolute left-0 top-0 bottom-0" />

        {/* Far Outer Right Architectural Guide */}
        <div className="grid-line-v-subtle absolute right-0 top-0 bottom-0" />

        {/* Outer Horizon Crosshair Reticles (at top-12 / 48px) */}
        <GridReticle variant="cross" size={7} className="left-0 top-12 opacity-60" />
        <GridReticle variant="cross" size={7} className="left-full top-12 opacity-60" />
      </div>

      {/* 2. Main Structural Framing Rails (Frames content envelope with clean breathing room) */}
      <div className="absolute inset-y-0 left-0 right-0">
        {/* Main Content Left Rail */}
        <div className="grid-line-v absolute left-0 top-0 bottom-0" />

        {/* Main Content Right Rail */}
        <div className="grid-line-v absolute right-0 top-0 bottom-0" />

        {/* Subtle Vertical Architectural Hatch Ruler Strips Flanking Main Rails (Desktop ≥1024px) */}
        <div
          className="absolute top-12 bottom-24 -left-2.5 w-2.5 bg-architectural-hatch opacity-55 hidden lg:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.4) 35%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.4) 35%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-12 bottom-24 -right-2.5 w-2.5 bg-architectural-hatch opacity-55 hidden lg:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.4) 35%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.4) 35%, transparent 100%)",
          }}
        />

        {/* Primary Horizon Crosshair Reticles (at top-12 / 48px) */}
        <GridReticle variant="cross" size={9} className="left-0 top-12" />
        <GridReticle variant="cross" size={9} className="left-full top-12" />
      </div>

      {/* 3. Full-Width Horizontal Structural Horizon Lines */}
      {/* Top Document Horizon Line spanning 100vw */}
      <div
        className="grid-line-h absolute top-0"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Hero / Content Entry Horizon Line spanning 100vw (at pt-12 / 48px, aligning with hero top border) */}
      <div
        className="grid-line-h absolute top-12"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Crisp Central Horizon Segment Between Main Rails */}
      <div
        className="absolute top-12 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--grid-guide-strong)" }}
      />

      {/* 4. 45° Architectural Diagonal Hatch Bands in Outer Top Gutters (≥1024px) */}
      {/* Left Gutter Hatch Band */}
      <div
        className="absolute top-0 h-12 bg-architectural-hatch hidden lg:block"
        style={{
          left: "calc(50% - 50vw)",
          right: "100%",
          WebkitMaskImage: "linear-gradient(to left, black 0%, rgba(0,0,0,0.5) 45%, transparent 95%)",
          maskImage: "linear-gradient(to left, black 0%, rgba(0,0,0,0.5) 45%, transparent 95%)",
        }}
      />

      {/* Right Gutter Hatch Band */}
      <div
        className="absolute top-0 h-12 bg-architectural-hatch hidden lg:block"
        style={{
          left: "100%",
          right: "calc(50% - 50vw)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.5) 45%, transparent 95%)",
          maskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.5) 45%, transparent 95%)",
        }}
      />
    </div>
  );
}

export default TechnicalGrid;
