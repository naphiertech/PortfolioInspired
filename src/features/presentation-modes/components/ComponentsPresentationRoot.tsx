"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { ComponentsCatalogView } from "@/components/showcase/ComponentsCatalogView";

export function ComponentsPresentationRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="components"
        initialSectionNode={<ComponentsCatalogView insideArtisanShell />}
      />
    );
  }

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      <ComponentsCatalogView />
    </div>
  );
}

export default ComponentsPresentationRoot;
