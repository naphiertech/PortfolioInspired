"use client";

import React, { useEffect, useState } from "react";
import { GITHUB_USERNAME, SOCIAL_PROFILES } from "@/lib/siteConfig";
import { useTheme } from "@/components/ThemeProvider";

const CELL_SIZE = 9;
const CELL_GAP = 2;

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

/**
 * MinimalContributions
 *
 * Quiet, restrained GitHub contribution calendar for Minimal Mode:
 * - Roman serif heading
 * - Understated total contribution counter in mono metadata
 * - Clean, non-distracting monochrome heatmap cells
 * - Direct external profile link
 */
export function MinimalContributions() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          GitHub Contributions
        </h2>
        <p className="font-serif text-[15px] text-zinc-700 dark:text-[#beb9ad]">
          <a
            href={SOCIAL_PROFILES.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-900 dark:text-[#dedad0] hover:text-zinc-700 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
          >
            View contributions on GitHub ↗
          </a>
        </p>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08] animate-pulse motion-reduce:animate-none">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          GitHub Contributions
        </h2>
        <div className="h-4 w-36 bg-zinc-200 dark:bg-white/[0.06] rounded" />
        <div className="h-20 w-full bg-zinc-100 dark:bg-white/[0.03] rounded border border-zinc-200/80 dark:border-white/[0.08]" />
      </section>
    );
  }

  const columnCount = data.weeks.length;

  return (
    <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-3">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          GitHub Contributions
        </h2>
        <span className="font-mono text-[10px] sm:text-[11px] text-zinc-500 dark:text-[#827d73]">
          {data.total.toLocaleString()} contributions{data.year ? ` in ${data.year}` : ""}
        </span>
      </div>

      {/* Contribution Calendar Grid without scrollbar */}
      <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none pb-1" tabIndex={0} role="region" aria-label="GitHub contribution calendar, scroll horizontally to see all months">
        <div className="inline-block min-w-max">
          {/* Month Header */}
          <div className="relative h-4 mb-1.5 font-mono text-[9px] text-zinc-500 dark:text-[#827d73]">
            {data.months.map((m, idx) => {
              const leftPos = m.weekIndex * (CELL_SIZE + CELL_GAP);
              return (
                <span
                  key={`${m.name}-${idx}`}
                  className="absolute"
                  style={{ left: `${leftPos}px` }}
                >
                  {m.name}
                </span>
              );
            })}
          </div>

          {/* 7-Row Minimalist Grid */}
          <div
            className="grid grid-flow-col"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
              gap: CELL_GAP,
            }}
          >
            {data.weeks.map((week, weekIdx) =>
              week.days.map((day, dayIdx) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${weekIdx}-${dayIdx}`}
                      className="w-full h-full rounded-[1.5px] opacity-0"
                    />
                  );
                }

                let levelStyle: React.CSSProperties = {};
                if (day.level === 0) {
                  levelStyle = {
                    backgroundColor: isDark ? "#222222" : "#eeeeee",
                  };
                } else if (day.level === 1) {
                  levelStyle = { backgroundColor: isDark ? "#404040" : "#cccccc" };
                } else if (day.level === 2) {
                  levelStyle = { backgroundColor: isDark ? "#696969" : "#999999" };
                } else if (day.level === 3) {
                  levelStyle = { backgroundColor: isDark ? "#a0a0a0" : "#666666" };
                } else if (day.level === 4) {
                  levelStyle = { backgroundColor: isDark ? "#eeeeee" : "#242424" };
                }

                return (
                  <div
                    key={day.date}
                    className="w-full h-full rounded-[1.5px]"
                    style={levelStyle}
                    title={day.tooltip}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* GitHub Profile Link */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-[#9e998e] pt-1">
        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
        >
          github.com/{GITHUB_USERNAME}<span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">↗</span>
        </a>
      </div>
    </section>
  );
}

export default MinimalContributions;
