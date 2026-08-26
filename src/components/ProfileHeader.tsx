"use client";

import { useEffect, useState, useRef } from "react";
import NextImage from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { GithubContributions } from "./GithubContributions";
import { LocalTime } from "./LocalTime";
import { ProfileInfoBlock } from "./ProfileInfoBlock";

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
    <section className="w-full select-none mb-16">
      {/* Top Eyebrow, Status & Theme Row */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground tracking-tight">
            {"// developer & it student"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live Availability Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-status-breathe inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono font-medium leading-none">
              Available for work
            </span>
          </div>

          {/* Sound Selector Toggle */}
          <SoundToggle />

          {/* Theme Selector Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Main Identity Row: Avatar + Title */}
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Profile Avatar with Animation */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface border border-border-hairline shadow-md cursor-pointer group transition-transform duration-200"
          title="Naphier Awalie"
        >
          {/* Static Base Image */}
          <NextImage
            src="/profile/ezgif-frame-001.png"
            alt="Naphier Awalie"
            fill
            sizes="100px"
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ objectPosition: "center 25%" }}
          />

          {/* Glasses Frame Animation Overlay */}
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

        {/* Name, Handle & Location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-normal text-ink leading-tight">
              Naphier Awalie
            </h1>
            {/* Inline Sparkles SVG */}
            <svg
              className="w-4 h-4 text-muted-foreground/60 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.857L13 21l-2.286-6.857L5 12l5.714-2.857L13 3z"
              />
            </svg>
          </div>

          {/* Handle & Subtitle */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-1.5">
            <a
              href="https://github.com/naphiertech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-200"
            >
              @naphiertech
            </a>
            <span className="text-border-hairline">•</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
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
              <span>Zamboanga City, Philippines</span>
            </div>
            <span className="text-border-hairline">•</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
          </div>

          <p className="font-sans text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
            BS Information Technology @ ZPPSU • Full-Stack & UI/UX Developer
          </p>
        </div>
      </div>

      {/* Tactile Action Buttons Row */}
      <div className="flex items-center flex-wrap gap-2.5 mt-5 pt-1">
        {/* Schedule a Call */}
        <a
          href="mailto:naphiera@gmail.com?subject=Let's%20Schedule%20a%20Call"
          className="tactile-btn gap-1.5"
        >
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Schedule a Call</span>
        </a>

        {/* Send Email */}
        <a href="mailto:naphiera@gmail.com" className="tactile-btn gap-1.5">
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Send Email</span>
        </a>

        {/* Resume */}
        <a
          href="/resume/IT_Resume_ATS.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="tactile-btn gap-1.5"
        >
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Resume</span>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/naphiertech"
          target="_blank"
          rel="noopener noreferrer"
          className="tactile-btn gap-1.5"
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

      {/* Structured Developer Profile Matrix (Current Focus, Capabilities, Principles, Quick Facts) */}
      <ProfileInfoBlock />

      {/* Real GitHub Contribution Graph */}
      <GithubContributions />
    </section>
  );
}

export default ProfileHeader;
