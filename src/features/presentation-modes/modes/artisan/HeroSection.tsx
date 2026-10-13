"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaXTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaReact,
  FaDocker,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiNodedotjs,
  SiPython,
  SiThreedotjs,
  RiSupabaseFill,
  LuAward,
  LuArrowUpRight,
  LuCode,
  LuFileText,
  LuGraduationCap,
  LuMapPin,
  LuSparkles,
  LuX,
} from "./ArtisanIcons";
import { HERO_DATA } from "./data";
import { certifications, CertificationItem } from "@/lib/data";
import { EDUCATION, AUTHOR_INFO, RESUME_PATH } from "@/lib/siteConfig";

import { Hero3DBackground } from "./Hero3DBackground";

interface HeroSectionProps {
  isDark: boolean;
  onNavigate?: (tab: string) => void;
}

const HERO_SKILLS = [
  { name: "TypeScript", icon: SiTypescript },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: FaReact },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Supabase", icon: RiSupabaseFill },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Python", icon: SiPython },
  { name: "Three.js", icon: SiThreedotjs },
  { name: "Docker", icon: FaDocker },
];

export function HeroSection({ isDark, onNavigate }: HeroSectionProps) {
  const [isTalkOpen, setIsTalkOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const talkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (talkRef.current && !talkRef.current.contains(e.target as Node)) {
        setIsTalkOpen(false);
      }
    };
    if (isTalkOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isTalkOpen]);

  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert]);

  return (
    <section className="relative w-full min-h-dvh lg:h-dvh flex flex-col lg:block justify-start overflow-x-hidden lg:overflow-hidden pb-24 lg:pb-0">
      {/* Soft Bottom Edge Gradient for dock transition (desktop) */}
      <div className="hidden lg:block absolute h-32 w-full bg-gradient-to-t from-background to-transparent bottom-0 pointer-events-none z-10" />

      {/* Main Content Container: Stacks [Intro -> 3D Desk -> Dossier] on Mobile; Left Column + Background 3D Desk on Desktop */}
      <div className="relative z-20 w-full lg:h-full pointer-events-none text-foreground flex flex-col justify-start">
        {/* 1. Top Intro: Title, Bio, and Action Buttons */}
        <div className="order-1 relative z-10 pt-10 sm:pt-12 md:pt-14 lg:pt-14 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 space-y-3 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-semibold font-serif tracking-tight text-foreground min-h-[2.25rem] sm:min-h-[2.75rem] lg:min-h-0">
            {HERO_DATA.title}
          </h1>

          <p className="w-[95%] sm:w-[85%] lg:w-full lg:max-w-[355px] xl:max-w-[370px] text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans font-normal min-h-[5rem] sm:min-h-[4.25rem] lg:min-h-0">
            Hey, I&apos;m{" "}
            <span className="font-caveat font-bold text-lg sm:text-xl italic tracking-wide text-foreground leading-none">
              {HERO_DATA.name}
            </span>
            . {HERO_DATA.bio}{" "}
            {HERO_DATA.status && (
              <span className="text-foreground/90 font-sans text-xs font-medium whitespace-nowrap">
                ({HERO_DATA.status})
              </span>
            )}
          </p>

          <div className="w-fit pointer-events-auto flex flex-wrap gap-3 items-center pt-1">
            {/* Let's Talk Popover */}
            <div ref={talkRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsTalkOpen((prev) => !prev)}
                className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black tracking-wide cursor-pointer transition-all duration-200 active:translate-y-0.5 rounded-3xl font-sans text-xs sm:text-sm shadow-sm hover:opacity-90 flex items-center justify-center font-medium"
              >
                Let&apos;s Talk
              </button>

              {isTalkOpen && (
                <div className="absolute left-0 bottom-full mb-2 flex items-center gap-3 p-2 bg-background/95 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/10 shadow-lg animate-in fade-in zoom-in-95 duration-150 z-30">
                  {HERO_DATA.socials
                    .filter((s) => s.type !== "github")
                    .map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className={`p-2 hover:scale-115 transition-transform duration-200 ${
                          s.type === "whatsapp"
                            ? "text-[#25D366]"
                            : s.type === "linkedin"
                            ? "text-[#0A66C2]"
                            : s.type === "email"
                            ? "text-[#EA4335]"
                            : "text-foreground"
                        }`}
                      >
                        {s.type === "twitter" && <FaXTwitter className="size-5" aria-hidden="true" />}
                        {s.type === "whatsapp" && <FaWhatsapp className="size-5" aria-hidden="true" />}
                        {s.type === "linkedin" && <FaLinkedinIn className="size-5" aria-hidden="true" />}
                        {s.type === "email" && <FaEnvelope className="size-5" aria-hidden="true" />}
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* GitHub Link */}
            {HERO_DATA.socials.find((s) => s.type === "github") && (
              <a
                href={HERO_DATA.socials.find((s) => s.type === "github")!.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="text-foreground tracking-wider cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-100 text-3xl p-0.5"
              >
                <FaGithub aria-hidden="true" />
              </a>
            )}

            {/* Resume Quick Pill */}
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/12 dark:border-white/10 hover:border-black/25 dark:hover:border-white/20 bg-background/75 backdrop-blur-sm text-xs font-sans font-medium text-foreground/85 hover:text-foreground transition-colors"
            >
              <LuFileText className="size-3.5" aria-hidden="true" />
              <span>Resume</span>
              <LuArrowUpRight className="size-3 opacity-70" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 2. 3D Workspace (Middle section on mobile, right-offset background on desktop) */}
        <div className="order-2 relative lg:absolute lg:inset-0 z-0 my-4 lg:my-0 flex justify-center items-center pointer-events-auto lg:translate-x-[13%] xl:translate-x-[10%] 2xl:translate-x-[7%] transition-transform duration-500">
          <Hero3DBackground isDark={isDark} />
        </div>

        {/* 3. Extended Information (Below 3D Desk on mobile, Left Column on desktop) */}
        <div className="order-3 relative z-10 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-2 lg:pt-3 w-full max-w-xl">
          <div className="flex flex-col gap-3.5 w-full lg:max-w-[355px] xl:max-w-[370px] pointer-events-auto lg:max-h-[calc(100dvh-295px)] lg:overflow-y-auto scrollbar-hide lg:pr-1 pb-6 lg:pb-14 font-sans">
            {/* A. Core Skills & Stack */}
            <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-foreground/90">
                  <LuCode className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>Core Stack</span>
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate("experience")}
                    className="font-sans text-xs font-medium text-muted-foreground hover:text-foreground hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
                  >
                    <span>All skills</span>
                    <LuArrowUpRight className="size-3" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {HERO_SKILLS.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-normal border border-black/12 dark:border-white/10 bg-background/75 backdrop-blur-sm text-foreground/90 hover:border-black/25 dark:hover:border-white/20 transition-colors"
                    >
                      <Icon className="size-3 text-foreground/85 shrink-0" aria-hidden="true" />
                      <span>{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* B. Certifications & Recognition */}
            <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-foreground/90">
                  <LuAward className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>Certificates</span>
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  {certifications.length} Verified
                </span>
              </div>

              <div className="space-y-1.5">
                {certifications.slice(0, 4).map((cert) => {
                  const hasPreview = cert.href && cert.href !== "#";
                  return (
                    <button
                      key={cert.name}
                      type="button"
                      onClick={() => {
                        if (hasPreview) setSelectedCert(cert);
                      }}
                      className={`w-full text-left group flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-background/75 backdrop-blur-sm transition-all ${
                        hasPreview
                          ? "hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-sans text-xs font-medium text-foreground/90 truncate group-hover:text-foreground">
                          {cert.name}
                        </p>
                        <p className="font-sans text-[11px] font-normal text-muted-foreground truncate">
                          {cert.issuer}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {cert.tag && (
                          <span className="font-sans text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.05] text-foreground/75 border border-black/10 dark:border-white/10">
                            {cert.tag}
                          </span>
                        )}
                        {hasPreview && (
                          <LuArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. Education, Active Build & Location */}
            <div className="space-y-1.5 pt-3 border-t border-black/10 dark:border-white/10 font-sans text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuGraduationCap className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span>Education</span>
                </span>
                <span className="font-medium text-foreground truncate">
                  {EDUCATION.shortDegree} · {EDUCATION.abbreviation} ({EDUCATION.period})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuSparkles className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span>Building</span>
                </span>
                {onNavigate ? (
                  <button
                    type="button"
                    onClick={() => onNavigate("projects")}
                    className="font-medium text-foreground hover:underline cursor-pointer inline-flex items-center gap-1 truncate"
                  >
                    <span>MKBRiderTrack &amp; Naphix</span>
                    <LuArrowUpRight className="size-3" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="font-medium text-foreground truncate">
                    MKBRiderTrack &amp; Naphix
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuMapPin className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span>Base</span>
                </span>
                <span className="font-medium text-foreground/90 truncate">
                  {AUTHOR_INFO.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Certificate Lightbox Modal */}
      {selectedCert && (
        <div
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm cursor-pointer font-sans animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-background border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden cursor-default p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {selectedCert.tag && (
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground/80 border border-black/10 dark:border-white/10">
                      {selectedCert.tag}
                    </span>
                  )}
                  {selectedCert.code && (
                    <span className="font-sans text-xs text-muted-foreground">
                      ID: {selectedCert.code}
                    </span>
                  )}
                </div>
                <h3 className="font-sans text-base sm:text-lg font-semibold text-foreground">
                  {selectedCert.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground">
                  {selectedCert.issuer}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Close certificate preview"
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <LuX className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-muted/30">
              <Image
                src={selectedCert.href}
                alt={selectedCert.name}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroSection;
