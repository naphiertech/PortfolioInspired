"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { MusicEdgeTab } from "./MusicEdgeTab";
import { MusicDrawer } from "./MusicDrawer";

interface MusicEdgeDrawerProps {
  initialOpen?: boolean;
  className?: string;
}

/**
 * MusicEdgeDrawer
 *
 * Self-contained entry point for the Left-Edge Music Folder / Music Drawer.
 * Orchestrates the fixed edge tab, overlay drawer panel, and native audio player state.
 *
 * Rendered via React Portal into document.body to ensure it remains strictly anchored
 * to the viewport edges without being trapped by containing-block CSS transforms.
 *
 * Designed for immediate mounting in Default Mode, and future re-use across Focus,
 * Minimal, or Agent presentation modes without code rewriting.
 */
export function MusicEdgeDrawer({
  initialOpen = false,
  className = "",
}: MusicEdgeDrawerProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const player = useMusicPlayer();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={`music-edge-drawer-container ${className}`}>
      {/* 1. Closed State Protruding Folder Tab (Fixed to Left Viewport Edge) */}
      <MusicEdgeTab
        isOpen={isOpen}
        isPlaying={player.isPlaying}
        onToggle={handleToggle}
      />

      {/* 2. Open State Overlay Drawer Card */}
      <MusicDrawer
        isOpen={isOpen}
        onClose={handleClose}
        tracks={player.tracks}
        currentTrack={player.currentTrack}
        isPlaying={player.isPlaying}
        currentTime={player.currentTime}
        duration={player.duration}
        progress={player.progress}
        formattedCurrentTime={player.formattedCurrentTime}
        formattedTotalDuration={player.formattedTotalDuration}
        onTogglePlay={player.togglePlay}
        onNext={player.nextTrack}
        onPrevious={player.previousTrack}
        onSeek={player.seek}
        onSelectTrack={player.selectTrack}
      />
    </div>,
    document.body
  );
}

export default MusicEdgeDrawer;
