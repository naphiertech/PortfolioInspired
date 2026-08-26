"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, GitCommit } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useUISound } from "@/context/SoundContext";
import { formatRelativeTime } from "@/lib/dateUtils";
import {
  sectionContainerVariants,
  sectionLabelVariants,
  sectionLineVariants,
  contentBlockVariants,
} from "@/lib/motion";
import type { GitHubActivityData } from "@/app/api/github-activity/route";

export function LatestActivity() {
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

  // Gracefully hide if data is unavailable (zero layout shift or error noise)
  if (!activity) return null;

  const displayTime = mounted
    ? formatRelativeTime(activity.pushedAt)
    : activity.formattedDate;

  return (
    <motion.section
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-4 select-none mb-16"
      aria-label="Latest Development Activity"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <motion.span
            variants={shouldReduceMotion ? undefined : sectionLabelVariants}
            className="font-caps text-xs text-muted-foreground uppercase tracking-wider font-mono font-semibold"
          >
            &lt;LATEST-ACTIVITY/&gt;
          </motion.span>
          <motion.span
            variants={shouldReduceMotion ? undefined : contentBlockVariants}
            className="font-mono text-[11px] text-muted-foreground"
          >
            <time dateTime={activity.pushedAt}>{displayTime}</time>
          </motion.span>
        </div>
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionLineVariants}
          className="h-[1px] w-full bg-border-hairline/40 origin-left"
        />
      </div>

      {/* Activity Card */}
      <motion.div variants={shouldReduceMotion ? undefined : contentBlockVariants}>
        <Link
          href={activity.href}
          target={activity.isProject ? undefined : "_blank"}
          rel={activity.isProject ? undefined : "noopener noreferrer"}
          onMouseEnter={playHover}
          onClick={playClick}
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg bg-surface/30 border border-border-hairline hover:bg-surface/60 hover:border-border-hairline/80 transition-all duration-150 group cursor-pointer"
          aria-label={`Latest development activity: Updated ${activity.repoTitle}`}
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            {/* Git commit icon with subtle status dot */}
            <div className="w-8 h-8 rounded-md bg-surface border border-border-hairline flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-ink transition-colors">
              <GitCommit className="w-4 h-4" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-ink truncate group-hover:text-brand transition-colors">
                  Updated {activity.repoTitle}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground bg-muted-subtle px-1.5 py-0.5 rounded border border-border-hairline/50 hidden sm:inline-block">
                  {activity.isProject ? "Portfolio Project" : "GitHub Repo"}
                </span>
              </div>
              <p className="font-sans text-[11px] sm:text-xs text-muted-foreground truncate max-w-md">
                {activity.description || `Recent code push to ${activity.rawRepoName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-ink transition-colors flex-shrink-0">
            <span className="hidden sm:inline">
              {activity.isProject ? "View project" : "GitHub"}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      </motion.div>
    </motion.section>
  );
}

export default LatestActivity;
