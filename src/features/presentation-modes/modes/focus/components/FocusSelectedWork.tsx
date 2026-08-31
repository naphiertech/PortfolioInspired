import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { fullProjects, FullProjectItem } from "@/lib/data";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";

export function FocusSelectedWork() {
  // Key projects to highlight in Focus Mode
  const selectedSlugs = ["mkb-ridertrack", "naphix-resume", "assetlink", "moviestream"];
  const projects: FullProjectItem[] = selectedSlugs
    .map((slug) => fullProjects.find((p) => p.slug === slug))
    .filter((p): p is FullProjectItem => Boolean(p));

  return (
    <section aria-label="Selected projects" className="w-full">
      {/* Section Index */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/70 select-none mb-3.5">
        <span className="tracking-wider text-muted-foreground/80 font-medium">
          [ 02 // PROJECTS ]
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
          SELECTED PROJECTS ({projects.length})
        </span>
      </div>

      {/* Structural Records List */}
      <div className="divide-y divide-border-divider border-y border-border-divider">
        {projects.map((project) => {
          const primaryDecision = project.technicalDecisions?.[0];
          const displayTech = project.techStack?.slice(0, 6) || project.tags?.slice(0, 6) || [];

          return (
            <article
              key={project.slug}
              className="py-6 first:pt-4.5 last:pb-4.5 grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 lg:gap-8 items-start"
            >
              {/* Left Column: Identity, Summary, Tech & Action Links */}
              <div className="w-full min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h3 className="font-sans font-bold text-base sm:text-lg text-ink tracking-tight">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="hover:text-brand transition-colors inline-flex items-center gap-1.5 group/title"
                      >
                        <span>{project.title}</span>
                        <span className="text-muted-foreground/40 group-hover/title:text-brand font-mono text-xs transition-colors">
                          →
                        </span>
                      </Link>
                    </h3>

                    {project.status && (
                      <ProjectStatusBadge status={project.status} size="sm" />
                    )}

                    <span className="font-mono text-xs text-muted-foreground/60 ml-auto">
                      {project.year}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-muted-foreground/80 mb-2">
                    {project.category}
                  </p>

                  <p className="text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed">
                    {project.overview}
                  </p>

                  {/* Technology Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {displayTech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-surface/50 border border-border-hairline text-[11px] font-mono text-muted-foreground select-none"
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
                      <span>GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Architectural Decision / Engineering Rationale */}
              <div className="w-full min-w-0">
                {primaryDecision ? (
                  <div className="rounded-md border border-border-hairline bg-surface/30 p-4 font-sans text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-brand tracking-wider uppercase mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                      <span className="font-semibold">Why this choice?</span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-[13px] text-ink font-bold leading-snug">
                        {primaryDecision.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-ink/80 font-sans leading-relaxed mt-1.5">
                        {primaryDecision.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-border-hairline bg-surface/20 p-4 font-sans text-xs">
                    <p className="text-xs text-muted-foreground italic">
                      Architecture documentation available in case study.
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Catalog Navigation Link */}
      <div className="mt-3.5 flex justify-end">
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
