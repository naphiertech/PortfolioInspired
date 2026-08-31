import React from "react";

interface EditorialDividerProps {
  className?: string;
  withCrosshairs?: boolean;
  withWings?: boolean;
}

/**
 * EditorialDivider
 *
 * Horizontal structural rail component for the unified technical grid.
 * Spans from the left vertical rail to the right vertical rail across the full
 * envelope of PortfolioShell, with CAD drafting reticles (+) at guide intersections.
 *
 * - Perfectly synchronized with PortfolioShell responsive padding (px-4 sm:px-6 md:px-8)
 * - Low-contrast, theme-aware (--grid-guide & --grid-crosshair)
 * - pointer-events: none (completely non-blocking)
 */
export function EditorialDivider({
  className = "my-10 sm:my-12",
  withCrosshairs = true,
  withWings = true,
}: EditorialDividerProps) {
  return (
    <div
      className={`w-full relative flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Container expanding to the exact outer rails of PortfolioShell */}
      <div className="w-full relative -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
        {/* 1. Main Horizontal Rail spanning from left rail to right rail */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-grid-guide" />

        {/* 2. Extended Architectural Wings on Desktop (reaching outer blueprint guides) */}
        {withWings && (
          <>
            <div className="absolute -left-12 xl:-left-24 top-1/2 -translate-y-1/2 w-12 xl:w-24 h-px bg-grid-guide-subtle hidden lg:block" />
            <div className="absolute -right-12 xl:-right-24 top-1/2 -translate-y-1/2 w-12 xl:w-24 h-px bg-grid-guide-subtle hidden lg:block" />
          </>
        )}

        {/* 3. CAD Reticle Crosshairs (+) at Structural Rail Intersections */}
        {withCrosshairs && (
          <>
            {/* Outer Left Margin Guide Intersection (+) */}
            {withWings && (
              <span className="absolute -left-[48px] xl:-left-[96px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden lg:block">
                +
              </span>
            )}

            {/* Left Vertical Rail Intersection (+) */}
            <span className="absolute -left-[4.5px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none">
              +
            </span>

            {/* Right Vertical Rail Intersection (+) */}
            <span className="absolute -right-[4.5px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none">
              +
            </span>

            {/* Outer Right Margin Guide Intersection (+) */}
            {withWings && (
              <span className="absolute -right-[48px] xl:-right-[96px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden lg:block">
                +
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EditorialDivider;
