"use client";

import React from "react";
import NextImage from "next/image";
import { Mail, FileText, ArrowUpRight, MapPin, GraduationCap } from "lucide-react";
import { LocalTime } from "@/components/LocalTime";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SITE_DEFAULT_DESCRIPTION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

export function FocusHero() {
  return (
    <section aria-label="Identity and candidate overview" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 00 // PROFILE ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          FOCUS VIEW
        </span>
      </div>

      {/* Main Structural Hero Composition */}
      <div className="flex items-start justify-between gap-5 sm:gap-8 pt-1">
        {/* Left Column: Name, Title, Bio & Metadata */}
        <div className="flex-1 min-w-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-sans leading-tight">
              {AUTHOR_INFO.name}
            </h1>
            <p className="font-mono text-sm sm:text-base text-brand font-medium tracking-tight mt-1">
              {AUTHOR_INFO.jobTitle}
            </p>
          </div>

          {/* Positioning Statement with comfortable line length */}
          <p className="mt-3 text-sm sm:text-[15px] text-ink/80 leading-relaxed font-sans max-w-3xl">
            {SITE_DEFAULT_DESCRIPTION}
          </p>

          {/* High-Signal Metadata Strip */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
            {/* Live Availability Status */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>{AVAILABILITY.openTo}</span>
            </div>

            {/* Location */}
            <span className="inline-flex items-center gap-1.5 text-muted-foreground/90">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" aria-hidden="true" />
              <span>{AUTHOR_INFO.city}, PH</span>
            </span>

            {/* Live Local Time */}
            <LocalTime />

            {/* Degree */}
            <span className="inline-flex items-center gap-1.5 text-muted-foreground/90">
              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/60" aria-hidden="true" />
              <span>
                {EDUCATION.shortDegree} @ {EDUCATION.abbreviation}
              </span>
            </span>
          </div>
        </div>

        {/* Right Column: Secondary Avatar */}
        <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-border-hairline bg-surface/50 shadow-xs mt-1">
          <NextImage
            src="/profile/ezgif-frame-001.png"
            alt={AUTHOR_INFO.name}
            fill
            sizes="64px"
            priority
            className="object-cover"
            style={{ objectPosition: "center 25%" }}
          />
        </div>
      </div>

      {/* Action Strip */}
      <div className="mt-5 pt-4 border-t border-border-divider flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Contact CTA */}
          <a
            href={`mailto:${SOCIAL_PROFILES.email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Send Email</span>
          </a>

          {/* Secondary Resume CTA */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface-hover hover:border-border transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
            <span>Resume PDF</span>
            <ArrowUpRight className="w-3 h-3 text-muted-foreground/60" aria-hidden="true" />
          </a>
        </div>

        {/* Secondary Social Channels */}
        <div className="flex items-center gap-3.5 font-mono text-xs text-muted-foreground">
          <a
            href={SOCIAL_PROFILES.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
          <span className="text-border">/</span>
          <a
            href={SOCIAL_PROFILES.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink transition-colors inline-flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FocusHero;
