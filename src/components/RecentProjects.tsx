"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fullProjects } from "@/lib/data";
import { TechIcon } from "./TechIcon";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";

export function RecentProjects() {
  const featuredProjects = fullProjects.slice(0, 4);
  const { playHover, playClick } = useUISound();

  return (
    <section className="w-full space-y-5 select-none mb-16" aria-label="Selected Projects">
      {/* Section Header */}
      <SectionHeader
        label="SELECTED-PROJECTS"
        description="Selected software engineering, full-stack, and mobile applications."
        actionHref="/projects"
        actionLabel="all projects"
        className="mb-5 pb-2 border-b border-border-hairline/40"
      />

      {/* 2-Column Responsive CAD Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {featuredProjects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="cad-project-card group block cursor-pointer"
          >
            {/* CAD Drafting Reticles (Four corner L-brackets revealing on hover) */}
            <div className="cad-reticle cad-reticle--tl" />
            <div className="cad-reticle cad-reticle--tr" />
            <div className="cad-reticle cad-reticle--bl" />
            <div className="cad-reticle cad-reticle--br" />

            {/* Inner Project Container */}
            <div className="p-3 sm:p-3.5 space-y-3">
              {/* Cover Image Container (16:9 ratio) */}
              <div className="relative aspect-video w-full rounded-[4px] overflow-hidden bg-surface border border-border-hairline transition-colors">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Title, Category & Action Link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                </div>
                <p className="font-sans text-xs text-muted-foreground line-clamp-1">
                  {project.category}
                </p>
              </div>

              {/* Vector Icon Tech Stack Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {project.tags.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    onMouseEnter={playHover}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-muted-subtle border border-border-hairline text-muted-foreground text-[11px] font-sans font-medium"
                  >
                    <TechIcon name={tech} className="w-3 h-3 flex-shrink-0" />
                    <span>{tech}</span>
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="text-[10px] font-mono text-muted-foreground px-1">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;
