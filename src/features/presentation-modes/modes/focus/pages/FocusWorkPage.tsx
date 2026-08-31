"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, FileText, ArrowUpRight, GraduationCap } from "lucide-react";
import { experiences } from "@/lib/data";
import { AUTHOR_INFO, AVAILABILITY, EDUCATION, SOCIAL_PROFILES } from "@/lib/siteConfig";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

/**
 * FocusWorkPage
 *
 * Focus Mode presentation for /work.
 * Work history, academic background, and hiring availability.
 */
export function FocusWorkPage() {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 mb-6">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none">
          <span className="tracking-wider text-muted-foreground/80 font-medium">
            [ 04 // EXPERIENCE ]
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
            EXPERIENCE & EDUCATION
          </span>
        </div>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Experience & Education
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-muted-foreground mt-1">
              Work history, development projects, and academic background.
            </p>
          </div>

          {/* Availability Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono leading-none">
              {AVAILABILITY.openTo}
            </span>
          </div>
        </div>
      </div>

      <EditorialDivider className="mb-6" />

      {/* 01 // WORK HISTORY */}
      <section aria-label="Work history">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3.5">
          01 // WORK HISTORY
        </div>

        <div className="divide-y divide-border-divider border-y border-border-divider">
          {experiences.map((exp, index) => (
            <div
              key={`${exp.year}-${index}`}
              className="py-4.5 sm:py-5 grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-2 sm:gap-6 items-start"
            >
              {/* Date Column */}
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

              {/* Content Column */}
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
                  <p className="mt-1.5 text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed max-w-3xl">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <EditorialDivider className="my-8" />

      {/* 02 // EDUCATION */}
      <section aria-label="Education">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3.5">
          02 // EDUCATION
        </div>

        <div className="p-4 sm:p-5 rounded-md border border-border-hairline bg-surface/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <GraduationCap className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-sans font-bold text-sm sm:text-base text-ink">
                {EDUCATION.degree}
              </h3>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {EDUCATION.institution} · {EDUCATION.department}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground/70 flex-shrink-0 sm:text-right">
            {EDUCATION.period}
          </span>
        </div>
      </section>

      <EditorialDivider className="my-8" />

      {/* 03 // WORK OPPORTUNITIES */}
      <section aria-label="Work opportunities">
        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3.5">
          03 // WORK OPPORTUNITIES
        </div>

        <div className="p-4 sm:p-5 rounded-md border border-border-hairline bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-sans font-bold text-base text-ink">
              Ready for web engineering and freelance roles
            </h3>
            <p className="text-xs sm:text-[13px] text-ink/75 font-sans leading-relaxed mt-1">
              {AVAILABILITY.workSetup} · Based in {AUTHOR_INFO.location}.
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

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface hover:border-border transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span>Resume PDF</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground/60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FocusWorkPage;
