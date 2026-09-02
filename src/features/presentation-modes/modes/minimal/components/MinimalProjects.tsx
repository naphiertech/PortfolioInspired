"use client";

import React from "react";
import { fullProjects } from "@/lib/data";

/**
 * MinimalProjects
 *
 * Selected work presented in an old editorial, text-first format:
 * - Roman serif headings with italic section titles
 * - Quiet external links directly to Live and GitHub repositories
 * - Bulleted feature highlights and concise tech stack labels
 * - No heavy cards, screenshots, or internal route links
 */
export function MinimalProjects() {
  // Select top 3 projects: MKBRiderTrack, Naphix Resume, AssetLink
  const targetSlugs = ["mkb-ridertrack", "naphix-resume", "assetlink"];
  const projects = targetSlugs
    .map((slug) => fullProjects.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="space-y-6 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
      <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
        Selected Work
      </h2>

      <div className="space-y-8">
        {projects.map((project) => {
          if (!project) return null;

          // Select top 3 core features
          const highlights = project.features?.slice(0, 3) || [];
          const techList = project.tags.slice(0, 5).join(" · ");

          return (
            <article key={project.slug} className="space-y-2.5">
              {/* Project Title & Direct Links */}
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h3 className="font-serif text-[17px] sm:text-[18px] text-zinc-900 dark:text-[#eae6df] font-medium tracking-tight">
                  {project.title}
                </h3>

                <div className="flex items-center gap-3 font-mono text-xs text-zinc-600 dark:text-[#9e998e]">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
                    >
                      Live ↗
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
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
        })}
      </div>
    </section>
  );
}

export default MinimalProjects;
