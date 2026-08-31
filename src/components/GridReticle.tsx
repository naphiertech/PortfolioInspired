import React from "react";

export type ReticleVariant =
  | "dot"
  | "cross"
  | "bracket-tl"
  | "bracket-tr"
  | "bracket-bl"
  | "bracket-br";

interface GridReticleProps {
  className?: string;
  variant?: ReticleVariant;
  size?: number;
}

/**
 * GridReticle
 *
 * Precision structural grid intersection marker.
 * Renders a crisp 3px circular dot at guide rail intersections.
 */
export function GridReticle({
  className = "",
  variant = "dot",
  size = 9,
}: GridReticleProps) {
  if (variant === "cross") {
    return (
      <div
        className={`pointer-events-none select-none absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-hidden="true"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 9 9"
          fill="none"
          className="overflow-visible text-grid-crosshair"
        >
          <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
          <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
        </svg>
      </div>
    );
  }

  if (variant === "bracket-tl") {
    return (
      <div
        className={`pointer-events-none select-none absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-hidden="true"
      >
        <svg width={size} height={size} viewBox="0 0 9 9" fill="none" className="text-grid-crosshair">
          <path d="M 8.5 4.5 L 4.5 4.5 L 4.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
        </svg>
      </div>
    );
  }

  if (variant === "bracket-tr") {
    return (
      <div
        className={`pointer-events-none select-none absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-hidden="true"
      >
        <svg width={size} height={size} viewBox="0 0 9 9" fill="none" className="text-grid-crosshair">
          <path d="M 0.5 4.5 L 4.5 4.5 L 4.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
        </svg>
      </div>
    );
  }

  // Default: Precision 3px circular dot
  return (
    <div
      className={`pointer-events-none select-none absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
      aria-hidden="true"
    >
      <span className="w-[3px] h-[3px] rounded-full bg-grid-crosshair block shadow-[0_0_2px_rgba(255,255,255,0.6)] dark:shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
    </div>
  );
}

export default GridReticle;
