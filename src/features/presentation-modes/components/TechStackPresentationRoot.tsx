"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { TechStackClient } from "@/app/tech-stack/TechStackClient";
import { FocusTechStackPage } from "../modes/focus/pages/FocusTechStackPage";

/**
 * TechStackPresentationRoot
 *
 * Presentation-aware dispatcher for /tech-stack.
 * Dispatches between Default categorized matrix and Focus tooling catalog.
 */
export function TechStackPresentationRoot() {
  const { mode, previousMode, clearPreviousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isSwitch) {
      clearPreviousMode();
    }
  };

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

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
      {mode === "focus" ? <FocusTechStackPage /> : <TechStackClient />}
    </div>
  );
}

export default TechStackPresentationRoot;
