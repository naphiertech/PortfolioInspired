"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuMapPin,
  LuArrowUpRight,
  LuLayers,
  LuBriefcase,
} from "react-icons/lu";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
} from "./ArtisanIcons";
import { VscVscode } from "react-icons/vsc";
import { SiSupabase } from "react-icons/si";
import {
  HERO_DATA,
  ARTISAN_GALLERY,
  ArtisanGalleryItem,
  ABOUT_PHILOSOPHY_ROW_1,
  ABOUT_PHILOSOPHY_ROW_2,
  WORKSPACE_GEAR,
} from "./data";
import { EDUCATION, RESUME_PATH, AVAILABILITY } from "@/lib/siteConfig";

function ClaudeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#D97757" className={className} aria-label="Claude">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

function CodexIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Codex">
      <g fill="#0A0A0A" className="fill-black dark:fill-white">
        <circle cx="12" cy="12" r="5.2" />
        <circle cx="12" cy="6.2" r="4.2" />
        <circle cx="17" cy="9.1" r="4.2" />
        <circle cx="17" cy="14.9" r="4.2" />
        <circle cx="12" cy="17.8" r="4.2" />
        <circle cx="7" cy="14.9" r="4.2" />
        <circle cx="7" cy="9.1" r="4.2" />
      </g>
      <path
        d="M8.8 9.8L11.4 12L8.8 14.2"
        stroke="#FFFFFF"
        className="stroke-white dark:stroke-black"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8 14.2H15.6"
        stroke="#FFFFFF"
        className="stroke-white dark:stroke-black"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GeminiIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Gemini">
      <defs>
        <linearGradient id="artisan-about-gemini" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="35%" stopColor="#9B72CF" />
          <stop offset="70%" stopColor="#D96570" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
        fill="url(#artisan-about-gemini)"
      />
    </svg>
  );
}

function CursorIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Cursor">
      <polygon points="12,2 20.66,7 12,12 3.34,7" fill="#D1D5DB" />
      <polygon points="3.34,7 12,12 12,22 3.34,17" fill="#4B5563" />
      <polygon points="12,12 20.66,7 20.66,17 12,22" fill="#9CA3AF" />
      <polygon points="12,6.5 19,10.5 12,21.2 12,12 4.5,8" fill="#FFFFFF" fillOpacity="0.95" />
    </svg>
  );
}

function AntigravityIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`relative ${className} shrink-0`}>
      <Image
        src="/resources/icons/antigravity-color.png"
        alt="Antigravity"
        fill
        sizes="48px"
        className="object-contain"
      />
    </div>
  );
}

function OpenCodeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 300" fill="none" className={className} aria-label="OpenCode">
      <path d="M180 240H60V120H180V240Z" fill="#CFCECD" />
      <path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" className="fill-black dark:fill-white" />
    </svg>
  );
}

interface AboutSectionProps {
  onNavigateTab?: (tab: "home" | "about" | "experience" | "projects" | "notes") => void;
}

