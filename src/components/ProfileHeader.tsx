"use client";

import { useState, useEffect, useRef } from "react";
import { ProfileFrameOverlay } from "./ProfileFrameOverlay";
import NextImage from "next/image";
import { useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import dynamic from "next/dynamic";

const CreativeModeToggle = dynamic(
  () => import("@/features/creative-mode/components/CreativeModeToggle").then((m) => m.CreativeModeToggle),
  {
    ssr: false,
    loading: () => <div className="h-[22px] w-[26px] rounded-[4px] bg-muted-subtle/50 animate-pulse" aria-hidden="true" />,
  }
);
import { LocalTime } from "./LocalTime";
import { ProfileInfoBlock } from "./ProfileInfoBlock";
import { EditorialDivider } from "./EditorialDivider";
import { StatusBadge } from "./ProjectStatusBadge";
import { CalBookingTrigger } from "./CalBookingModal";
import { EditorialBio } from "./EditorialBio";
import { RetroComputerWidget } from "@/features/retro-computer";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  EDUCATION,
  RESUME_PATH,
  SITE_NAME,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

const SnapTrigger = dynamic(
  () => import("./SnapTrigger").then((m) => m.SnapTrigger),
  {
    ssr: false,
    loading: () => <div className="w-[80px] h-[80px]" aria-hidden="true" />,
  }
);

const GithubContributions = dynamic(
  () => import("./GithubContributions").then(module => module.GithubContributions),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[132px] space-y-3" role="status" aria-label="Loading GitHub contributions">
        <div className="h-3 w-48 bg-muted-subtle rounded" />
        <div className="h-20 w-full max-w-[690px] rounded border border-border-hairline" />
        <div className="h-3 w-64 bg-muted-subtle rounded" />
      </div>
    ),
  },
);

function DeferredGithubContributions() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return;
    const timer = setTimeout(() => setInView(true), 6000);

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setInView(true);
            clearTimeout(timer);
            observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    } else {
      setInView(true);
    }
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <div ref={containerRef} className="min-h-[132px]">
      {inView ? (
        <GithubContributions />
      ) : (
        <div className="min-h-[132px] space-y-3" role="status" aria-label="Loading GitHub contributions">
          <div className="h-3 w-48 bg-muted-subtle rounded" />
          <div className="h-20 w-full max-w-[690px] rounded border border-border-hairline" />
          <div className="h-3 w-64 bg-muted-subtle rounded" />
        </div>
      )}
    </div>
  );
}

