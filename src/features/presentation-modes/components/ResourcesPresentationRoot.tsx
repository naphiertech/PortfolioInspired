"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { ResourcesSection } from "../modes/artisan/ResourcesSection";

/**
 * ResourcesPresentationRoot
 *
 * Presentation-aware dispatcher for /resources.
 * Renders full Artisan studio shell synchronously for SSR in Agent/Artisan mode,
 * or standalone curated Resources directory in other modes.
 */
export function ResourcesPresentationRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="resources"
        initialSectionNode={<ResourcesSection />}
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
      <ResourcesSection standalone />
    </div>
  );
}

export default ResourcesPresentationRoot;
