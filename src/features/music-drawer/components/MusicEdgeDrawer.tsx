"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FAVORITE_TRACKS, DEFAULT_TRACK } from "../data/tracks";
import { MusicTrack } from "../types/music";
import { MusicEdgeTab } from "./MusicEdgeTab";
import { MusicDrawer } from "./MusicDrawer";

interface MusicEdgeDrawerProps {
  initialOpen?: boolean;
  className?: string;
}

/**
 * MusicEdgeDrawer
 *
 * Self-contained entry point for the "What I'm Listening To" Music Drawer.
 * Orchestrates the fixed edge tab and overlay drawer panel.
 *
 * Rendered via React Portal into document.body to ensure it remains strictly anchored
 * to the viewport edges without being trapped by containing-block CSS transforms.
 */
export function MusicEdgeDrawer({
  initialOpen = false,
  className = "",
}: MusicEdgeDrawerProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(DEFAULT_TRACK);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelectTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={`music-edge-drawer-container ${className}`}>
      {/* 1. Closed State Protruding Folder Tab (Fixed to Left Viewport Edge) */}
      <MusicEdgeTab
        isOpen={isOpen}
        onToggle={handleToggle}
      />

      {/* 2. Open State Overlay Drawer Card */}
      <MusicDrawer
        isOpen={isOpen}
        onClose={handleClose}
        tracks={FAVORITE_TRACKS}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
      />
    </div>,
    document.body
  );
}

export default MusicEdgeDrawer;
