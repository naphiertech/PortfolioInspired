"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePresentationMode } from "../context/PresentationModeContext";

// Inactive presentation modes are code-split to keep the initial landing bundle lean
const DefaultModeLayout = dynamic(
  () => import("../modes/default/DefaultModeLayout").then((m) => m.DefaultModeLayout)
);
const FocusModeLayout = dynamic(
  () => import("../modes/focus/FocusModeLayout").then((m) => m.FocusModeLayout)
);
const MinimalModeLayout = dynamic(
  () => import("../modes/minimal/MinimalModeLayout").then((m) => m.MinimalModeLayout)
);
const AgentFolioLayout = dynamic(
  () => import("../modes/agent/AgentFolioLayout").then((m) => m.AgentFolioLayout)
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
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
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
