"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fullProjects } from "@/lib/data";
import { TechIcon } from "./TechIcon";

export function RecentProjects() {
  // Showcase top 4 key projects on the home page
  const featuredProjects = fullProjects.slice(0, 4);

  return (
    <section className="w-full space-y-4 select-none mb-14">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold">
            &lt;selected-projects/&gt;
          </span>
        </div>

        <Link
          href="/projects"
          className="font-mono text-xs text-muted-foreground hover:text-ink flex items-center gap-1 transition-colors duration-200 group"
        >
          <span>all projects</span>
          <span className="text-muted-foreground/60 group-hover:text-ink transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </Link>
      </div>

      {/* 2-Column Responsive CAD Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {featuredProjects.map((project) => {
          const targetHref = project.live || project.github || "/projects";
          const isExternal = !!(project.live || project.github);

          return (
            <a
              key={project.title}
              href={targetHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="cad-project-card group block"
            >
              {/* CAD Drafting Reticles (Four corner L-brackets revealing on hover) */}
              <div className="cad-reticle cad-reticle--tl" />
              <div className="cad-reticle cad-reticle--tr" />
              <div className="cad-reticle cad-reticle--br" />
              <div className="cad-reticle cad-reticle--bl" />

              {/* 16:9 Thumbnail with grayscale-to-color transition */}
              <div className="relative aspect-video w-full rounded-[3px] overflow-hidden bg-surface mb-3 border border-border-hairline/60">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover opacity-85 grayscale transition-all duration-250 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.02]"
                />
              </div>

              {/* Project Metadata */}
              <div className="space-y-1.5 px-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors duration-150 truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {project.year}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <p className="font-mono text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.overview}
                </p>

                {/* Tech tags with vector icons */}
                <div className="flex items-center flex-wrap gap-1.5 pt-2">
                  {project.tags.slice(0, 4).map((tag) => (
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
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default RecentProjects;
