"use client";

import React, { useEffect, useRef } from "react";

interface PageTransitionSpiralProps {
  isTransitioning: boolean;
  targetTab?: string | null;
  onMidpoint?: () => void;
  onComplete?: () => void;
}

const SHUTTER_COLUMNS = [0, 1, 2, 3, 4];

export function PageTransitionSpiral({
  isTransitioning,
  onMidpoint,
  onComplete,
}: PageTransitionSpiralProps) {
  const midpointCalledRef = useRef(false);
  const onMidpointRef = useRef(onMidpoint);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onMidpointRef.current = onMidpoint;
    onCompleteRef.current = onComplete;
  }, [onMidpoint, onComplete]);

  useEffect(() => {
    if (!isTransitioning) return;

    midpointCalledRef.current = false;
    const midTimer = setTimeout(() => {
      if (!midpointCalledRef.current) {
        midpointCalledRef.current = true;
        onMidpointRef.current?.();
      }
    }, 340);

    const endTimer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 890);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div
      key="artisan-shutter-transition"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
    >
      {/* 5 Staggered Architectural Louver Columns */}
      <div className="absolute inset-0 grid grid-cols-5 w-full h-full">
        {SHUTTER_COLUMNS.map((colIndex) => (
          <div
            key={colIndex}
            style={{
              transform: "translate3d(0, 100%, 0)",
              animation: `artisanShutterLouver 0.82s cubic-bezier(0.76, 0, 0.24, 1) ${
                colIndex * 0.018
              }s both`,
            }}
            className="relative h-full w-[calc(100%+2px)] -ml-px bg-[#F4F3EF] dark:bg-[#0D0D0F] border-r border-black/10 dark:border-white/10 last:border-r-0 will-change-transform"
          />
        ))}
      </div>
    </div>
  );
}


