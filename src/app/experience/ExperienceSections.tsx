"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  X,
} from "lucide-react";
import {
  techSections,
  certifications,
  CertificationCategory,
  CertificationItem,
  getTopLevelCertifications,
  getTopLevelCertificationGroups,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import {
  CertificationBoxCard,
  CertificationInspectorModal,
} from "@/components/CertificationShared";
import { TechIconTile } from "@/components/TechIconTile";
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

/**
 * Shared interactive Technical Stack & Tools section used by /experience and /tech-stack.
 */
export function TechStackSection({ defaultShowAll = false }: { defaultShowAll?: boolean }) {
  const { playHover, playClick } = useUISound();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(defaultShowAll);
  const usedInProjectsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTech = new URLSearchParams(window.location.search).get("tech");
      if (urlTech) {
        setSelectedTech(urlTech);
        setShowAllSkills(true);
      }
    }
  }, []);

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
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedTech]);

  const matchingProjects = useMemo(() => {
    if (!selectedTech) return [];
    const canonical = getCanonicalTechName(selectedTech);
    return canonical ? getProjectsUsingTech(canonical) : [];
  }, [selectedTech]);

  const handleTechClick = (tech: string) => {
    playClick();
    const normalizedClicked = normalizeTechName(tech);
    const normalizedCurrent = selectedTech ? normalizeTechName(selectedTech) : null;
    setSelectedTech(normalizedCurrent === normalizedClicked ? null : tech);
  };

  const totalSkills = techSections.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <section id="tech-stack" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
          &lt;skills-and-tools/&gt;
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {totalSkills} tools in {techSections.length} groups
        </span>
      </div>

      <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
        Tools I use to build websites and apps. Choose a tool to see projects that use it.
      </p>

      <div id="experience-skills-list" className="divide-y divide-black/[0.05] dark:divide-white/[0.05] border-y border-black/[0.06] dark:border-white/[0.06]">
        {techSections.slice(0, showAllSkills ? undefined : 3).map((category, index) => {
          const categoryNumber = String(index + 1).padStart(2, "0");
          const syntaxTag =
            categorySyntaxMap[category.title] ||
            `<${category.title.toLowerCase().replace(/[\s&]+/g, "-")}/>`;

          return (
            <div
              key={category.title}
              className="relative py-5 sm:py-6 flex flex-col md:flex-row md:items-start gap-3 md:gap-6"
            >
              <div className="md:w-40 lg:w-44 flex-shrink-0 flex md:flex-col justify-between md:justify-start items-baseline md:items-start gap-1 pb-1 md:pb-0 md:pt-1.5 border-b md:border-b-0 border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground select-none">
                    {categoryNumber}
                  </span>
                  <span className="font-mono text-xs font-medium text-ink/85 tracking-tight lowercase">
                    {syntaxTag}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/50">
                  {category.items.length} tools
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {category.items.map((item) => {
                    const isSelected =
                      selectedTech !== null &&
                      normalizeTechName(selectedTech) === normalizeTechName(item);

                    return (
                      <TechIconTile
                        key={item}
                        name={item}
                        ariaPressed={isSelected}
                        isSelected={isSelected}
                        onClick={() => handleTechClick(item)}
                        onMouseEnter={playHover}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!defaultShowAll && (
        <button
          type="button"
          onClick={() => { playClick(); setShowAllSkills((shown) => !shown); }}
          onMouseEnter={playHover}
          aria-expanded={showAllSkills}
          aria-controls="experience-skills-list"
          className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-muted-foreground hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {showAllSkills ? "Show fewer groups" : `View all ${techSections.length} groups`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllSkills ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}

      {selectedTech && (
        <section
          ref={usedInProjectsRef}
          id="used-in-projects"
          aria-label={`Projects built with ${selectedTech}`}
          className="p-4 sm:p-5 rounded-lg border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.01] dark:bg-white/[0.01] space-y-4 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.05]">
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              <span className="text-muted-foreground/60 uppercase">
                &lt;USED-IN-PROJECTS/&gt;
              </span>
              <span className="px-2 py-0.5 rounded bg-muted-subtle text-ink font-semibold border border-border-hairline">
                {selectedTech}
              </span>
              <span className="text-muted-foreground/60">
                ({matchingProjects.length}{" "}
                {matchingProjects.length === 1 ? "project" : "projects"})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                setSelectedTech(null);
              }}
              className="font-mono text-xs text-muted-foreground hover:text-ink transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filter</span>
            </button>
          </div>

          {matchingProjects.length > 0 ? (
            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              {matchingProjects.map((project) => (
                <div
                  key={project.slug}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      onMouseEnter={playHover}
                      onClick={playClick}
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
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="font-mono text-xs text-muted-foreground hover:text-brand transition-colors inline-flex items-center gap-1 flex-shrink-0"
                  >
                    <span>View project</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-muted-foreground italic py-1">
              No projects listed for {selectedTech} yet.
            </p>
          )}
        </section>
      )}
    </section>
  );
}

/**
 * Shared Verified Certifications section & modal preview used by /experience and /certifications.
 */
export function CertificationsSection({
  defaultTrackExpanded: _defaultTrackExpanded = false,
}: {
  defaultTrackExpanded?: boolean;
}) {
  void _defaultTrackExpanded;
  const { playHover, playClick } = useUISound();
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | CertificationCategory>("all");

  const topLevelCerts = useMemo(() => getTopLevelCertifications(certifications), []);
  const certGroups = useMemo(() => getTopLevelCertificationGroups(certifications), []);
  const visibleCerts = useMemo(
    () =>
      activeFilter === "all"
        ? topLevelCerts
        : topLevelCerts.filter((c) => c.category === activeFilter),
    [activeFilter, topLevelCerts]
  );

  const handleFilterChange = (next: "all" | CertificationCategory) => {
    playClick();
    setActiveFilter(next);
  };

  return (
    <>
      <section id="certifications" className="scroll-mt-20 sm:scroll-mt-24 space-y-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;certificates/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {certifications.length} verified
          </span>
        </div>

        {/* Segmented Category Filter */}
        <div
          role="group"
          aria-label="Filter certifications by category"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-surface/50 border border-border-hairline"
        >
          <button
            type="button"
            aria-pressed={activeFilter === "all"}
            onClick={() => handleFilterChange("all")}
            onMouseEnter={playHover}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
              activeFilter === "all"
                ? "bg-ink text-page font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-ink hover:bg-surface/80"
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] tabular-nums ${
                activeFilter === "all" ? "opacity-80" : "opacity-60"
              }`}
            >
              {topLevelCerts.length}
            </span>
          </button>

          {certGroups.map((group) => {
            const isActive = activeFilter === group.id;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleFilterChange(group.id)}
                onMouseEnter={playHover}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-ink text-page font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-ink hover:bg-surface/80"
                }`}
              >
                <span>{group.shortLabel}</span>
                <span
                  className={`text-[10px] tabular-nums ${
                    isActive ? "opacity-80" : "opacity-60"
                  }`}
                >
                  {group.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Double-Bordered Credential Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {visibleCerts.map((cert) => (
            <CertificationBoxCard
              key={cert.name}
              cert={cert}
              variant="standard"
              onSelect={(selected) => {
                playClick();
                setPreviewCert(selected);
              }}
              onHover={playHover}
            />
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90">
            “Certifications are milestones, but real learning never stops.”
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
            Keep Building
          </span>
        </div>
      </section>

      <CertificationInspectorModal
        selectedCert={previewCert}
        onClose={() => setPreviewCert(null)}
        variant="standard"
        onSelectCourse={playClick}
      />
    </>
  );
}
