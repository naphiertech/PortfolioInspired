"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { MusicSection } from "../modes/artisan/MusicSection";

/**
 * MusicPresentationRoot
 *
 * Presentation-aware dispatcher for /music.
 * Renders full Artisan studio shell synchronously for SSR in Agent/Artisan mode,
 * or standalone editorial Music listening room in other modes.
 */
export function MusicPresentationRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="music"
        initialSectionNode={<MusicSection />}
      />
    );
  }

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`artisan-mode w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      <MusicSection standalone />
    </div>
  );
}

export default MusicPresentationRoot;
