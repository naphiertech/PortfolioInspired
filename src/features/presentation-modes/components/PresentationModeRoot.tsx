"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePresentationMode } from "../context/PresentationModeContext";
import { DefaultModeLayout } from "../modes/default/DefaultModeLayout";

// Inactive presentation modes are code-split to keep the initial landing bundle lean
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
 * Dispatches immediately between active modes (Default, Focus, Minimal, Agent Folio) as soon as
 * context state updates, ensuring a layout is always mounted with zero blank frames.
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
