"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Layers,
  Server,
  Layout,
  GraduationCap,
  Terminal,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experiences } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./ProjectStatusBadge";
import { ExperienceTowerNode, ExperienceTowerBase } from "./ExperienceTower";
import towerStyles from "./ExperienceTower.module.css";
import { useUISound } from "@/context/SoundContext";
import {
  sectionContainerVariants,
  timelineContainerVariants,
  milestoneVariants,
} from "@/lib/motion";

// Compact disclosure copy; full experience descriptions remain in the shared data.
const disclosureHighlights: Record<string, string[]> = {
  PRESENT: [
    "Full-stack apps with Next.js, React, TypeScript, and Supabase.",
    "MKBRiderTrack: attendance, logistics, and biometric verification.",
    "Naphix Resume: live A4 previews and dual export.",
    "Responsive interfaces, role-based access, and REST/Edge APIs.",
  ],
  "2025": [
    "Relational schemas and migrations with PostgreSQL and Prisma.",
    "AssetLink: QR-based asset tracking and maintenance.",
    "RLS, token authentication, and transaction safety.",
    "Modular REST APIs with Node.js, Express, and FastAPI.",
  ],
  "2024": [
    "Responsive, accessible React interfaces and reusable components.",
    "MovieStream: movie discovery with live TMDB data.",
    "Mobile-first layouts, semantic HTML, and WCAG accessibility.",
    "Client caching, debounced search, and micro-interactions.",
  ],
  "2023": [
    "Data structures, databases, networking, and systems analysis.",
    "Team capstones, requirements, and technical presentations.",
    "Campus workshops and GDG Zamboanga community events.",
  ],
  "2022": [
    "First projects with HTML, CSS, and JavaScript.",
    "Learning Git, GitHub workflows, and the terminal.",
    "Static web pages and early algorithm exercises.",
  ],
};

