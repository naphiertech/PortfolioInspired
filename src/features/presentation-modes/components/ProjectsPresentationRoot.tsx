"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import { FocusProjectsPage } from "../modes/focus/pages/FocusProjectsPage";

/**
 * ProjectsPresentationRoot
 *
 * Presentation-aware dispatcher for /projects.
 * Dispatches between Default CAD project gallery and Focus engineering index.
 */
export function ProjectsPresentationRoot() {
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
      {mode === "focus" ? <FocusProjectsPage /> : <ProjectsPageClient />}
    </div>
  );
}

export default ProjectsPresentationRoot;
