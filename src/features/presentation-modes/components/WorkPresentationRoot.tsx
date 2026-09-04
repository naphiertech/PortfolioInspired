"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { WorkClient } from "@/app/work/WorkClient";
import { FocusWorkPage } from "../modes/focus/pages/FocusWorkPage";

/**
 * WorkPresentationRoot
 *
 * Presentation-aware dispatcher for /work.
 * Dispatches between Default work timeline and Focus experience ledger.
 */
export function WorkPresentationRoot() {
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
      {mode === "focus" ? <FocusWorkPage /> : <WorkClient />}
    </div>
  );
}

export default WorkPresentationRoot;
