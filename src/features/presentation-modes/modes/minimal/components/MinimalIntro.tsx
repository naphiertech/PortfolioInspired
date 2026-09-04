"use client";

import React from "react";
import Image from "next/image";
import { AUTHOR_INFO, AVAILABILITY, SOCIAL_PROFILES } from "@/lib/siteConfig";

/**
 * MinimalIntro
 *
 * Quiet, text-first introduction with Roman serif typography, understated avatar,
 * availability note, and simple text action links.
 */
export function MinimalIntro() {
  return (
    <section className="space-y-6 pt-4 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      {/* Avatar & Identity Row */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-[#141514] flex-shrink-0">
          <Image
            src="/profile/ezgif-frame-001.png"
            alt={AUTHOR_INFO.name}
            fill
            sizes="64px"
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
            priority
          />
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-900 dark:text-[#eae6df] tracking-tight">
            {AUTHOR_INFO.name}
          </h1>
          <p className="font-serif text-sm sm:text-base text-zinc-600 dark:text-[#9e998e] mt-0.5">
            {AUTHOR_INFO.jobTitle}
          </p>
        </div>
      </div>

      {/* Narrative Paragraphs */}
      <div className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[28px] space-y-4">
        <p>
          I&apos;m an IT student and full-stack developer who enjoys turning ideas
          into practical web applications with clean interfaces, thoughtful user
          experiences, and reliable functionality.
        </p>

        <p>
          Most of my work comes from turning ideas into working products, from
          school systems and productivity tools to personal side projects. I&apos;m
          especially interested in UI/UX, web animation, AI-assisted development,
          and learning how real software systems are designed, connected, and
          improved over time.
        </p>
      </div>

      {/* Availability Status */}
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 dark:text-[#9e998e] pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 dark:bg-emerald-400/80" />
        <a
          href={`mailto:${SOCIAL_PROFILES.email}?subject=Collaboration%20Inquiry`}
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] transition-colors underline-offset-4 hover:underline"
        >
          {AVAILABILITY.label} ↗
        </a>
      </div>

      {/* Understated Action Links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-mono text-zinc-600 dark:text-[#9e998e]">
        <a
          href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
          className="text-zinc-900 dark:text-[#dedad0] hover:text-zinc-700 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Schedule a Call ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href="/resume/naphier_awalie_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-900 dark:text-[#dedad0] hover:text-zinc-700 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Resume PDF ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href={SOCIAL_PROFILES.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          GitHub ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href={SOCIAL_PROFILES.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          LinkedIn ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href={`mailto:${SOCIAL_PROFILES.email}`}
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Email ↗
        </a>
      </div>
    </section>
  );
}

export default MinimalIntro;
