"use client";

import React, { Suspense } from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import dynamic from "next/dynamic";
import { MusicSection } from "../modes/artisan/MusicSection";

const ArtisanPortfolioLayout = dynamic(
  () =>
    import("../modes/artisan/ArtisanPortfolioLayout").then(
      (mod) => mod.ArtisanPortfolioLayout
    ),
  {
    loading: () => <div className="min-h-screen bg-background" />,
  }
);

/**
 * MusicPresentationRoot
 *
 * Presentation-aware dispatcher for /music.
 * Renders full Artisan studio shell in Agent/Artisan mode,
 * or standalone editorial Music listening room in other modes.
 */
export function MusicPresentationRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ArtisanPortfolioLayout defaultTab="music" />
      </Suspense>
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
