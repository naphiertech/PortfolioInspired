"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  usePresentationMode,
  getResolvedModeLayout,
} from "../context/PresentationModeContext";

import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";

// Inactive presentation modes are code-split to keep the initial landing bundle lean
const DefaultModeLayout = dynamic(
  () => import("../modes/default/DefaultModeLayout").then((m) => m.DefaultModeLayout),
  { ssr: false }
);
const FocusModeLayout = dynamic(
  () => import("../modes/focus/FocusModeLayout").then((m) => m.FocusModeLayout),
  { ssr: false }
);
const MinimalModeLayout = dynamic(
  () => import("../modes/minimal/MinimalModeLayout").then((m) => m.MinimalModeLayout),
  { ssr: false }
);

/**
 * PresentationModeRoot
 *
 * Top-level presentation layout dispatcher.
 * Server-renders the selected layout and loads other layouts on demand.
 * When switching modes via the whirlpool transition, the target layout module
 * is preloaded and resolved before the whirlpool unwinds so it mounts synchronously.
 */
export function PresentationModeRoot() {
  const { mode } = usePresentationMode();
  const ResolvedLayout = getResolvedModeLayout(mode);

  return (
    <div key={mode} data-mode={mode} className="w-full">
      {mode === "agent" ? (
        <ArtisanPortfolioLayout />
      ) : ResolvedLayout ? (
        <ResolvedLayout />
      ) : mode === "minimal" ? (
        <MinimalModeLayout />
      ) : mode === "focus" ? (
        <FocusModeLayout />
      ) : (
        <DefaultModeLayout />
      )}
    </div>
  );
}

export default PresentationModeRoot;
