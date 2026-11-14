"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HiOutlineHome,
  PiUserLight,
  PiChairLight,
  BsFolder2,
  PiNotePencilLight,
  LuCode,
  LuAward,
  LuFileText,
  LuArrowUpRight,
  LuPanelLeftClose,
  LuHeadphones,
  LuLibrary,
  LuVolume2,
  LuVolumeX,
  LuMic,
  LuSun,
  LuMoon,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
} from "./ArtisanIcons";
import { EXPERIENCE_DATA } from "./data";
import { fullProjects, certifications, techSections } from "@/lib/data";
import { fieldNotes } from "@/lib/fieldNotes";
import { FAVORITE_TRACKS } from "@/features/music-drawer";
import { RESOURCE_CATEGORIES } from "@/features/resources-drawer";
import {
  AUTHOR_INFO,
  AVAILABILITY,
  RESUME_PATH,
  SOCIAL_PROFILES,
} from "@/lib/siteConfig";
import { useUISound } from "@/context/SoundContext";
import { LocalTime } from "@/components/LocalTime";

const VisitorPresence = dynamic(
  () => import("@/components/VisitorPresence").then((m) => m.VisitorPresence),
  { ssr: false }
);

interface WorkspaceSidebarProps {
  isOpen: boolean;
  activeTab: string;
  activeSubTarget?: string | null;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onTriggerLetsTalk: () => void;
  onTriggerNaphBot: () => void;
  isDark: boolean;
  onToggleTheme: (event?: React.MouseEvent) => void;
}

