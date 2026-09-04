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
  const { mode } = usePresentationMode();

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div key={mode} className="w-full presentation-mode-enter">
      {mode === "focus" ? <FocusTechStackPage /> : <TechStackClient />}
    </div>
  );
}

export default TechStackPresentationRoot;
