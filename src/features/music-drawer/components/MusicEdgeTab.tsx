"use client";

import React, { useId } from "react";
import { Music2 } from "lucide-react";

interface MusicEdgeTabProps {
  isOpen: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

// The left side continues beyond the viewport; only the outer contour is outlined.
const folderContour =
  "M -4 0.75 H 1 Q 3 0.75 6 4 L 46 28 Q 51 32 51 42 V 121 Q 51 131 46 135 L 6 159 Q 3 162.25 1 162.25 H -4";

/** Viewport-attached folder tab with the same silhouette at every screen size. */
export function MusicEdgeTab({
  isOpen,
  isPlaying,
  onToggle,
  className = "",
}: MusicEdgeTabProps) {
  const surfaceId = useId();

  return (
    <aside
      aria-label="Music folder drawer toggle"
      className={`fixed left-0 top-[24%] sm:top-[26%] z-40 select-none ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="music-drawer-panel"
        aria-label={
          isOpen
            ? "Close music drawer"
            : isPlaying
            ? "Open music drawer (music playing)"
            : "Open music drawer"
        }
        className="group relative block aspect-[52/163] w-[48.5px] sm:w-[52px] border-0 bg-transparent p-0 focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-body)] [filter:drop-shadow(3px_2px_5px_rgba(0,0,0,0.16))] hover:[filter:drop-shadow(4px_2px_7px_rgba(0,0,0,0.22))] transition-[filter] duration-200 motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 52 163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="pointer-events-none block h-full w-full overflow-hidden"
        >
          <defs>
            <linearGradient
              id={surfaceId}
              x1="0" y1="0" x2="52" y2="34"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.045" />
              <stop offset="0.45" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="black" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <path
            d={`${folderContour} Z`}
            className={`transition-colors duration-200 motion-reduce:transition-none ${
              isOpen
                ? "fill-[var(--bg-surface-hover)]"
                : "fill-[var(--bg-surface)] group-hover:fill-[var(--bg-surface-hover)]"
            }`}
          />
          <path d={`${folderContour} Z`} fill={`url(#${surfaceId})`} />
          <path
            d={folderContour}
            strokeWidth="1"
            className={`transition-colors duration-200 motion-reduce:transition-none ${
              isOpen
                ? "stroke-[var(--grid-guide)]"
                : "stroke-[var(--border-dashed)] group-hover:stroke-[var(--grid-guide)]"
            }`}
          />
          <path
            d="M 49.75 43 V 120"
            strokeWidth="0.5"
            className="stroke-[var(--border-hairline)]"
          />

          <Music2
            x="17.5"
            y="27"
            width="17"
            height="17"
            strokeWidth="1.65"
            className="text-[var(--text-body)]"
          />
          <text
            x="26"
            y="89"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(90 26 89)"
            className="fill-[var(--text-body)] font-mono text-[11px] font-medium tracking-[0.12em]"
          >
            &lt;MUSIC/&gt;
          </text>
          <circle
            cx="26"
            cy="135"
            r="2.75"
            className={`transition-colors duration-200 motion-reduce:transition-none ${
              isOpen
                ? "fill-[var(--text-ink)]"
                : "fill-[var(--text-faint)]"
            }`}
          />
        </svg>
      </button>
    </aside>
  );
}
