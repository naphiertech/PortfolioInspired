"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, GitCommit, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { currentBuild, getProjectBySlug } from "@/lib/data";
import { TechIcon } from "./TechIcon";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";
import { formatRelativeTime } from "@/lib/dateUtils";
import {
  sectionContainerVariants,
  staggeredGridVariants,
  gridItemVariants,
} from "@/lib/motion";
import type { GitHubActivityData } from "@/app/api/github-activity/route";

/**
 * NowSection
 *
 * High-density unified section combining "Currently Building" and "Latest Activity".
 * Provides an instant real-time snapshot of active focus and recent development work.
 */
export function NowSection() {
  const [activity, setActivity] = useState<GitHubActivityData | null>(null);
  const [mounted, setMounted] = useState(false);
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function fetchActivity() {
      try {
        const res = await fetch("/api/github-activity");
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setActivity(json.data);
        }
      } catch {
        // Silently omit if offline or network unavailable
      }
    }

    fetchActivity();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusLabel =
    currentBuild.status === "improving"
      ? "IMPROVING"
      : currentBuild.status === "experimenting"
      ? "EXPERIMENTING"
      : "BUILDING";

  const referencedProject = currentBuild.projectSlug
    ? getProjectBySlug(currentBuild.projectSlug)
    : undefined;

  const displayTime =
    activity && mounted
      ? formatRelativeTime(activity.pushedAt)
      : activity?.formattedDate || "";

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-4 select-none mb-16"
      aria-label="Now and Activity"
    >
      {/* Section Header */}
      <SectionHeader
        label="NOW"
        description="Active product engineering and recent development activity."
        className="mb-4 pb-2 border-b border-border-hairline/40"
      />

      {/* 2-Column Compact Grid */}
      <motion.div
        variants={shouldReduceMotion ? undefined : staggeredGridVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Card 1: Currently Building */}
        <motion.div
          variants={shouldReduceMotion ? undefined : gridItemVariants}
          className="p-4 sm:p-4.5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/50 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
        >
          <div className="space-y-2">
            {/* Header: Status Tag */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold tracking-wider">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0 items-center justify-center">
                  <span className="animate-status-ring absolute inset-0 rounded-full bg-emerald-400/50" />
                  <span className="animate-status-breathe relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>{statusLabel}</span>
              </div>

              {currentBuild.updatedAt && (
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  {currentBuild.updatedAt}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-1">
                {currentBuild.title}
              </h3>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {currentBuild.description}
              </p>
            </div>
          </div>

          {/* Technologies & Link */}
          <div className="pt-2 border-t border-border-hairline/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentBuild.technologies?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted-subtle text-muted-foreground text-[10px] font-sans font-medium"
                >
                  <TechIcon name={tech} className="w-2.5 h-2.5 flex-shrink-0" />
                  <span>{tech}</span>
                </span>
              ))}
            </div>

            {referencedProject && (
              <Link
                href={`/projects/${referencedProject.slug}`}
                onMouseEnter={playHover}
                onClick={playClick}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:underline flex-shrink-0"
              >
                <span>View project</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Card 2: Latest Activity */}
        {activity ? (
          <motion.div
            variants={shouldReduceMotion ? undefined : gridItemVariants}
            className="p-4 sm:p-4.5 rounded-xl bg-surface/30 border border-border-hairline hover:bg-surface/50 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
          >
            <div className="space-y-2">
              {/* Header: Git Activity Tag & Relative Time */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-semibold tracking-wider">
                  <GitCommit className="w-3 h-3" />
                  <span>LATEST ACTIVITY</span>
                </div>

                <span className="font-mono text-[10px] text-muted-foreground/60">
                  <time dateTime={activity.pushedAt}>{displayTime}</time>
                </span>
              </div>

              {/* Repo Title & Description */}
              <div className="space-y-1">
                <h3 className="font-sans text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-1">
                  {activity.repoTitle}
                </h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {activity.description || "Active repository development"}
                </p>
              </div>
            </div>

            {/* Bottom Meta & Repo Link */}
            <div className="pt-2 border-t border-border-hairline/30 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-muted-foreground/70 truncate max-w-[160px]">
                {activity.rawRepoName}
              </span>

              <Link
                href={activity.href}
                target={activity.isProject ? undefined : "_blank"}
                rel={activity.isProject ? undefined : "noopener noreferrer"}
                onMouseEnter={playHover}
                onClick={playClick}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:underline flex-shrink-0"
              >
                <span>{activity.isProject ? "View project" : "View repository"}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Fallback if offline/loading */
          <motion.div
            variants={shouldReduceMotion ? undefined : gridItemVariants}
            className="p-4 sm:p-4.5 rounded-xl bg-surface/30 border border-border-hairline flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface border border-border-hairline text-muted-foreground font-mono text-[10px] w-fit">
              <Sparkles className="w-3 h-3" />
              <span>ACTIVE DEV</span>
            </div>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Actively developing full-stack applications and open-source tooling.
            </p>
            <div className="pt-2 border-t border-border-hairline/30">
              <Link
                href="/projects"
                className="font-mono text-[11px] text-brand hover:underline inline-flex items-center gap-1"
              >
                <span>Browse all projects</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}

export default NowSection;
