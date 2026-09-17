"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { MusicTrack } from "../types/music";

interface MusicDiscProps {
  track: MusicTrack;
  className?: string;
}

/**
 * MusicDisc
 *
 * Aesthetic Compact Disc (CD) matching the portfolio design system:
 * - Left half: Crisp monochrome photography/artwork printed on the disc surface.
 * - Right half: Brushed silver metallic CD finish with concentric sheen and vintage "Good Music Better Days" typography.
 * - Center: Clear transparent spindle hole with silver polycarbonate inner ring.
 * - Slow, continuous decorative rotation respecting prefers-reduced-motion.
 * - Decoupled from audio playback state.
 */
export function MusicDisc({
  track,
  className = "",
}: MusicDiscProps) {
  const reducedMotion = useReducedMotion();
  const artworkSrc = track.artwork || "/audio/favorites/cd-artwork.jpg";

  return (
    <div
      className={`relative w-full aspect-square max-w-[158px] mx-auto flex items-center justify-center my-2.5 select-none ${className}`}
    >
      {/* Outer Rotating CD Disc */}
      <div
        role="img"
        aria-label={`Compact disc record for ${track.title}`}
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center border border-zinc-300/80 dark:border-zinc-700/80"
        style={{
          boxShadow: "0 8px 20px -4px rgba(0, 0, 0, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
          animation: reducedMotion ? "none" : "spin 22s linear infinite",
          willChange: "transform",
          background:
            "linear-gradient(135deg, #f5f5f7 0%, #e6e8ec 40%, #d4d7dd 70%, #e5e7eb 100%)",
        }}
      >
        {/* Left Half: Album Cover / Architectural Monochrome Artwork */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[53%] h-full overflow-hidden pointer-events-none"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 96% 100%, 0% 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artworkSrc}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover grayscale contrast-110 brightness-95"
          />
          {/* Subtle blend gradient on seam */}
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-r from-transparent to-zinc-300/60" />
        </div>

        {/* Right Half: Brushed Silver Surface with Printed Decorative Typography */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-[49%] h-full flex flex-col items-center justify-center pr-3 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(115deg, rgba(240, 242, 245, 0.88) 0%, rgba(220, 223, 228, 0.95) 100%)",
          }}
        >
          <div className="flex flex-col items-center text-center select-none ml-2">
            <span
              className="font-serif italic text-[9px] text-zinc-700 leading-tight tracking-normal"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Good
            </span>
            <span className="font-mono text-[9.5px] font-bold text-zinc-800 tracking-wider uppercase leading-tight my-0.5">
              Music
            </span>
            <span
              className="font-serif italic text-[8.5px] text-zinc-600 leading-tight tracking-normal"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Better
            </span>
            <span className="font-mono text-[9px] font-semibold text-zinc-700 tracking-wide uppercase leading-tight">
              Days
            </span>
          </div>
        </div>

        {/* Holographic Specular Sheen Cone & Concentric Grooves */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-45 z-20"
          style={{
            background:
              "conic-gradient(from 50deg at 50% 50%, rgba(255, 255, 255, 0.55) 0deg, transparent 55deg, rgba(255, 255, 255, 0.4) 180deg, transparent 235deg, rgba(255, 255, 255, 0.55) 360deg)",
          }}
        />
        <div
          className="absolute inset-1 rounded-full pointer-events-none opacity-25 z-20"
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 3px, rgba(0, 0, 0, 0.07) 4px, transparent 5px)",
          }}
        />

        {/* Center Polycarbonate Clear Hub & Silver Rings */}
        <div
          className="relative w-[36%] h-[36%] rounded-full border border-zinc-300/90 dark:border-zinc-600/70 bg-white/70 dark:bg-zinc-800/40 backdrop-blur-xs flex items-center justify-center shadow-inner pointer-events-none z-30"
          style={{
            boxShadow:
              "inset 0 0 6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Inner Clear Spindle Hole matching drawer background */}
          <div className="w-5 h-5 rounded-full border border-zinc-300/90 dark:border-zinc-600/80 bg-[#fafaf8] dark:bg-[#141619] shadow-inner flex items-center justify-center transition-colors">
            <div className="w-2 h-2 rounded-full border border-zinc-300/60 dark:border-zinc-500/50 bg-white/90 dark:bg-zinc-700/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
