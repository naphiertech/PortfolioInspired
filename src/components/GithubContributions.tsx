"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ContributionTruck } from "./ContributionTruck";
import styles from "./ContributionTruck.module.css";
import { AUTHOR_INFO, SOCIAL_PROFILES } from "@/lib/siteConfig";
import {
  type ContributionData,
  fetchCombinedContributions,
} from "@/lib/githubContributions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ContributionTooltipPortalProps {
  text: string;
  target: HTMLElement;
}

function ContributionTooltipPortal({ text, target }: ContributionTooltipPortalProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip || !target) return;

    const updatePosition = () => {
      if (!target.isConnected) return;

      const cellRect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 8;
      const padding = 8;

      // If cell is scrolled completely out of viewport, hide tooltip
      if (
        cellRect.bottom < 0 ||
        cellRect.top > viewportHeight ||
        cellRect.right < 0 ||
        cellRect.left > viewportWidth
      ) {
        tooltip.style.opacity = "0";
        return;
      }
      tooltip.style.opacity = "1";

      // Vertical placement: default above, flip below if not enough room above
      const spaceAbove = cellRect.top;
      const placeBelow = spaceAbove < tooltipRect.height + gap + padding;

      let top = placeBelow
        ? cellRect.bottom + gap
        : cellRect.top - tooltipRect.height - gap;

      // Prevent vertical overflow outside viewport
      top = Math.max(padding, Math.min(viewportHeight - tooltipRect.height - padding, top));

      // Horizontal placement: center above cell, clamp within viewport edges
      const cellCenter = cellRect.left + cellRect.width / 2;
      let left = cellCenter - tooltipRect.width / 2;

      // Prevent overflow on left and right viewport edges
      if (left < padding) {
        left = padding;
      } else if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - padding - tooltipRect.width;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    };

    updatePosition();

    // Recalculate on window scroll, container scroll (capture phase catches horizontal container scroll), and resize
    window.addEventListener("scroll", updatePosition, { capture: true, passive: true });
    window.addEventListener("resize", updatePosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", updatePosition, { capture: true });
      window.removeEventListener("resize", updatePosition);
    };
  }, [target, text]);

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none px-2.5 py-1 bg-surface text-ink border border-border-hairline text-[11px] font-mono rounded-[4px] shadow-lg backdrop-blur-sm whitespace-nowrap"
      style={{
        top: 0,
        left: 0,
        opacity: 0,
      }}
    >
      {text}
    </div>,
    document.body
  );
}

export function GithubContributions() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    text: string;
    target: HTMLElement;
  } | null>(null);

  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setMounted(true);
    return () => {
      if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchContributions() {
      try {
        const combined = await fetchCombinedContributions();
        if (isMounted) {
          if (combined) {
            setData(combined);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full mt-4 pt-1 font-mono text-[11px] text-muted-foreground flex items-center justify-between">
        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink transition-colors"
        >
          View real contributions on {AUTHOR_INFO.handle} ↗
        </a>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="w-full mt-5 pt-1 space-y-2 select-none animate-pulse">
        <div className="h-3 w-48 bg-muted-subtle rounded" />
        <div className="h-20 w-full max-w-[690px] bg-muted-subtle/50 rounded border border-border-hairline" />
        <div className="h-3 w-64 bg-muted-subtle rounded" />
      </div>
    );
  }

  // Calculate column count
  const columnCount = data.weeks.length;

  return (
    <div className="w-full">
      <ContributionTruck>
      <div className="relative min-w-0">
        <div className="w-full">
          {/* Month Labels Header */}
          <div className={`${styles.months} hidden sm:block font-mono text-muted-foreground/90`}>
            {data.months.map((m, idx) => {
              // Keep month labels aligned with the fluid week columns.
              const leftPos = (m.weekIndex / columnCount) * 100;
              return (
                <span
                  key={`${m.name}-${idx}`}
                  className={styles.month}
                  style={{ left: `${leftPos}%` }}
                >
                  {m.name}
                </span>
              );
            })}
          </div>

          {/* 7-Row Contribution Grid */}
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {data.weeks.map((week, weekIdx) =>
              week.days.map((day, dayIdx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${weekIdx}-${dayIdx}`}
                      className={`${styles.cell} opacity-0`}
                    />
                  );
                }

                // Inline level styles for perfect theme matching matching user reference screenshot
                let levelStyle: React.CSSProperties = {};
                if (day.level === 0) {
                  levelStyle = { backgroundColor: "var(--calendar-cell-empty, rgba(120, 120, 128, 0.15))" };
                } else if (day.level === 1) {
                  levelStyle = { backgroundColor: "var(--calendar-cell-lvl-1, #52525b)" };
                } else if (day.level === 2) {
                  levelStyle = { backgroundColor: "var(--calendar-cell-lvl-2, #71717a)" };
                } else if (day.level === 3) {
                  levelStyle = { backgroundColor: "var(--calendar-cell-lvl-3, #a1a1aa)" };
                } else if (day.level === 4) {
                  levelStyle = { backgroundColor: "var(--calendar-cell-lvl-4, #f4f4f5)" };
                }

                return (
                  <div
                    key={day.date}
                    className={`${styles.cell} transition-transform duration-100 hover:scale-125 cursor-pointer relative group`}
                    style={levelStyle}
                    title={day.tooltip}
                    onClick={(e) => {
                      if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
                      const target = e.currentTarget;
                      setHoveredCell({ text: day.tooltip, target });
                    }}
                    onMouseEnter={(e) => {
                      if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
                      const target = e.currentTarget;
                      tooltipTimerRef.current = setTimeout(() => {
                        tooltipTimerRef.current = null;
                        if (target.isConnected) setHoveredCell({ text: day.tooltip, target });
                      }, 80);
                    }}
                    onMouseLeave={() => {
                      if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
                      tooltipTimerRef.current = null;
                      setHoveredCell(null);
                    }}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>

      {/* Total Contributions Subtitle */}
      <div className={`${styles.summary} hidden sm:flex font-mono text-muted-foreground`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-ink font-medium">Total</span>
            <span className="text-ink font-semibold">{data.total.toLocaleString()}</span>
            <span>contributions in {data.year || new Date().getFullYear()}</span>
          </div>
          <span className="text-muted-foreground/60 text-[10px] sm:text-[11px] font-normal">
            {data.username.includes("+")
              ? "(@naphiertech + @bagatata05)"
              : `(@${data.username})`}
          </span>
        </div>

        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/70 hover:text-ink transition-colors duration-150 text-[10px] sm:text-[11px] whitespace-nowrap"
        >
          {AUTHOR_INFO.handle} ↗
        </a>
      </div>

      {/* Floating Tooltip Portal (Anchored directly to hovered cell, escaping transformed ancestors) */}
      {mounted && hoveredCell && typeof document !== "undefined" && (
        <ContributionTooltipPortal
          text={hoveredCell.text}
          target={hoveredCell.target}
        />
      )}
    </ContributionTruck>

    {/* Mobile-only subtle swipe hint */}
    <div
      className="flex sm:hidden items-center justify-end gap-1 mt-1.5 px-0.5 font-mono text-[9px] text-muted-foreground/40 select-none tracking-wider"
      aria-hidden="true"
    >
      <span>← swipe to explore →</span>
    </div>
  </div>
);
}

export default GithubContributions;
