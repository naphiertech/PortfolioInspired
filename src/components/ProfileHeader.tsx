"use client";

import { useEffect, useState, useRef } from "react";
import NextImage from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { GithubContributions } from "./GithubContributions";
import { LocalTime } from "./LocalTime";
import { ProfileInfoBlock } from "./ProfileInfoBlock";
import { SnapTrigger } from "./SnapTrigger";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  SITE_NAME,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

export function ProfileHeader() {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    currentFrameRef.current = animationFrame;
  }, [animationFrame]);

  // Preload animation frames for smooth caching
  useEffect(() => {
    if (typeof window === "undefined") return;

    const framesToPreload: number[] = [];
    for (let i = 4; i <= 240; i += 8) {
      framesToPreload.push(i);
    }
    if (!framesToPreload.includes(240)) {
      framesToPreload.push(240);
    }

    framesToPreload.forEach((frame) => {
      const img = document.createElement("img");
      img.src = `/profile/ezgif-frame-${String(frame).padStart(3, "0")}.png`;
    });
  }, []);

  // Frame animation on hover/interaction
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (time: number) => {
      const current = currentFrameRef.current;

      if (isHovered && current >= 240) return;
      if (!isHovered && current <= 0) return;

      const delta = time - lastTime;

      if (delta >= interval) {
        lastTime = time - (delta % interval);

        setAnimationFrame((prev) => {
          const basePrev = Math.round(prev / 4) * 4;
          if (isHovered) {
            const next = basePrev + 8;
            return next > 240 ? 240 : next;
          } else {
            const next = basePrev - 8;
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
  }, [isHovered]);

  return (
    <section className="relative w-full select-none mb-16">
      {/* Top Portfolio Visual Banner */}
      <div className="relative w-full h-36 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-border-hairline bg-surface/40 shadow-xs">
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
      </div>

      {/* Profile Header Content Container */}
      <div className="px-1 sm:px-2">
        {/* Upper Row: Overlapping Portrait on Left + Status & Controls on Right */}
        <div className="flex items-end justify-between gap-3 -mt-10 sm:-mt-12 md:-mt-14 mb-3.5 relative z-20">
          {/* Overlapping Profile Avatar with Animated Frames - Shifted slightly left */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl ring-4 ring-page bg-surface border border-border-hairline overflow-hidden shadow-md flex-shrink-0 cursor-pointer group transition-transform duration-200 ml-2 sm:ml-3"
            title={SITE_NAME}
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

          {/* Upper-Right Utility & Status Area */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end pb-0.5">
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
        <div className="space-y-3">
          {/* Name & Handle */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-normal text-ink leading-tight flex items-center gap-1.5">
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
          </div>

          {/* Short Bio */}
          <p className="font-sans text-xs sm:text-[13px] text-body max-w-xl leading-relaxed">
            Full-stack developer building practical web products with thoughtful interfaces and reliable systems.
          </p>

          {/* Compact Metadata Row */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground pt-0.5">
            {/* Location */}
            <div className="flex items-center gap-1.5">
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

            {/* Local Time - No duplicated GMT+8 string */}
            <div className="flex items-center gap-1.5">
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
            <div className="flex items-center gap-1.5">
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

          {/* Reworked CTA Hierarchy Row with Apart Easter Egg Trigger */}
          <div className="relative pt-2">
            {/* Action Buttons Group */}
            <div className="flex items-center flex-wrap gap-2.5 pr-14 sm:pr-20">
              {/* Primary Action: Schedule a Call */}
              <a
                href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ink text-page font-sans text-xs font-semibold hover:opacity-90 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Schedule a Call</span>
              </a>

              {/* Secondary Action: Send Email */}
              <a
                href={`mailto:${SOCIAL_PROFILES.email}`}
                className="tactile-btn gap-1.5 text-xs px-3.5 py-2"
              >
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send Email</span>
              </a>

              {/* Quieter Action: Resume */}
              <a
                href="/resume/IT_Resume_ATS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn gap-1.5 text-xs px-3 py-2 text-muted-foreground hover:text-ink"
              >
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Resume</span>
              </a>

              {/* Quieter Action: GitHub */}
              <a
                href={SOCIAL_PROFILES.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn gap-1.5 text-xs px-3 py-2 text-muted-foreground hover:text-ink"
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

            {/* Subtle 2-Line Monospace Dev-Annotation Easter Egg Trigger - Positioned cleanly on far right */}
            <div className="absolute right-0 bottom-1 sm:bottom-2 pointer-events-auto rotate-45 origin-center opacity-65 hover:opacity-100 transition-all duration-200">
              <SnapTrigger />
            </div>
          </div>
        </div>
      </div>

      {/* Structured Developer Profile Matrix (Current Focus, Capabilities, Principles) */}
      <ProfileInfoBlock />

      {/* Real GitHub Contribution Graph */}
      <GithubContributions />
    </section>
  );
}

export default ProfileHeader;
