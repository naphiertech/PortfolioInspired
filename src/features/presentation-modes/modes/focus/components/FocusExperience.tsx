import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/lib/data";
import { StatusBadge } from "@/components/ProjectStatusBadge";

export function FocusExperience() {
  return (
    <section aria-label="Work experience" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/80 select-none mb-3.5">
        <h2 className="tracking-wider font-medium font-mono text-xs">
          [ 05 // EXPERIENCE ]
        </h2>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/70">
          EXPERIENCE & EDUCATION
        </span>
      </div>

      {/* Chronological Balanced Rows: 160px Period on Desktop, Structured Stack on Mobile */}
      <div className="divide-y divide-border-divider">
        {experiences.map((exp, index) => (
          <div
            key={`${exp.year}-${index}`}
            className="py-4.5 sm:py-5 grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 items-start"
          >
            {/* Desktop Left Column: Date & Status Tag */}
            <div className="hidden sm:flex min-w-0 items-center gap-2 pt-0.5">
              <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink tabular-nums">
                {exp.year}
              </span>
              {exp.isCurrent && (
                <StatusBadge status="active" size="sm" />
              )}
            </div>

            {/* Content Column */}
            <div className="min-w-0 flex flex-col">
              {/* Mobile Timeframe & Status Kicker */}
              <div className="flex sm:hidden items-center justify-between gap-2 mb-1">
                <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground/80 uppercase tabular-nums">
                  {exp.year}
                </span>
                {exp.isCurrent && (
                  <StatusBadge status="active" size="sm" />
                )}
              </div>

              {/* Role & Company Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <h3 className="font-sans font-semibold text-[15px] sm:text-base text-ink leading-snug">
                  {exp.role}
                </h3>
                <span className="hidden sm:inline text-zinc-400 dark:text-zinc-500 font-mono text-xs select-none" aria-hidden="true">
                  ·
                </span>
                <p className="font-sans sm:font-mono text-xs sm:text-[13px] text-zinc-600 dark:text-zinc-400 mt-0.5 sm:mt-0 leading-normal">
                  {exp.company}
                </p>
              </div>

              {/* Description */}
              {exp.description && (
                <p className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed max-w-[62ch]">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full Work Page Link */}
      <div className="mt-3.5 flex justify-end">
        <Link
          href="/experience"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-brand transition-colors"
        >
          <span>View work and experience</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default FocusExperience;
