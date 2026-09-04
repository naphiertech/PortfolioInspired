"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { DefaultModeLayout } from "../modes/default/DefaultModeLayout";
import { FocusModeLayout } from "../modes/focus/FocusModeLayout";
import { MinimalModeLayout } from "../modes/minimal/MinimalModeLayout";

/**
 * PresentationModeRoot
 *
 * Top-level presentation layout dispatcher.
 * Dispatches immediately between active modes (Default, Focus, Minimal) as soon as
 * context state updates, ensuring a layout is always mounted with zero blank frames.
 */
export function PresentationModeRoot() {
  const { mode, previousMode, clearPreviousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isSwitch) {
      clearPreviousMode();
    }
  };

  return (
    <div
      key={mode}
      data-mode={mode}
      data-previous-mode={previousMode ?? undefined}
      onAnimationEnd={handleAnimationEnd}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "minimal" ? (
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