export function ExperienceTimeline() {
  const shouldReduceMotion = useReducedMotion();
  const { playClick } = useUISound();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleItem = (index: number) => {
    playClick?.();
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const getIcon = (role: string) => {
    if (role.includes("Full-Stack")) {
      return <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
    if (role.includes("Backend")) {
      return <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
    if (role.includes("Front-End")) {
      return <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
    if (role.includes("BS Information Technology") || role.includes("Information Technology")) {
      return <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
    if (role.includes("Hello World")) {
      return <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
    return <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
  };

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.12 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-6 select-none mb-0"
      aria-label="Experience Timeline"
    >
      {/* Consistent Section Header */}
      <SectionHeader
        label="EXPERIENCE-TIMELINE"
        description="A timeline of my growth, from my first line of code to where I am today."
        actionHref="/work"
        actionLabel="view work & experience"
        className="mb-6 pb-2 border-b border-border-hairline/40"
      />

      {/* Vertical Milestone Timeline Container */}
      <div className={towerStyles.environment}>
        <motion.div
          variants={shouldReduceMotion ? undefined : timelineContainerVariants}
          className="flex flex-col relative"
        >
          {experiences.map((exp, index) => {
            const isCurrent = exp.isCurrent;
            const yearLabel = exp.yearNode || (isCurrent ? "PRESENT" : exp.year.split(" ")[0]);
            const isOpen = openIndex === index;
            const highlights = (disclosureHighlights[exp.yearNode ?? ""] ?? exp.details ?? []).slice(0, 4);

            return (
              <motion.div
                key={`${exp.role}-${exp.year}`}
                variants={shouldReduceMotion ? undefined : milestoneVariants}
                className={`relative flex items-stretch gap-2.5 sm:gap-5 group pb-4 sm:pb-4.5 last:pb-0 ${towerStyles.row}`}
                data-open={isOpen}
              >
                <ExperienceTowerNode index={index} current={!!isCurrent} year={yearLabel} />

                {/* Milestone Row Editorial Container */}
                <div className="flex-1 min-w-0 pb-3 pt-1 border-b border-border-hairline/30 last:border-b-0 flex flex-col justify-start">
                  {/* Accessible Accordion Disclosure Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={`timeline-detail-${index}`}
                    id={`timeline-trigger-${index}`}
                    className="w-full text-left cursor-pointer group/btn focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-md p-1 -m-1 transition-colors hover:bg-surface/30"
                  >
                    {/* --- MOBILE VERTICAL COMPOSITION (< sm) --- */}
                    <div className="sm:hidden space-y-2">
                      {/* Top Row: Icon + Title + Current Badge + Date + Chevron */}
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-md border border-border-hairline flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isCurrent
                              ? "bg-surface text-ink"
                              : "bg-surface/50 text-muted-foreground group-hover/btn:text-ink"
                          }`}
                        >
                          {getIcon(exp.role)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-sans text-[13px] font-semibold text-ink leading-snug break-words group-hover/btn:text-brand transition-colors">
                              {exp.role}
                            </h3>
                            {isCurrent && (
                              <StatusBadge status="current" size="sm" className="flex-shrink-0" />
                            )}
                          </div>
                          <p className="font-sans text-xs text-muted-foreground leading-tight mt-0.5 break-words">
                            {exp.company}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                          <span className="font-mono text-[11px] text-muted-foreground/80">
                            {exp.year}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-brand" : "group-hover/btn:text-ink"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      {/* Description: Full Width on Mobile */}
                      {exp.description && (
                        <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed pl-9">
                          {exp.description}
                        </p>
                      )}
                    </div>

                    {/* --- DESKTOP & TABLET HORIZONTAL COMPOSITION (>= sm) --- */}
                    <div className="hidden sm:flex sm:items-center justify-between gap-4 py-1">
                      {/* Left: Icon + Role & Context */}
                      <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xs">
                        <div
                          className={`w-8 h-8 rounded-md border border-border-hairline flex items-center justify-center flex-shrink-0 transition-colors ${
                            isCurrent
                              ? "bg-surface text-ink"
                              : "bg-surface/50 text-muted-foreground group-hover/btn:text-ink"
                          }`}
                        >
                          {getIcon(exp.role)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-sans text-sm font-semibold text-ink group-hover/btn:text-brand transition-colors truncate">
                              {exp.role}
                            </h3>
                            {isCurrent && (
                              <StatusBadge status="current" size="sm" />
                            )}
                          </div>
                          <p className="font-sans text-xs text-muted-foreground truncate mt-0.5">
                            {exp.company}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Real Description (Desktop) */}
                      {exp.description && (
                        <div className="hidden md:block flex-1 max-w-xs xl:max-w-sm pl-2">
                          <p className="font-sans text-xs sm:text-[13px] text-muted-foreground/90 leading-relaxed line-clamp-2 max-w-[60ch]">
                            {exp.description}
                          </p>
                        </div>
                      )}

                      {/* Right: Date Range & Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        <span className="font-mono text-xs text-muted-foreground/80">
                          {exp.year}
                        </span>
                        <div className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground/50 transition-colors">
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-brand" : "group-hover/btn:text-ink"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expandable Disclosure Detail Region */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`timeline-detail-${index}`}
                        role="region"
                        aria-labelledby={`timeline-trigger-${index}`}
                        initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
                        transition={{
                          height: { duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className={towerStyles.disclosure}>
                          {/* Details / Highlights */}
                          {highlights.length > 0 && (
                            <div className="space-y-1">
                              <span className={towerStyles.disclosureLabel}>
                                DETAILS / HIGHLIGHTS
                              </span>
                              <ul className="space-y-0.5 text-xs text-muted-foreground leading-[1.45]">
                                {highlights.map((detail, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-1.5">
                                    <span
                                      className="text-muted-foreground select-none"
                                      aria-hidden="true"
                                    >
                                      •
                                    </span>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Focus / Stack */}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="space-y-1">
                              <span className={towerStyles.disclosureLabel}>
                                STACK
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {exp.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center px-1.5 py-px rounded-[3px] bg-surface/50 border border-border-hairline/60 text-ink/90 font-mono text-[10px] leading-4"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Projects */}
                          {exp.projects && exp.projects.length > 0 && (
                            <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap text-xs font-mono">
                              <span className={towerStyles.disclosureLabel}>
                                PROJECTS
                              </span>
                              {exp.projects.map((proj, projectIndex) => (
                                <React.Fragment key={proj.title}>
                                {projectIndex > 0 && <span aria-hidden="true" className="text-muted-foreground/60">·</span>}
                                <Link
                                  href={proj.href}
                                  className="inline-flex items-center gap-0.5 whitespace-nowrap text-ink/90 hover:underline font-mono text-[11px] leading-4"
                                >
                                  <span>{proj.title}</span>
                                  <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                </Link>
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <ExperienceTowerBase />
      </div>
    </motion.section>
  );
}

export default ExperienceTimeline;
