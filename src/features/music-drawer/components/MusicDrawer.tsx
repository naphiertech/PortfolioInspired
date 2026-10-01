"use client";

import { X, Activity } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MusicTrack } from "../types/music";
import { MusicFeaturedSong } from "./MusicFeaturedSong";
import { MusicPlaylist } from "./MusicPlaylist";
import styles from "./MusicDrawer.module.css";
import shellStyles from "@/features/side-drawers/SideDrawerShell.module.css";
import { useSideDrawers } from "@/features/side-drawers/SideDrawerProvider";

interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
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
  onExitComplete,
  tracks,
  currentTrack,
  onSelectTrack,
}: MusicDrawerProps) {
  const reducedMotion = useReducedMotion();
  const { isMobile } = useSideDrawers();

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <motion.section
          id="music-drawer-panel"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          aria-label="What I'm Listening To Drawer"
          initial={isMobile ? { y: reducedMotion ? 0 : "100%", opacity: 0 } : { x: reducedMotion ? 0 : -28, opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          exit={isMobile ? { y: reducedMotion ? 0 : "100%", opacity: 0, pointerEvents: "none", transition: { duration: reducedMotion ? 0 : 0.16 } } : { x: reducedMotion ? 0 : -24, opacity: 0, scale: reducedMotion ? 1 : 0.98, pointerEvents: "none", transition: { duration: reducedMotion ? 0 : 0.16 } }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`${shellStyles.panel} bg-[#fafaf8] dark:bg-[#141619] text-zinc-900 dark:text-[#eceeed]`}
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
          <div className={styles.body}>
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
