"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fullProjects } from "@/lib/data";
import { TechIcon } from "@/components/TechIcon";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { ProjectMedia } from "@/components/ProjectMedia";
import { useUISound } from "@/context/SoundContext";

export function ProjectsPageClient() {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none">
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Projects
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Selected software engineering, full-stack, and mobile applications"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline">
            {fullProjects.length} builds
          </span>
        </div>
      </div>

      {/* 2-Column Responsive CAD Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fullProjects.map((project) => (
          <article
            key={project.slug}
            className="cad-project-card group relative flex flex-col justify-between"
          >
            {/* Full Card Clickable Link to Detail Page */}
            <Link
              href={`/projects/${project.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="absolute inset-0 z-10 cursor-pointer rounded-[3px]"
              aria-label={`View details for ${project.title}`}
            />

            <div>
              {/* CAD Corner Drafting Reticles */}
              <div className="cad-reticle cad-reticle--tl pointer-events-none" />
              <div className="cad-reticle cad-reticle--tr pointer-events-none" />
              <div className="cad-reticle cad-reticle--br pointer-events-none" />
              <div className="cad-reticle cad-reticle--bl pointer-events-none" />

              {/* 16:9 Thumbnail with Drafting Reveal, Hover Preview, & Pointer Depth */}
              <ProjectMedia
                src={project.image}
                previewSrc={
                  project.designScreens && project.designScreens.length > 1
                    ? project.designScreens[1]
                    : project.gallery?.[0]
                }
                alt={project.title}
                sizes="(max-width: 640px) 100vw, 360px"
                className="mb-3"
                category={project.category}
                badge={
                  project.status && (
                    <ProjectStatusBadge
                      status={project.status}
                      size="sm"
                      className="bg-page/90 backdrop-blur-sm shadow-sm"
                    />
                  )
                }
              />

              {/* Title & Metadata */}
              <div className="space-y-2 px-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors duration-150">
                    {project.title}
                  </h2>
                  <span className="font-mono text-[11px] text-muted-foreground flex-shrink-0">
                    {project.year}
                  </span>
                </div>

                <p className="font-mono text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {project.overview}
                </p>

                {/* Tech Stack Pills with TechIcon */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground bg-muted-subtle px-2 py-0.5 rounded-[4px] border border-border-hairline"
                    >
                      <TechIcon name={tag} className="w-3 h-3 text-muted-foreground" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Links (Higher z-index so clicking them opens external URL and does not trigger card route) */}
            <div className="flex items-center gap-2 pt-3 mt-4 border-t border-border-hairline/50 px-1 relative z-20">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn gap-1.5 text-[11px]"
                >
                  <ExternalLink className="w-3 h-3 opacity-70" />
                  <span>Live Demo</span>
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactile-btn gap-1.5 text-[11px]"
                >
                  <svg className="w-3 h-3 fill-current opacity-70" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Source</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPageClient;
