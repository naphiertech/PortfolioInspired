"use client";

import React from "react";
import {
  Briefcase,
  Layers,
  Server,
  Layout,
  GraduationCap,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { experiences } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";
import {
  sectionContainerVariants,
  timelineContainerVariants,
  milestoneVariants,
  railVariants,
} from "@/lib/motion";

export function ExperienceTimeline() {
  const shouldReduceMotion = useReducedMotion();

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
    if (role.includes("BS Information Technology")) {
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
        actionComponent={
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border-hairline text-muted-foreground font-mono text-[10px] font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-status-breathe" />
            <span>MY JOURNEY</span>
          </div>
        }
        className="mb-6 pb-2 border-b border-border-hairline/40"
      />

      {/* Vertical Milestone Timeline */}
      <div className="relative pl-0 sm:pl-2 pb-4 sm:pb-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : timelineContainerVariants}
          className="flex flex-col"
        >
          {experiences.map((exp, index) => {
            const isCurrent = exp.isCurrent;
            const isLast = index === experiences.length - 1;
            const yearLabel = exp.yearNode || (isCurrent ? "PRESENT" : exp.year.split(" ")[0]);

            return (
              <motion.div
                key={`${exp.role}-${exp.year}`}
                variants={shouldReduceMotion ? undefined : milestoneVariants}
                className="relative flex items-start gap-2.5 sm:gap-5 group pb-3.5 sm:pb-3 last:pb-0"
              >
                {/* Left Rail & Timeline Node (Compact 48px on mobile, 80px on desktop) */}
                <div className="flex flex-col items-center flex-shrink-0 w-12 sm:w-20 pt-2.5 sm:pt-3 relative self-stretch">
                  {/* Continuous Vertical Rail Line with progressive reveal */}
                  {index === 0 ? (
                    // Present: rail starts behind the node circle and runs to bottom of row
                    <motion.div
                      variants={shouldReduceMotion ? undefined : railVariants}
                      className="absolute top-[32px] sm:top-[36px] bottom-0 w-[1px] bg-border-hairline left-1/2 -translate-x-1/2 z-0 pointer-events-none origin-top"
                    />
                  ) : isLast ? (
                    // 2022: rail enters from top and cleanly terminates behind the 2022 node
                    <motion.div
                      variants={shouldReduceMotion ? undefined : railVariants}
                      className="absolute top-0 h-[32px] sm:h-[36px] w-[1px] bg-border-hairline left-1/2 -translate-x-1/2 z-0 pointer-events-none origin-top"
                    />
                  ) : (
                    // Intermediate years (2025, 2024, 2023): continuous top-to-bottom rail
                    <motion.div
                      variants={shouldReduceMotion ? undefined : railVariants}
                      className="absolute top-0 bottom-0 w-[1px] bg-border-hairline left-1/2 -translate-x-1/2 z-0 pointer-events-none origin-top"
                    />
                  )}

                  {/* Year Label with background mask so rail passes cleanly behind */}
                  <span
                    className={`font-mono text-[9px] sm:text-[11px] mb-1 sm:mb-1.5 tracking-wider uppercase text-center relative z-10 bg-page px-1 select-none ${
                      isCurrent
                        ? "text-brand font-bold"
                        : "text-muted-foreground/70 group-hover:text-muted-foreground transition-colors"
                    }`}
                  >
                    {yearLabel}
                  </span>

                  {/* Node Marker sitting above the rail */}
                  <div className="relative flex items-center justify-center z-10">
                    {isCurrent ? (
                      <div className="relative flex items-center justify-center">
                        {/* Soft expanding ring indicator (2.5 - 3.5s, no movement on the core node) */}
                        <span className="animate-status-ring absolute inline-flex h-4 w-4 rounded-full bg-brand/35 pointer-events-none" />
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border-hairline bg-surface flex items-center justify-center shadow-2xs relative z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        </div>
                      </div>
                    ) : (
                      /* Past nodes (2025, 2024, 2023, 2022) remain 100% static */
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-surface border border-border-hairline shadow-2xs group-hover:border-muted-foreground/60 transition-colors" />
                    )}
                  </div>

                  {/* Desktop/Tablet Only: 2022 Curved Connector Arc & Quote */}
                  {isLast && (
                    <div className="hidden sm:block absolute top-[44px] right-1/2 w-36 h-20 pointer-events-none z-10">
                      {/* Smooth curved connector path */}
                      <svg
                        className="w-24 h-14 overflow-visible absolute top-0 right-0"
                        viewBox="0 0 80 45"
                        fill="none"
                      >
                        <path
                          d="M 80 0 C 80 16, 56 28, 28 34"
                          stroke="currentColor"
                          className="text-muted-foreground/50 dark:text-muted-foreground/50"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="28"
                          cy="34"
                          r="1.8"
                          fill="currentColor"
                          className="text-muted-foreground/60 dark:text-muted-foreground/60"
                        />
                      </svg>

                      {/* Hand-annotated reflection text */}
                      <div className="absolute top-2 right-14 sm:right-16 w-24 transform -rotate-6 text-right select-none">
                        <span className="font-sans italic font-normal text-[10px] sm:text-[11px] text-muted-foreground/80 leading-[13px] block tracking-tight">
                          same curiosity,<br />bigger impact
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestone Row Card Container */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`p-3 sm:p-3.5 rounded-xl border border-border-hairline transition-all duration-200 ${
                      isCurrent
                        ? "bg-surface/50 shadow-2xs group-hover:bg-surface/70"
                        : "bg-surface/30 group-hover:bg-surface/60"
                    }`}
                  >
                    {/* --- MOBILE VERTICAL COMPOSITION (< sm) --- */}
                    <div className="sm:hidden space-y-2.5">
                      {/* Top Row: Icon + Title + Current Badge */}
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-md border border-border-hairline flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5 ${
                            isCurrent
                              ? "bg-surface text-ink"
                              : "bg-surface text-muted-foreground"
                          }`}
                        >
                          {getIcon(exp.role)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-sans text-[13px] font-semibold text-ink leading-snug break-words">
                              {exp.role}
                            </h3>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] font-medium leading-none flex-shrink-0">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-status-breathe" />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="font-sans text-[11px] text-muted-foreground leading-tight mt-0.5 break-words">
                            {exp.company}
                          </p>
                        </div>
                      </div>

                      {/* Description: Full Width on Mobile */}
                      {exp.description && (
                        <div className="pt-1 border-t border-border-hairline/30">
                          <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      )}

                      {/* Bottom Row: Date Badge + Arrow */}
                      <div className="flex items-center justify-between pt-1 border-t border-border-hairline/30">
                        <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle/80 px-2 py-0.5 rounded border border-border-hairline">
                          {exp.year}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-ink transition-transform flex-shrink-0" />
                      </div>
                    </div>

                    {/* --- DESKTOP & TABLET HORIZONTAL COMPOSITION (>= sm) --- */}
                    <div className="hidden sm:flex sm:items-center justify-between gap-4">
                      {/* Left: Icon + Role & Context */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-lg border border-border-hairline flex items-center justify-center flex-shrink-0 shadow-2xs transition-colors ${
                            isCurrent
                              ? "bg-surface text-ink"
                              : "bg-surface text-muted-foreground group-hover:text-ink"
                          }`}
                        >
                          {getIcon(exp.role)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors truncate">
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
                          <p className="font-sans text-xs text-muted-foreground/90 leading-relaxed line-clamp-2">
                            {exp.description}
                          </p>
                        </div>
                      )}

                      {/* Right: Date Range & Arrow */}
                      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        <span className="font-mono text-xs text-muted-foreground bg-muted-subtle/80 px-2.5 py-1 rounded-[5px] border border-border-hairline">
                          {exp.year}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Only: 2022 Reflection Quote underneath the milestone card */}
                  {isLast && (
                    <div className="sm:hidden pt-2.5 pl-1">
                      <p className="font-sans italic text-[11px] text-muted-foreground/75 leading-tight">
                        &ldquo;same curiosity, bigger impact&rdquo;
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
