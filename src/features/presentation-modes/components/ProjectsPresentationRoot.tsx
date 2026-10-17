"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import dynamic from "next/dynamic";

const FocusProjectsPage = dynamic(
  () => import("../modes/focus/pages/FocusProjectsPage").then(module => module.FocusProjectsPage),
);

/**
 * ProjectsPresentationRoot
 *
 * Presentation-aware dispatcher for /projects.
 * Dispatches between Default CAD project gallery and Focus engineering index.
 */
export function ProjectsPresentationRoot() {
  const router = useRouter();
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (mode === "minimal") {
      router.replace("/");
    } else if (mode === "agent") {
      router.replace("/?tab=projects");
    }
  }, [mode, router]);

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
