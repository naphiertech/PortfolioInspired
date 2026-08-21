import React from "react";
import { experiences } from "@/lib/data";

export function ExperienceTimeline() {
  return (
    <section className="w-full space-y-5 select-none mb-14">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
          &lt;experience-timeline/&gt;
        </span>
      </div>

      {/* Unboxed Experience Entries List */}
      <div className="space-y-4">
        {experiences.map((exp) => {
          const isCurrent = exp.isCurrent;
          const isEducation = exp.role.includes("BS Information Technology");
          const isFirstCode = exp.role.includes("Hello World");

          return (
            <div
              key={`${exp.role}-${exp.year}`}
              className="group py-1 transition-colors duration-150"
            >
              {/* Split Header Row */}
              <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                {/* Left: Company & Role */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-[6px] bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-ink transition-colors">
                    {isEducation ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    ) : isFirstCode ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans text-sm font-semibold text-ink truncate">
                        {exp.role}
                      </span>
                      {isCurrent && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400"></span>
                          </span>
                          <span className="text-[10px] font-mono leading-none font-medium">
                            Current
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-sans text-xs text-muted-foreground truncate mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>

                {/* Center Hairline Divider Track (Desktop only) */}
                <div className="hidden sm:block work-divider-track" />

                {/* Right: Date Range */}
                <div className="font-mono text-xs text-muted-foreground sm:text-right flex-shrink-0 pl-12 sm:pl-0">
                  {exp.year}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ExperienceTimeline;
