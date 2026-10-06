"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

/**
 * FlickeringGrid
 *
 * Full-page subtle dot pattern background replacing the legacy flickering drafting surface.
 * Powered by DotPattern from @/components/ui/dot-pattern.
 */
export function FlickeringGrid() {
  const { gridEnabled } = usePresentationMode();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [isPresent, setIsPresent] = useState(gridEnabled);

  useEffect(() => {
    if (gridEnabled) {
      setIsPresent(true);
      return;
    }
    const timeout = window.setTimeout(() => setIsPresent(false), 500);
    return () => window.clearTimeout(timeout);
  }, [gridEnabled]);

  useEffect(() => {
    if (!isPresent) return;
    const surface = surfaceRef.current;
    if (!surface) return;

    // Measure normal-flow body height, not scrollHeight: the overlay must never
    // keep a previous long page artificially tall after navigation or collapse.
    const syncHeight = () => {
      surface.style.height = `${Math.max(
        document.body.offsetHeight,
        document.documentElement.clientHeight
      )}px`;
    };
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(document.body);
    window.addEventListener("resize", syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [isPresent]);

  if (!isPresent && !gridEnabled) return null;

  return (
    <div
      ref={surfaceRef}
      className={cn(
        "absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-300 ease-out",
        gridEnabled ? "opacity-100" : "opacity-0"
      )}
      style={{ minHeight: "100vh" }}
      aria-hidden="true"
    >
      <DotPattern
        width={16}
        height={16}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "fill-neutral-400/40 dark:fill-neutral-500/30",
          "[mask-image:radial-gradient(ellipse_80%_65%_at_50%_25%,white_20%,transparent_85%)]"
        )}
      />
    </div>
  );
}

export default FlickeringGrid;
