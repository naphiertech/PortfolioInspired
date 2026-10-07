"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePresentationMode } from "../context/PresentationModeContext";

import { DefaultModeLayout } from "../modes/default/DefaultModeLayout";

// Inactive presentation modes are code-split to keep the initial landing bundle lean
const FocusModeLayout = dynamic(
  () => import("../modes/focus/FocusModeLayout").then((m) => m.FocusModeLayout),
  { ssr: false }
);
const MinimalModeLayout = dynamic(
  () => import("../modes/minimal/MinimalModeLayout").then((m) => m.MinimalModeLayout),
  { ssr: false }
);
const AgentFolioLayout = dynamic(
  () => import("../modes/agent/AgentFolioLayout").then((m) => m.AgentFolioLayout),
  { ssr: false }
);

/**
 * PresentationModeRoot
 *
 * Top-level presentation layout dispatcher.
 * Server-renders the selected layout and loads other layouts on demand.
 * Mode updates use a transition to retain the current view while a layout loads.
 */
export function PresentationModeRoot() {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full ${
        isSwitch ? "presentation-mode-enter presentation-mode-switch" : ""
      }`}
    >
      {mode === "minimal" ? (
        <MinimalModeLayout />
      ) : mode === "focus" ? (
        <FocusModeLayout />
      ) : mode === "agent" ? (
        <AgentFolioLayout />
      ) : (
        <DefaultModeLayout />
      )}
    </div>
  );
}

export default PresentationModeRoot;
