"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { fullProjects } from "@/lib/data";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechIcon } from "@/components/TechIcon";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

/**
 * FocusProjectsPage
 *
 * Focus Mode presentation for /projects.
 * Browseable 2-column project gallery grid based on Reference Image 2.
 */
export function FocusProjectsPage() {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Section Eyebrow */}
      <div className="space-y-3 mb-6">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none">
          <span className="tracking-wider font-medium">
            [ 02 // PROJECTS ]
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
            PROJECTS ({fullProjects.length})
          </span>
        </div>

        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Projects
            </h1>
            <p className="font-mono text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
              Web applications, logistics tools, and developer platforms.
            </p>
          </div>
        </div>
      </div>

      <EditorialDivider className="mb-8" />

      {/* 2-Column Browseable Project Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fullProjects.map((project, idx) => {
          const displayTech =
            project.techStack?.slice(0, 5) || project.tags?.slice(0, 5) || [];
          const description = project.focusDescription || project.overview;

          return (
            <article
              key={project.slug}
              className="rounded-2xl border border-border-hairline bg-surface/30 p-4 sm:p-5 flex flex-col justify-between hover:border-border transition-all duration-200 group/card"
            >
              {/* Project Screenshot on top */}
              <div>
                <Link
                  href={`/projects/${project.slug}`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="block relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border-hairline/80 group-hover/img:border-border bg-muted/20 mb-4 transition-colors duration-200 group/img"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    loading={idx < 2 ? "eager" : "lazy"}
                    priority={idx < 2}
                    className="object-cover object-top transition-[filter,opacity] duration-300 ease-out group-hover/img:brightness-[1.02] dark:group-hover/img:brightness-105"
                  />
                </Link>

                {/* Title Row: Title + Status + Year */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="font-sans font-semibold text-base sm:text-lg text-ink tracking-tight">
                    <Link
                      href={`/projects/${project.slug}`}
                      onMouseEnter={playHover}
                      onClick={playClick}
                      className="hover:text-brand transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h2>

                  {project.status && (
                    <ProjectStatusBadge status={project.status} size="sm" />
                  )}

                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
                    {project.year}
                  </span>
                </div>

                {/* Category */}
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                  {project.category}
                </p>

                {/* Short 1-2 sentence description */}
                <p className="text-[13.5px] sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mb-3.5">
                  {description}
                </p>

                {/* Technology Badges (Icons only) */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4" aria-label="Technologies used">
                  {displayTech.map((tech) => (
                    <span
                      key={tech}
                      title={tech}
                      aria-label={tech}
                      className="p-1.5 rounded-md bg-surface/60 border border-border-hairline text-zinc-500 dark:text-zinc-400 hover:text-ink hover:border-border transition-colors flex items-center justify-center group/icon"
                    >
                      <TechIcon name={tech} className="w-3.5 h-3.5 flex-shrink-0" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Action Links */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs mt-auto pt-2 border-t border-border-hairline/60">
                <Link
                  href={`/projects/${project.slug}`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface/60 border border-border-hairline text-ink hover:bg-surface hover:border-border transition-colors font-medium group/btn"
                >
                  <span>Case study</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-muted-foreground/70 group-hover/btn:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>

                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink transition-colors py-1"
                  >
                    <span>Live demo</span>
                    <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink transition-colors py-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default FocusProjectsPage;
