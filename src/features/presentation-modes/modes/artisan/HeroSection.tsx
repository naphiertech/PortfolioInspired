"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  LuPanelLeft,
  LuPanelLeftClose,
  LuSparkles,
} from "./ArtisanIcons";
import { CertificationPreviewModal } from "./CertificationCard";
import { ArtisanOverviewSections } from "./ArtisanOverviewSections";
import { HERO_DATA } from "./data";
import { certifications, CertificationItem } from "@/lib/data";
import {
  EDUCATION,
  AUTHOR_INFO,
  RESUME_PATH,
  SITE_NAME,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";

import { Hero3DBackground } from "./Hero3DBackground";

interface HeroSectionProps {
  isDark: boolean;
  activeTab?: string;
  isHomeActive?: boolean;
  onNavigate?: (tab: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
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

const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
const LAYOUT_GLIDE = {
  layout: { duration: 0.36, ease: EASE_DRAWER },
} as const;

export function HeroSection({
  isDark,
  activeTab = "home",
  isHomeActive = true,
  onNavigate,
  isSidebarOpen = false,
  onToggleSidebar,
}: HeroSectionProps) {
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
    const handleOpenLetsTalk = () => setIsTalkOpen(true);
    window.addEventListener("artisan-open-lets-talk", handleOpenLetsTalk);
    return () => {
      window.removeEventListener("artisan-open-lets-talk", handleOpenLetsTalk);
    };
  }, []);

  const handleTabLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: string
  ) => {
    if (
      onNavigate &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0
    ) {
      e.preventDefault();
      onNavigate(tab);
    }
  };

  return (
    <section
      className={
        isSidebarOpen
          ? "relative w-full min-h-screen overflow-x-hidden pb-12"
          : "relative w-full min-h-dvh lg:h-dvh flex flex-col lg:block justify-start overflow-x-hidden lg:overflow-hidden pb-24 lg:pb-0"
      }
    >
      {/* Soft Bottom Edge Gradient for dock transition when sidebar is closed on desktop (Image 1 state) */}
      {!isSidebarOpen && (
        <div className="hidden lg:block absolute h-32 w-full bg-gradient-to-t from-background to-transparent bottom-0 pointer-events-none z-10" />
      )}

      {/* Main Content Container: Image 1 split when closed; full first-view 3D stage + portrait dossier below fold when sidebar is open */}
      <div
        className={
          isSidebarOpen
            ? "relative z-20 w-full px-5 sm:px-8 pt-2 pb-14 flex flex-col items-center text-foreground"
            : "relative z-20 w-full lg:h-full pointer-events-none text-foreground flex flex-col justify-start"
        }
      >
        {/* 1. Intro: Title, Bio, and Action Buttons (Left-Top on Image 1; Expanded Editorial Header below 3D Desk on Image 2) */}
        <motion.div
          id="artisan-dossier"
          layout="position"
          transition={LAYOUT_GLIDE}
          className={
            isSidebarOpen
              ? "order-2 relative z-10 w-full max-w-2xl mx-auto scroll-mt-6 space-y-4 pt-6 pb-8 border-b border-dotted border-black/15 dark:border-white/15 pointer-events-auto"
              : "order-1 relative z-10 pt-10 sm:pt-12 md:pt-14 lg:pt-14 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 space-y-3 max-w-xl"
          }
        >
          <div data-guide="artisan-intro" className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-semibold font-serif tracking-tight text-foreground min-h-[2.25rem] sm:min-h-[2.75rem] lg:min-h-0">
              <span className="sr-only">{SITE_NAME} — </span>
              {HERO_DATA.title}
            </h1>

            <p
              className={
                isSidebarOpen
                  ? "w-full max-w-xl text-sm sm:text-[15px] text-foreground/80 leading-relaxed font-sans font-normal"
                  : "w-[95%] sm:w-[85%] lg:w-full lg:max-w-[355px] xl:max-w-[370px] text-xs sm:text-sm text-foreground/80 leading-relaxed font-sans font-normal min-h-[5rem] sm:min-h-[4.25rem] lg:min-h-0"
              }
            >
              Hey, I&apos;m{" "}
              <span className="font-caveat font-bold italic tracking-wide text-foreground text-lg sm:text-xl leading-none">
                {HERO_DATA.name}
              </span>
              . {HERO_DATA.bio}{" "}
              {HERO_DATA.status && (
                <span className="text-foreground/90 font-sans text-xs font-medium whitespace-nowrap">
                  ({HERO_DATA.status})
                </span>
              )}
            </p>
          </div>

          <div
            data-guide="artisan-actions"
            className="w-fit pointer-events-auto flex flex-wrap items-center gap-3 pt-1 shrink-0"
          >
            {/* Let's Talk Popover */}
            <div ref={talkRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsTalkOpen((prev) => !prev)}
                className="bg-black text-white dark:bg-white dark:text-black tracking-wide cursor-pointer transition-all duration-200 active:translate-y-0.5 rounded-3xl font-sans shadow-sm hover:opacity-90 flex items-center justify-center font-medium px-5 py-2 text-xs sm:text-sm"
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
                        {s.type === "twitter" && (
                          <FaXTwitter className="size-5" aria-hidden="true" />
                        )}
                        {s.type === "whatsapp" && (
                          <FaWhatsapp className="size-5" aria-hidden="true" />
                        )}
                        {s.type === "linkedin" && (
                          <FaLinkedinIn className="size-5" aria-hidden="true" />
                        )}
                        {s.type === "email" && (
                          <FaEnvelope className="size-5" aria-hidden="true" />
                        )}
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* GitHub & LinkedIn Links */}
            {HERO_DATA.socials.find((s) => s.type === "github") && (
              <a
                href={HERO_DATA.socials.find((s) => s.type === "github")!.url}
                target="_blank"
                rel="me noopener noreferrer"
                aria-label="GitHub Profile"
                className="text-foreground tracking-wider cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-100 p-0.5 text-3xl"
              >
                <FaGithub aria-hidden="true" />
              </a>
            )}
            <a
              href={SOCIAL_PROFILES.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-foreground tracking-wider cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-100 p-0.5 text-2xl"
            >
              <FaLinkedinIn aria-hidden="true" />
            </a>

            {/* Resume Quick Pill */}
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/12 dark:border-white/10 hover:border-black/25 dark:hover:border-white/20 bg-background/75 backdrop-blur-sm text-xs font-sans font-medium text-foreground/85 hover:text-foreground transition-colors px-4 py-2"
            >
              <LuFileText className="size-3.5" aria-hidden="true" />
              <span>Résumé</span>
              <LuArrowUpRight className="size-3 opacity-70" aria-hidden="true" />
            </a>

            {/* Workspace Sidebar Toggle Pill */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-expanded={isSidebarOpen}
                aria-controls="artisan-workspace-sidebar"
                aria-label={
                  isSidebarOpen
                    ? "Close navigation sidebar"
                    : "Open navigation sidebar"
                }
                title={
                  isSidebarOpen
                    ? "Close sidebar (Ctrl+B)"
                    : "Open sidebar (Ctrl+B)"
                }
                className={`inline-flex items-center justify-center rounded-full border backdrop-blur-sm transition-colors cursor-pointer size-[34px] ${
                  isSidebarOpen
                    ? "border-black/30 dark:border-white/25 bg-black/[0.06] dark:bg-white/[0.1] text-foreground"
                    : "border-black/12 dark:border-white/10 hover:border-black/25 dark:hover:border-white/20 bg-white/80 dark:bg-[#0d0f10]/80 text-foreground/80 hover:text-foreground"
                }`}
              >
                {isSidebarOpen ? (
                  <LuPanelLeftClose className="size-3.5" aria-hidden="true" />
                ) : (
                  <LuPanelLeft className="size-3.5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {isSidebarOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-dotted border-black/15 dark:border-white/15 font-sans">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <LuGraduationCap className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Education</span>
                </span>
                <p className="text-xs font-medium text-foreground truncate">
                  {EDUCATION.shortDegree} · {EDUCATION.abbreviation} ({EDUCATION.period})
                </p>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <LuSparkles className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Building</span>
                </span>
                <div>
                  <Link
                    href="/projects"
                    onClick={(e) => handleTabLinkClick(e, "projects")}
                    className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1 truncate"
                  >
                    <span>MKBRiderTrack &amp; Naphix</span>
                    <LuArrowUpRight className="size-3 shrink-0 opacity-70" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <LuMapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Base</span>
                </span>
                <p className="text-xs font-medium text-foreground truncate">
                  {AUTHOR_INFO.location}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* 2. 3D Workspace (Right-offset centerpiece on Image 1; Full first-view centerpiece on Image 2) */}
        <motion.div
          layout="position"
          transition={LAYOUT_GLIDE}
          data-guide="artisan-3d"
          className={
            isSidebarOpen
              ? "order-1 relative z-0 w-full min-h-[calc(100dvh-2rem)] lg:min-h-[calc(100dvh-1.5rem)] flex flex-col justify-center items-center pointer-events-auto py-4"
              : "order-2 relative lg:absolute lg:inset-0 z-0 my-4 lg:my-0 flex justify-center items-center pointer-events-auto"
          }
        >
          <div
            className={`w-full flex flex-col items-center transition-transform duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
              isSidebarOpen
                ? ""
                : "lg:translate-x-[13%] xl:translate-x-[10%] 2xl:translate-x-[7%]"
            }`}
          >
            <Hero3DBackground
              isDark={isDark}
              activeTab={activeTab}
              isHomeActive={isHomeActive}
              onNavigate={onNavigate}
              expanded={isSidebarOpen}
            />
          </div>
        </motion.div>

        {/* 3. Extended Dossier: Left scrollable rail on Image 1; Editorial Overview on Image 2 */}
        <motion.div
          layout="position"
          transition={LAYOUT_GLIDE}
          className={
            isSidebarOpen
              ? "order-3 relative z-10 w-full pointer-events-auto font-sans"
              : "order-3 relative z-10 px-5 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-2 lg:pt-3 w-full max-w-xl"
          }
        >
          {isSidebarOpen ? (
            <ArtisanOverviewSections
              skills={HERO_SKILLS}
              onTabLinkClick={handleTabLinkClick}
              onSelectCert={setSelectedCert}
            />
          ) : (
            <div className="flex flex-col gap-3.5 w-full pointer-events-auto lg:max-h-[calc(100dvh-295px)] lg:overflow-y-auto scrollbar-hide lg:pr-1 pb-6 lg:pb-14 font-sans lg:max-w-[355px] xl:max-w-[370px]">
              {/* A. Core Skills & Stack */}
            <div
              data-guide="artisan-stack"
              className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-foreground/90">
                  <LuCode
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>Core Stack</span>
                </span>
                <Link
                  href="/tech-stack"
                  onClick={(e) =>
                    handleTabLinkClick(e, "experience#tech-stack")
                  }
                  className="font-sans text-xs font-medium text-muted-foreground hover:text-foreground hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
                >
                  <span>All skills</span>
                  <LuArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {HERO_SKILLS.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 rounded-full font-sans font-normal border border-black/12 dark:border-white/10 bg-background/75 backdrop-blur-sm text-foreground/90 hover:border-black/25 dark:hover:border-white/20 transition-colors px-2.5 py-1 text-xs"
                    >
                      <Icon
                        className="size-3 text-foreground/85 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* B. Certificates & Recognition */}
            <div className="space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-foreground/90">
                  <LuAward
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>Certificates</span>
                </span>
                <Link
                  href="/certifications"
                  onClick={(e) =>
                    handleTabLinkClick(e, "experience#certifications")
                  }
                  className="font-sans text-xs font-medium text-muted-foreground hover:text-foreground hover:underline cursor-pointer inline-flex items-center gap-0.5 transition-colors"
                >
                  <span>{certifications.length} Verified</span>
                  <LuArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
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
                      className={`w-full text-left group flex items-center justify-between gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-background/75 backdrop-blur-sm transition-all px-3 py-2 ${
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
                          <span className="font-sans text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.05] text-foreground/75 border border-black/10 dark:border-white/10">
                            {cert.tag}
                          </span>
                        )}
                        {hasPreview && (
                          <LuArrowUpRight
                            className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
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
                  <LuGraduationCap
                    className="size-3.5 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <span>Education</span>
                </span>
                <span className="font-medium text-foreground truncate">
                  {EDUCATION.shortDegree} · {EDUCATION.abbreviation} (
                  {EDUCATION.period})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuSparkles
                    className="size-3.5 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <span>Building</span>
                </span>
                <Link
                  href="/projects"
                  onClick={(e) => handleTabLinkClick(e, "projects")}
                  className="font-medium text-foreground hover:underline cursor-pointer inline-flex items-center gap-1 truncate"
                >
                  <span>MKBRiderTrack &amp; Naphix</span>
                  <LuArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <LuMapPin
                    className="size-3.5 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                  <span>Base</span>
                </span>
                <span className="font-medium text-foreground/90 truncate">
                  {AUTHOR_INFO.location}
                </span>
              </div>
            </div>
          </div>
          )}
        </motion.div>
      </div>

      {/* 4. Certificate Lightbox Modal */}
      <CertificationPreviewModal
        selectedCert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
}

export default HeroSection;
