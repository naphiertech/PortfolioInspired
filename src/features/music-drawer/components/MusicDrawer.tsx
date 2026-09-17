"use client";

import React, { useEffect, useRef } from "react";
import { X, Activity } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MusicTrack } from "../types/music";
import { MusicFeaturedSong } from "./MusicFeaturedSong";
import { MusicPlaylist } from "./MusicPlaylist";

interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: MusicTrack[];
  currentTrack: MusicTrack;
  onSelectTrack: (track: MusicTrack) => void;
  className?: string;
}

/**
 * MusicDrawer
 *
 * "What I'm Listening To" Music Showcase Drawer:
 * - Fixed header: <MUSIC/> and lowercase "what i'm listening to" subtitle + close button
 * - Fixed featured song showcase: decorative rotating CD, title, artist, tagline, and external action buttons
 * - Constrained scrollable playlist: // MY ROTATION with direct Spotify & YouTube Music service buttons
 * - Fixed footer: Activity pulse icon + "Music makes a softer workspace."
 * - Purely client-side static metadata and external service links; zero embedded audio streaming.
 */
export function MusicDrawer({
  isOpen,
  onClose,
  tracks,
  currentTrack,
  onSelectTrack,
}: MusicDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

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

  // Outside click detection
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
        target.closest('[aria-label*="What I\'m Listening To"]') ||
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
          aria-label="What I'm Listening To Drawer"
          initial={{ x: reducedMotion ? 0 : -28, opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: reducedMotion ? 0 : -24, opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
          transition={{ duration: reducedMotion ? 0.05 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 bottom-20 sm:top-6 sm:bottom-6 left-2 sm:left-[64px] w-[336px] sm:w-[356px] max-w-[calc(100vw-16px)] z-50 bg-[#fafaf8] dark:bg-[#141619] border border-zinc-200 dark:border-[#262930] shadow-xl dark:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.55)] rounded-2xl sm:rounded-[22px] flex flex-col p-3.5 sm:p-4 backdrop-blur-md select-none text-zinc-900 dark:text-[#eceeed]"
        >
          {/* Header Row: <MUSIC/> + what i'm listening to & Close Button */}
          <div className="flex items-start justify-between pb-2.5 border-b border-zinc-200/70 dark:border-[#22252a] flex-shrink-0">
            <div>
              <h2 className="font-mono text-xs font-semibold tracking-wider text-zinc-900 dark:text-[#eceeed] uppercase leading-tight">
                &lt;MUSIC/&gt;
              </h2>
              <p className="font-mono text-xs text-zinc-600 dark:text-[#a0a5b2] leading-tight mt-0.5 lowercase">
                what i&apos;m listening to
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close music drawer"
              className="p-1.5 rounded-lg text-zinc-500 dark:text-[#a0a5b2] hover:text-zinc-900 dark:hover:text-[#eceeed] hover:bg-zinc-200/60 dark:hover:bg-[#1f2228] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Fixed featured showcase + scrollable rotation (no ancestor overflow-hidden clipping) */}
          <div className="flex-1 min-h-0 flex flex-col my-1">
            <div className="flex-shrink-0">
              {/* 1. Featured Song Showcase with CD & Streaming Buttons */}
              <MusicFeaturedSong track={currentTrack} />
            </div>

            {/* 2. My Rotation Playlist Rows with Service Links */}
            <MusicPlaylist
              tracks={tracks}
              currentTrack={currentTrack}
              onSelectTrack={onSelectTrack}
            />
          </div>

          {/* Footer Note Row with Soundwave Icon & Decorative Corner Line */}
          <div className="pt-2.5 mt-auto border-t border-zinc-200/70 dark:border-[#22252a] flex items-center justify-between text-zinc-600 dark:text-[#a0a5b2] flex-shrink-0">
            <div className="flex items-center gap-2 text-[12.5px] font-mono tracking-tight text-zinc-600 dark:text-[#a0a5b2]">
              <Activity className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
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
