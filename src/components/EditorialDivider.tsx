import React from "react";
import { GridReticle, ReticleVariant } from "./GridReticle";

interface EditorialDividerProps {
  className?: string;
  withCrosshairs?: boolean;
  reticleVariant?: ReticleVariant;
}

/**
 * EditorialDivider
 *
 * Full-viewport CAD Drafting Blueprint horizontal divider.
 * Spans seamlessly across the entire browser viewport (100vw) with 1px dashed
 * architectural lines and precision 3px circular dots anchored at the vertical rails.
 */
export function EditorialDivider({
  className = "my-10 sm:my-12",
  withCrosshairs = true,
  reticleVariant = "dot",
}: EditorialDividerProps) {
  return (
    <div
      className={`w-full relative flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Full-viewport continuous 1px dashed horizontal line */}
      <div
        className="grid-line-h absolute top-1/2"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 2. Precision circular dots anchored at the vertical rails */}
      {withCrosshairs && (
        <div className="w-full relative -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8">
          {/* Left Vertical Rail Intersection Dot */}
          <GridReticle variant={reticleVariant} className="left-0 top-1/2" />

          {/* Right Vertical Rail Intersection Dot */}
          <GridReticle variant={reticleVariant} className="left-full top-1/2" />
        </div>
      )}
    </div>
  );
}

export default EditorialDivider;
