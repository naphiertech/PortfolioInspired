"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { FullProjectItem } from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

interface FocusProjectDetailPageProps {
  project: FullProjectItem;
  prevProject?: FullProjectItem;
  nextProject?: FullProjectItem;
}

/**
 * FocusProjectDetailPage
 *
 * Focus Mode presentation for /projects/[slug].
 * Direct engineering overview with problem statement, technical decisions, and features.
 */
export function FocusProjectDetailPage({
  project,
  prevProject,
  nextProject,
}: FocusProjectDetailPageProps) {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 mb-6">
        <Link
          href="/projects"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / projects</span>
        </Link>

        {/* Project Eyebrow */}
        <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none">
          <span className="tracking-wider text-muted-foreground/80 font-medium">
            [ PROJECT // {project.slug.toUpperCase()} ]
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
            CASE STUDY
          </span>
        </div>

        {/* Title & Metadata Strip */}
        <div className="space-y-2 pt-1">
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {project.title}
            </h1>

            {project.status && (
              <ProjectStatusBadge status={project.status} size="md" />
            )}
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>{project.category}</span>
            <span className="text-border">·</span>
            <span>{project.year}</span>
            {project.role && (
              <>
                <span className="text-border">·</span>
                <span>{project.role}</span>
              </>
            )}
            {project.client && (
              <>
                <span className="text-border">·</span>
                <span>{project.client}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <EditorialDivider className="mb-8" />

      {/* Structured Technical Sections */}
      <div className="space-y-8">
        {/* 01 // OVERVIEW */}
        <section aria-label="Project overview">
          <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-2.5">
            01 // OVERVIEW & PURPOSE
          </div>
          <p className="text-sm sm:text-[15px] text-ink/85 font-sans leading-relaxed">
            {project.fullDescription || project.overview}
          </p>
        </section>

        <EditorialDivider />

        {/* 02 // WHY THESE CHOICES? */}
        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <section aria-label="Technical choices">
            <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3.5">
              02 // WHY THESE CHOICES?
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.technicalDecisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-md border border-border-hairline bg-surface/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-brand uppercase tracking-wider mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>CHOICE {String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="font-sans font-bold text-xs sm:text-[13px] text-ink leading-snug">
                      {decision.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] text-ink/80 leading-relaxed mt-1.5">
                      {decision.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <EditorialDivider />
        )}

        {/* 03 // TECH STACK */}
        <section aria-label="Technology stack">
          <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">
            03 // TECH STACK
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface/50 border border-border-hairline text-xs font-mono text-ink/90 select-none"
              >
                <TechIcon name={tech} className="w-3.5 h-3.5 text-muted-foreground/80 flex-shrink-0" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </section>

        <EditorialDivider />

        {/* 04 // KEY FEATURES */}
        {project.features && project.features.length > 0 && (
          <section aria-label="Key features">
            <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">
              04 // KEY FEATURES
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed flex items-start gap-2 p-2.5 rounded bg-surface/20 border border-border-hairline"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.features && project.features.length > 0 && <EditorialDivider />}

        {/* 05 // LINKS */}
        <section aria-label="Links and source code">
          <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">
            05 // LINKS & REPOSITORY
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-ink text-page font-medium font-sans text-xs hover:opacity-90 active:scale-[0.98] transition-all"
              >
                <span>Live demo</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-surface/50 border border-border-hairline text-ink font-medium font-sans text-xs hover:bg-surface hover:border-border transition-colors"
              >
                <span>GitHub repository</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
              </a>
            )}
          </div>
        </section>
      </div>

      <EditorialDivider className="my-10" />

      {/* Prev / Next Pagination */}
      <nav aria-label="Project Navigation" className="flex items-center justify-between gap-4 font-mono text-xs">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{prevProject.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            href={`/projects/${nextProject.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors group ml-auto"
          >
            <span className="truncate max-w-[140px] sm:max-w-xs">{nextProject.title}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </nav>
    </div>
  );
}

export default FocusProjectDetailPage;
