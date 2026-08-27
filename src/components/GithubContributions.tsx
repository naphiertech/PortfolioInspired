"use client";

import React, { useEffect, useState } from "react";
import { AUTHOR_INFO, GITHUB_USERNAME, SOCIAL_PROFILES } from "@/lib/siteConfig";

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
  const [hoveredCell, setHoveredCell] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

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
      <div className="overflow-x-auto scrollbar-none pb-1 -mx-2 px-2">
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
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        text: day.tooltip,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
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
          <span>contributions in the last year</span>
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

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none px-2.5 py-1 bg-surface text-ink border border-border-hairline text-[11px] font-mono rounded-[4px] shadow-lg backdrop-blur-sm transform -translate-x-1/2 -translate-y-full -mt-2 whitespace-nowrap"
          style={{ left: `${hoveredCell.x}px`, top: `${hoveredCell.y}px` }}
        >
          {hoveredCell.text}
        </div>
      )}
    </div>
  );
}

export default GithubContributions;