const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export function WorkspaceSidebar({
  isOpen,
  activeTab,
  activeSubTarget = null,
  onClose,
  onSelectTab,
  onTriggerLetsTalk,
  onTriggerNaphBot,
  isDark,
  onToggleTheme,
}: WorkspaceSidebarProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isSoundEnabled, toggleSound, playClick, playHover } = useUISound();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const totalTools = useMemo(
    () => techSections.reduce((sum, section) => sum + section.items.length, 0),
    []
  );

  const totalResources = useMemo(
    () =>
      RESOURCE_CATEGORIES.reduce(
        (sum, category) => sum + category.items.length,
        0
      ),
    []
  );

  // Move keyboard focus into the sidebar header control on open for clear accessibility
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetTab: string
  ) => {
    if (
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.button === 0
    ) {
      event.preventDefault();
      playClick();
      onSelectTab(targetTab);
      if (typeof window !== "undefined" && window.innerWidth < 1280) {
        onClose();
      }
    }
  };

  const overviewItems = [
    { id: "home", href: "/", label: "Home", icon: HiOutlineHome },
    { id: "about", href: "/?tab=about", label: "About", icon: PiUserLight },
  ];

  const portfolioItems = [
    {
      id: "projects",
      target: "projects",
      href: "/projects",
      label: "Projects",
      count: fullProjects.length,
      icon: BsFolder2,
    },
    {
      id: "experience",
      target: "experience",
      href: "/experience",
      label: "Experience",
      count: EXPERIENCE_DATA.length,
      icon: PiChairLight,
    },
    {
      id: "tech-stack",
      target: "experience#tech-stack",
      href: "/tech-stack",
      label: "Tech Stack",
      count: totalTools,
      icon: LuCode,
    },
    {
      id: "certifications",
      target: "experience#certifications",
      href: "/certifications",
      label: "Certifications",
      count: certifications.length,
      icon: LuAward,
    },
    {
      id: "notes",
      target: "notes",
      href: "/notes",
      label: "Field Notes",
      count: fieldNotes.length,
      icon: PiNotePencilLight,
    },
  ];

  const blockVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 6, filter: "blur(2px)" },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: prefersReducedMotion
        ? { duration: 0.08 }
        : {
            duration: 0.22,
            delay: 0.04 + index * 0.035,
            ease: EASE_DRAWER,
          },
    }),
  };

  const isNavItemActive = (itemId: string) => {
    if (itemId === "tech-stack" || itemId === "certifications") {
      return activeTab === "experience" && activeSubTarget === itemId;
    }
    if (itemId === "experience") {
      return activeTab === "experience" && !activeSubTarget;
    }
    return activeTab === itemId;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Translucent dim backdrop on < 1280px viewports where sidebar overlays */}
          <motion.div
            key="workspace-sidebar-backdrop"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              ease: EASE_DRAWER,
            }}
            className="fixed inset-0 z-[75] xl:hidden bg-black/35 dark:bg-black/55 backdrop-blur-sm"
          />

          {/* Floating Studio Sidebar Card */}
          <motion.aside
            key="workspace-sidebar-card"
            id="artisan-workspace-sidebar"
            aria-label="Studio workspace navigation sidebar"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -24, scale: 0.97 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -20, scale: 0.98 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.1 }
                : { duration: 0.34, ease: EASE_DRAWER }
            }
            style={{
              boxShadow: isDark
                ? "var(--shadow-tactile)"
                : "0 14px 36px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
            className="fixed top-3 bottom-3 left-3 z-[80] xl:z-40 w-[256px] max-w-[calc(100vw-24px)] rounded-2xl border border-black/10 dark:border-white/10 bg-[#ffffff]/[0.96] xl:bg-[#ffffff]/92 dark:bg-[#0d0f10]/[0.96] xl:dark:bg-[#0d0f10]/92 backdrop-blur-xl text-foreground flex flex-col overflow-hidden select-none"
          >
            {/* Blueprint Scaffold Perimeter Trace during generation reveal */}
            {!prefersReducedMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0.85, scale: 0.985 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.38, delay: 0.06, ease: "easeOut" }}
                className="pointer-events-none absolute inset-1.5 rounded-[12px] border border-dashed border-foreground/25 z-20"
              />
            )}

            {/* Block 0: Identity Header + Collapse Toggle */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={blockVariants}
              className="px-3.5 pt-3.5 pb-3 border-b border-black/[0.07] dark:border-white/[0.08] flex items-center justify-between gap-2.5 shrink-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Image
                  src="/favicon-96x96.png"
                  alt={AUTHOR_INFO.name}
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-sans text-[13px] font-semibold tracking-tight text-foreground truncate">
                    {AUTHOR_INFO.name}
                  </p>
                  <p className="flex items-center gap-1.5 font-code text-[10px] text-muted-foreground truncate">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{AVAILABILITY.status}</span>
                  </p>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                onMouseEnter={playHover}
                aria-label="Close workspace sidebar"
                title="Collapse sidebar (Esc)"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.07] transition-colors cursor-pointer shrink-0"
              >
                <LuPanelLeftClose className="size-4" aria-hidden="true" />
              </button>
            </motion.div>

            {/* Scrollable Body: Primary CTA + Overview + Portfolio + Tools */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto scrollbar-hide px-2.5 py-3 space-y-4"
            >
              {/* Block 1: Contact Pill + Overview */}
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={blockVariants}
                className="space-y-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onTriggerLetsTalk();
                    if (typeof window !== "undefined" && window.innerWidth < 1280) {
                      onClose();
                    }
                  }}
                  onMouseEnter={playHover}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-black/12 dark:border-white/12 bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] font-sans text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <FaEnvelope className="size-3.5 text-muted-foreground" />
                  <span>Let&apos;s Talk</span>
                </button>

                <div className="space-y-0.5">
                  <p className="px-2 pb-1 font-sans font-medium text-[10px] uppercase tracking-[0.14em] text-muted-foreground/75">
                    Overview
                  </p>
                  {overviewItems.map((item) => {
                    const Icon = item.icon;
                    const active = isNavItemActive(item.id);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.id)}
                        onMouseEnter={playHover}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg font-sans text-[13px] transition-colors ${
                          active
                            ? "bg-black/[0.06] dark:bg-white/[0.09] text-foreground font-medium"
                            : "text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2.5 min-w-0">
                          <Icon className="size-4 shrink-0 opacity-80" />
                          <span className="truncate">{item.label}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Block 2: Portfolio Routes with Real Counts */}
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={blockVariants}
                className="space-y-0.5"
              >
                <p className="px-2 pb-1 font-sans font-medium text-[10px] uppercase tracking-[0.14em] text-muted-foreground/75">
                  Portfolio
                </p>
                {portfolioItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavItemActive(item.id);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.target)}
                      onMouseEnter={playHover}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg font-sans text-[13px] transition-colors ${
                        active
                          ? "bg-black/[0.06] dark:bg-white/[0.09] text-foreground font-medium"
                          : "text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5 min-w-0">
                        <Icon className="size-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="font-code text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
                        {item.count}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>

              {/* Block 3: Workspace Dedicated Pages & Shortcuts */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={blockVariants}
                className="space-y-0.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.07]"
              >
                <p className="px-2 pb-1 font-sans font-medium text-[10px] uppercase tracking-[0.14em] text-muted-foreground/75">
                  Workspace
                </p>

                <Link
                  href="/music"
                  onClick={(e) => handleNavClick(e, "music")}
                  onMouseEnter={playHover}
                  aria-current={activeTab === "music" ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg font-sans text-[13px] transition-colors ${
                    activeTab === "music"
                      ? "bg-black/[0.06] dark:bg-white/[0.09] text-foreground font-medium"
                      : "text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <LuHeadphones className="size-4 shrink-0 opacity-80" />
                    <span className="truncate">Music</span>
                  </span>
                  <span className="font-code text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
                    {FAVORITE_TRACKS.length}
                  </span>
                </Link>

                <Link
                  href="/resources"
                  onClick={(e) => handleNavClick(e, "resources")}
                  onMouseEnter={playHover}
                  aria-current={activeTab === "resources" ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg font-sans text-[13px] transition-colors ${
                    activeTab === "resources"
                      ? "bg-black/[0.06] dark:bg-white/[0.09] text-foreground font-medium"
                      : "text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <LuLibrary className="size-4 shrink-0 opacity-80" />
                    <span className="truncate">Resources</span>
                  </span>
                  <span className="font-code text-[11px] tabular-nums text-muted-foreground/80 shrink-0">
                    {totalResources}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onTriggerNaphBot();
                    if (typeof window !== "undefined" && window.innerWidth < 1280) {
                      onClose();
                    }
                  }}
                  onMouseEnter={playHover}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg font-sans text-[13px] text-left text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <LuMic className="size-4 shrink-0 opacity-80" />
                    <span className="truncate">Chat with NaphBot</span>
                  </span>
                  <span className="font-code text-[10px] text-muted-foreground/75 shrink-0">
                    Voice
                  </span>
                </button>

                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={playHover}
                  className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg font-sans text-[13px] text-foreground/75 hover:text-foreground hover:bg-black/[0.035] dark:hover:bg-white/[0.05] transition-colors"
                >
                  <span className="inline-flex items-center gap-2.5 min-w-0">
                    <LuFileText className="size-4 shrink-0 opacity-80" />
                    <span className="truncate">Résumé</span>
                  </span>
                  <LuArrowUpRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                </a>
              </motion.div>
            </div>

            {/* Block 4: Telemetry & Quick Controls Footer */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={blockVariants}
              className="px-3 py-2.5 border-t border-black/[0.07] dark:border-white/[0.08] space-y-2.5 shrink-0 bg-black/[0.015] dark:bg-white/[0.015]"
            >
              <div className="flex items-center justify-between gap-2 min-h-[26px]">
                <LocalTime fontClassName="font-code tabular-nums" />
                <VisitorPresence />
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      playClick();
                      onToggleTheme(e);
                    }}
                    onMouseEnter={playHover}
                    aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                    title={isDark ? "Light mode" : "Dark mode"}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    {isDark ? (
                      <LuSun className="size-3.5" aria-hidden="true" />
                    ) : (
                      <LuMoon className="size-3.5" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleSound}
                    onMouseEnter={playHover}
                    aria-label={isSoundEnabled ? "Mute UI sounds" : "Enable UI sounds"}
                    title={isSoundEnabled ? "Sound: On" : "Sound: Off"}
                    className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    {isSoundEnabled ? (
                      <LuVolume2 className="size-3.5" aria-hidden="true" />
                    ) : (
                      <LuVolumeX className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={SOCIAL_PROFILES.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    onMouseEnter={playHover}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <FaGithub className="size-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={SOCIAL_PROFILES.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    onMouseEnter={playHover}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <FaLinkedinIn className="size-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={`mailto:${SOCIAL_PROFILES.email}`}
                    aria-label="Email Naphier"
                    onMouseEnter={playHover}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <FaEnvelope className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default WorkspaceSidebar;
