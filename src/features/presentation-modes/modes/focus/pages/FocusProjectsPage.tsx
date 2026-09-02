"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { fullProjects } from "@/lib/data";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

/**
 * FocusProjectsPage
 *
 * Focus Mode presentation for /projects.
 * Compact project index presenting web applications and technical choices.
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

      <EditorialDivider className="mb-6" />

      {/* Structured Systems Ledger */}
      <div className="divide-y divide-border-divider">
        {fullProjects.map((project, idx) => {
          const indexString = String(idx + 1).padStart(2, "0");
          const primaryDecision = project.technicalDecisions?.[0];
          const displayTech = project.techStack?.slice(0, 7) || project.tags?.slice(0, 7) || [];

          return (
            <article
              key={project.slug}
              className="py-6 first:pt-4.5 last:pb-4.5 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 lg:gap-8 items-start"
            >
              {/* Left Column: Index, Title, Overview, Tech & Links */}
              <div className="min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {indexString}.
                    </span>

                    <h2 className="font-sans font-semibold text-base sm:text-lg text-ink tracking-tight">
                      <Link
                        href={`/projects/${project.slug}`}
                        onMouseEnter={playHover}
                        onClick={playClick}
                        className="hover:text-brand transition-colors inline-flex items-center gap-1.5 group/title"
                      >
                        <span>{project.title}</span>
                        <span className="text-muted-foreground/40 group-hover/title:text-brand font-mono text-xs transition-colors">
                          →
                        </span>
                      </Link>
                    </h2>

                    {project.status && (
                      <ProjectStatusBadge status={project.status} size="sm" />
                    )}

                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
                      {project.year}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    {project.category} {project.role ? `· ${project.role}` : ""}
                  </p>

                  <p className="text-[14px] sm:text-[15px] text-zinc-700 dark:text-zinc-300 font-sans leading-[1.6]">
                    {project.overview}
                  </p>

                  {/* Technology Badges */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    {displayTech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-surface/60 border border-border-hairline text-[11.5px] font-mono text-zinc-600 dark:text-zinc-400 select-none"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <Link
                    href={`/projects/${project.slug}`}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/50 border border-border-hairline text-ink hover:bg-surface hover:border-border transition-colors font-medium"
                  >
                    <span>Case study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/70" aria-hidden="true" />
                  </Link>

                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface border border-transparent hover:border-border-hairline transition-colors"
                    >
                      <span>Live demo</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-ink hover:bg-surface border border-transparent hover:border-border-hairline transition-colors"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Key Technical Decision */}
              <div className="min-w-0">
                {primaryDecision ? (
                  <div className="rounded-md border border-border-hairline bg-surface/30 p-4 font-sans text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-brand tracking-wider uppercase mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                      <span className="font-semibold">Why this choice?</span>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm text-ink font-semibold leading-snug">
                        {primaryDecision.title}
                      </h3>
                      <p className="text-[13.5px] sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-[1.55] mt-1.5">
                        {primaryDecision.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-border-hairline bg-surface/20 p-4 font-sans text-xs">
                    <p className="text-xs text-muted-foreground italic">
                      Architecture details available in case study.
                    </p>
                  </div>
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
