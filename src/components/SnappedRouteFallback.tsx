"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useSnap } from "@/context/SnapContext";
import { useUISound } from "@/context/SoundContext";

interface SnappedRouteFallbackProps {
  title?: string;
  line1?: string;
  line2?: string;
  buttonLabel?: string;
}

export function SnappedRouteFallback({
  title = "Oops.",
  line1 = "Looks like this page",
  line2 = "got snapped away.",
  buttonLabel = "restore reality ↺",
}: SnappedRouteFallbackProps) {
  const { triggerRestore, isRestoring } = useSnap();
  const { playClick, playHover } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  // Subtle procedural background floating dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: (i * 27) % 100,
      y: (i * 39 + 15) % 100,
      size: (i % 3) * 1.2 + 1.8,
      duration: 3.5 + (i % 4) * 1.2,
      delay: (i * 0.3) % 2.5,
      opacity: 0.15 + (i % 3) * 0.15,
    }));
  }, []);

  const handleRestore = () => {
    playClick();
    triggerRestore();
  };

  return (
    <div className="min-h-[58vh] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 relative select-none animate-in fade-in zoom-in-95 duration-500">
      {/* Subtle Dust Particle Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={
              shouldReduceMotion
                ? { opacity: p.opacity }
                : {
                    opacity: [0, p.opacity, 0],
                    y: [-10, -35],
                    x: [0, (p.id % 2 === 0 ? 8 : -8)],
                  }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="rounded-full bg-ink/30 dark:bg-ink/40 filter blur-[0.5px]"
          />
        ))}
      </div>

      {/* Main Snap Fallback Card */}
      <div className="relative z-10 max-w-sm w-full mx-auto flex flex-col items-center">
        {/* Technical Blueprint Annotation */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/80 border border-border-hairline text-muted-foreground/80 font-mono text-[10px] tracking-wider uppercase mb-5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
          <span>snap_entropy // route_disintegrated</span>
        </div>

        {/* Headline */}
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-3 leading-none">
          {title}
        </h2>

        {/* Description */}
        <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed mt-1">
          {line1}
          <br />
          <span className="text-ink/90 font-medium">{line2}</span>
        </p>

        {/* Primary Action: Restore Reality */}
        <button
          type="button"
          onClick={handleRestore}
          disabled={isRestoring}
          onMouseEnter={playHover}
          className={`mt-7 tactile-btn px-4 py-2 text-xs font-mono font-medium rounded-lg border transition-all duration-200 flex items-center gap-2 group cursor-pointer active:scale-95 shadow-xs ${
            isRestoring
              ? "opacity-60 pointer-events-none text-muted-foreground border-border-hairline bg-surface/50"
              : "text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/40"
          }`}
          aria-label="Restore Reality and rematerialize page"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isRestoring
                ? "animate-spin text-emerald-500"
                : "group-hover:-rotate-45"
            }`}
          />
          <span>{isRestoring ? "restoring reality..." : buttonLabel}</span>
        </button>

        {/* Secondary Quiet Navigation to Home */}
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/70 hover:text-ink transition-colors duration-150 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 opacity-70" />
          <span>cd .. / return home</span>
        </Link>
      </div>
    </div>
  );
}

export default SnappedRouteFallback;
