"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowRight, Layers } from "lucide-react";
import { FullProjectItem } from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { ProjectMedia } from "@/components/ProjectMedia";
import { useUISound } from "@/context/SoundContext";

interface ProjectDetailClientProps {
  project: FullProjectItem;
  prevProject?: FullProjectItem;
  nextProject?: FullProjectItem;
}

export function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: ProjectDetailClientProps) {
  const { playHover, playClick } = useUISound();
  const narrative = project.fullDescription || project.overview;
  const galleryImages = (project.gallery || []).filter(
    (img) => img !== project.image
  );

  return (
    <div className="space-y-12 sm:space-y-14 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-4">
        <Link
          href="/projects"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span>cd .. / projects</span>
        </Link>

        <div className="space-y-2 pt-1">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;{project.slug}/&gt;
          </span>

          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {project.title}
            </h1>

            {project.status && (
              <ProjectStatusBadge status={project.status} size="md" />
            )}
          </div>

          {/* Project Metadata Details */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground pt-0.5">
            <span>{project.category}</span>
            <span className="text-border-hairline">•</span>
            <span>{project.year}</span>
            {project.role && (
              <>
                <span className="text-border-hairline">•</span>
                <span>{project.role}</span>
              </>
            )}
            {project.client && (
              <>
                <span className="text-border-hairline">•</span>
                <span>{project.client}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons (Live Demo & Source) */}
        {(project.live || project.github) && (
          <div className="flex items-center flex-wrap gap-2.5 pt-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn gap-1.5 h-8 px-3 rounded-md text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                <span>Live Demo</span>
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn gap-1.5 h-8 px-3 rounded-md text-xs"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current opacity-70"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Source Code</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Prominent Primary Cover Screenshot with Drafting Reveal & Subtle Depth */}
      <div className="cad-project-card group relative w-full aspect-video rounded-lg overflow-hidden bg-surface border border-border-hairline shadow-md">
        <div className="cad-reticle cad-reticle--tl" />
        <div className="cad-reticle cad-reticle--tr" />
        <div className="cad-reticle cad-reticle--br" />
        <div className="cad-reticle cad-reticle--bl" />
        <ProjectMedia
          src={project.image}
          alt={`${project.title} primary preview`}
          priority
          sizes="(max-width: 768px) 100vw, 700px"
          className="border-0 rounded-none"
        />
      </div>

      {/* Section: <about-project/> */}
      <section className="space-y-3 pt-2">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
          &lt;about-project/&gt;
        </span>
        <div className="font-sans text-[15px] text-muted-foreground leading-[26px] space-y-3">
          <p>{narrative}</p>
        </div>
      </section>

      {/* Section: <tech-stack/> */}
      <section className="space-y-3 pt-2">
        <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
          &lt;tech-stack/&gt;
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {project.techStack.map((tech) => (
            <Link
              key={tech}
              href={`/tech-stack?tech=${encodeURIComponent(tech.toLowerCase())}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="skill-pill cursor-pointer hover:border-border-hairline hover:text-ink transition-colors"
              title={`View projects using ${tech}`}
            >
              <TechIcon name={tech} className="w-3.5 h-3.5" />
              <span>{tech}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section: <key-features/> */}
      {project.features && project.features.length > 0 && (
        <section className="space-y-4 pt-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;key-features/&gt;
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-surface/30 border border-border-hairline font-sans text-xs sm:text-[13px] text-ink leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0 mt-1.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: <gallery/> (Responsive Screenshot Gallery) */}
      {galleryImages.length > 0 && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
              &lt;gallery/&gt;
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {galleryImages.length} additional screens
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map((screen, idx) => (
              <div
                key={idx}
                className="cad-project-card group relative aspect-video w-full rounded-md overflow-hidden bg-surface border border-border-hairline shadow-sm"
              >
                <div className="cad-reticle cad-reticle--tl" />
                <div className="cad-reticle cad-reticle--tr" />
                <div className="cad-reticle cad-reticle--br" />
                <div className="cad-reticle cad-reticle--bl" />
                <ProjectMedia
                  src={screen}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="border-0 rounded-none"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: <technical-decisions/> */}
      {project.technicalDecisions && project.technicalDecisions.length > 0 && (
        <section className="space-y-3.5 pt-2" aria-label="Technical Decisions">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;technical-decisions/&gt;
          </span>
          <div className="space-y-3">
            {project.technicalDecisions.map((decision, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-4.5 rounded-lg bg-surface/30 border border-border-hairline space-y-1.5 transition-colors"
              >
                <h3 className="font-sans text-sm sm:text-[14px] font-semibold text-ink leading-snug">
                  {decision.title}
                </h3>
                <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  {decision.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section: <what-i-learned/> */}
      {project.learnings && project.learnings.length > 0 && (
        <section className="space-y-3.5 pt-2" aria-label="What I Learned">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold block">
            &lt;what-i-learned/&gt;
          </span>
          <div className="space-y-3">
            {project.learnings.map((learning, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-lg bg-surface/30 border border-border-hairline transition-colors"
              >
                <span className="font-mono text-xs font-semibold text-brand/80 dark:text-brand/90 flex-shrink-0 mt-0.5 select-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm sm:text-[14px] font-semibold text-ink leading-snug">
                    {learning.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    {learning.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Navigation: Previous / All / Next Project */}
      <nav
        aria-label="Project Navigation"
        className="pt-6 border-t border-border-hairline/60 space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors duration-150 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <span className="text-muted-foreground/30 text-xs">
              First project
            </span>
          )}

          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-ink transition-colors duration-150 px-2.5 py-1 rounded bg-surface/40 border border-border-hairline"
          >
            <Layers className="w-3.5 h-3.5 opacity-60" />
            <span>All Projects</span>
          </Link>

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink transition-colors duration-150 group"
            >
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {nextProject.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <span className="text-muted-foreground/30 text-xs">
              Last project
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}

export default ProjectDetailClient;
