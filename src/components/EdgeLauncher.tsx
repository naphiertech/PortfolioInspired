"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import styles from "./EdgeLauncher.module.css";

const folderContour =
  "M -4 0.75 H 1 Q 3 0.75 6 4 L 46 28 Q 51 32 51 42 V 121 Q 51 131 46 135 L 6 159 Q 3 162.25 1 162.25 H -4";

/** The two left-edge drawers share one contour, size, spacing and icon treatment. */
export function EdgeLauncher({ icon: Icon, label, controls, ariaLabel, title, isOpen, onToggle, onHover, second = false, className = "" }: {
  icon: LucideIcon;
  label: string;
  controls: string;
  ariaLabel: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onHover?: () => void;
  second?: boolean;
  className?: string;
}) {
  const surfaceId = useId();
  const tooltipId = useId();
  return (
    <aside aria-label={`${title} drawer toggle`} className={`${styles.position} ${second ? styles.second : ""} ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={onHover}
        aria-expanded={isOpen}
        aria-controls={controls}
        aria-label={ariaLabel}
        aria-describedby={tooltipId}
        className={`${styles.button} group relative block border-0 bg-transparent p-0 cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-body)] [filter:drop-shadow(3px_2px_5px_rgba(0,0,0,0.16))] hover:[filter:drop-shadow(4px_2px_7px_rgba(0,0,0,0.22))] transition-[filter] duration-200 motion-reduce:transition-none`}
      >
        <svg viewBox="0 0 52 163" fill="none" aria-hidden="true" className="pointer-events-none block h-full w-full overflow-hidden">
          <defs>
            <linearGradient id={surfaceId} x1="0" y1="0" x2="52" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.045" />
              <stop offset="0.45" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="black" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path d={`${folderContour} Z`} className={`transition-colors duration-200 motion-reduce:transition-none ${isOpen ? "fill-[var(--bg-surface-hover)]" : "fill-[var(--bg-surface)] group-hover:fill-[var(--bg-surface-hover)]"}`} />
          <path d={`${folderContour} Z`} fill={`url(#${surfaceId})`} />
          <path d={folderContour} strokeWidth="1" className={`transition-colors duration-200 motion-reduce:transition-none ${isOpen ? "stroke-[var(--grid-guide)]" : "stroke-[var(--border-dashed)] group-hover:stroke-[var(--grid-guide)]"}`} />
          <path d="M 49.75 43 V 120" strokeWidth="0.5" className="stroke-[var(--border-hairline)]" />
          <Icon x="17.5" y="73" width="17" height="17" strokeWidth="1.65" className="text-[var(--text-body)]" />
          <circle cx="26" cy="135" r="2.75" className={`transition-colors duration-200 motion-reduce:transition-none ${isOpen ? "fill-[var(--text-ink)]" : "fill-[var(--text-faint)]"}`} />
        </svg>
      </button>
      <span id={tooltipId} role="tooltip" className={styles.tooltip}>{label}</span>
    </aside>
  );
}
