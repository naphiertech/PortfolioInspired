import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { fullProjects, FullProjectItem } from "@/lib/data";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { TechIcon } from "@/components/TechIcon";

export function FocusSelectedWork() {
  // Key projects to highlight in Focus Mode
  const selectedSlugs = ["mkb-ridertrack", "naphix-resume", "assetlink", "moviestream"];
  const projects: FullProjectItem[] = selectedSlugs
    .map((slug) => fullProjects.find((p) => p.slug === slug))
    .filter((p): p is FullProjectItem => Boolean(p));

  return (
    <section aria-label="Selected projects" className="w-full">
      {/* Section Index Header */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none mb-4">
        <span className="tracking-wider font-medium">
          [ 02 // PROJECTS ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          SELECTED PROJECTS ({projects.length})
        </span>
      </div>

      {/* Alternating Editorial Project Showcase */}
      <div className="divide-y divide-border-hairline">
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          const displayTech = project.techStack?.slice(0, 5) || project.tags?.slice(0, 5) || [];
          const description = project.focusDescription || project.overview;
          const highlight = project.focusHighlight;

          return (
            <article
              key={project.slug}
              className="py-10 lg:py-12 first:pt-4 last:pb-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
            >
              {/* Project Image: Order-1 on mobile, alternates on desktop */}
              <div
                className={`w-full min-w-0 order-1 lg:col-span-6 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="block relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-border-hairline bg-surface/50 dark:bg-surface/30 shadow-xs group/img"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="object-cover object-top transition-transform duration-300 ease-out group-hover/img:scale-[1.02]"
                  />
                </Link>
              </div>

              {/* Project Information: Order-2 on mobile, alternates on desktop */}
              <div
                className={`w-full min-w-0 flex flex-col justify-center order-2 lg:col-span-6 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                {/* Title, Status & Year */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-sans font-semibold text-lg sm:text-xl text-ink tracking-tight">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-brand transition-colors inline-flex items-center gap-1.5 group/title"
                    >
                      <span>{project.title}</span>
                    </Link>
                  </h3>

                  <span className="text-muted-foreground/40 font-sans text-sm select-none" aria-hidden="true">
                    ·
                  </span>

                  {project.status && (
                    <ProjectStatusBadge status={project.status} size="sm" />
                  )}

                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
                    {project.year}
                  </span>
                </div>

                {/* Category */}
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-2.5">
                  {project.category}
                </p>

                {/* Concise 1-2 sentence description */}
                <p className="text-sm sm:text-[14.5px] text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed mb-3.5">
                  {description}
                </p>

                {/* Short takeaway highlight pill */}
                {highlight && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/60 border border-border-hairline text-xs font-sans text-foreground/90 self-start select-none">
                    <span>{highlight}</span>
                  </div>
                )}

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

                {/* Direct Action Links */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs pt-0.5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface/60 border border-border-hairline text-ink hover:bg-surface hover:border-border transition-colors font-medium group/btn"
                  >
                    <span>Case study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/70 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
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
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Catalog Navigation Link */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-brand transition-colors"
        >
          <span>View all projects</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default FocusSelectedWork;
