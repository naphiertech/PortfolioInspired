"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FAVORITE_TRACKS, DEFAULT_TRACK } from "../data/tracks";
import { MusicTrack } from "../types/music";
import { FocusDrawerTab } from "@/features/side-drawers/FocusDrawerTab";
import shellStyles from "@/features/side-drawers/SideDrawerShell.module.css";
import { MusicEdgeTab } from "./MusicEdgeTab";
import { MusicDrawer } from "./MusicDrawer";
import { useSideDrawers } from "@/features/side-drawers/SideDrawerProvider";

interface MusicEdgeDrawerProps {
  variant?: "standard" | "focus";
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
  variant = "standard",
  initialOpen = false,
  className = "",
}: MusicEdgeDrawerProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const { activeDrawer, openDrawer, toggleDrawer, closeDrawer, finishClose } = useSideDrawers();
  const isOpen = activeDrawer === "music";
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(DEFAULT_TRACK);

  useEffect(() => {
    setMounted(true);
    if (initialOpen) openDrawer("music");
  }, [initialOpen, openDrawer]);

  const handleSelectTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={`music-edge-drawer-container ${className}`}>
      {/* 1. Closed State Protruding Folder Tab (Fixed to Left Viewport Edge) */}
      {variant === "focus" ? <FocusDrawerTab drawer="music" isOpen={isOpen} onToggle={() => toggleDrawer("music")} /> : (
        <MusicEdgeTab isOpen={isOpen} onToggle={() => toggleDrawer("music")} />
      )}

      {/* Keep the animation owner mounted so closing can finish and open a pending drawer. */}
      <MusicDrawer
        className={variant === "focus" ? shellStyles.focusPanel : undefined}
        isOpen={isOpen}
        onClose={closeDrawer}
        onExitComplete={() => finishClose("music")}
        tracks={FAVORITE_TRACKS}
        currentTrack={currentTrack}
        onSelectTrack={handleSelectTrack}
      />
    </div>,
    document.body
  );
}

export default MusicEdgeDrawer;
