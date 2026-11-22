"use client";

import React, { useMemo } from "react";
import { ContributionTruck } from "@/components/ContributionTruck";
import truckStyles from "@/components/ContributionTruck.module.css";

export interface ContributionTruckPreviewProps {
  weeks?: number;
  showMonths?: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionTruckPreview({
  weeks = 36,
  showMonths = true,
}: ContributionTruckPreviewProps) {
  const grid = useMemo(() => {
    const cols: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const col: number[] = [];
      for (let d = 0; d < 7; d++) {
        const seed = (w * 17 + d * 31 + (w % 5) * 7) % 13;
        const level = seed < 4 ? 0 : seed < 7 ? 1 : seed < 10 ? 2 : seed < 12 ? 3 : 4;
        col.push(level);
      }
      cols.push(col);
    }
    return cols;
  }, [weeks]);

  return (
    <div className="w-full max-w-[640px] mx-auto px-2">
      <ContributionTruck>
        <div className="relative min-w-0">
          {showMonths && (
            <div className="flex justify-between font-mono text-[9px] text-muted-foreground mb-1 px-0.5 select-none">
              {MONTHS.slice(0, Math.max(4, Math.round(weeks / 4.2))).map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          )}
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
            }}
            aria-label="Sample contribution matrix inside cargo trailer"
          >
            {grid.map((col, wIdx) =>
              col.map((level, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  className="aspect-square rounded-[1.5px]"
                  style={{
                    gridColumnStart: wIdx + 1,
                    gridRowStart: dIdx + 1,
                    backgroundColor:
                      level === 0
                        ? "var(--calendar-cell-empty)"
                        : level === 1
                        ? "var(--calendar-cell-lvl-1)"
                        : level === 2
                        ? "var(--calendar-cell-lvl-2)"
                        : level === 3
                        ? "var(--calendar-cell-lvl-3)"
                        : "var(--calendar-cell-lvl-4)",
                  }}
                />
              ))
            )}
          </div>
          <div className={`${truckStyles.footer} mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground`}>
            <span>Sample matrix ({weeks} wks)</span>
            <span>Hover truck cab</span>
          </div>
        </div>
      </ContributionTruck>
    </div>
  );
}

export default ContributionTruckPreview;