const SOCIAL_ACTIONS = [
  {
    label: "Email",
    href: `mailto:${SOCIAL_PROFILES.email}`,
    ariaLabel: "Send Email",
    cursorLabel: "Send me an email.",
    icon: (
      <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    external: false,
  },
  {
    label: "Résumé",
    href: RESUME_PATH,
    ariaLabel: "View Résumé",
    cursorLabel: "View my résumé.",
    icon: (
      <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    external: true,
  },
  {
    label: "GitHub",
    href: SOCIAL_PROFILES.github,
    ariaLabel: "GitHub Profile",
    cursorLabel: "My code and projects.",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    external: true,
  },
  {
    label: "LinkedIn",
    href: SOCIAL_PROFILES.linkedin,
    ariaLabel: "LinkedIn Profile",
    cursorLabel: "My professional profile.",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    external: true,
  },
  {
    label: "Instagram",
    href: SOCIAL_PROFILES.instagram,
    ariaLabel: "Instagram Profile",
    cursorLabel: "Follow on Instagram.",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    external: true,
  },
  {
    label: "Twitter",
    href: SOCIAL_PROFILES.twitter,
    ariaLabel: "X / Twitter Profile",
    cursorLabel: "Follow on X.",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100 transition-opacity shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
    external: true,
  },
];

export function ProfileHeader() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <section data-creative-note="hero" className="relative w-full select-none mb-2 sm:mb-3">
      {/* Top Portfolio Visual Banner */}
      <div className="group relative w-full h-44 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-border-hairline bg-surface/40 shadow-xs">
        {/* Custom Header Background Image */}
        <NextImage
          src="/background-header/background.webp"
          alt="Header Background"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 760px"
          className="object-cover object-center grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 hover:grayscale-0"
        />

        {/* Subtle Theme-Aware Bottom Vignette for Seamless Portrait Transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-page/80 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Mobile-Only Floating Unified Instrument Strip (Top Right of Cover) */}
        <div
          data-creative-font-exempt
          className="absolute top-2.5 right-2.5 z-20 inline-flex sm:hidden items-center h-7 p-[2px] rounded-[6px] bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-xs gap-0.5"
        >
          <SoundToggle variant="embedded" />
          <span className="w-px h-3.5 bg-border-hairline mx-0.5 flex-shrink-0" aria-hidden="true" />
          <CreativeModeToggle variant="default" />
          <span className="w-px h-3.5 bg-border-hairline mx-0.5 flex-shrink-0" aria-hidden="true" />
          <ThemeToggle variant="default" />
        </div>
      </div>

      {/* Profile Header Content Container */}
      <div className="px-1 sm:px-2">
        {/* Upper Row: Overlapping Portrait + Desktop Status & Controls */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 -mt-14 sm:-mt-12 md:-mt-14 mb-3 sm:mb-2.5 relative z-20">
          {/* Overlapping Profile Avatar with Animated Frames */}
          <div
            className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl ring-4 ring-page bg-surface border border-border-hairline overflow-hidden shadow-lg flex-shrink-0 cursor-pointer group transition-transform duration-200 sm:ml-3"
            title={`${SITE_NAME} (${isDark ? "Dark theme sunglasses" : "Light theme"})`}
            data-guide="avatar"
          >
            {/* Static Base Image */}
            <NextImage
              src="/profile/ezgif-frame-001.png"
              alt={SITE_NAME}
              fill
              priority
              sizes="120px"
              className="object-cover transition-opacity duration-300"
              style={{ objectPosition: "center 25%" }}
            />

            {/* Glasses Animation Overlay */}
            <ProfileFrameOverlay
              className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
              style={{ objectPosition: "center 25%" }}
            />
          </div>

          {/* Desktop-Only Upper-Right Utility & Status Area */}
          <div data-creative-font-exempt className="hidden sm:flex items-center gap-2 flex-wrap justify-end pb-0.5">
            {/* Live Availability Status Indicator */}
            <StatusBadge status="available" label={AVAILABILITY.label} size="sm" className="h-7 px-2.5" />

            {/* Unified Technical Instrument Strip */}
            <div className="inline-flex items-center h-7 p-[2px] rounded-[6px] bg-surface border border-border-hairline gap-0.5">
              <SoundToggle variant="embedded" />
              <span className="w-px h-3.5 bg-border-hairline mx-0.5 flex-shrink-0" aria-hidden="true" />
              <CreativeModeToggle variant="default" />
              <span className="w-px h-3.5 bg-border-hairline mx-0.5 flex-shrink-0" aria-hidden="true" />
              <ThemeToggle variant="default" />
            </div>
          </div>
        </div>

        {/* Profile Information Hierarchy */}
        <div className="space-y-3 text-center sm:text-left">
          {/* Identity & Bio paired with Interactive 1990s Retro CRT Computer on Desktop */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-5">
            <div className="min-w-0 flex-1 space-y-2.5">
              {/* Name & Mobile Availability Badge */}
              <div className="flex flex-col items-center sm:items-start">
                <h1
                  data-guide="name"
                  className="font-display text-2xl sm:text-3xl font-bold tracking-normal text-ink leading-tight flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>{SITE_NAME}</span>
                  <span className="text-muted-foreground/60 text-lg sm:text-xl select-none" aria-hidden="true">✧</span>
                </h1>

                {/* Mobile-Only Availability Status (Positioned directly under identity) */}
                <div className="flex sm:hidden items-center justify-center mt-2">
                  <StatusBadge status="available" label={AVAILABILITY.label} size="sm" />
                </div>
              </div>

              {/* Compact Interactive Bio with Blueprint Keycaps & AI Card-Fan */}
              <EditorialBio variant="standard" />
            </div>

            {/* Interactive 1990s 2D CRT Desktop perched in the right hero nook */}
            <div className="hidden md:flex items-center justify-center pr-1 self-center">
              <RetroComputerWidget />
            </div>
          </div>

          {/* Lower Hero Band: Telemetry Strip + Actions on Left, Dedicated Gauntlet Slot on Right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pt-0.5">
            <div className="min-w-0 flex-1 space-y-3">
              {/* Quiet Hairline Telemetry Strip (Location, Live Time, Education) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border-y border-black/[0.08] dark:border-white/[0.09] divide-y sm:divide-y-0 sm:divide-x divide-black/[0.07] dark:divide-white/[0.08] bg-surface/25 text-left">
                {/* Location */}
                <div className="px-2.5 py-2 flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    LOC
                  </span>
                  <span className="font-sans text-xs font-medium text-ink truncate">
                    {AUTHOR_INFO.location}
                  </span>
                </div>

                {/* Live Local Time */}
                <div className="px-2.5 py-2 flex flex-col gap-0.5 min-w-0">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    <span>TIME</span>
                    <span
                      className="w-1 h-1 rounded-full bg-muted-foreground/80"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-xs font-medium text-ink truncate">
                    <LocalTime />
                  </span>
                </div>

                {/* Education */}
                <div className="px-2.5 py-2 flex flex-col gap-0.5 min-w-0">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    EDU
                  </span>
                  <span className="font-sans text-xs font-medium text-ink truncate">
                    BSIT @ {EDUCATION.abbreviation}
                  </span>
                </div>
              </div>

              {/* Action Buttons Group with Profile-First Hierarchy */}
              <div data-guide="socials" className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2.5">
                {/* Primary Action: Schedule a Call via Cal.com (Full-width on mobile) */}
                <CalBookingTrigger
                  data-cursor-label="Let's talk."
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg bg-ink text-page font-sans text-xs sm:text-[12.5px] font-semibold hover:opacity-90 transition-[opacity,transform] shadow-xs active:scale-[0.98] cursor-pointer shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Schedule a Call</span>
                </CalBookingTrigger>

                {/* Secondary Icon-Only Actions with Expanding Pill on Hover (Approach B) */}
                <div className="grid grid-cols-6 gap-2 w-full sm:contents">
                  {SOCIAL_ACTIONS.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={action.ariaLabel}
                      data-cursor-label={action.cursorLabel}
                      className="tactile-btn group !px-0 sm:!px-2.5 !h-9 sm:!h-[32px] w-full sm:w-auto text-xs text-muted-foreground hover:text-ink transition-all duration-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      {action.icon}
                      <span className="hidden sm:inline-block max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-200 ease-out group-hover:max-w-[85px] group-hover:opacity-100 group-hover:ml-1.5 group-focus-visible:max-w-[85px] group-focus-visible:opacity-100 group-focus-visible:ml-1.5 font-sans text-xs font-medium">
                        {action.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Dedicated Desktop Gauntlet Column (zero overlap with telemetry strip) */}
            <div className="hidden sm:flex items-end justify-center shrink-0 pointer-events-auto opacity-80 hover:opacity-100 transition-all duration-200">
              <SnapTrigger />
            </div>
          </div>

          {/* Mobile-Only Easter Egg Gauntlet Trigger */}
          <div className="flex sm:hidden justify-center pt-2 pb-1 pointer-events-auto opacity-80 hover:opacity-100 transition-all duration-200">
            <SnapTrigger />
          </div>
        </div>
      </div>

      {/* Horizontal Structural Rail before Developer Profile Matrix */}
      <EditorialDivider variant="hatch" className="mt-5 mb-3 sm:mt-6 sm:mb-4" />

      {/* Structured Developer Profile Matrix (Current Focus, Capabilities, Principles) */}
      <ProfileInfoBlock />

      {/* Horizontal Structural Rail before GitHub Graph */}
      <EditorialDivider variant="hatch" className="my-3 sm:my-4" />

      {/* Real GitHub Contribution Graph */}
      <DeferredGithubContributions />
    </section>
  );
}

export default ProfileHeader;
