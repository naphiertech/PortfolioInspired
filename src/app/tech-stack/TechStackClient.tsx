"use client";

import React, { useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  techSections,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { useUISound } from "@/context/SoundContext";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<frontend/>",
  Backend: "<backend/>",
  "Databases & Cloud": "<database-cloud/>",
  "AI & Machine Learning": "<ai-ml/>",
  "Animation & Design": "<design-animation/>",
  "DevOps & Tools": "<devops-tools/>",
};

export function TechStackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playHover, playClick } = useUISound();
  const usedInProjectsRef = useRef<HTMLElement>(null);

  const rawTechParam = searchParams.get("tech");
  const selectedTech = useMemo(() => {
    return rawTechParam ? getCanonicalTechName(rawTechParam) : null;
  }, [rawTechParam]);

  const matchingProjects = useMemo(() => {
    return selectedTech ? getProjectsUsingTech(selectedTech) : [];
  }, [selectedTech]);

  // Gentle auto-scroll to the <USED-IN-PROJECTS/> section when a technology is selected
  useEffect(() => {
    if (selectedTech && usedInProjectsRef.current) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Small delay to ensure DOM render has completed
      const timer = setTimeout(() => {
        usedInProjectsRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedTech]);

  const handleTechClick = (tech: string) => {
    playClick();
    const normalizedClicked = normalizeTechName(tech);
    const normalizedCurrent = selectedTech ? normalizeTechName(selectedTech) : null;

    if (normalizedCurrent === normalizedClicked) {
      router.push("/tech-stack", { scroll: false });
    } else {
      router.push(`/tech-stack?tech=${encodeURIComponent(tech.toLowerCase())}`, {
        scroll: false,
      });
    }
  };

  const clearSelection = () => {
    playClick();
    router.push("/tech-stack", { scroll: false });
  };

  const totalSkills = techSections.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="w-full select-none">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Tech Stack
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Languages, frameworks, databases, and development toolchains"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline">
            {totalSkills} skills
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {techSections.map((category) => {
          const syntaxTag =
            categorySyntaxMap[category.title] ||
            `<${category.title.toLowerCase().replace(/[\s&]+/g, "-")}/>`;

          return (
            <div
              key={category.title}
              className="p-5 rounded-lg bg-surface/30 border border-border-hairline space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground font-semibold tracking-tight">
                  {syntaxTag}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground/60">
                  {category.items.length} items
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => {
                  const isSelected =
                    selectedTech !== null &&
                    normalizeTechName(selectedTech) === normalizeTechName(item);

                  return (
                    <button
                      key={item}
                      onClick={() => handleTechClick(item)}
                      onMouseEnter={playHover}
                      aria-pressed={isSelected}
                      className={`skill-pill cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-surface border-ink/40 text-ink font-semibold shadow-xs ring-1 ring-border-hairline"
                          : "hover:border-border-hairline hover:text-ink"
                      }`}
                      title={`Filter projects using ${item}`}
                    >
                      <TechIcon
                        name={item}
                        className={`w-3.5 h-3.5 transition-colors ${
                          isSelected ? "text-ink" : "text-muted-foreground"
                        }`}
                      />
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated <USED-IN-PROJECTS/> Section Placed Directly Below All Categories */}
      {selectedTech && (
        <section
          ref={usedInProjectsRef}
          id="used-in-projects"
          aria-label={`Projects built with ${selectedTech}`}
          className="mt-8 p-4 sm:p-5 rounded-lg bg-surface/50 border border-border-hairline space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-hairline/40">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
                &lt;USED-IN-PROJECTS/&gt;
              </span>
              <span className="text-border-hairline">•</span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-ink font-semibold">
                <TechIcon name={selectedTech} className="w-3.5 h-3.5 text-brand" />
                <span>{selectedTech}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">
                Used in {matchingProjects.length}{" "}
                {matchingProjects.length === 1 ? "project" : "projects"}
              </span>
              <button
                onClick={clearSelection}
                className="font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors px-2 py-0.5 rounded bg-muted-subtle border border-border-hairline flex items-center gap-1 cursor-pointer"
                aria-label="Clear technology filter"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {matchingProjects.length > 0 ? (
            <div className="space-y-2 pt-1">
              {matchingProjects.map((project, idx) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-md bg-page/80 border border-border-hairline hover:border-border-hairline hover:bg-page transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-brand/70 select-none flex-shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-sans text-xs sm:text-sm font-semibold text-ink group-hover:text-brand transition-colors truncate">
                          {project.title}
                        </h3>
                        {project.status && (
                          <ProjectStatusBadge status={project.status} size="sm" />
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {project.overview}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-ink transition-transform group-hover:translate-x-0.5 flex-shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground py-1">
              No projects currently linked to this technology.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default TechStackClient;
