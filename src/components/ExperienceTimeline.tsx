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
import { useUISound } from "@/context/SoundContext";
import {
  sectionContainerVariants,
  timelineContainerVariants,
  milestoneVariants,
} from "@/lib/motion";

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
      className="w-full space-y-6 select-none mb-16"
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
      <div className="relative pl-0 sm:pl-2 pb-4 sm:pb-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : timelineContainerVariants}
          className="flex flex-col relative"
        >
          {experiences.map((exp, index) => {
            const isCurrent = exp.isCurrent;
            const isLast = index === experiences.length - 1;
            const yearLabel = exp.yearNode || (isCurrent ? "PRESENT" : exp.year.split(" ")[0]);
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={`${exp.role}-${exp.year}`}
                variants={shouldReduceMotion ? undefined : milestoneVariants}
                className="relative flex items-stretch gap-2.5 sm:gap-5 group pb-4 sm:pb-4.5 last:pb-0"
              >
                {/* Left Rail & Timeline Node (Compact 48px on mobile, 80px on desktop) */}
                <div className="flex flex-col items-center flex-shrink-0 w-12 sm:w-20 pt-2 sm:pt-2.5 relative select-none">
                  {/* Year Label */}
                  <span
                    className={`font-mono text-[9px] sm:text-[11px] mb-1 sm:mb-1.5 tracking-wider uppercase text-center relative z-10 transition-colors ${
                      isCurrent
                        ? "text-brand font-bold"
                        : "text-muted-foreground/80 group-hover:text-ink font-medium"
                    }`}
                  >
                    {yearLabel}
                  </span>

                  {/* Node Marker */}
                  <div className="relative flex items-center justify-center z-10">
                    {isCurrent ? (
                      <div className="relative flex items-center justify-center">
                        {/* Expanding breathing halo ring */}
                        <span className="animate-status-ring absolute inline-flex h-5 w-5 rounded-full bg-brand/35 pointer-events-none" />
                        <div className="w-3.5 h-3.5 rounded-full ring-4 ring-page bg-surface border border-border-hairline flex items-center justify-center shadow-xs relative z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        </div>
                      </div>
                    ) : (
                      /* Past nodes: clean milestone rivet with ring-4 mask */
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ring-4 ring-page bg-surface border-2 border-border-hairline shadow-2xs group-hover:border-brand group-hover:bg-brand/30 transition-all duration-200" />
                    )}
                  </div>

                  {/* Dynamic Vertical Spine connecting to the next milestone */}
                  {!isLast && (
                    <div
                      className={`absolute top-[32px] sm:top-[38px] -bottom-4 sm:-bottom-4.5 left-1/2 -translate-x-1/2 w-px pointer-events-none z-0 ${
                        index === 0
                          ? "bg-gradient-to-b from-brand/80 via-border-hairline to-border-hairline/50"
                          : "bg-border-hairline/50"
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Desktop/Tablet: 2022 Curved Connector Arc & Inspiring Quote */}
                  {isLast && (
                    <div className="hidden sm:block absolute top-[46px] right-1/2 w-44 pointer-events-none z-20">
                      {/* Smooth curved connector path */}
                      <svg
                        className="w-28 h-16 overflow-visible absolute top-0 right-0"
                        viewBox="0 0 90 48"
                        fill="none"
                      >
                        <path
                          d="M 90 0 C 90 20, 60 34, 20 38"
                          stroke="currentColor"
                          className="text-muted-foreground/60 dark:text-muted-foreground/60"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="20"
                          cy="38"
                          r="2.5"
                          fill="currentColor"
                          className="text-brand/80"
                        />
                      </svg>

                      {/* Hand-annotated reflection text */}
                      <div className="absolute top-3 right-16 sm:right-20 w-28 transform -rotate-6 text-right select-none">
                        <span className="font-sans italic font-normal text-[11px] sm:text-xs text-muted-foreground/90 leading-[14px] block tracking-tight">
                          same curiosity,<br />
                          <strong className="text-ink font-semibold not-italic">bigger impact</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

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
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-medium leading-none flex-shrink-0">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-status-breathe" />
                                Current
                              </span>
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
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-medium leading-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-status-breathe" />
                                Current
                              </span>
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
                          <p className="font-sans text-xs sm:text-[13px] text-muted-foreground/90 leading-relaxed line-clamp-2">
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
                          height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.2, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 pb-1 pl-3 sm:pl-4 mt-2 border-l border-border-hairline/60 space-y-3">
                          {/* Details / Highlights */}
                          {exp.details && exp.details.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-muted-foreground/70 uppercase font-semibold block">
                                DETAILS / HIGHLIGHTS
                              </span>
                              <ul className="space-y-1 text-xs text-muted-foreground leading-relaxed">
                                {exp.details.map((detail, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-2">
                                    <span
                                      className="text-brand font-mono text-[11px] select-none mt-0.5 leading-none"
                                      aria-hidden="true"
                                    >
                                      ›
                                    </span>
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Focus / Stack */}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="space-y-1.5 pt-0.5">
                              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-muted-foreground/70 uppercase font-semibold block">
                                FOCUS / STACK
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-surface/50 border border-border-hairline/60 text-ink/90 font-mono text-[11px]"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Projects */}
                          {exp.projects && exp.projects.length > 0 && (
                            <div className="pt-1 flex items-center gap-2 flex-wrap text-xs font-mono">
                              <span className="text-[10px] sm:text-[11px] tracking-wider text-muted-foreground/70 uppercase font-semibold">
                                PROJECTS:
                              </span>
                              {exp.projects.map((proj) => (
                                <Link
                                  key={proj.title}
                                  href={proj.href}
                                  className="inline-flex items-center gap-1 text-brand hover:underline font-mono text-xs"
                                >
                                  <span>{proj.title}</span>
                                  <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mobile Only: 2022 Reflection Quote underneath the milestone */}
                  {isLast && (
                    <div className="sm:hidden pt-2 pl-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/80" />
                      <p className="font-sans italic text-xs text-muted-foreground/90 leading-tight">
                        &ldquo;same curiosity, <strong className="text-ink not-italic font-semibold">bigger impact</strong>&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ExperienceTimeline;
