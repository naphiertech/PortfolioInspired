"use client";

import React, { Suspense } from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import dynamic from "next/dynamic";
import { ResourcesSection } from "../modes/artisan/ResourcesSection";

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
 * ResourcesPresentationRoot
 *
 * Presentation-aware dispatcher for /resources.
 * Renders full Artisan studio shell in Agent/Artisan mode,
 * or standalone curated Resources directory in other modes.
 */
export function ResourcesPresentationRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ArtisanPortfolioLayout defaultTab="resources" />
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
      <ResourcesSection standalone />
    </div>
  );
}

export default ResourcesPresentationRoot;
