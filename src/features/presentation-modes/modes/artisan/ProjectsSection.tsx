"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuExternalLink,
  LuX,
  LuCheck,
  LuLayers,
  LuCpu,
  LuArrowUpRight,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import { fullProjects, FullProjectItem } from "@/lib/data";
import { MacbookPro } from "@/components/ui/macbook-pro";

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<FullProjectItem | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const activeProject = fullProjects[activeIndex] || fullProjects[0];

  // Lock body scroll and listen for Escape key when project modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedProject(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProject]);

  const openProjectModal = (proj: FullProjectItem) => {
    setSelectedProject(proj);
    setActiveImage(proj.image);
  };

  return (
    <div className="w-full flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
      {/* 1. Page Header */}
      <div className="space-y-3 text-center max-w-xl px-4 pb-6">
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground">
          Selected Projects
        </h2>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed">
          Production systems, client platforms, and privacy-first digital tools engineered with modern TypeScript and React.
        </p>
      </div>

      {/* 2. MacBook Pro Stage */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div
          onClick={() => openProjectModal(activeProject)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openProjectModal(activeProject);
            }
          }}
          aria-label={`Inspect ${activeProject.title} case study`}
          className="group relative w-full max-w-[540px] flex flex-col items-center cursor-pointer select-none focus:outline-none"
        >
          <MacbookPro
            src={activeProject.image}
            className="w-full h-auto text-neutral-950 drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_45px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out group-hover:scale-[1.015]"
          />
        </div>

        {/* Active Project Caption & Actions under MacBook */}
        <div className="w-full pt-4 pb-6 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {activeProject.category} • {activeProject.year}
              </span>
            </div>
            <h3 className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {activeProject.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed line-clamp-1">
              {activeProject.overview}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeProject.live && (
              <a
                href={activeProject.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border border-black/12 dark:border-white/10 text-foreground/85 hover:text-foreground hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <span>Live Site</span>
                <LuExternalLink className="size-3" />
              </a>
            )}
            <button
              type="button"
              onClick={() => openProjectModal(activeProject)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Case Study</span>
              <LuArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Project Titles Directory Below MacBook */}
      <section className="w-full max-w-2xl px-2 pt-2">
        <div className="flex items-center justify-between pb-2.5">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Project Index
          </span>
          <span className="font-sans text-[11px] text-muted-foreground">
            Select or hover to preview
          </span>
        </div>

        <div className="divide-y divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
          {fullProjects.map((project, idx) => {
            const indexStr = `0${idx + 1}`;
            const isActive = idx === activeIndex;

            return (
              <div
                key={project.slug}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  if (isActive) {
                    openProjectModal(project);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isActive) {
                      openProjectModal(project);
                    } else {
                      setActiveIndex(idx);
                    }
                  }
                }}
                className={`group flex items-center justify-between gap-4 py-3.5 px-3 transition-colors cursor-pointer select-none ${
                  isActive
                    ? "bg-black/[0.03] dark:bg-white/[0.04]"
                    : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`font-mono text-base sm:text-lg tabular-nums transition-colors ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-foreground/35 group-hover:text-foreground/70"
                    }`}
                  >
                    {indexStr}
                  </span>

                  <span
                    className={`font-mono text-lg sm:text-xl tracking-tight truncate transition-colors ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-foreground/75 group-hover:text-foreground"
                    }`}
                  >
                    {project.title}
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block font-sans text-xs text-muted-foreground">
                    {project.category}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground/70 tabular-nums">
                    {project.year}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProjectModal(project);
                    }}
                    className="inline-flex items-center gap-1 font-sans text-xs font-medium text-foreground/70 hover:text-foreground pl-1 cursor-pointer"
                    aria-label={`Open ${project.title} case study`}
                  >
                    <LuArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Full Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto z-10 flex flex-col"
            >
              {/* Sticky Top Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-background/90 backdrop-blur-md border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-muted text-foreground/80 border border-black/10 dark:border-white/10">
                    {selectedProject.year}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {selectedProject.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <LuX className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 space-y-8">
                {/* Header Title & Subtext */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.role && (
                    <p className="font-mono text-xs sm:text-sm text-muted-foreground">
                      {selectedProject.role}
                      {selectedProject.client ? ` • ${selectedProject.client}` : ""}
                    </p>
                  )}
                </div>

                {/* Primary Preview Screenshot */}
                <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-muted/40">
                  <Image
                    src={activeImage || selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Gallery Thumbnails (if any) */}
                {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      Gallery Screens:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveImage(selectedProject.image)}
                        className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                          activeImage === selectedProject.image
                            ? "border-foreground"
                            : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={selectedProject.image}
                          alt="Cover"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                      {selectedProject.gallery.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImage(img)}
                          className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                            activeImage === img
                              ? "border-foreground"
                              : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Gallery screenshot ${i + 1}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description Narrative */}
                <div className="space-y-3">
                  <h4 className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
                    Overview & Architecture
                  </h4>
                  <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
                    {selectedProject.fullDescription || selectedProject.overview}
                  </p>
                </div>

                {/* Features Section */}
                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
                      <LuCheck className="size-4 text-emerald-500" />
                      <span>Key Capabilities</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProject.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs sm:text-sm text-foreground/85 p-2 rounded-lg bg-foreground/[0.02] border border-black/10 dark:border-white/10"
                        >
                          <span className="font-mono text-xs text-muted-foreground pt-0.5">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Decisions */}
                {selectedProject.technicalDecisions && selectedProject.technicalDecisions.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
                      <LuCpu className="size-4 text-foreground/70" />
                      <span>Technical Decisions</span>
                    </div>
                    <div className="space-y-2.5">
                      {selectedProject.technicalDecisions.map((dec, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-muted/40 border border-black/10 dark:border-white/10 space-y-1"
                        >
                          <p className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                            {dec.title}
                          </p>
                          <p className="font-sans text-xs sm:text-sm text-foreground/75 leading-relaxed">
                            {dec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
                    <LuLayers className="size-4 text-foreground/70" />
                    <span>Tech Stack & Libraries</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs px-2.5 py-1 rounded-md bg-muted/80 text-foreground/80 border border-black/10 dark:border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    {selectedProject.live && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-background bg-foreground hover:opacity-90 px-4 py-2.5 rounded-xl transition-opacity cursor-pointer"
                      >
                        <span>Visit Live Platform</span>
                        <LuExternalLink className="size-4" />
                      </a>
                    )}
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-foreground hover:bg-muted/80 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 transition-colors cursor-pointer"
                      >
                        <FaGithub className="size-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Close Window [Esc]
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectsSection;
