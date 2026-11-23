"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Calendar,
  FileText,
  ArrowUpRight,
  GraduationCap,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  experiences,
  techSections,
  certifications,
  CertificationCategory,
  CertificationItem,
  getTopLevelCertifications,
  getTopLevelCertificationGroups,
  getProjectsUsingTech,
  getCanonicalTechName,
} from "@/lib/data";
import {
  CertificationBoxCard,
  CertificationInspectorModal,
} from "@/components/CertificationShared";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";
import { TechIcon } from "@/components/TechIcon";
import { EditorialDivider } from "@/components/EditorialDivider";
import { CalBookingTrigger } from "@/components/CalBookingModal";
import { StatusBadge, ProjectStatusBadge } from "@/components/ProjectStatusBadge";
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

function FocusTechChip({
  tech,
  isSelected,
  onSelect,
  onHover,
}: {
  tech: string;
  isSelected: boolean;
  onSelect: (tech: string) => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tech)}
      onMouseEnter={onHover}
      aria-pressed={isSelected}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors select-none cursor-pointer ${
        isSelected
          ? "bg-ink text-page font-semibold border border-ink shadow-xs"
          : "bg-surface/60 border border-border-hairline text-zinc-700 dark:text-zinc-300 hover:border-border hover:text-ink"
      }`}
    >
      <TechIcon
        name={tech}
        className={`w-3.5 h-3.5 flex-shrink-0 ${
          isSelected ? "text-page" : "text-zinc-500 dark:text-zinc-400"
        }`}
      />
      <span>{tech}</span>
    </button>
  );
}

/**
 * FocusExperiencePage
 *
 * Focus Mode presentation for /experience.
 * Unifies Work History, Categorized Tech Stack, and Verified Credentials.
 */
export function FocusExperiencePage() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  // Tech stack filter state
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Certificate inspector state
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const [expandedExperiences, setExpandedExperiences] = useState<Set<number>>(new Set());

  // Smooth scroll to target anchor when page loads with a hash or hash changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTech = new URLSearchParams(window.location.search).get("tech");
      if (urlTech) {
        setSelectedTech(urlTech);
        setShowAllSkills(true);
      }
    }

    const handleHashScroll = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      let attempts = 0;
      const maxAttempts = 15;

      const tryScroll = () => {
        const target = document.getElementById(hash);
        if (target) {
          requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 60);
        }
      };

      setTimeout(tryScroll, 40);
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const toggleExperience = (idx: number) => {
    playClick();
    setExpandedExperiences((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const matchingProjects = useMemo(() => {
    if (!selectedTech) return [];
    const canonical = getCanonicalTechName(selectedTech);
    return canonical ? getProjectsUsingTech(canonical) : [];
  }, [selectedTech]);

  const handleTechClick = (techName: string) => {
    playClick();
    if (selectedTech === techName) {
      setSelectedTech(null);
    } else {
      setSelectedTech(techName);
    }
  };

  const [activeCertFilter, setActiveCertFilter] = useState<"all" | CertificationCategory>("all");

  const topLevelCerts = useMemo(() => getTopLevelCertifications(certifications), []);
  const certGroups = useMemo(() => getTopLevelCertificationGroups(certifications), []);
  const visibleCerts = useMemo(
    () =>
      activeCertFilter === "all"
        ? topLevelCerts
        : topLevelCerts.filter((c) => c.category === activeCertFilter),
    [activeCertFilter, topLevelCerts]
  );

  const handleCertFilterChange = (next: "all" | CertificationCategory) => {
    playClick();
    setActiveCertFilter(next);
  };

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Experience & Background
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
              My work, skills, certificates, and the roles I’m looking for.
            </p>
          </div>
        </div>
      </div>

      <EditorialDivider className="my-4 sm:my-5" />

      <div>
        {/* Concise introduction */}
        <p className="max-w-2xl font-sans text-[15px] leading-[26px] text-muted-foreground">
          I build thoughtful web applications with a focus on{" "}
          <span className="font-medium text-ink">web development and easy-to-use interfaces</span>.
          I&apos;m looking for my first professional opportunity and am open to junior roles,
          internships, freelance work, and team projects.
        </p>
      </div>

      <EditorialDivider className="my-4 sm:my-5" />

      {/* 01 // WORK HISTORY & EDUCATION */}
      <section id="work" aria-label="Work history and education" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
          <span>01 // WORK HISTORY & EDUCATION</span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground/40 font-mono">TIMELINE</span>
        </div>

        {/* Experience Timeline Accordion */}
        <div className="divide-y divide-border-divider">
          {experiences.map((exp, index) => {
            const isOpen = expandedExperiences.has(index);

            return (
              <div
                key={`${exp.year}-${index}`}
                className="py-3.5 sm:py-4 transition-colors"
              >
                {/* Clickable Summary Row / Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleExperience(index)}
                  onMouseEnter={playHover}
                  aria-expanded={isOpen}
                  aria-controls={`focus-exp-detail-${index}`}
                  className="w-full text-left flex items-start justify-between gap-3 p-2 -m-2 rounded-lg hover:bg-surface/40 transition-colors group/row cursor-pointer"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-2 sm:gap-6 items-start flex-1 min-w-0">
                    {/* Date Column */}
                    <div className="min-w-0 flex items-center gap-2 pt-0.5">
                      <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink">
                        {exp.year}
                      </span>
                      {exp.isCurrent && (
                        <StatusBadge status="active" size="sm" />
                      )}
                    </div>

                    {/* Role & Company & Brief Summary */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-sans font-semibold text-sm sm:text-base text-ink group-hover/row:text-brand transition-colors">
                          {exp.role}
                        </h3>
                        <span className="text-muted-foreground/60 font-mono text-xs select-none">·</span>
                        <span className="font-mono text-xs sm:text-[13px] text-muted-foreground">
                          {exp.company}
                        </span>
                      </div>

                      {exp.description && (
                        <p className="mt-1 text-[13.5px] sm:text-sm text-body font-sans leading-relaxed line-clamp-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Chevron Indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-1 text-muted-foreground/60 group-hover/row:text-ink transition-colors">
                    <span className="font-mono text-[10.5px] hidden sm:inline text-muted-foreground/50">
                      {isOpen ? "less" : "details"}
                    </span>
                    <div className="w-5 h-5 rounded flex items-center justify-center">
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>

                {/* Collapsible Details Region */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`focus-exp-detail-${index}`}
                      role="region"
                      aria-label={`${exp.role} details`}
                      initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                      transition={{
                        height: { duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1 pl-0 sm:pl-[184px] space-y-3">
                        {exp.details && exp.details.length > 0 && (
                          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-[13px] text-muted-foreground/90 font-sans">
                            {exp.details.map((bullet, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-surface/50 border border-border-hairline text-muted-foreground"
                              >
                                <TechIcon name={tech} className="w-3 h-3 text-muted-foreground/70" />
                                <span>{tech}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Education Highlight Card */}
        <div className="mt-2 p-4 sm:p-5 rounded-md border border-border-hairline bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <GraduationCap className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-sans font-semibold text-sm sm:text-base text-ink">
                {EDUCATION.degree}
              </h3>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {EDUCATION.institution} · {EDUCATION.department}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 flex-shrink-0 sm:text-right">
            {EDUCATION.period}
          </span>
        </div>
      </section>

      <EditorialDivider className="my-4 sm:my-5" />

      {/* 02 // SKILLS & TOOLS */}
      <section id="tech-stack" aria-label="Skills and tools" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
          <span>02 // SKILLS & TOOLS</span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground/40 font-mono">
            {techSections.reduce((acc, cat) => acc + cat.items.length, 0)} SKILLS
          </span>
        </div>

        <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
          Tools I use to build websites and apps. Choose a tool to see projects that use it.
        </p>

        {/* Domain-Grouped Technology Ledger */}
        <div id="experience-skills-list" className="divide-y divide-border-divider">
          {techSections.slice(0, showAllSkills ? undefined : 3).map((section) => {
            const syntaxTag =
              categorySyntaxMap[section.title] || `<${section.title.toUpperCase()}/>`;

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
                  <span className="font-caps text-[10px] text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">
                    {syntaxTag}
                  </span>
                </div>

                {/* Technologies Badges */}
                <div className="min-w-0 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {section.items.map((tech) => (
                    <FocusTechChip
                      key={tech}
                      tech={tech}
                      isSelected={selectedTech === tech}
                      onSelect={handleTechClick}
                      onHover={playHover}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

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

        {/* Selected Technology Cross-Reference Panel */}
        {selectedTech && (
          <div className="p-4 sm:p-5 rounded-md border border-border-hairline bg-surface/40 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-muted-foreground/70 uppercase">FILTERED BY:</span>
                <span className="px-2 py-0.5 rounded bg-ink text-page font-bold">
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
                className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear filter</span>
              </button>
            </div>

            {matchingProjects.length > 0 ? (
              <div className="divide-y divide-border-divider/60 border-t border-border-divider/60 pt-2">
                {matchingProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="py-2.5 flex items-center justify-between gap-4"
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
                      <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-muted-foreground italic pt-1">
                No projects listed for {selectedTech} yet.
              </p>
            )}
          </div>
        )}
      </section>

      <EditorialDivider className="my-4 sm:my-5" />

      {/* 03 // CERTIFICATES */}
      <section id="certifications" aria-label="Certificates" className="scroll-mt-20 sm:scroll-mt-24 space-y-5">
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 uppercase tracking-wider">
          <span>03 // CERTIFICATES</span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground/50 font-mono tabular-nums">
            {certifications.length} VERIFIED
          </span>
        </div>

        {/* Segmented Category Filter */}
        <div
          role="group"
          aria-label="Filter certificates by category"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-md bg-surface/50 border border-border-hairline"
        >
          <button
            type="button"
            aria-pressed={activeCertFilter === "all"}
            onClick={() => handleCertFilterChange("all")}
            onMouseEnter={playHover}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              activeCertFilter === "all"
                ? "bg-ink text-page font-semibold shadow-2xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-ink hover:bg-surface/80"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] tabular-nums opacity-70">{topLevelCerts.length}</span>
          </button>

          {certGroups.map((group) => {
            const isActive = activeCertFilter === group.id;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleCertFilterChange(group.id)}
                onMouseEnter={playHover}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  isActive
                    ? "bg-ink text-page font-semibold shadow-2xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-ink hover:bg-surface/80"
                }`}
              >
                <span>{group.shortLabel}</span>
                <span className="text-[10px] tabular-nums opacity-70">{group.items.length}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Double-Bordered Credential Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {visibleCerts.map((cert) => (
            <CertificationBoxCard
              key={cert.name}
              cert={cert}
              variant="focus"
              onSelect={(selected) => {
                playClick();
                setPreviewCert(selected);
              }}
              onHover={playHover}
            />
          ))}
        </div>

        {/* Milestone Quote */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90 font-mono text-[11.5px]">
            “Certifications are milestones, but real learning never stops.”
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
            KEEP BUILDING
          </span>
        </div>
      </section>

      <EditorialDivider className="my-4 sm:my-5" />

      {/* 04 // HIRING & COLLABORATION */}
      <section id="contact" aria-label="Work opportunities and collaboration" className="scroll-mt-20 sm:scroll-mt-24">
        <div className="font-mono text-xs text-muted-foreground/60 uppercase tracking-wider mb-3.5">
          04 // HIRING & COLLABORATION
        </div>

        <div className="p-4 sm:p-5 rounded-md border border-border-hairline bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-sans font-semibold text-base text-ink">
              Ready for web engineering and freelance roles
            </h3>
            <p className="text-[13.5px] sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mt-1">
              {AVAILABILITY.workSetup} · Based in {AUTHOR_INFO.location}. Open to{" "}
              {AVAILABILITY.openTo}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <a
              href={`mailto:${SOCIAL_PROFILES.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send Email</span>
            </a>

            <CalBookingTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface hover:border-border transition-colors">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span>Schedule Call</span>
            </CalBookingTrigger>

            <a
              href="/resume/naphier_awalie_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface hover:border-border transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span>Résumé PDF</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground/60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Certificate Split-Pane Inspector Modal */}
      <CertificationInspectorModal
        selectedCert={previewCert}
        onClose={() => setPreviewCert(null)}
        variant="focus"
        onSelectCourse={playClick}
      />
    </div>
  );
}

export default FocusExperiencePage;
