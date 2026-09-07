"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AUTHOR_INFO, GITHUB_USERNAME, SOCIAL_PROFILES } from "@/lib/siteConfig";

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

interface ContributionDay {
  date: string;
  level: number;
  count: number;
  tooltip: string;
  dayOfWeek: number;
}

interface ContributionWeek {
  days: (ContributionDay | null)[];
}

interface MonthLabel {
  name: string;
  weekIndex: number;
}

interface ContributionData {
  username: string;
  year?: number;
  total: number;
  totalText: string;
  weeks: ContributionWeek[];
  months: MonthLabel[];
  updatedAt: string;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchContributions() {
      try {
        const res = await fetch(`/api/github-contributions?username=${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error("Failed to fetch contributions");
        const json = await res.json();
        if (isMounted) {
          if (json.success && json.data) {
            setData(json.data);
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
    <div className="w-full mt-5 pt-1 select-none">
      <div className="overflow-x-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 -mx-2 px-2">
        <div className="inline-block min-w-max">
          {/* Month Labels Header */}
          <div className="relative h-4 mb-1.5 font-mono text-[10px] text-muted-foreground/80">
            {data.months.map((m, idx) => {
              // Calculate horizontal offset based on week index (each column is 10px + 3px gap = 13px)
              const leftPos = m.weekIndex * 13;
              return (
                <span
                  key={`${m.name}-${idx}`}
                  className="absolute transform -translate-x-0"
                  style={{ left: `${leftPos}px` }}
                >
                  {m.name}
                </span>
              );
            })}
          </div>

          {/* 7-Row Contribution Grid */}
          <div
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
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
                      className="w-[10px] h-[10px] rounded-[2px] opacity-0"
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
                    className="w-[10px] h-[10px] rounded-[2px] transition-transform duration-100 hover:scale-125 cursor-pointer relative group"
                    style={levelStyle}
                    title={day.tooltip}
                    onMouseEnter={(e) => {
                      setHoveredCell({
                        text: day.tooltip,
                        target: e.currentTarget,
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>

      {/* Total Contributions Subtitle */}
      <div className="mt-2 flex items-center justify-between font-mono text-[11px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="text-[#38bdf8] dark:text-[#38bdf8] font-medium">Total</span>
          <span className="text-ink font-semibold">{data.total.toLocaleString()}</span>
          <span>contributions in {data.year || new Date().getFullYear()}</span>
        </div>

        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/70 hover:text-ink transition-colors duration-150 text-[10px] sm:text-[11px]"
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
    </div>
  );
}

export default GithubContributions;