export function AboutSection({ onNavigateTab }: AboutSectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ArtisanGalleryItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const openLightbox = (photo: ArtisanGalleryItem, index: number) => {
    setActivePhotoIndex(index);
    setSelectedPhoto(photo);
  };

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const nextPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => {
      const nextIdx = (prev + 1) % ARTISAN_GALLERY.length;
      setSelectedPhoto(ARTISAN_GALLERY[nextIdx]);
      return nextIdx;
    });
  }, []);

  const prevPhoto = useCallback(() => {
    setActivePhotoIndex((prev) => {
      const nextIdx = (prev - 1 + ARTISAN_GALLERY.length) % ARTISAN_GALLERY.length;
      setSelectedPhoto(ARTISAN_GALLERY[nextIdx]);
      return nextIdx;
    });
  }, []);

  // Lock body scroll and keyboard events when lightbox modal is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedPhoto, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <div className="w-full flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
      {/* 1. Page Header */}
      <div className="w-full max-w-2xl text-center space-y-3 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground">
          About Me
        </h2>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed max-w-xl mx-auto">
          Student, builder, and interface enthusiast. A glimpse into my background, craft philosophy, and life offline.
        </p>
      </div>

      <div className="w-full max-w-2xl sm:max-w-3xl px-1 sm:px-0 space-y-12 sm:space-y-12">
        {/* 2. Personal Story & Profile */}
        <section
          id="about-bio"
          aria-label="Profile and background"
          className="w-full space-y-8 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
            {/* Left Column on Desktop / Clean Containerless Profile + Single-Row Tool Icons on Mobile */}
            <div className="flex flex-col shrink-0 w-full sm:w-36 space-y-4 sm:space-y-2">
              {/* Avatar + Mobile Identity Header Row */}
              <div className="flex sm:flex-col items-center gap-4 sm:gap-2">
                {/* Profile Avatar matching other layouts */}
                <div className="relative group shrink-0 w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-surface">
                  <Image
                    src="/profile/ezgif-frame-001.png"
                    alt="Naphier Awalie"
                    fill
                    sizes="(max-width: 640px) 96px, 144px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: "center 20%" }}
                    priority
                  />
                </div>

                {/* Mobile Header: Availability, Name & Location */}
                <div className="flex-1 min-w-0 sm:hidden space-y-1.5">
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {AVAILABILITY.label}
                  </span>
                  <h3 className="font-mono text-xl font-semibold tracking-tight text-foreground leading-tight">
                    Hi, I&apos;m Naphier Awalie
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground flex items-center gap-1">
                    <LuMapPin className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                    Zamboanga City, PH
                  </p>
                </div>
              </div>

              {/* AI & Dev Tools: Single clean bare row of 8 on mobile, 2 columns on desktop */}
              <div
                aria-label="AI & Dev Tools"
                className="grid grid-cols-8 sm:grid-cols-2 gap-x-2 sm:gap-x-3.5 gap-y-2.5 sm:gap-y-3 sm:pt-2 items-center justify-items-center sm:justify-center w-full sm:w-fit sm:mx-auto"
              >
                <div
                  title="Claude"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <ClaudeIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="Codex"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <CodexIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="Gemini"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <GeminiIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="Cursor"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <CursorIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="Antigravity"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <AntigravityIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="OpenCode"
                  className="hover:scale-110 transition-transform duration-200 cursor-default"
                >
                  <OpenCodeIcon className="size-7 sm:size-10" />
                </div>

                <div
                  title="VS Code"
                  className="hover:scale-110 transition-transform duration-200 cursor-default text-[#007ACC]"
                >
                  <VscVscode className="size-7 sm:size-10" />
                </div>

                <div
                  title="Supabase"
                  className="hover:scale-110 transition-transform duration-200 cursor-default text-[#3ECF8E]"
                >
                  <SiSupabase className="size-7 sm:size-10" />
                </div>
              </div>
            </div>

            {/* Profile Narrative */}
            <div className="space-y-3 flex-1 min-w-0 w-full">
              {/* Desktop Only Badge & Location Header */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {AVAILABILITY.label}
                </span>
                <span className="font-sans text-xs text-muted-foreground inline-flex items-center gap-1">
                  <LuMapPin className="size-3 text-muted-foreground" aria-hidden="true" />
                  Zamboanga City, PH
                </span>
              </div>

              <h3 className="hidden sm:block font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Hi, I&apos;m Naphier Awalie
              </h3>

              <div className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed space-y-2.5">
                <p>
                  I&apos;m an Information Technology student at{" "}
                  <strong className="text-foreground font-medium">
                    {EDUCATION.institution} ({EDUCATION.abbreviation})
                  </strong>{" "}
                  and a full-stack developer who loves creating software that feels tactile, thoughtful, and dependable.
                </p>
                <p>
                  Most of my time is spent turning ideas into working systems—from logistics platforms with biometric attendance to split-screen document builders and responsive web apps. I care deeply about clean UI/UX, microinteractions, and maintainable architectures.
                </p>
                <p>
                  I&apos;m currently open to junior roles, internships, and collaborative projects where I can contribute while continuing to grow.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5 items-center">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab("projects")}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background font-sans text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    <LuLayers className="size-3.5" aria-hidden="true" />
                    <span>View Projects</span>
                  </button>
                )}
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab("experience")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/12 dark:border-white/12 bg-background hover:bg-foreground/[0.04] text-foreground font-sans text-xs font-medium transition-colors cursor-pointer"
                  >
                    <LuBriefcase className="size-3.5" aria-hidden="true" />
                    <span>Experience</span>
                  </button>
                )}
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/12 dark:border-white/12 bg-background hover:bg-foreground/[0.04] text-foreground font-sans text-xs font-medium transition-colors"
                >
                  <span>Resume</span>
                  <LuArrowUpRight className="size-3 opacity-70" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Facts Strip */}
          <div className="pt-6 sm:pt-7 border-t border-black/10 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Focus</span>
              <p className="font-sans font-medium text-xs sm:text-sm text-foreground/90">Full-Stack &amp; UI/UX</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Degree</span>
              <p className="font-sans font-medium text-xs sm:text-sm text-foreground/90">BS IT (2023 - Present)</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Campus</span>
              <p className="font-sans font-medium text-xs sm:text-sm text-foreground/90">ZPPSU CICS</p>
            </div>
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Open To</span>
              <p className="font-sans font-medium text-xs sm:text-sm text-foreground/90">Junior &amp; Freelance</p>
            </div>
          </div>
        </section>

        {/* 3. Everyday Carry & Workspace */}
        <section id="about-gear" aria-label="Everyday carry and workspace" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between pb-2 border-b border-black/8 dark:border-white/[0.05]">
            <div className="space-y-1">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                Workspace &amp; Gear
              </h3>
              <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                The daily hardware and physical tools I rely on for building and design.
              </p>
            </div>
            <span className="font-sans text-xs text-muted-foreground">
              Daily Drivers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            {WORKSPACE_GEAR.map((item, idx) => (
              <div
                key={item.id}
                className={`group space-y-2 ${
                  idx === 2 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <div className="relative aspect-[4/3] rounded-2xl border border-black/6 dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/15 dark:hover:border-white/[0.08] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] flex items-center justify-center p-3.5 sm:p-4 transition-all duration-300">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className={`object-contain ${
                      idx === 0
                        ? "max-h-24 sm:max-h-28"
                        : idx === 1
                        ? "max-h-20 sm:max-h-24"
                        : "max-h-22 sm:max-h-26"
                    } drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-105`}
                    priority
                  />
                </div>
                <div className="space-y-0.5 px-0.5">
                  <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug">
                    {item.name}
                  </h4>
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Moments & Photo Gallery */}
        <section id="about-moments" aria-label="Moments and photo gallery" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
            <div className="space-y-1">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                Moments &amp; Memories
              </h3>
              <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                Hackathons, student capstones, team milestones, and creative downtime.
              </p>
            </div>
            <span className="font-sans text-xs text-muted-foreground">
              {ARTISAN_GALLERY.length} Moments
            </span>
          </div>

          {/* Gallery Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3.5 sm:gap-4 pt-1">
            {ARTISAN_GALLERY.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(item, idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(item, idx);
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-foreground/[0.02] cursor-pointer transition-all duration-300 hover:border-black/25 dark:hover:border-white/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                  idx === 0
                    ? "sm:col-span-4 sm:row-span-2 aspect-[16/10] sm:aspect-auto sm:h-full"
                    : idx === 1 || idx === 2
                      ? "sm:col-span-2 sm:row-span-1 aspect-[16/10]"
                      : "sm:col-span-3 aspect-[16/10]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes={idx === 0 ? "(max-width: 640px) 100vw, 800px" : "(max-width: 640px) 100vw, 450px"}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Craft Philosophy */}
        <section id="about-philosophy" aria-label="Craft philosophy" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
            <div className="space-y-1">
              <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
                How I Build
              </h3>
              <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                Guiding principles behind my software development and design approach.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden w-full py-1 space-y-3.5">
            {/* Row 1: Moves Left */}
            <div className="overflow-hidden">
              <div className="animate-marquee-left">
                <div className="flex gap-3.5 sm:gap-4 shrink-0 pr-3.5 sm:pr-4">
                  {ABOUT_PHILOSOPHY_ROW_1.map((item) => (
                    <div
                      key={item.badge}
                      className="w-[280px] sm:w-[340px] shrink-0 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm space-y-2.5 transition-colors hover:bg-foreground/[0.02] hover:border-black/25 dark:hover:border-white/25 select-none"
                    >
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block">
                        {item.badge}
                      </span>
                      <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3.5 sm:gap-4 shrink-0 pr-3.5 sm:pr-4" aria-hidden="true">
                  {ABOUT_PHILOSOPHY_ROW_1.map((item, idx) => (
                    <div
                      key={`r1-dup-${idx}`}
                      className="w-[280px] sm:w-[340px] shrink-0 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm space-y-2.5 transition-colors hover:bg-foreground/[0.02] hover:border-black/25 dark:hover:border-white/25 select-none"
                    >
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block">
                        {item.badge}
                      </span>
                      <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Moves Right */}
            <div className="overflow-hidden">
              <div className="animate-marquee-right">
                <div className="flex gap-3.5 sm:gap-4 shrink-0 pr-3.5 sm:pr-4">
                  {ABOUT_PHILOSOPHY_ROW_2.map((item) => (
                    <div
                      key={item.badge}
                      className="w-[280px] sm:w-[340px] shrink-0 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm space-y-2.5 transition-colors hover:bg-foreground/[0.02] hover:border-black/25 dark:hover:border-white/25 select-none"
                    >
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block">
                        {item.badge}
                      </span>
                      <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3.5 sm:gap-4 shrink-0 pr-3.5 sm:pr-4" aria-hidden="true">
                  {ABOUT_PHILOSOPHY_ROW_2.map((item, idx) => (
                    <div
                      key={`r2-dup-${idx}`}
                      className="w-[280px] sm:w-[340px] shrink-0 p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm space-y-2.5 transition-colors hover:bg-foreground/[0.02] hover:border-black/25 dark:hover:border-white/25 select-none"
                    >
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground block">
                        {item.badge}
                      </span>
                      <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Direct Connect Pill Bar */}
        <section aria-label="Social connections" className="pt-2 pb-4">
          <div className="p-5 sm:p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-mono text-lg font-semibold tracking-wider text-foreground">
                Let&apos;s Build Together
              </h4>
              <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                Have an opportunity, project, or question? Always happy to chat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={HERO_DATA.socials.find((s) => s.type === "email")?.url || "mailto:naphiera@gmail.com"}
                aria-label="Send Email"
                className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-foreground/[0.05] text-foreground transition-all duration-200"
              >
                <FaEnvelope className="size-4" aria-hidden="true" />
              </a>
              <a
                href={HERO_DATA.socials.find((s) => s.type === "github")?.url || "https://github.com/naphiertech"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-foreground/[0.05] text-foreground transition-all duration-200"
              >
                <FaGithub className="size-4" aria-hidden="true" />
              </a>
              <a
                href={HERO_DATA.socials.find((s) => s.type === "linkedin")?.url || "https://www.linkedin.com/in/naphier-awalie-0551983b5/"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-foreground/[0.05] text-[#0A66C2] transition-all duration-200"
              >
                <FaLinkedinIn className="size-4" aria-hidden="true" />
              </a>
              <a
                href={HERO_DATA.socials.find((s) => s.type === "twitter")?.url || "https://x.com/bagatata05"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter Profile"
                className="p-2.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:bg-foreground/[0.05] text-foreground transition-all duration-200"
              >
                <FaXTwitter className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
          >
            {/* Modal Controls Bar */}
            <div
              className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between text-white z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
                  {activePhotoIndex + 1} / {ARTISAN_GALLERY.length}
                </span>
                <span className="hidden sm:inline-block font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                  {selectedPhoto.tag}
                </span>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <LuX className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white transition-all cursor-pointer z-20"
              aria-label="Previous photo"
            >
              <LuChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white transition-all cursor-pointer z-20"
              aria-label="Next photo"
            >
              <LuChevronRight className="size-5" aria-hidden="true" />
            </button>

            {/* Main Stage Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full h-[70vh] sm:h-[78vh] flex items-center justify-center rounded-2xl overflow-hidden"
            >
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                sizes="(max-width: 1024px) 95vw, 1024px"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AboutSection;
