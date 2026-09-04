"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { FullProjectItem } from "@/lib/data";
import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";
import { FocusProjectDetailPage } from "../modes/focus/pages/FocusProjectDetailPage";

interface ProjectDetailPresentationRootProps {
  project: FullProjectItem;
  prevProject?: FullProjectItem;
  nextProject?: FullProjectItem;
}

/**
 * ProjectDetailPresentationRoot
 *
 * Presentation-aware dispatcher for /projects/[slug].
 * Dispatches between Default case study and Focus engineering case file.
 */
export function ProjectDetailPresentationRoot({
  project,
  prevProject,
  nextProject,
}: ProjectDetailPresentationRootProps) {
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
      {mode === "focus" ? (
        <FocusProjectDetailPage
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
        />
      ) : (
        <ProjectDetailClient
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
        />
      )}
    </div>
  );
}

export default ProjectDetailPresentationRoot;
