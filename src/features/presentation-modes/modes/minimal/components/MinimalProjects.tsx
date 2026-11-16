"use client";

import React, { useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FullProjectItem, fullProjects } from "@/lib/data";
import { MinimalProjectActions } from "./MinimalActionPreview";
import { PROJECT_CURSOR_LABELS } from "@/lib/cursorConfig";

const INITIAL_PROJECTS_COUNT = 2;

function MinimalProjectArticle({ project }: { project: FullProjectItem }) {
  const highlights = project.features?.slice(0, 3) || [];
  const techList = project.tags.slice(0, 5).join(" · ");

  return (
    <article
      data-cursor-label={PROJECT_CURSOR_LABELS[project.slug] || "One of my full-stack projects."}
      className="space-y-2.5"
    >
      {/* Project Title & Direct Links */}
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-serif text-[17px] sm:text-[18px] text-zinc-900 dark:text-[#eae6df] font-medium tracking-tight">
          {project.title}
        </h3>

        <MinimalProjectActions project={project} />
      </div>

      {/* Short Description */}
      <p className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[26px]">
        {project.overview}
      </p>

      {/* Key Highlights */}
      <ul className="font-serif text-[14px] sm:text-[15px] text-zinc-600 dark:text-[#beb9ad]/90 leading-relaxed space-y-1 list-disc list-inside pl-1">
        {highlights.map((highlight, idx) => (
          <li key={idx}>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* Tech Stack Summary */}
      <p className="font-mono text-xs text-zinc-500 dark:text-[#827d73] pt-0.5">
        {techList}
      </p>
    </article>
  );
}

/**
 * MinimalProjects
 *
 * Selected work presented in an old editorial, text-first format:
 * - Shows 2 featured projects initially with an inline View More toggle
 * - Roman serif headings with italic section titles
 * - Quiet external links directly to Live and GitHub repositories
 */
export function MinimalProjects() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  const targetSlugs = ["audit-web", "mkb-ridertrack", "naphix-resume", "assetlink"];
  const projects = targetSlugs
    .map((slug) => fullProjects.find((p) => p.slug === slug))
    .filter((p): p is FullProjectItem => Boolean(p));

  const visibleProjects = projects.slice(0, INITIAL_PROJECTS_COUNT);
  const extraProjects = projects.slice(INITIAL_PROJECTS_COUNT);

  return (
    <TooltipPrimitive.Provider delayDuration={100} skipDelayDuration={150}>
      <section data-guide="projects" data-creative-note="projects" className="space-y-6 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          Selected Work
        </h2>

        <div className="space-y-8">
          {visibleProjects.map((project) => (
            <MinimalProjectArticle key={project.slug} project={project} />
          ))}

          <AnimatePresence initial={false}>
            {expanded && extraProjects.length > 0 && (
              <motion.div
                id="minimal-projects-more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <div className="space-y-8">
                  {extraProjects.map((project) => (
                    <MinimalProjectArticle key={project.slug} project={project} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {extraProjects.length > 0 && (
          <div>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="minimal-projects-more"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[36px] font-serif italic text-[14px] sm:text-[15px] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors cursor-pointer"
            >
              <span>
                {expanded ? "Show less" : `View more (${extraProjects.length})`}
              </span>
              <span aria-hidden="true" className="not-italic font-mono text-xs">
                {expanded ? "↑" : "↓"}
              </span>
            </button>
          </div>
        )}
      </section>
    </TooltipPrimitive.Provider>
  );
}

export default MinimalProjects;
