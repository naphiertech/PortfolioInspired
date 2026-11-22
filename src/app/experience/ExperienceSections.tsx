"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  X,
  Eye,
  CheckCircle2,
  ChevronDown,
  Layers,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  techSections,
  certifications,
  CertificationCategory,
  CertificationItem,
  getCertificationGroups,
  getTrackCourses,
  getTopLevelCertifications,
  hasPreviewableDocument,
  isPdfCertificate,
  getVerifyHref,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import {
  IssuerLogo,
  CertificationTagBadge,
  CareerPathBadge,
  getCertificationMetaText,
  CertificationDocumentPreview,
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
  defaultTrackExpanded = false,
}: {
  defaultTrackExpanded?: boolean;
}) {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | CertificationCategory>("all");
  const [trackExpanded, setTrackExpanded] = useState(defaultTrackExpanded);
  const [mounted, setMounted] = useState(false);

  const certGroups = useMemo(() => getCertificationGroups(), []);
  const filteredItems = useMemo(
    () =>
      activeFilter === "all"
        ? certifications
        : certifications.filter((c) => c.category === activeFilter),
    [activeFilter]
  );
  const topLevelItems = useMemo(
    () => getTopLevelCertifications(filteredItems),
    [filteredItems]
  );
  const flagshipTracks = useMemo(
    () => topLevelItems.filter((c) => Boolean(c.trackId)),
    [topLevelItems]
  );
  const ledgerItems = useMemo(
    () => topLevelItems.filter((c) => !c.trackId),
    [topLevelItems]
  );

  const handleFilterChange = (next: "all" | CertificationCategory) => {
    playClick();
    setActiveFilter(next);
    if (next === "course") {
      setTrackExpanded(true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPreviewCert(null);
      }
    }
    if (previewCert) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewCert]);

  const ledgerHeading =
    activeFilter === "all"
      ? "Courses & Workshops"
      : activeFilter === "course"
      ? "Standalone Course"
      : "Workshops & Events";

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
              {certifications.length}
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
                <span>{group.label}</span>
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

        {/* #1 Flagship Career Path Spotlight */}
        {flagshipTracks.map((track) => {
          const subCourses = track.trackId ? getTrackCourses(track.trackId) : [];
          const hasPreview = hasPreviewableDocument(track);
          const verifyHref = getVerifyHref(track);
          const metaText = getCertificationMetaText(track);
          const panelId = `std-track-${track.trackId}`;

          return (
            <div
              key={track.name}
              className="rounded-xl border border-border-hairline border-t-2 border-t-sky-500/55 dark:border-t-sky-400/50 bg-surface/40 shadow-2xs overflow-hidden"
            >
              <div className="p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-2 shadow-2xs shrink-0 mt-0.5">
                      <IssuerLogo cert={track} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-sans text-base sm:text-[17px] font-semibold text-ink tracking-tight leading-snug">
                        {track.name}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        {track.issuer}
                        {metaText ? ` · ${metaText}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0 pl-[3.25rem] sm:pl-0">
                    <CareerPathBadge label={track.trackLabel || "CAREER PATH"} />
                    <CertificationTagBadge cert={track} />
                  </div>
                </div>

                {track.summary && (
                  <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                    {track.summary}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {hasPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setPreviewCert(track);
                      }}
                      onMouseEnter={playHover}
                      className="tactile-btn gap-1.5 text-xs px-3 py-1.5 min-h-[34px]"
                    >
                      <Eye className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                      <span>Inspect PDF</span>
                    </button>
                  )}

                  {verifyHref && (
                    <a
                      href={verifyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tactile-btn gap-1.5 text-xs px-3 py-1.5 min-h-[34px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />
                      <span>{track.verifyUrl ? "Verify on Credly" : "Open Certificate"}</span>
                    </a>
                  )}
                </div>
              </div>

              {subCourses.length > 0 && (
                <div className="border-t border-border-hairline/70">
                  <button
                    type="button"
                    aria-expanded={trackExpanded}
                    aria-controls={panelId}
                    onClick={() => {
                      playClick();
                      setTrackExpanded((open) => !open);
                    }}
                    onMouseEnter={playHover}
                    className="w-full px-4 sm:px-5 py-2.5 bg-black/[0.015] dark:bg-white/[0.02] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink/90">
                        {String(subCourses.length).padStart(2, "0")} Included Courses
                      </span>
                      <span className="hidden md:inline font-mono text-[11px] text-muted-foreground/75 truncate">
                        · Basics · Devices · Addressing · Support &amp; Security
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground shrink-0">
                      <span>{trackExpanded ? "Hide" : "Expand"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          trackExpanded ? "rotate-180 text-brand" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {trackExpanded && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-label={`${track.name} included courses`}
                        initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          height: { duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-border-hairline/50 border-t border-border-hairline/60 bg-surface/20">
                          {subCourses.map((course, idx) => {
                            const courseHasPreview = hasPreviewableDocument(course);
                            const courseVerifyHref = getVerifyHref(course);

                            return (
                              <div
                                key={course.name}
                                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-surface/60 transition-colors"
                              >
                                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                  <span className="font-mono text-[11px] font-semibold tabular-nums text-sky-600/80 dark:text-sky-400/80 pt-0.5 sm:pt-0 shrink-0 w-5">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    {courseHasPreview ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playClick();
                                          setPreviewCert(course);
                                        }}
                                        onMouseEnter={playHover}
                                        className="text-left font-sans text-xs sm:text-[13.5px] font-medium text-ink group-hover:text-brand transition-colors leading-snug cursor-pointer after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-brand"
                                      >
                                        {course.name}
                                      </button>
                                    ) : (
                                      <span className="font-sans text-xs sm:text-[13.5px] font-medium text-ink leading-snug">
                                        {course.name}
                                      </span>
                                    )}
                                    {course.issuedAt && (
                                      <span className="block sm:inline sm:ml-2 font-mono text-[10.5px] text-muted-foreground/75">
                                        {course.issuedAt}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pl-8 sm:pl-0 shrink-0">
                                  {courseHasPreview && (
                                    <span
                                      aria-hidden="true"
                                      className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-ink px-2 py-1 rounded border border-border-hairline/70 bg-surface/60 transition-colors"
                                    >
                                      <Eye className="w-3 h-3 opacity-75" />
                                      <span>Inspect</span>
                                    </span>
                                  )}

                                  {courseVerifyHref && (
                                    <a
                                      href={courseVerifyHref}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={`Verify ${course.name} on Credly`}
                                      className="relative z-10 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-ink px-2 py-1 rounded border border-border-hairline bg-surface hover:bg-surface-hover transition-colors"
                                    >
                                      <span>Credly</span>
                                      <ExternalLink className="w-3 h-3 opacity-75" aria-hidden="true" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}

        {/* Compact Hairline-Divided Credential Ledger */}
        {ledgerItems.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {ledgerHeading}
              </h3>
              <span className="font-mono text-[11px] text-muted-foreground/70 tabular-nums">
                {String(ledgerItems.length).padStart(2, "0")}
              </span>
            </div>

            <div className="rounded-xl border border-border-hairline bg-surface/25 divide-y divide-border-hairline/60 overflow-hidden shadow-2xs">
              {ledgerItems.map((cert) => {
                const hasPreview = hasPreviewableDocument(cert);
                const verifyHref = getVerifyHref(cert);
                const metaText = getCertificationMetaText(cert);

                return (
                  <div
                    key={cert.name}
                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 px-3.5 sm:px-4 py-3.5 transition-colors ${
                      hasPreview ? "hover:bg-surface/65" : "hover:bg-surface/35"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs shrink-0 mt-0.5 sm:mt-0">
                        <IssuerLogo cert={cert} className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        {hasPreview ? (
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              setPreviewCert(cert);
                            }}
                            onMouseEnter={playHover}
                            className="text-left font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors leading-snug cursor-pointer after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-brand"
                          >
                            {cert.name}
                          </button>
                        ) : (
                          <h4 className="font-sans text-sm font-semibold text-ink leading-snug">
                            {cert.name}
                          </h4>
                        )}

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                          <span className="font-sans truncate max-w-full">{cert.issuer}</span>
                          {metaText && (
                            <>
                              <span aria-hidden="true" className="opacity-40">·</span>
                              <span className="font-mono text-[10.5px] text-muted-foreground/85 tabular-nums">
                                {metaText}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pl-11 sm:pl-0 shrink-0">
                      <CertificationTagBadge cert={cert} />

                      <div className="flex items-center gap-1.5">
                        {hasPreview ? (
                          <span
                            aria-hidden="true"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground group-hover:text-ink px-2 py-1 rounded-md border border-border-hairline/80 bg-surface/70 transition-colors"
                          >
                            <Eye className="w-3 h-3 opacity-75" />
                            <span>Inspect</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[10.5px] text-muted-foreground/70 inline-flex items-center gap-1 px-1.5">
                            <CheckCircle2 className="w-3 h-3 text-ink/75" aria-hidden="true" />
                            <span>Verified</span>
                          </span>
                        )}

                        {verifyHref && (
                          <a
                            href={verifyHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={cert.verifyUrl ? `Verify ${cert.name} on Credly` : `Open certificate for ${cert.name}`}
                            className="relative z-10 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-ink px-2 py-1 rounded-md border border-border-hairline bg-surface hover:bg-surface-hover transition-colors"
                          >
                            <span>{cert.verifyUrl ? "Credly" : "Open"}</span>
                            <ExternalLink className="w-3 h-3 opacity-75" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90">
            “Certifications are milestones, but real learning never stops.”
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
            Keep Building
          </span>
        </div>
      </section>

      {previewCert && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate preview: ${previewCert.name}`}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={() => setPreviewCert(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl bg-surface border border-border-hairline rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 border-b border-border-hairline flex items-center justify-between gap-3 bg-surface/90">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CertificationTagBadge cert={previewCert} />
                  {getCertificationMetaText(previewCert) && (
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      {getCertificationMetaText(previewCert)}
                    </span>
                  )}
                </div>
                <h4 className="font-sans text-sm sm:text-base font-semibold text-ink truncate mt-1">
                  {previewCert.name}
                </h4>
                <p className="text-xs font-mono text-muted-foreground truncate">
                  {previewCert.issuer}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close certificate preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CertificationDocumentPreview cert={previewCert} />

            <div className="px-4 py-2.5 border-t border-border-hairline flex flex-wrap items-center justify-between gap-2 bg-surface/50 font-mono text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                Verified Credential Document
              </span>
              <div className="flex items-center gap-3">
                {previewCert.verifyUrl && (
                  <a
                    href={previewCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand hover:underline font-medium transition-colors"
                  >
                    <span>Verify on Credly</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {previewCert.href && previewCert.href !== "#" && (
                  <a
                    href={previewCert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink hover:text-brand font-medium transition-colors"
                  >
                    <span>{isPdfCertificate(previewCert) ? "Open PDF" : "Open Full Size"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
