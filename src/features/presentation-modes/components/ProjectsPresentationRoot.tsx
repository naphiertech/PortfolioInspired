"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { ProjectsSection } from "../modes/artisan/ProjectsSection";
import dynamic from "next/dynamic";

const FocusProjectsPage = dynamic(
  () => import("../modes/focus/pages/FocusProjectsPage").then(module => module.FocusProjectsPage),
);

/**
 * ProjectsPresentationRoot
 *
 * Presentation-aware dispatcher for /projects.
 * Dispatches synchronously for SSR between Artisan studio view, Focus engineering index, and Default CAD gallery.
 */
export function ProjectsPresentationRoot() {
  const router = useRouter();
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (mode === "minimal") {
      router.replace("/");
    }
  }, [mode, router]);

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="projects"
        initialSectionNode={<ProjectsSection standalone />}
      />
    );
  }

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
