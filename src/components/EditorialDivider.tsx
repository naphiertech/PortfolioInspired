import React from "react";
import { ReticleVariant } from "./GridReticle";

interface EditorialDividerProps {
  className?: string;
  withCrosshairs?: boolean;
  reticleVariant?: ReticleVariant;
}

/**
 * EditorialDivider
 *
 * Full-viewport architectural horizontal section line.
 * Spans seamlessly across the entire browser viewport (100vw) with a crisp 1px solid line
 * that naturally intersects vertical rails to form subtle crosshairs without circular dots.
 */
export function EditorialDivider({
  className = "my-10 sm:my-12",
}: EditorialDividerProps) {
  return (
    <div
      className={`w-full relative flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Full-viewport continuous 1px solid horizontal structural line */}
      <div
        className="grid-line-h absolute top-1/2"
        style={{
          width: "100vw",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

export default EditorialDivider;
