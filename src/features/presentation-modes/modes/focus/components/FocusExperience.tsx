import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/lib/data";

export function FocusExperience() {
  return (
    <section aria-label="Work experience" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none mb-3.5">
        <span className="tracking-wider font-medium">
          [ 04 // EXPERIENCE ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          EXPERIENCE & EDUCATION
        </span>
      </div>

      {/* Chronological Balanced Rows: 160px Period + Full Content Column */}
      <div className="divide-y divide-border-divider">
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
                <h3 className="font-sans font-semibold text-sm sm:text-base text-ink">
                  {exp.role}
                </h3>
                <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs select-none">·</span>
                <span className="font-mono text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400">
                  {exp.company}
                </span>
              </div>

              {exp.description && (
                <p className="mt-1.5 text-[14px] sm:text-[15px] text-zinc-700 dark:text-zinc-300 font-sans leading-[1.6] max-w-2xl">
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
