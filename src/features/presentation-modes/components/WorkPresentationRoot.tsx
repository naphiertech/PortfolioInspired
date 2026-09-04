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
  const { mode } = usePresentationMode();

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div key={mode} className="w-full presentation-mode-enter">
      {mode === "focus" ? <FocusWorkPage /> : <WorkClient />}
    </div>
  );
}

export default WorkPresentationRoot;
