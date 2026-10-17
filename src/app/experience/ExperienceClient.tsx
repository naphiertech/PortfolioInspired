"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Calendar,
  FolderGit2,
  FileText,
  ArrowRight,
  ExternalLink,
  Award,
  GraduationCap,
  X,
  Eye,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  experiences,
  techSections,
  techStackIntro,
  certifications,
  CertificationItem,
  workCapabilities,
  getProjectsUsingTech,
  getCanonicalTechName,
  normalizeTechName,
} from "@/lib/data";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";
import { TechIcon } from "@/components/TechIcon";
import { EditorialDivider } from "@/components/EditorialDivider";
import { StatusBadge, ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { useUISound } from "@/context/SoundContext";

const categorySyntaxMap: Record<string, string> = {
  Frontend: "<FRONTEND/>",
  Backend: "<BACKEND/>",
  "Databases & Cloud": "<DATABASES-CLOUD/>",
  "AI & Machine Learning": "<AI-ML/>",
  "Animation & Design": "<DESIGN-ANIMATION/>",
  "DevOps & Tools": "<DEVOPS-TOOLS/>",
};

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function DICTLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" className="fill-slate-900 stroke-blue-500/40" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="17" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
      <circle cx="24" cy="24" r="8.5" fill="#1E3A8A" />
      <path d="M24 16 L31 24 L24 32 Z" fill="#DC2626" opacity="0.9" />
      <path d="M24 16 L17 24 L24 32 Z" fill="#2563EB" opacity="0.9" />
      <circle cx="24" cy="24" r="3.2" fill="#FBBF24" />
      <path d="M14 18 A14 14 0 0 1 34 18" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 20 A10 10 0 0 1 31 20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ExperienceClient() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificationItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [expandedExperiences, setExpandedExperiences] = useState<Set<number>>(new Set());
  const usedInProjectsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth scroll to target anchor when page loads with a hash or hash changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlTech = new URLSearchParams(window.location.search).get("tech");
      if (urlTech) {
        setSelectedTech(urlTech);
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

  // Close lightbox on Escape
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

  // Gentle auto-scroll to <USED-IN-PROJECTS/> when selecting a tech
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

    if (normalizedCurrent === normalizedClicked) {
      setSelectedTech(null);
    } else {
      setSelectedTech(tech);
    }
  };

  const getIssuerLogo = (cert: CertificationItem) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return <GoogleLogo />;
    }
    if (
      cert.tag === "DICT" ||
      cert.issuer.includes("DICT") ||
      cert.issuer.includes("Information and Communications")
    ) {
      return <DICTLogo />;
    }
    return <Award className="w-5 h-5 text-muted-foreground" />;
  };

  const getTagBadge = (cert: CertificationItem) => {
    if (cert.tag === "GOOGLE" || cert.issuer.includes("Google")) {
      return (
        <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          GOOGLE
        </span>
      );
    }
    if (
      cert.tag === "DICT" ||
      cert.issuer.includes("DICT") ||
      cert.issuer.includes("Information and Communications")
    ) {
      return (
        <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          DICT
        </span>
      );
    }
    return (
      <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-muted-subtle text-muted-foreground border border-border-hairline">
        CREDENTIAL
      </span>
    );
  };

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

  const totalSkills = techSections.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  return (
    <div className="space-y-12 sm:space-y-14 animate-in fade-in duration-300">
      {/* Top Header & Context Row */}
      <div className="space-y-4">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 pt-1">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Experience & Background
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// work history, complete technical stack & verified credentials"}
            </p>
          </div>

          <StatusBadge
            status="available"
            label={AVAILABILITY.label}
            size="sm"
            className="self-start sm:self-auto"
          />
        </div>
      </div>

      {/* Compact Status Block */}
      <div className="p-4 sm:p-5 rounded-lg bg-surface/30 border border-border-hairline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Status:</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-medium">
              {AVAILABILITY.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Looking for:</span>
            <span className="text-ink">{AVAILABILITY.lookingFor}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Location:</span>
            <span className="text-ink">{AUTHOR_INFO.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Work preference:</span>
            <span className="text-ink">{AVAILABILITY.workPreference}</span>
          </div>
        </div>
      </div>

      {/* Main Narrative Copy */}
      <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-4">
        <p>
          I&apos;m currently looking for my first professional opportunity in tech.
        </p>
        <p>
          I&apos;ve spent significant time{" "}
          <span className="text-ink font-medium">building real projects</span>,
          experimenting with modern tools, and learning how to turn complex ideas
          into polished, high-performance applications. I specialize in{" "}
          <span className="text-ink font-medium">frontend architecture</span>,{" "}
          <span className="text-ink font-medium">UI/UX craft</span>, and{" "}
          <span className="text-ink font-medium">full-stack web development</span>.
        </p>
        <p>
          I&apos;m open to{" "}
          <span className="text-ink font-medium">junior roles</span>,{" "}
          <span className="text-ink font-medium">internships</span>,{" "}
          <span className="text-ink font-medium">freelance work</span>,{" "}
          <span className="text-ink font-medium">project-based collaborations</span>,
          and opportunities where I can learn while contributing to something useful.
        </p>
      </div>

      {/* Divider before Act 1 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 1: <WORK-HISTORY/> */}
      <section id="work" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;work-history/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {experiences.length} milestones
          </span>
        </div>

        <div className="divide-y divide-border-divider border-y border-border-divider">
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
                  aria-controls={`exp-detail-${index}`}
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
                      id={`exp-detail-${index}`}
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
                      <div className="pt-3 pb-1 pl-0 sm:pl-[176px] space-y-3">
                        {exp.details && exp.details.length > 0 && (
                          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-[13px] text-muted-foreground font-sans">
                            {exp.details.map((bullet, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                            {exp.technologies.map((tech) => (
                              <span key={tech} className="skill-pill">
                                <TechIcon name={tech} className="w-3.5 h-3.5" />
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

        {/* Academic Foundation Card */}
        <div className="pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block mb-3">
            &lt;academic-foundation/&gt;
          </span>
          <div className="p-4 sm:p-5 rounded-lg bg-surface/30 border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <GraduationCap className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-sans font-semibold text-sm sm:text-base text-ink">
                  {EDUCATION.degree}
                </h3>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  {EDUCATION.institution} · {EDUCATION.department}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground flex-shrink-0 sm:text-right">
              {EDUCATION.period}
            </span>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="pt-3 space-y-3">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;what-i-can-help-with/&gt;
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {workCapabilities.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface/30 border border-border-hairline font-sans text-xs sm:text-[13px] text-ink"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 flex-shrink-0" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider before Act 2 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 2: <TECHNICAL-STACK/> */}
      <section id="tech-stack" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;technical-stack/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {totalSkills} tools across 6 disciplines
          </span>
        </div>

        {/* Natural Editorial Intro */}
        <div className="space-y-2.5 font-sans text-xs sm:text-[13px] leading-relaxed">
          <p className="text-body">{techStackIntro.headline}</p>
          <p className="leading-loose text-body">
            Depending on the project, I work with{" "}
            {techStackIntro.highlightedTools.map((tool, idx) => (
              <React.Fragment key={tool}>
                <InlineTechBadge name={tool} />
                {idx < techStackIntro.highlightedTools.length - 1
                  ? ", "
                  : ", and other tools shown below."}
              </React.Fragment>
            ))}
          </p>
          <p className="text-muted-foreground/75">{techStackIntro.footer}</p>
        </div>

        {/* Catalog Rows */}
        <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] border-y border-black/[0.06] dark:border-white/[0.06]">
          {techSections.map((category, index) => {
            const categoryNumber = String(index + 1).padStart(2, "0");
            const syntaxTag =
              categorySyntaxMap[category.title] ||
              `<${category.title.toUpperCase().replace(/[\s&]+/g, "-")}/>`;

            return (
              <div
                key={category.title}
                className="py-5 sm:py-6 flex flex-col md:flex-row md:items-start gap-3 md:gap-8"
              >
                {/* Index Label */}
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

                {/* Technologies */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {category.items.map((item) => {
                      const isSelected =
                        selectedTech !== null &&
                        normalizeTechName(selectedTech) === normalizeTechName(item);

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
            );
          })}
        </div>

        {/* Dedicated <USED-IN-PROJECTS/> Connection Section */}
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
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
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
                No flagship projects currently tagged with {selectedTech}.
              </p>
            )}
          </section>
        )}
      </section>

      {/* Divider before Act 3 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 3: <VERIFIED-CERTIFICATIONS/> */}
      <section id="certifications" className="scroll-mt-20 sm:scroll-mt-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;verified-certifications/&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {certifications.length} credentials
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert) => {
            const hasPreviewImage =
              cert.href &&
              (cert.href.endsWith(".png") ||
                cert.href.endsWith(".jpg") ||
                cert.href.endsWith(".webp"));

            return (
              <div
                key={cert.name}
                className="p-4 sm:p-5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/60 transition-all duration-200 flex flex-col justify-between group shadow-2xs relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-surface border border-border-hairline flex items-center justify-center p-1.5 shadow-2xs">
                      {getIssuerLogo(cert)}
                    </div>
                    {getTagBadge(cert)}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                      {cert.name}
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                      Issued by <span className="text-body font-medium">{cert.issuer}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border-hairline/40 flex items-center justify-between gap-2">
                  {cert.code ? (
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline truncate max-w-[170px]">
                      ID: {cert.code}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-muted-foreground/60 italic">
                      Verified
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {hasPreviewImage && (
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setPreviewCert(cert);
                        }}
                        onMouseEnter={playHover}
                        className="tactile-btn gap-1 text-xs px-2.5 py-1"
                        title={`Inspect certificate for ${cert.name}`}
                      >
                        <Eye className="w-3 h-3 opacity-70" />
                        <span>Inspect</span>
                      </button>
                    )}

                    {cert.href && cert.href !== "#" && (
                      <a
                        href={cert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tactile-btn gap-1 text-xs px-2.5 py-1"
                      >
                        <ExternalLink className="w-3 h-3 opacity-70" />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Quote */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="border-l-2 border-border-hairline pl-3 italic text-muted-foreground/90">
            “Certifications are milestones, but real learning never stops.”
          </div>
          <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider font-medium sm:text-right">
            Keep Building
          </span>
        </div>
      </section>

      {/* Divider before Act 4 */}
      <EditorialDivider className="my-8 sm:my-10" />

      {/* ACT 4: <LET'S-WORK-TOGETHER/> */}
      <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 space-y-5">
        <div className="flex items-center gap-2 pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;let&apos;s-work-together/&gt;
          </span>
        </div>

        <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-3">
          <p>
            If you&apos;re working on something and think I might be a good fit, I&apos;d be happy to hear about it.
          </p>
          <p>
            Whether it&apos;s a junior role, internship, freelance project, collaboration, or simply a conversation about an idea, feel free to reach out.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          <a
            href={`mailto:${SOCIAL_PROFILES.email}`}
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Mail className="w-3.5 h-3.5 opacity-70" />
            <span>Send Email</span>
          </a>

          <a
            href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span>Schedule a Call</span>
          </a>

          <Link
            href="/projects"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FolderGit2 className="w-3.5 h-3.5 opacity-70" />
            <span>View Projects</span>
          </Link>

          <a
            href="/resume/naphier_awalie_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn gap-2 h-9 px-4 rounded-md"
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span>Download Resume</span>
          </a>
        </div>
      </section>

      {/* Lightbox Modal */}
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
                  {previewCert.tag && (
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                      {previewCert.tag}
                    </span>
                  )}
                  {previewCert.code && (
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      ID: {previewCert.code}
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

            {previewCert.href && (
              <div className="relative w-full aspect-[4/3] bg-black/40">
                <Image
                  src={previewCert.href}
                  alt={previewCert.name}
                  fill
                  sizes="(max-width: 768px) 95vw, 672px"
                  className="object-contain p-3 sm:p-5"
                />
              </div>
            )}

            <div className="px-4 py-2.5 border-t border-border-hairline flex items-center justify-between gap-2 bg-surface/50 font-mono text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Credential Document
              </span>
              {previewCert.href && (
                <a
                  href={previewCert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink hover:text-brand font-medium transition-colors"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ExperienceClient;
