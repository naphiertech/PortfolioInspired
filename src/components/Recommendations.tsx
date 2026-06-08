"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { recommendations } from "@/lib/data";
import { gsap } from "gsap";

export function Recommendations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const handleSlideChange = useCallback(
    (index: number) => {
      if (index === activeIndex) return;

      if (slideRef.current) {
        // Premium horizontal shift crossfade slide transitions
        gsap.fromTo(
          slideRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
        );
      }
      setActiveIndex(index);
    },
    [activeIndex],
  );

  // Auto advance slide every 8 seconds (matches live site timing!)
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % recommendations.length;
      handleSlideChange(nextIndex);
    }, 8000);

    return () => clearInterval(timer);
  }, [activeIndex, handleSlideChange]);

  const currentRec = recommendations[activeIndex];

  return (
    <div className="bento-card p-4 col-span-1 md:col-span-3 space-y-2 group overflow-hidden">
      <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
        Recommendations
      </h2>

      {/* Slide Container (matches live layout height and typography) */}
      <div className="relative min-h-[160px] pt-2">
        <div
          ref={slideRef}
          className="absolute inset-0 flex flex-col justify-between select-none"
        >
          <div>
            <p className="text-[13px] leading-relaxed text-text-secondary dark:text-dark-text-secondary font-serif italic line-clamp-4">
              &ldquo;{currentRec.quote}&rdquo;
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-border-default dark:border-dark-border">
            <h3 className="text-xs font-semibold font-sans text-text-primary dark:text-dark-text-primary leading-tight">
              {currentRec.author}
            </h3>
            <p className="text-xs text-text-muted dark:text-dark-text-muted font-sans mt-0.5">
              {currentRec.title}
            </p>
          </div>
        </div>
      </div>

      {/* Dot Pagination indicators */}
      <div className="flex gap-1.5 mt-4">
        {recommendations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSlideChange(idx)}
            className={`rounded-full transition-all duration-500 cursor-pointer ${
              idx === activeIndex
                ? "w-3 h-1.5 bg-text-primary dark:bg-dark-text-primary opacity-80"
                : "w-1.5 h-1.5 bg-text-primary dark:bg-dark-text-primary opacity-20"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
export default Recommendations;
