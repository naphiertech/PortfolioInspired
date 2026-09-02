"use client";

import React, { useEffect, useState } from "react";
import { GITHUB_USERNAME, SOCIAL_PROFILES } from "@/lib/siteConfig";
import { useTheme } from "@/components/ThemeProvider";

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
 * - Understated total contribution counter in serif copy
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
      <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08] animate-pulse">
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
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          GitHub Contributions
        </h2>
        <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73]">
          {data.total} contributions in {data.year || 2026}
        </span>
      </div>

      {/* Contribution Calendar Grid without scrollbar */}
      <div className="w-full overflow-x-auto scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none pb-1">
        <div className="inline-block min-w-max">
          {/* Month Header */}
          <div className="relative h-4 mb-1.5 font-mono text-[9px] text-zinc-500 dark:text-[#827d73]">
            {data.months.map((m, idx) => {
              const leftPos = m.weekIndex * 10.5;
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
            className="grid grid-flow-col grid-rows-7 gap-[2px]"
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
                      className="w-[8.5px] h-[8.5px] rounded-[1.5px] opacity-0"
                    />
                  );
                }

                let levelStyle: React.CSSProperties = {};
                if (day.level === 0) {
                  levelStyle = {
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ebedf0",
                  };
                } else if (day.level === 1) {
                  levelStyle = { backgroundColor: isDark ? "#3d3e3a" : "#c4c8d0" };
                } else if (day.level === 2) {
                  levelStyle = { backgroundColor: isDark ? "#63645e" : "#8f94a3" };
                } else if (day.level === 3) {
                  levelStyle = { backgroundColor: isDark ? "#94958d" : "#585c69" };
                } else if (day.level === 4) {
                  levelStyle = { backgroundColor: isDark ? "#dedad0" : "#18191c" };
                }

                return (
                  <div
                    key={day.date}
                    className="w-[8.5px] h-[8.5px] rounded-[2px] transition-colors"
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
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          github.com/{GITHUB_USERNAME} ↗
        </a>
      </div>
    </section>
  );
}

export default MinimalContributions;
