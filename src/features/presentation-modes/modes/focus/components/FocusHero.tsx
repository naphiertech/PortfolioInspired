"use client";

import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { Mail, FileText, ArrowUpRight, MapPin, GraduationCap } from "lucide-react";
import { LocalTime } from "@/components/LocalTime";
import { useTheme } from "@/components/ThemeProvider";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SITE_DEFAULT_DESCRIPTION,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

export function FocusHero() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [animationFrame, setAnimationFrame] = useState(0);
  const currentFrameRef = useRef(0);
  const isInitialMount = useRef(true);

  // Sync ref with state
  useEffect(() => {
    currentFrameRef.current = animationFrame;
  }, [animationFrame]);

  // Set initial frame on mount based on active theme
  useEffect(() => {
    if (isInitialMount.current && resolvedTheme) {
      const initial = resolvedTheme === "dark" ? 240 : 0;
      setAnimationFrame(initial);
      currentFrameRef.current = initial;
      isInitialMount.current = false;
    }
  }, [resolvedTheme]);

  // Preload animation frames for smooth 60fps caching
  useEffect(() => {
    if (typeof window === "undefined") return;

    for (let i = 1; i <= 240; i++) {
      const img = document.createElement("img");
      img.src = `/profile/ezgif-frame-${String(i).padStart(3, "0")}.png`;
    }
  }, []);

  // Frame animation driven by dark/light theme switching (Butter-smooth 60fps)
  useEffect(() => {
    if (isInitialMount.current) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const fps = 60;
    const interval = 1000 / fps; // ~16.67ms per frame tick

    const animate = (time: number) => {
      const current = currentFrameRef.current;

      if (isDark && current >= 240) return;
      if (!isDark && current <= 0) return;

      const delta = time - lastTime;

      if (delta >= interval) {
        lastTime = time - (delta % interval);

        setAnimationFrame((prev) => {
          // Smooth 2-frame advancement per tick for continuous 60fps motion (~2 seconds)
          if (isDark) {
            const next = prev + 2;
            return next > 240 ? 240 : next;
          } else {
            const next = prev - 2;
            return next < 0 ? 0 : next;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <section aria-label="Identity and candidate overview" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3 sm:mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 00 // PROFILE ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          FOCUS VIEW
        </span>
      </div>

      {/* Main Identity Composition */}
      <div className="pt-1">
        {/* Top Header Row: Name & Title on Left, Avatar on Right */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink font-sans leading-tight">
              {AUTHOR_INFO.name}
            </h1>
            <p className="font-mono text-xs sm:text-base text-brand font-medium tracking-tight mt-0.5 sm:mt-1">
              {AUTHOR_INFO.jobTitle}
            </p>
          </div>

          {/* Profile Avatar */}
          <div className="relative flex-shrink-0 w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-border-hairline bg-surface/50 shadow-xs">
            <NextImage
              src="/profile/ezgif-frame-001.png"
              alt={AUTHOR_INFO.name}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              priority
              className="object-cover"
              style={{ objectPosition: "center 25%" }}
            />

            {/* Glasses Animation Overlay */}
            {animationFrame > 0 && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/profile/ezgif-frame-${String(animationFrame).padStart(3, "0")}.png`}
                alt="Profile Animation"
                className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                style={{ objectPosition: "center 25%" }}
              />
            )}
          </div>
        </div>

        {/* Positioning Statement */}
        <p className="mt-3 text-xs sm:text-[15px] text-ink/85 leading-relaxed font-sans max-w-3xl">
          {SITE_DEFAULT_DESCRIPTION}
        </p>

        {/* Availability Badge (Compact and self-sizing) */}
        <div className="mt-3 sm:mt-4 flex">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] sm:text-xs font-medium">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{AVAILABILITY.openTo}</span>
          </div>
        </div>

        {/* Metadata: Clean vertical stack on mobile (< sm), single wrapped row on desktop (≥ sm) */}
        <div className="mt-3 sm:mt-3.5 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-x-4 sm:gap-y-2 font-mono text-xs text-muted-foreground">
          {/* Location */}
          <span className="inline-flex items-center gap-1.5 text-muted-foreground/90">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden="true" />
            <span>{AUTHOR_INFO.city}, PH</span>
          </span>

          {/* Local Time */}
          <div className="flex items-center">
            <LocalTime />
          </div>

          {/* Degree */}
          <span className="inline-flex items-center gap-1.5 text-muted-foreground/90">
            <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" aria-hidden="true" />
            <span>
              {EDUCATION.shortDegree} @ {EDUCATION.abbreviation}
            </span>
          </span>
        </div>
      </div>

      {/* Action Strip */}
      <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-border-divider">
        {/* --- MOBILE ACTION COMPOSITION (< sm) --- */}
        <div className="sm:hidden space-y-2.5">
          {/* 2-Column Primary Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`mailto:${SOCIAL_PROFILES.email}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send Email</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface-hover hover:border-border active:scale-[0.98] transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span>Resume PDF</span>
              <ArrowUpRight className="w-3 h-3 text-muted-foreground/60" aria-hidden="true" />
            </a>
          </div>

          {/* Quiet Secondary Socials Directly Underneath */}
          <div className="flex items-center justify-center gap-4 font-mono text-xs text-muted-foreground pt-0.5">
            <a
              href={SOCIAL_PROFILES.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" aria-hidden="true" />
            </a>
            <span className="text-border-divider">·</span>
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

        {/* --- DESKTOP ACTION COMPOSITION (≥ sm) --- */}
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${SOCIAL_PROFILES.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Send Email</span>
            </a>

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
      </div>
    </section>
  );
}

export default FocusHero;
