"use client";

import React, { useEffect, useRef } from "react";
import { X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Track } from "../types/music";
import { MusicDisc } from "./MusicDisc";
import { MusicPlayerControls } from "./MusicPlayerControls";
import { MusicPlaylist } from "./MusicPlaylist";

interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  formattedCurrentTime: string;
  formattedTotalDuration: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onSelectTrack: (track: Track) => void;
  className?: string;
}

/**
 * MusicDrawer
 *
 * Polished, theme-integrated drawer overlay matching the portfolio design system:
 * - In Dark mode: dark charcoal surface (#141619) with muted borders (#262930) and soft off-white text.
 * - In Light mode: soft off-white paper surface (#fafaf8) with subtle borders and dark gray text.
 * - Header: <MUSIC/> favorites & Close button ✕
 * - Main media area: Aesthetic silver CD with monochrome architecture artwork (no decorative star)
 * - Song info & controls: Perfectly centered playback controls with symmetrical spacing
 * - Playlist: Clean, tabular durations without three-dot menus
 * - Footer note: Soundwave icon + "Music makes a softer workspace."
 * - Overlays without pushing page content or modifying layout.
 */
export function MusicDrawer({
  isOpen,
  onClose,
  tracks,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  progress,
  formattedCurrentTime,
  formattedTotalDuration,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onSelectTrack,
}: MusicDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Sensible outside-click detection with composedPath for detached elements
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const path = typeof e.composedPath === "function" ? e.composedPath() : [];

      // If click was inside the drawer panel, do not close
      if (
        (drawerRef.current && drawerRef.current.contains(target)) ||
        (drawerRef.current && path.includes(drawerRef.current))
      ) {
        return;
      }

      // Ignore clicks on the toggle tab itself so toggle doesn't double-trigger
      if (
        target.closest('[aria-label*="Music folder"]') ||
        target.closest('[aria-controls="music-drawer-panel"]') ||
        path.some(
          (el) =>
            (el as HTMLElement)?.getAttribute?.("aria-controls") ===
            "music-drawer-panel"
        )
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={drawerRef}
          id="music-drawer-panel"
          role="region"
          aria-label="Music Player Drawer"
          initial={{ x: -28, opacity: 0, scale: 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -24, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 bottom-20 sm:top-6 sm:bottom-6 left-2 sm:left-[64px] w-[310px] max-w-[calc(100vw-16px)] z-50 bg-[#fafaf8] dark:bg-[#141619] border border-zinc-200/90 dark:border-[#262930] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.02)] dark:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)] rounded-2xl sm:rounded-[22px] flex flex-col p-4 sm:p-5 overflow-hidden backdrop-blur-md select-none text-zinc-900 dark:text-[#eceeed]"
        >
          {/* Header Row: <MUSIC/> + favorites & Close Button */}
          <div className="flex items-start justify-between pb-2.5 border-b border-zinc-200/70 dark:border-[#22252a] flex-shrink-0">
            <div>
              <h2 className="font-mono text-xs font-semibold tracking-wider text-zinc-900 dark:text-[#eceeed] uppercase leading-tight">
                &lt;MUSIC/&gt;
              </h2>
              <p className="font-mono text-[11px] text-zinc-400 dark:text-[#8d929a] leading-tight mt-0.5 lowercase">
                favorites
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close music drawer"
              className="p-1 rounded-md text-zinc-400 dark:text-[#8d929a] hover:text-zinc-700 dark:hover:text-[#eceeed] hover:bg-zinc-100 dark:hover:bg-[#1f2228] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Center Body: CD Disc + Controls + Playlist */}
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar my-1">
            {/* 1. Rotating Compact Disc with Artwork & Silver Sheen */}
            <MusicDisc track={currentTrack} isPlaying={isPlaying} />

            {/* 2. Track Info, Scrubber & Centered Controls */}
            <MusicPlayerControls
              track={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              progress={progress}
              formattedCurrentTime={formattedCurrentTime}
              formattedTotalDuration={formattedTotalDuration}
              onTogglePlay={onTogglePlay}
              onNext={onNext}
              onPrevious={onPrevious}
              onSeek={onSeek}
            />

            {/* 3. Playlist Tracks with Responsive Dark/Light Active Row */}
            <MusicPlaylist
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onSelectTrack={onSelectTrack}
            />
          </div>

          {/* Footer Note Row with Soundwave Icon & Decorative Corner Line */}
          <div className="pt-2.5 mt-auto border-t border-zinc-200/70 dark:border-[#22252a] flex items-center justify-between text-zinc-400 dark:text-[#71767f] flex-shrink-0">
            <div className="flex items-center gap-2 text-[10.5px] font-mono tracking-tight text-zinc-400 dark:text-[#71767f]">
              <Activity className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Music makes a softer workspace.</span>
            </div>

            {/* Subtle editorial corner notch */}
            <div className="w-2 h-2 border-r border-b border-zinc-300 dark:border-[#2d3138]" />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
