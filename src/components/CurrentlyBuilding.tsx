"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { currentBuild, getProjectBySlug } from "@/lib/data";
import { TechIcon } from "./TechIcon";
import { useUISound } from "@/context/SoundContext";
import {
  sectionContainerVariants,
  sectionLabelVariants,
  sectionLineVariants,
  contentBlockVariants,
} from "@/lib/motion";

export function CurrentlyBuilding() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  if (!currentBuild || !currentBuild.title) return null;

  const referencedProject = currentBuild.projectSlug
    ? getProjectBySlug(currentBuild.projectSlug)
    : undefined;

  const statusLabel =
    currentBuild.status === "improving"
      ? "IMPROVING"
      : currentBuild.status === "experimenting"
      ? "EXPERIMENTING"
      : "BUILDING";

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-4 select-none mb-16"
      aria-label="Currently Building"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <motion.span
            variants={shouldReduceMotion ? undefined : sectionLabelVariants}
            className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold"
          >
            &lt;CURRENTLY-BUILDING/&gt;
          </motion.span>
          {currentBuild.updatedAt && (
            <motion.span
              variants={shouldReduceMotion ? undefined : contentBlockVariants}
              className="font-mono text-[11px] text-muted-foreground"
            >
              {currentBuild.updatedAt}
            </motion.span>
          )}
        </div>
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionLineVariants}
          className="h-[1px] w-full bg-border-hairline/40 origin-left"
        />
      </div>

      {/* Live Development Note Container */}
      <motion.div
        variants={shouldReduceMotion ? undefined : contentBlockVariants}
        className="p-4 sm:p-5 rounded-lg bg-surface/30 border border-border-hairline space-y-3.5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Living status breathing dot with subtle ring */}
          <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
            <span className="animate-status-ring absolute inset-0 rounded-full bg-emerald-400/50" />
            <span className="animate-status-breathe relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider leading-none">
            {statusLabel}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-sans text-sm sm:text-base font-semibold text-ink tracking-tight">
            {currentBuild.title}
          </h3>
          <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
            {currentBuild.description}
          </p>
        </div>

        {/* Technologies and Action Link */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          {currentBuild.technologies && currentBuild.technologies.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5">
              {currentBuild.technologies.map((tech) => (
                <Link
                  key={tech}
                  href={`/tech-stack?tech=${encodeURIComponent(tech.toLowerCase())}`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-muted-subtle border border-border-hairline text-muted-foreground hover:text-ink hover:border-border-hairline text-[11px] font-sans font-medium transition-colors"
                >
                  <TechIcon
                    name={tech}
                    className="w-3 h-3 flex-shrink-0 text-muted-foreground"
                  />
                  <span>{tech}</span>
                </Link>
              ))}
            </div>
          )}

          {(referencedProject || currentBuild.href) && (
            <Link
              href={
                referencedProject
                  ? `/projects/${referencedProject.slug}`
                  : currentBuild.href!
              }
              onMouseEnter={playHover}
              onClick={playClick}
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-ink transition-colors group ml-auto"
            >
              <span>View {referencedProject ? "project" : "details"}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default CurrentlyBuilding;
