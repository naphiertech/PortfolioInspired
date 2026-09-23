import React from "react";

/**
 * TechnicalGrid
 *
 * Clean Editorial / Architectural Layout Grid System.
 * Inspired by Swiss editorial design and architectural drafting frameworks.
 *
 * Visual Hierarchy:
 * 1. Main Content Rails (solid 1px, --grid-guide)
 *    - Anchored precisely to the content container envelope
 *    - left-4 sm:left-6 md:left-8 and right-4 sm:right-6 md:right-8
 * 2. Secondary Alignment Rails (solid 1px, --grid-guide-subtle)
 *    - Anchored to the outer shell container edges (left-0, right-0)
 *    - Responsive: hidden on mobile, visible on sm/md/lg/xl
 * 3. Outer Structural Guides (solid 1px, --grid-guide-subtle)
 *    - Framing outer margins on desktop (-left-12 -right-12 on lg, -left-24 -right-24 on xl)
 * 4. Horizontal Structural Horizon Lines
 *    - Top document horizon (top-0) spanning 100vw
 *    - Content entry horizon (top-12) spanning 100vw (aligns with hero card top)
 * 5. Subtle Architectural Diagonal Hatch Bands
 *    - Positioned strictly in outer margin gutters between top horizon & content entry horizon
 *    - Hidden on mobile, leaving central reading measure completely clear
 */
export function TechnicalGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10 select-none overflow-visible transition-opacity duration-[250ms] ease-out motion-reduce:transition-none"
      style={{ opacity: "var(--creative-grid-opacity, 0)" }}
      aria-hidden="true"
    >
      {/* 1. Outer Viewport Margin Guides (Desktops ≥1024px and ≥1280px) */}
      <div className="absolute inset-y-0 -left-12 -right-12 xl:-left-24 xl:-right-24 hidden lg:block">
        {/* Far Outer Left Architectural Guide */}
        <div className="grid-line-v-subtle absolute left-0 top-0 bottom-0" />

        {/* Far Outer Right Architectural Guide */}
        <div className="grid-line-v-subtle absolute right-0 top-0 bottom-0" />
      </div>

      {/* 2. Main Structural Framing Rails (Frames content envelope with clean 32px desktop / 24px tablet / 16px mobile breathing room) */}
      <div className="absolute inset-y-0 left-0 right-0">
        {/* Main Content Left Rail */}
        <div className="grid-line-v absolute left-0 top-0 bottom-0" />

        {/* Main Content Right Rail */}
        <div className="grid-line-v absolute right-0 top-0 bottom-0" />
      </div>

      {/* 4. Full-Width Horizontal Structural Horizon Lines */}
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

      {/* 5. Subtle Architectural Diagonal Hatch Bands in Outer Gutters (Top horizon transition, ≥1024px) */}
      {/* Left Gutter Hatch Band */}
      <div
        className="absolute top-0 h-12 bg-architectural-hatch border-b border-grid-guide-subtle hidden lg:block"
        style={{
          left: "calc(50% - 50vw)",
          right: "100%",
        }}
      />

      {/* Right Gutter Hatch Band */}
      <div
        className="absolute top-0 h-12 bg-architectural-hatch border-b border-grid-guide-subtle hidden lg:block"
        style={{
          left: "100%",
          right: "calc(50% - 50vw)",
        }}
      />
    </div>
  );
}

export default TechnicalGrid;
