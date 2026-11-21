import React from "react";
import { GridReticle, ReticleVariant } from "./GridReticle";

interface EditorialDividerProps {
  className?: string;
  withCrosshairs?: boolean;
  reticleVariant?: ReticleVariant;
  variant?: "line" | "hatch";
}

/**
 * EditorialDivider
 *
 * Full-viewport architectural horizontal section separator.
 * - "hatch" (default): full-bleed (100vw) 45° diagonal hatched architectural band framed by
 *   1px dashed top and bottom drafting borders.
 * - "line": 1px two-tier horizon line with optional CAD crosshair reticles.
 */
export function EditorialDivider({
  className = "my-4 sm:my-5",
  withCrosshairs = true,
  reticleVariant = "cross",
  variant = "hatch",
}: EditorialDividerProps) {
  if (variant === "hatch") {
    return (
      <div
        className={`w-full relative h-6 sm:h-7 pointer-events-none select-none transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${className}`}
        style={{ opacity: "var(--creative-grid-opacity, 1)" }}
        aria-hidden="true"
      >
        <div
          className="editorial-hatch-band absolute inset-y-0"
          style={{
            width: "100vw",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full relative flex items-center justify-center pointer-events-none select-none transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${className}`}
      style={{ opacity: "var(--creative-grid-opacity, 1)" }}
      aria-hidden="true"
    >
      {/* 1. Full-viewport continuous 1px horizontal structural line */}
      <div
        className="grid-line-h absolute top-1/2"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 2. Central reading-envelope reinforced line segment */}
      <div
        className="absolute -left-4 -right-4 sm:-left-6 sm:-right-6 md:-left-8 md:-right-8 top-1/2 -translate-y-1/2 h-px"
        style={{ backgroundColor: "var(--grid-guide-strong)" }}
      />

      {/* 3. Precision CAD Crosshair Reticles (+) at Vertical Rail Intersections */}
      {withCrosshairs && (
        <div className="absolute -left-4 -right-4 sm:-left-6 sm:-right-6 md:-left-8 md:-right-8 top-1/2">
          {/* Primary Left Rail Intersection */}
          <GridReticle variant={reticleVariant} size={9} className="left-0 top-0" />

          {/* Primary Right Rail Intersection */}
          <GridReticle variant={reticleVariant} size={9} className="left-full top-0" />

          {/* Outer Desktop Blueprint Rail Intersections (≥1024px) */}
          <GridReticle
            variant={reticleVariant}
            size={7}
            className="-left-12 xl:-left-24 top-0 opacity-55 hidden lg:flex"
          />
          <GridReticle
            variant={reticleVariant}
            size={7}
            className="left-[calc(100%+3rem)] xl:left-[calc(100%+6rem)] top-0 opacity-55 hidden lg:flex"
          />
        </div>
      )}
    </div>
  );
}

export default EditorialDivider;
