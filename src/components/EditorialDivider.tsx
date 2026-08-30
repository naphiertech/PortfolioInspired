import React from "react";

interface EditorialDividerProps {
  className?: string;
  withCrosshairs?: boolean;
  withWings?: boolean;
}

/**
 * EditorialDivider
 *
 * Horizontal structural rail component for the technical/editorial grid.
 * Spans across the content column and extends out toward the vertical guide rails
 * with CAD drafting reticle crosshairs (+) at guide intersections.
 *
 * - Responsive: full grid on desktop, simplified on mobile
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
      {/* Container matching full reading column width */}
      <div className="w-full relative -mx-4 sm:-mx-6 px-4 sm:px-6">
        {/* 1. Main Horizontal Rail spanning full 760px envelope */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-grid-guide" />

        {/* 2. Extended Architectural Wings on Desktop (reaching outer blueprint guides) */}
        {withWings && (
          <>
            <div className="absolute -left-12 xl:-left-24 top-1/2 -translate-y-1/2 w-12 xl:w-24 h-px bg-grid-guide-subtle hidden lg:block" />
            <div className="absolute -right-12 xl:-right-24 top-1/2 -translate-y-1/2 w-12 xl:w-24 h-px bg-grid-guide-subtle hidden lg:block" />
          </>
        )}

        {/* 3. CAD Reticle Crosshairs (+) at Structural Guide Intersections */}
        {withCrosshairs && (
          <>
            {/* Outer Left Margin Guide Intersection (+) */}
            {withWings && (
              <span className="absolute -left-[48px] xl:-left-[96px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden lg:block">
                +
              </span>
            )}

            {/* Reading Measure Left Edge (+) */}
            <span className="absolute -left-[4.5px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none">
              +
            </span>

            {/* Content Margin Left (+) */}
            <span className="absolute left-[11.5px] sm:left-[19.5px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden sm:block">
              +
            </span>

            {/* Internal Secondary Center Axis (+) */}
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden md:block">
              +
            </span>

            {/* Content Margin Right (+) */}
            <span className="absolute right-[11.5px] sm:right-[19.5px] top-1/2 -translate-y-[5.5px] font-mono text-[9px] text-grid-crosshair leading-none hidden sm:block">
              +
            </span>

            {/* Reading Measure Right Edge (+) */}
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
