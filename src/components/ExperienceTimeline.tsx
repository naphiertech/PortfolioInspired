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
import { experiences } from "@/lib/data";
import { SectionHeader } from "./SectionHeader";

export function ExperienceTimeline() {
  const getIcon = (role: string) => {
    if (role.includes("Full-Stack")) {
      return <Layers className="w-4 h-4" />;
    }
    if (role.includes("Backend")) {
      return <Server className="w-4 h-4" />;
    }
    if (role.includes("Front-End")) {
      return <Layout className="w-4 h-4" />;
    }
    if (role.includes("BS Information Technology")) {
      return <GraduationCap className="w-4 h-4" />;
    }
    if (role.includes("Hello World")) {
      return <Terminal className="w-4 h-4" />;
    }
    return <Briefcase className="w-4 h-4" />;
  };

  return (
    <section className="w-full space-y-6 select-none mb-16" aria-label="Experience Timeline">
      {/* Consistent Section Header */}
      <SectionHeader
        label="EXPERIENCE-TIMELINE"
        description="A timeline of my growth, from my first line of code to where I am today."
        actionComponent={
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border-hairline text-muted-foreground font-mono text-[10px] font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span>MY JOURNEY</span>
          </div>
        }
        className="mb-6 pb-2 border-b border-border-hairline/40"
      />

      {/* Vertical Milestone Timeline */}
      <div className="relative pl-0 sm:pl-2 pb-6 sm:pb-8">
        <div className="space-y-4 sm:space-y-3">
          {experiences.map((exp, index) => {
            const isCurrent = exp.isCurrent;
            const isLast = index === experiences.length - 1;
            const yearLabel = exp.yearNode || (isCurrent ? "PRESENT" : exp.year.split(" ")[0]);

            return (
              <div key={`${exp.role}-${exp.year}`} className="relative flex items-start gap-3 sm:gap-5 group">
                {/* Left Rail & Timeline Node */}
                <div className="flex flex-col items-center flex-shrink-0 w-16 sm:w-20 pt-3 relative self-stretch">
                  {/* Vertical Rail Line */}
                  {!isLast && (
                    <div
                      className={`absolute top-6 bottom-[-16px] w-[1px] ${
                        isCurrent
                          ? "bg-gradient-to-b from-brand/80 via-border-hairline to-border-hairline/40"
                          : "bg-border-hairline/60"
                      }`}
                    />
                  )}

                  {/* Year Label */}
                  <span
                    className={`font-mono text-[10px] sm:text-[11px] mb-1.5 tracking-wider uppercase ${
                      isCurrent
                        ? "text-brand font-bold"
                        : "text-muted-foreground/70 group-hover:text-muted-foreground transition-colors"
                    }`}
                  >
                    {yearLabel}
                  </span>

                  {/* Node Marker */}
                  <div className="relative flex items-center justify-center z-10">
                    {isCurrent ? (
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-brand/30 opacity-75" />
                        <div className="w-3.5 h-3.5 rounded-full border border-brand/70 bg-brand/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-surface border-2 border-border-hairline group-hover:border-muted-foreground transition-colors" />
                    )}
                  </div>

                  {/* Refined 2022 Annotation Arc & Quote */}
                  {isLast && (
                    <div className="absolute top-[44px] right-1/2 w-36 h-20 pointer-events-none z-10">
                      {/* Smooth curved connector path */}
                      <svg
                        className="w-24 h-14 overflow-visible absolute top-0 right-0"
                        viewBox="0 0 80 45"
                        fill="none"
                      >
                        <path
                          d="M 80 0 C 80 16, 56 28, 28 34"
                          stroke="currentColor"
                          className="text-muted-foreground/60 dark:text-muted-foreground/60"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="28"
                          cy="34"
                          r="1.8"
                          fill="currentColor"
                          className="text-muted-foreground/70 dark:text-muted-foreground/70"
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

                {/* Milestone Row Card */}
                <div
                  className={`flex-1 min-w-0 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? "bg-surface/50 border-brand/30 shadow-2xs group-hover:bg-surface/80 group-hover:border-brand/50"
                      : "bg-surface/30 border-border-hairline/60 group-hover:bg-surface/70 group-hover:border-border-hairline"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                    {/* Left: Icon + Role & Context */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 shadow-2xs transition-colors mt-0.5 sm:mt-0 ${
                          isCurrent
                            ? "bg-brand/10 border-brand/30 text-brand"
                            : "bg-surface border-border-hairline text-muted-foreground group-hover:text-ink"
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
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border-hairline/30">
                      {/* Mobile Description */}
                      {exp.description && (
                        <p className="md:hidden font-sans text-xs text-muted-foreground/90 leading-relaxed min-w-0 pr-2">
                          {exp.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                        <span className="font-mono text-xs text-muted-foreground bg-muted-subtle/80 px-2.5 py-1 rounded-[5px] border border-border-hairline/70">
                          {exp.year}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExperienceTimeline;
