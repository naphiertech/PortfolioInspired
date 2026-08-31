import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/lib/data";

export function FocusExperience() {
  return (
    <section aria-label="Work experience" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 04 // EXPERIENCE ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          EXPERIENCE & EDUCATION
        </span>
      </div>

      {/* Chronological Balanced Rows: 160px Period + Full Content Column */}
      <div className="divide-y divide-border-divider border-y border-border-divider">
        {experiences.map((exp, index) => (
          <div
            key={`${exp.year}-${index}`}
            className="py-4.5 sm:py-5 grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-2 sm:gap-6 items-start"
          >
            {/* Left Column: Date & Status Tag */}
            <div className="min-w-0 flex items-center gap-2 pt-0.5">
              <span className="font-mono text-xs sm:text-[13px] font-semibold text-ink">
                {exp.year}
              </span>
              {exp.isCurrent && (
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium leading-none">
                  ACTIVE
                </span>
              )}
            </div>

            {/* Right Column: Role, Company & Readable Line-Length Description */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="font-sans font-bold text-sm sm:text-base text-ink">
                  {exp.role}
                </h3>
                <span className="text-muted-foreground/40 font-mono text-xs select-none">·</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {exp.company}
                </span>
              </div>

              {exp.description && (
                <p className="mt-1.5 text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed max-w-2xl">
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
          href="/work"
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
