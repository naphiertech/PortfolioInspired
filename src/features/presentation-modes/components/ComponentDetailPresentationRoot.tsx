"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import {
  ComponentDetailView,
  type ComponentDetailViewProps,
} from "@/components/showcase/ComponentDetailView";

export function ComponentDetailPresentationRoot(
  props: ComponentDetailViewProps
) {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="components"
        initialSectionNode={<ComponentDetailView {...props} />}
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
      <ComponentDetailView {...props} />
    </div>
  );
}

export default ComponentDetailPresentationRoot;
