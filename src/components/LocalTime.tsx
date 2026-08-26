"use client";

import React, { useState, useEffect } from "react";
import { getManilaTimeString } from "@/lib/dateUtils";

export function LocalTime() {
  const [timeDisplay, setTimeDisplay] = useState<string | null>(null);

  useEffect(() => {
    // Initial calculation immediately after client mount
    setTimeDisplay(getManilaTimeString());

    let intervalId: NodeJS.Timeout | null = null;

    // Calculate exact milliseconds until the next minute boundary (:00 seconds)
    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;

    // Align first tick to next minute boundary, then continue every 60s
    const timeoutId = setTimeout(() => {
      setTimeDisplay(getManilaTimeString());
      intervalId = setInterval(() => {
        setTimeDisplay(getManilaTimeString());
      }, 60000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground select-none"
      aria-label={
        timeDisplay
          ? `Local time in Asia/Manila: ${timeDisplay.replace(" · GMT+8", "")}`
          : "Local time in Asia/Manila (GMT+8)"
      }
    >
      <span className="text-muted-foreground/70">GMT+8</span>
      {timeDisplay ? (
        <>
          <span className="text-border-hairline">·</span>
          <span className="text-ink/90 font-medium tracking-tight">
            {timeDisplay.replace(" · GMT+8", "")}
          </span>
        </>
      ) : (
        <span className="text-muted-foreground/40 text-[11px]">· --:--</span>
      )}
    </span>
  );
}

export default LocalTime;
