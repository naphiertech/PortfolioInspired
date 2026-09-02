"use client";

import React from "react";
import { currentBuild } from "@/lib/data";
import { AUTHOR_INFO, EDUCATION } from "@/lib/siteConfig";

/**
 * MinimalCurrent
 *
 * Editorial definition list capturing active milestones and focus:
 * - What Naphier is currently building
 * - Degree and academic study
 * - Geographic base of operations
 */
export function MinimalCurrent() {
  return (
    <section className="space-y-4 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
        Currently
      </h2>

      <dl className="space-y-3 font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-relaxed">
        <div>
          <dt className="inline font-medium text-zinc-900 dark:text-[#eae6df]">Building:</dt>{" "}
          <dd className="inline">
            <a
              href="https://mkbridertrack.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 dark:text-[#dedad0] hover:text-zinc-700 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
            >
              {currentBuild.title}
            </a>{" "}
            — {currentBuild.description}
          </dd>
        </div>

        <div>
          <dt className="inline font-medium text-zinc-900 dark:text-[#eae6df]">Studying:</dt>{" "}
          <dd className="inline">
            {EDUCATION.degree} at {EDUCATION.institution} ({EDUCATION.period}).
          </dd>
        </div>

        <div>
          <dt className="inline font-medium text-zinc-900 dark:text-[#eae6df]">Based in:</dt>{" "}
          <dd className="inline">{AUTHOR_INFO.location}.</dd>
        </div>
      </dl>
    </section>
  );
}

export default MinimalCurrent;
