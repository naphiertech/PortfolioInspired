"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fullProjects } from "@/lib/data";
import { TechIcon } from "./TechIcon";
import { SectionHeader } from "./SectionHeader";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { ProjectMedia } from "./ProjectMedia";
import { useUISound } from "@/context/SoundContext";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
} from "@/lib/motion";

export function RecentProjects() {
  const featuredProjects = fullProjects.slice(0, 4);
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-5 select-none mb-16"
      aria-label="Selected Projects"
    >
      {/* Section Header */}
      <SectionHeader
        label="SELECTED-PROJECTS"
        description="Selected software engineering, full-stack, and mobile applications."
        actionHref="/projects"
        actionLabel="all projects"
        className="mb-5 pb-2 border-b border-border-hairline/40"
      />

      {/* 2-Column Responsive CAD Project Grid */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {featuredProjects.map((project) => (
          <motion.div
            key={project.slug}
            variants={shouldReduceMotion ? undefined : gridItemVariants}
          >
            <Link
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
                {/* Cover Image Container (16:9 ratio with drafting reveal, hover preview, & pointer depth) */}
                <ProjectMedia
                  src={project.image}
                  alt={project.title}
                  previewSrc={
                    project.designScreens && project.designScreens.length > 1
                      ? project.designScreens[1]
                      : project.gallery?.[0]
                  }
                  sizes="(max-width: 640px) 100vw, 50vw"
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
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default RecentProjects;
