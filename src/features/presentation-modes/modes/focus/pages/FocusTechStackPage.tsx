"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  techSections,
  getProjectsUsingTech,
  getCanonicalTechName,
} from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<FRONTEND/>",
  Backend: "<BACKEND/>",
  "Databases & Cloud": "<DATABASES-CLOUD/>",
  "AI & Machine Learning": "<AI-ML/>",
  "Animation & Design": "<DESIGN-ANIMATION/>",
  "DevOps & Tools": "<DEVOPS-TOOLS/>",
};

/**
 * FocusTechStackPage
 *
 * Focus Mode presentation for /tech-stack.
 * Complete technology catalog with project cross-referencing.
 */
export function FocusTechStackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playHover, playClick } = useUISound();

  const rawTechParam = searchParams.get("tech");
  const selectedTech = useMemo(() => {
    return rawTechParam ? getCanonicalTechName(rawTechParam) : null;
  }, [rawTechParam]);

  const matchingProjects = useMemo(() => {
    return selectedTech ? getProjectsUsingTech(selectedTech) : [];
  }, [selectedTech]);

  const handleTechClick = (techName: string) => {
    playClick();
    if (selectedTech === techName) {
      router.push("/tech-stack", { scroll: false });
    } else {
      router.push(`/tech-stack?tech=${encodeURIComponent(techName)}`, {
        scroll: false,
      });
    }
  };

  const handleClearSelection = () => {
    playClick();
    router.push("/tech-stack", { scroll: false });
  };

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 mb-6">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none">
          <span className="tracking-wider text-muted-foreground/80 font-medium">
            [ 03 // TECH STACK ]
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
            TECHNOLOGIES
          </span>
        </div>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Tech Stack & Tooling
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-muted-foreground mt-1">
              Languages, frameworks, databases, and developer tools I work with.
            </p>
          </div>
        </div>
      </div>

      <EditorialDivider className="mb-6" />

      {/* Domain-Grouped Technology Ledger */}
      <div className="divide-y divide-border-divider border-y border-border-divider">
        {techSections.map((section) => {
          const syntaxTag = categorySyntaxMap[section.title] || `<${section.title.toUpperCase()}/>`;

          return (
            <div
              key={section.title}
              className="py-4.5 sm:py-5 grid grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)] gap-2 sm:gap-5 items-start"
            >
              {/* Category Domain Label */}
              <div className="min-w-0 pt-0.5">
                <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink block">
                  {section.title}
                </span>
                <span className="font-caps text-[10px] text-muted-foreground/60 tracking-wider font-mono">
                  {syntaxTag}
                </span>
              </div>

              {/* Technologies Badges */}
              <div className="min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {section.items.map((tech) => {
                  const isSelected = selectedTech === tech;

                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleTechClick(tech)}
                      onMouseEnter={playHover}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors select-none ${
                        isSelected
                          ? "bg-ink text-page font-semibold border border-ink shadow-xs"
                          : "bg-surface/50 border border-border-hairline text-ink/90 hover:border-border hover:text-ink"
                      }`}
                    >
                      <TechIcon
                        name={tech}
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isSelected ? "text-page" : "text-muted-foreground/80"
                        }`}
                      />
                      <span>{tech}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Technology Cross-Reference Panel */}
      {selectedTech && (
        <section aria-label="Projects using selected technology" className="mt-8 pt-6 border-t border-border-divider">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-muted-foreground/70 uppercase">FILTERED BY:</span>
              <span className="px-2 py-0.5 rounded bg-ink text-page font-bold">
                {selectedTech}
              </span>
              <span className="text-muted-foreground/60">
                ({matchingProjects.length} {matchingProjects.length === 1 ? "project" : "projects"})
              </span>
            </div>

            <button
              type="button"
              onClick={handleClearSelection}
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear filter</span>
            </button>
          </div>

          {matchingProjects.length > 0 ? (
            <div className="divide-y divide-border-divider/60 border-y border-border-divider/60">
              {matchingProjects.map((project) => (
                <div
                  key={project.slug}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-sans font-bold text-xs sm:text-sm text-ink hover:text-brand transition-colors truncate"
                    >
                      {project.title}
                    </Link>
                    {project.status && (
                      <ProjectStatusBadge status={project.status} size="sm" />
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-mono text-xs text-muted-foreground hover:text-brand transition-colors inline-flex items-center gap-1 flex-shrink-0"
                  >
                    <span>View project</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-muted-foreground italic py-3">
              No flagship projects currently tagged with {selectedTech}.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default FocusTechStackPage;
