"use client";

import React, { useState, useEffect, useCallback } from "react";
import { recommendations } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";

export function Recommendations() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % recommendations.length);
  }, []);

  // Auto advance slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const currentRec = recommendations[activeIndex];

  return (
    <section className="w-full space-y-4 select-none mb-16" aria-label="Recommendations">
      {/* Consistent Section Header */}
      <SectionHeader
        label="RECOMMENDATIONS"
        actionComponent={
          <div className="flex items-center gap-1.5">
            {recommendations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === activeIndex
                    ? "w-4 bg-brand"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to recommendation ${idx + 1}`}
              />
            ))}
          </div>
        }
        className="mb-4 pb-2 border-b border-border-hairline/40"
      />

      {/* Unboxed Quote Card with Smooth Slide Fade Transition */}
      <div className="p-4 sm:p-5 rounded-xl bg-surface/30 border border-border-hairline min-h-[140px] flex flex-col justify-between transition-all duration-300">
        <blockquote className="font-sans text-xs sm:text-[13px] text-muted-foreground/90 italic leading-relaxed">
          &ldquo;{currentRec.quote}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-hairline/40">
          <div>
            <div className="font-sans text-xs font-semibold text-ink">
              {currentRec.author}
            </div>
            <div className="font-sans text-[11px] text-muted-foreground">
              {currentRec.title}
            </div>
          </div>

          <span className="font-mono text-[10px] text-muted-foreground/60">
            {activeIndex + 1} of {recommendations.length}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;
