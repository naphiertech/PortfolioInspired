"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { FullProjectItem } from "@/lib/data";
import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import { ProjectsSection } from "../modes/artisan/ProjectsSection";
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
 * Dispatches synchronously for SSR between Artisan studio view, Focus engineering case file, and Default case study.
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
    }
  }, [mode, router]);

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="projects"
        initialProjectSlug={project.slug}
        initialSectionNode={
          <ProjectsSection
            standalone
            initialProjectSlug={project.slug}
            onClearInitialProject={() => {
              if (typeof window !== "undefined") {
                window.history.replaceState({}, "", "/projects");
              }
            }}
          />
        }
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
