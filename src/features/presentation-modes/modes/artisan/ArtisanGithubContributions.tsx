"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaGithub, LuArrowUpRight } from "./ArtisanIcons";
import { AUTHOR_INFO, GITHUB_USERNAME, SOCIAL_PROFILES } from "@/lib/siteConfig";
import {
  type ContributionData,
  fetchCombinedContributions,
} from "@/lib/githubContributions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const LEVEL_COLORS = [
  "var(--calendar-cell-empty, rgba(120, 120, 128, 0.14))",
  "var(--calendar-cell-lvl-1, #a1a1aa)",
  "var(--calendar-cell-lvl-2, #71717a)",
  "var(--calendar-cell-lvl-3, #3f3f46)",
  "var(--calendar-cell-lvl-4, #09090b)",
] as const;

interface TooltipPortalProps {
  text: string;
  target: HTMLElement;
}

function ArtisanContributionTooltip({ text, target }: TooltipPortalProps) {
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

      const spaceAbove = cellRect.top;
      const placeBelow = spaceAbove < tooltipRect.height + gap + padding;
      let top = placeBelow
        ? cellRect.bottom + gap
        : cellRect.top - tooltipRect.height - gap;

      top = Math.max(
        padding,
        Math.min(viewportHeight - tooltipRect.height - padding, top)
      );

      let left = cellRect.left + cellRect.width / 2 - tooltipRect.width / 2;
      if (left < padding) {
        left = padding;
      } else if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - padding - tooltipRect.width;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    };

    updatePosition();
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
      className="fixed z-[110] pointer-events-none px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#141517]/95 text-neutral-900 dark:text-neutral-100 border border-black/10 dark:border-white/15 text-[11px] font-sans font-medium shadow-lg backdrop-blur-md whitespace-nowrap"
      style={{ top: 0, left: 0, opacity: 0 }}
    >
      {text}
    </div>,
    document.body
  );
}

interface ArtisanGithubContributionsProps {
  variant?: "editorial" | "compact";
}

/**
 * ArtisanGithubContributions
 *
 * Tactile monochrome GitHub contribution matrix tailored for Artisan mode:
 * - "editorial": Full-width overview section card with month headers, legend, and live totals
 * - "compact": Tight split-rail module for the closed-sidebar Artisan homepage
 */
