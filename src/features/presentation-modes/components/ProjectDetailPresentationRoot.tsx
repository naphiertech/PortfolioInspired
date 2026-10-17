"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { FullProjectItem } from "@/lib/data";
import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";
import dynamic from "next/dynamic";

const FocusProjectDetailPage = dynamic(
  () => import("../modes/focus/pages/FocusProjectDetailPage").then(module => module.FocusProjectDetailPage),
);

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
