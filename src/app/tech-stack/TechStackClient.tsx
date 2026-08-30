"use client";

import React, { useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  techSections,
  techStackIntro,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<FRONTEND/>",
  Backend: "<BACKEND/>",
  "Databases & Cloud": "<DATABASES-CLOUD/>",
  "AI & Machine Learning": "<AI-ML/>",
  "Animation & Design": "<DESIGN-ANIMATION/>",
  "DevOps & Tools": "<DEVOPS-TOOLS/>",
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

      const timer = setTimeout(() => {
        usedInProjectsRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [selectedTech]);

  const handleTechClick = (tech: string) => {
    playClick();
    const normalizedClicked = normalizeTechName(tech);
    const normalizedCurrent = selectedTech
      ? normalizeTechName(selectedTech)
      : null;

    if (normalizedCurrent === normalizedClicked) {
      router.push("/tech-stack", { scroll: false });
    } else {
      router.push(
        `/tech-stack?tech=${encodeURIComponent(tech.toLowerCase())}`,
        {
          scroll: false,
        }
      );
    }
  };

  const clearSelection = () => {
    playClick();
    router.push("/tech-stack", { scroll: false });
  };

  const totalSkills = techSections.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  const InlineTechBadge = ({ name }: { name: string }) => {
    const isSelected =
      selectedTech !== null &&
      normalizeTechName(selectedTech) === normalizeTechName(name);

    return (
      <button
        type="button"
        onClick={() => handleTechClick(name)}
        onMouseEnter={playHover}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border text-[11px] sm:text-xs font-sans align-middle transition-colors cursor-pointer my-0.5 ${
          isSelected
            ? "border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/[0.08] text-ink font-medium"
            : "border-black/[0.08] dark:border-white/[0.08] bg-transparent text-body hover:border-black/20 dark:hover:border-white/20 hover:text-ink"
        }`}
        title={`Filter projects built with ${name}`}
      >
        <TechIcon name={name} className="w-3 h-3 flex-shrink-0" />
        <span>{name}</span>
      </button>
    );
  };

  return (
    <div className="w-full select-none">
      {/* Page Header */}
      <div className="mb-5 space-y-2">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                Tech Stack
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] text-muted-foreground uppercase tracking-wider font-semibold">
                TECH ATLAS
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// languages, frameworks, databases & tooling"}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
              <strong className="text-ink font-semibold">{totalSkills}</strong> tools
            </span>
          </div>
        </div>
      </div>

      {/* Natural Editorial Intro */}
      <div className="mb-7 space-y-2.5 font-sans text-xs sm:text-[13px] leading-relaxed">
        <p className="text-body">
          {techStackIntro.headline}
        </p>
        <p className="leading-loose text-body">
          Depending on the project, I work with{" "}
          {techStackIntro.highlightedTools.map((tool, idx) => (
            <React.Fragment key={tool}>
              <InlineTechBadge name={tool} />
              {idx < techStackIntro.highlightedTools.length - 1 ? ", " : ", and other tools shown below."}
            </React.Fragment>
          ))}
        </p>
        <p className="text-muted-foreground/75">
          {techStackIntro.footer}
        </p>
      </div>

      {/* Horizontal Structural Rail before Tech Atlas */}
      <EditorialDivider className="mb-6 sm:mb-8" />

      {/* Editorial Tech Atlas (Full-Width Catalog Rows) */}
      <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] border-y border-black/[0.06] dark:border-white/[0.06]">
        {techSections.map((category, index) => {
          const categoryNumber = String(index + 1).padStart(2, "0");
          const syntaxTag =
            categorySyntaxMap[category.title] ||
            `<${category.title.toUpperCase().replace(/[\s&]+/g, "-")}/>`;

          return (
            <section
              key={category.title}
              className="py-5 sm:py-6 group/row"
              aria-label={`${category.title} category`}
            >
              {/* Desktop 2-column layout; Mobile vertical stack */}
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
                {/* Left Column: Technical Index Label */}
                <div className="md:w-44 lg:w-48 flex-shrink-0 flex md:flex-col justify-between md:justify-start items-baseline md:items-start gap-1 pb-1 md:pb-0 border-b md:border-b-0 border-black/[0.04] dark:border-white/[0.04]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-emerald-500/70 dark:text-emerald-400/70 select-none">
                      {categoryNumber}
                    </span>
                    <span className="font-mono text-xs font-semibold text-ink/85 tracking-tight">
                      {syntaxTag}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground/50">
                    {category.items.length} tools
                  </span>
                </div>

                {/* Right Column: Technology Canvas */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {category.items.map((item) => {
                      const isSelected =
                        selectedTech !== null &&
                        normalizeTechName(selectedTech) ===
                          normalizeTechName(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleTechClick(item)}
                          onMouseEnter={playHover}
                          aria-pressed={isSelected}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-sans transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "border border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/[0.08] text-ink font-semibold"
                              : "border border-black/[0.08] dark:border-white/[0.08] bg-transparent text-body hover:border-black/20 dark:hover:border-white/20 hover:text-ink hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                          }`}
                          title={`Filter projects using ${item}`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 animate-pulse flex-shrink-0" />
                          )}
                          <TechIcon
                            name={item}
                            className={`w-3.5 h-3.5 ${
                              isSelected ? "text-ink" : "text-muted-foreground"
                            }`}
                          />
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Dedicated <USED-IN-PROJECTS/> Connection Section */}
      {selectedTech && (
        <section
          ref={usedInProjectsRef}
          id="used-in-projects"
          aria-label={`Projects built with ${selectedTech}`}
          className="mt-8 p-4 sm:p-5 rounded-lg border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.01] dark:bg-white/[0.01] space-y-4 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* CAD Connection Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              <span className="text-emerald-500/80 dark:text-emerald-400/80 font-semibold tracking-wider">
                &lt;USED-IN-PROJECTS/&gt;
              </span>
              <span className="text-black/20 dark:text-white/20 select-none">──→</span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-ink font-medium">
                <TechIcon name={selectedTech} className="w-3.5 h-3.5" />
                <span>{selectedTech}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">
                {matchingProjects.length}{" "}
                {matchingProjects.length === 1 ? "linked project" : "linked projects"}
              </span>
              <button
                onClick={clearSelection}
                className="font-mono text-[11px] text-muted-foreground hover:text-ink transition-colors px-2 py-0.5 rounded border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center gap-1 cursor-pointer"
                aria-label="Clear technology filter"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Connected Projects List */}
          {matchingProjects.length > 0 ? (
            <div className="space-y-2 pt-1">
              {matchingProjects.map((project, idx) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-md border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/20 dark:hover:border-white/20 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-emerald-500/70 dark:text-emerald-400/70 select-none flex-shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-sans text-xs sm:text-sm font-semibold text-ink group-hover:text-emerald-500 transition-colors truncate">
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
            <div className="p-3 rounded border border-dashed border-black/[0.08] dark:border-white/[0.08] font-mono text-xs text-muted-foreground">
              No projects currently linked to <strong className="text-ink">{selectedTech}</strong> in the portfolio catalog.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default TechStackClient;
