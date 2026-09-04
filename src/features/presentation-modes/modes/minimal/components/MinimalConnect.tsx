"use client";

import React from "react";
import { AUTHOR_INFO, SOCIAL_PROFILES } from "@/lib/siteConfig";

/**
 * MinimalConnect
 *
 * Quiet editorial contact and social connections ending section:
 * - Roman serif typography
 * - Direct email and external social links
 * - Understated minimal footer
 */
export function MinimalConnect() {
  return (
    <section className="space-y-6 pt-8 pb-12">
      <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
        Connect
      </h2>

      <p className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[28px]">
        If you&apos;d like to collaborate, discuss an opportunity, or chat about
        web engineering and software design, feel free to reach out directly at{" "}
        <a
          href={`mailto:${SOCIAL_PROFILES.email}`}
          className="text-zinc-900 dark:text-[#eae6df] underline underline-offset-4 hover:text-zinc-600 hover:dark:text-[#dedad0] transition-colors"
        >
          {SOCIAL_PROFILES.email}
        </a>
        .
      </p>

      {/* Social Links List */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-600 dark:text-[#9e998e]">
        <a
          href={`mailto:${SOCIAL_PROFILES.email}`}
          className="text-zinc-900 dark:text-[#dedad0] hover:text-zinc-700 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Email ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href={`mailto:${SOCIAL_PROFILES.email}?subject=Let's%20Schedule%20a%20Call`}
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Schedule a Call ↗
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
          href={SOCIAL_PROFILES.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Instagram ↗
        </a>
        <span className="text-zinc-300 dark:text-white/[0.12] select-none">/</span>
        <a
          href="/resume/naphier_awalie_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
        >
          Resume PDF ↗
        </a>
      </div>

      {/* Quiet Minimal Ending */}
      <footer className="pt-8 border-t border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-zinc-500 dark:text-[#827d73] select-none">
        <span>&copy; {new Date().getFullYear()} {AUTHOR_INFO.name}</span>
        <span>Minimal presentation</span>
      </footer>
    </section>
  );
}

export default MinimalConnect;
