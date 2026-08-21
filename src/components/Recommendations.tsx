"use client";

import React, { useState, useEffect, useCallback } from "react";
import { recommendations } from "@/lib/data";

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
    <section className="w-full space-y-3.5 select-none mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;recommendations/&gt;
          </span>
        </div>

        {/* Slide Indicators */}
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
      </div>

      {/* Testimonial Card */}
      <div className="p-5 rounded-lg bg-surface/30 border border-border-hairline/60 space-y-4 min-h-[140px] flex flex-col justify-between">
        <p className="font-sans text-[14px] text-muted-foreground italic leading-relaxed">
          &ldquo;{currentRec.quote}&rdquo;
        </p>

        <div className="pt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2">
          <div>
            <h4 className="font-sans text-xs sm:text-sm font-semibold text-ink leading-tight">
              {currentRec.author}
            </h4>
            <p className="font-sans text-xs text-muted-foreground mt-0.5">
              {currentRec.title}
            </p>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground/60">
            {activeIndex + 1} / {recommendations.length}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Recommendations;
