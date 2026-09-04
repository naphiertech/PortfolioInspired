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
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "focus" ? <FocusWorkPage /> : <WorkClient />}
    </div>
  );
}

export default WorkPresentationRoot;
