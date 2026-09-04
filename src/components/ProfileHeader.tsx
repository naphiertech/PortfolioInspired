"use client";

import { useEffect, useState, useRef } from "react";
import NextImage from "next/image";
import { useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { GithubContributions } from "./GithubContributions";
import { LocalTime } from "./LocalTime";
import { ProfileInfoBlock } from "./ProfileInfoBlock";
import { SnapTrigger } from "./SnapTrigger";
import { EditorialDivider } from "./EditorialDivider";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SITE_NAME,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

export function ProfileHeader() {
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
    <section className="relative w-full select-none mb-16">
      {/* Top Portfolio Visual Banner */}
      <div className="relative w-full h-44 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-border-hairline bg-surface/40 shadow-xs">
        {/* Custom Header Background Image */}
        <NextImage
          src="/background-header/background.png"
          alt="Header Background"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 760px"
          className="object-cover object-center"
        />

        {/* Subtle Theme-Aware Bottom Vignette for Seamless Portrait Transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-page/80 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Mobile-Only Floating Theme & Sound Controls (Top Right of Cover) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex sm:hidden items-center gap-1.5 p-1 rounded-xl bg-page/70 backdrop-blur-md border border-border-hairline shadow-xs">
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Header Content Container */}
      <div className="px-1 sm:px-2">
        {/* Upper Row: Overlapping Portrait + Desktop Status & Controls */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 -mt-14 sm:-mt-12 md:-mt-14 mb-4 sm:mb-3.5 relative z-20">
          {/* Overlapping Profile Avatar with Animated Frames */}
          <div
            className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl ring-4 ring-page bg-surface border border-border-hairline overflow-hidden shadow-lg flex-shrink-0 cursor-pointer group transition-transform duration-200 sm:ml-3"
            title={`${SITE_NAME} (${isDark ? "Dark theme sunglasses" : "Light theme"})`}
          >
            {/* Static Base Image */}
            <NextImage
              src="/profile/ezgif-frame-001.png"
              alt={SITE_NAME}
              fill
              sizes="120px"
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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

          {/* Desktop-Only Upper-Right Utility & Status Area */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end pb-0.5">
            {/* Live Availability Status Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
              </span>
              <span className="text-[11px] font-mono font-medium leading-none whitespace-nowrap">
                {AVAILABILITY.label}
              </span>
            </div>

            {/* Sound Selector Toggle */}
            <SoundToggle />

            {/* Theme Selector Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Profile Information Hierarchy */}
        <div className="space-y-4 sm:space-y-3 text-center sm:text-left">
          {/* Name & Handle & Mobile Availability Badge */}
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-normal text-ink leading-tight flex items-center justify-center sm:justify-start gap-1.5">
              <span>{SITE_NAME}</span>
              <span className="text-muted-foreground/60 text-lg sm:text-xl select-none" aria-hidden="true">✧</span>
            </h1>
            <a
              href={SOCIAL_PROFILES.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs sm:text-[13px] text-muted-foreground hover:text-ink transition-colors inline-block mt-0.5"
            >
              {AUTHOR_INFO.handle}
            </a>

            {/* Mobile-Only Availability Status (Positioned directly under identity) */}
            <div className="flex sm:hidden items-center justify-center mt-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
                </span>
                <span className="text-[11px] font-mono font-medium leading-none whitespace-nowrap">
                  {AVAILABILITY.label}
                </span>
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <p className="font-sans text-xs sm:text-[13px] text-body max-w-md sm:max-w-xl mx-auto sm:mx-0 leading-relaxed px-2 sm:px-0">
            Full-stack developer building practical web products with thoughtful interfaces and reliable systems.
          </p>

          {/* Profile Details (Location, Live Time, Education) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center sm:justify-start gap-2.5 sm:gap-x-4 sm:gap-y-2 text-xs text-muted-foreground pt-1 sm:pt-0.5 max-w-xs sm:max-w-none mx-auto sm:mx-0 sm:flex-wrap">
            {/* Location */}
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{AUTHOR_INFO.location}</span>
            </div>

            {/* Local Time */}
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 2" />
              </svg>
              <LocalTime />
            </div>

            {/* Education */}
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
              <span>{EDUCATION.degree} @ {EDUCATION.abbreviation}</span>
            </div>
          </div>

          {/* Action Buttons Group with Profile-First Hierarchy */}
          <div className="relative pt-2">
            {/* Mobile Vertical Stack / Desktop Horizontal Flow */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2.5 sm:pr-14 sm:pr-20">
              {/* Primary Action: Schedule a Call (Full-width on mobile) */}
              <a
                href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-ink text-page font-sans text-xs font-semibold hover:opacity-90 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Schedule a Call</span>
              </a>

              {/* Mobile 2-Column Grid / Desktop Inline Flex */}
              <div className="grid grid-cols-2 gap-2.5 sm:contents">
                {/* Secondary Action: Send Email */}
                <a
                  href={`mailto:${SOCIAL_PROFILES.email}`}
                  className="tactile-btn gap-1.5 text-xs px-3.5 py-2.5 sm:py-2 h-auto sm:h-7 w-full sm:w-auto justify-center"
                >
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send Email</span>
                </a>

                {/* Secondary Action: Resume */}
                <a
                  href="/resume/naphier_awalie_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn gap-1.5 text-xs px-3 py-2.5 sm:py-2 h-auto sm:h-7 w-full sm:w-auto justify-center text-muted-foreground hover:text-ink"
                >
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Resume</span>
                </a>
              </div>

              {/* Third Action: GitHub (Full-width on mobile / inline on desktop) */}
              <a
                href={SOCIAL_PROFILES.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn gap-1.5 text-xs px-3 py-2.5 sm:py-2 h-auto sm:h-7 w-full sm:w-auto justify-center text-muted-foreground hover:text-ink"
              >
                <svg className="w-3.5 h-3.5 fill-current opacity-70" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </a>
            </div>

            {/* Desktop Easter Egg Trigger */}
            <div className="hidden sm:block absolute right-0 bottom-1 sm:bottom-2 pointer-events-auto rotate-45 origin-center opacity-65 hover:opacity-100 transition-all duration-200">
              <SnapTrigger />
            </div>
          </div>

          {/* Mobile-Only Easter Egg Trigger */}
          <div className="flex sm:hidden justify-center pt-2 pb-1 pointer-events-auto opacity-65 hover:opacity-100 transition-all duration-200">
            <SnapTrigger />
          </div>
        </div>
      </div>

      {/* Horizontal Structural Rail before Developer Profile Matrix */}
      <EditorialDivider className="mt-8 mb-6 sm:mt-10 sm:mb-7" />

      {/* Structured Developer Profile Matrix (Current Focus, Capabilities, Principles) */}
      <ProfileInfoBlock />

      {/* Horizontal Structural Rail before GitHub Graph */}
      <EditorialDivider className="mt-6 mb-6 sm:mt-8 sm:mb-7" />

      {/* Real GitHub Contribution Graph */}
      <GithubContributions />
    </section>
  );
}

export default ProfileHeader;