export function ArtisanGithubContributions({
  variant = "editorial",
}: ArtisanGithubContributionsProps) {
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

    async function load() {
      try {
        const combined = await fetchCombinedContributions();
        if (!isMounted) return;
        if (combined) {
          setData(combined);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const isCompact = variant === "compact";

  if (error) {
    return (
      <div
        className={
          isCompact
            ? "rounded-xl border border-black/10 dark:border-white/10 bg-background/85 px-3 py-2.5 flex items-center justify-between gap-2 font-sans text-xs"
            : "rounded-2xl border border-black/10 dark:border-white/10 bg-background/85 px-4 py-4 flex items-center justify-between gap-3 font-sans text-xs"
        }
      >
        <span className="text-muted-foreground">GitHub activity unavailable</span>
        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
        >
          <span>{AUTHOR_INFO.handle}</span>
          <LuArrowUpRight className="size-3" aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading GitHub contributions"
        className={
          isCompact
            ? "rounded-xl border border-black/10 dark:border-white/10 bg-background/75 p-2.5 space-y-2 animate-pulse motion-reduce:animate-none"
            : "rounded-2xl border border-black/10 dark:border-white/10 bg-background/85 p-4 sm:p-5 space-y-3 animate-pulse motion-reduce:animate-none"
        }
      >
        <div className="h-3 w-36 rounded bg-black/[0.06] dark:bg-white/[0.08]" />
        <div
          className={
            isCompact
              ? "h-11 w-full rounded-lg bg-black/[0.04] dark:bg-white/[0.05]"
              : "h-24 w-full rounded-xl bg-black/[0.04] dark:bg-white/[0.05]"
          }
        />
      </div>
    );
  }

  const columnCount = data.weeks.length;
  const yearLabel = data.year || new Date().getFullYear();
  const accountLabel = data.username.includes("+")
    ? "@naphiertech + @bagatata05"
    : `@${data.username}`;

  const renderGridCells = (cellClassName: string) =>
    data.weeks.map((week, weekIdx) =>
      week.days.map((day, dayIdx) => {
        if (!day) {
          return (
            <div
              key={`empty-${weekIdx}-${dayIdx}`}
              className={`${cellClassName} opacity-0 pointer-events-none`}
            />
          );
        }

        const safeLevel = Math.max(0, Math.min(4, day.level));

        return (
          <div
            key={day.date}
            className={`${cellClassName} transition-transform duration-100 hover:scale-125 cursor-pointer`}
            style={{ backgroundColor: LEVEL_COLORS[safeLevel] }}
            title={day.tooltip}
            onClick={(e) => {
              if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
              setHoveredCell({ text: day.tooltip, target: e.currentTarget });
            }}
            onMouseEnter={(e) => {
              if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
              const target = e.currentTarget;
              tooltipTimerRef.current = setTimeout(() => {
                tooltipTimerRef.current = null;
                if (target.isConnected) setHoveredCell({ text: day.tooltip, target });
              }, 70);
            }}
            onMouseLeave={() => {
              if (tooltipTimerRef.current !== null) clearTimeout(tooltipTimerRef.current);
              tooltipTimerRef.current = null;
              setHoveredCell(null);
            }}
          />
        );
      })
    );

  const legend = (
    <div
      className="inline-flex items-center gap-1 font-sans text-[10px] text-muted-foreground shrink-0 select-none"
      aria-label="Contribution intensity scale"
    >
      <span>Less</span>
      {LEVEL_COLORS.map((color, idx) => (
        <span
          key={idx}
          className={isCompact ? "size-2 rounded-[1.5px]" : "size-2.5 rounded-[2px]"}
          style={{ backgroundColor: color }}
        />
      ))}
      <span>More</span>
    </div>
  );

  if (isCompact) {
    return (
      <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10 font-sans">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-foreground/90">
            <FaGithub className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>GitHub Activity</span>
          </span>
          <a
            href={SOCIAL_PROFILES.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-medium text-muted-foreground hover:text-foreground hover:underline inline-flex items-center gap-0.5 transition-colors"
          >
            <span>@{GITHUB_USERNAME}</span>
            <LuArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-background/85 p-2.5 space-y-2">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div
              className="grid grid-flow-col grid-rows-7 gap-[1.5px] min-w-[290px] sm:min-w-0 w-full"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              }}
              role="img"
              aria-label={`${data.total.toLocaleString()} GitHub contributions in ${yearLabel}`}
            >
              {renderGridCells("w-full min-w-0 aspect-square rounded-[1.5px]")}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="font-sans text-[11px] text-muted-foreground tabular-nums truncate">
              <strong className="font-medium text-foreground">
                {data.total.toLocaleString()}
              </strong>{" "}
              in {yearLabel}
            </span>
            {legend}
          </div>
        </div>

        {mounted && hoveredCell && typeof document !== "undefined" && (
          <ArtisanContributionTooltip
            text={hoveredCell.text}
            target={hoveredCell.target}
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-1.5 border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.015] dark:bg-white/[0.02]">
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-background p-4 sm:p-5 space-y-3.5">
        {/* Card Header: Total Count & Scale Legend */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-sans text-sm font-semibold text-foreground tabular-nums">
              {data.total.toLocaleString()} contributions
            </span>
            <span className="font-sans text-xs text-muted-foreground">
              in {yearLabel}
            </span>
            <span className="font-sans text-[11px] text-muted-foreground/75">
              ({accountLabel})
            </span>
          </div>
          {legend}
        </div>

        {/* Month Labels + 7-Row Matrix */}
        <div
          className="w-full overflow-x-auto scrollbar-hide select-none pb-0.5"
          tabIndex={0}
          role="region"
          aria-label={`GitHub contribution graph showing ${data.total.toLocaleString()} contributions in ${yearLabel}`}
        >
          <div className="min-w-[560px] sm:min-w-0 w-full">
            <div className="relative h-4 mb-1.5 font-sans text-[11px] text-muted-foreground">
              {data.months.map((m, idx) => {
                const leftPos = (m.weekIndex / columnCount) * 100;
                return (
                  <span
                    key={`${m.name}-${idx}`}
                    className="absolute leading-none"
                    style={{ left: `${leftPos}%` }}
                  >
                    {m.name}
                  </span>
                );
              })}
            </div>

            <div
              className="grid grid-flow-col grid-rows-7 gap-[3px] w-full"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              }}
            >
              {renderGridCells("w-full min-w-0 aspect-square rounded-[2px]")}
            </div>
          </div>
        </div>

        {mounted && hoveredCell && typeof document !== "undefined" && (
          <ArtisanContributionTooltip
            text={hoveredCell.text}
            target={hoveredCell.target}
          />
        )}
      </div>
    </div>
  );
}

export default ArtisanGithubContributions;
