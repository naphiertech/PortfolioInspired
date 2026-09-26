"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { FullProjectItem } from "@/lib/data";
import styles from "./MinimalActionPreview.module.css";

type PreviewType = "live" | "github" | null;

interface MinimalProjectActionsProps {
  project: FullProjectItem;
}

function parseGitHubUrl(url?: string): { owner: string; repo: string } {
  if (!url) return { owner: "naphiertech", repo: "repository" };
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    if (parts.length === 1) {
      return { owner: "naphiertech", repo: parts[0] };
    }
  } catch {
    const parts = url.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
    }
  }
  return { owner: "naphiertech", repo: "repository" };
}

function getDomain(url?: string): string {
  if (!url) return "Live Preview";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  React: "#61dafb",
  "React 18": "#61dafb",
  "Next.js": "#3b82f6",
  PostgreSQL: "#336791",
  Supabase: "#3ecf8e",
};

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function MinimalProjectActions({ project }: MinimalProjectActionsProps) {
  // Shared active preview state: only one preview can ever be active at a time
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [hasLiveInteracted, setHasLiveInteracted] = useState(false);

  // Single shared intent tracking ref and pending delay timer
  const intentRef = useRef<PreviewType>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const requestPreview = useCallback((type: "live" | "github") => {
    // 1. Clear any previous pending open timer immediately
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // 2. Record the new intended trigger immediately
    intentRef.current = type;
    if (type === "live") {
      setHasLiveInteracted(true);
    }

    // 3. Start the hover-intent delay (100ms) for only this trigger
    timerRef.current = setTimeout(() => {
      // 4. Before opening, verify that the same trigger is still the active intent
      if (intentRef.current === type) {
        setActivePreview(type);
      }
    }, 100);
  }, []);

  const cancelPreview = useCallback((type: "live" | "github") => {
    // Clear pending timer if it was scheduled for this type
    if (intentRef.current === type) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      intentRef.current = null;
    }

    // Only close if this trigger is still the currently active trigger
    // (Prevents a leave event on 'live' from closing a newly opened 'github', and vice versa)
    setActivePreview((current) => (current === type ? null : current));
  }, []);

  const handlePointerEnter = (e: React.PointerEvent, type: "live" | "github") => {
    // Suppress hover popovers on touch devices so mobile taps open links directly
    if (e.pointerType === "touch") return;
    requestPreview(type);
  };

  const handlePointerLeave = (e: React.PointerEvent, type: "live" | "github") => {
    if (e.pointerType === "touch") return;
    cancelPreview(type);
  };

  const handleFocus = (type: "live" | "github") => {
    requestPreview(type);
  };

  const handleBlur = (type: "live" | "github") => {
    cancelPreview(type);
  };

  const domain = getDomain(project.live);
  const { owner, repo } = parseGitHubUrl(project.github);
  const primaryLang =
    project.tags.find((t) => t in LANGUAGE_COLORS) ||
    project.tags[0] ||
    "TypeScript";
  const langColor = LANGUAGE_COLORS[primaryLang] || "#3178c6";

  return (
    <div className="flex items-center gap-3 font-mono text-xs text-zinc-600 dark:text-[#9e998e]">
      {/* 1. Live Action with Controlled Popover */}
      {project.live && (
        <TooltipPrimitive.Root
          open={activePreview === "live"}
          onOpenChange={(open) => {
            if (!open) cancelPreview("live");
          }}
        >
          <TooltipPrimitive.Trigger asChild>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline"
              onPointerEnter={(e) => handlePointerEnter(e, "live")}
              onPointerLeave={(e) => handlePointerLeave(e, "live")}
              onFocus={() => handleFocus("live")}
              onBlur={() => handleBlur("live")}
            >
              Live ↗
            </a>
          </TooltipPrimitive.Trigger>

          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="top"
              align="end"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              className={`${styles.popoverContent} w-[290px] sm:w-[320px] rounded-lg border border-zinc-200/90 dark:border-white/[0.12] bg-[#faf9f6]/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-lg shadow-zinc-900/10 dark:shadow-black/50 text-left`}
            >
              <div className="p-2.5 space-y-2">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="font-mono text-[11px] text-zinc-600 dark:text-[#9e998e] truncate max-w-[190px]">
                      {domain}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                    Live
                  </span>
                </div>

                {/* Screenshot frame */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900/80">
                  {hasLiveInteracted && project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 290px, 320px"
                      className="object-cover object-top"
                    />
                  )}
                </div>

                {/* Project Name and Category Caption */}
                <div className="flex items-baseline justify-between px-1 pt-0.5">
                  <span className="font-serif text-[13px] font-medium text-zinc-900 dark:text-[#eae6df] truncate">
                    {project.title}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-[#827d73] flex-shrink-0 ml-2">
                    {project.category}
                  </span>
                </div>
              </div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      )}

      {/* 2. GitHub Action with Controlled Popover */}
      {project.github && (
        <TooltipPrimitive.Root
          open={activePreview === "github"}
          onOpenChange={(open) => {
            if (!open) cancelPreview("github");
          }}
        >
          <TooltipPrimitive.Trigger asChild>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 hover:dark:text-[#eae6df] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:underline"
              onPointerEnter={(e) => handlePointerEnter(e, "github")}
              onPointerLeave={(e) => handlePointerLeave(e, "github")}
              onFocus={() => handleFocus("github")}
              onBlur={() => handleBlur("github")}
            >
              GitHub ↗
            </a>
          </TooltipPrimitive.Trigger>

          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side="top"
              align="end"
              sideOffset={8}
              collisionPadding={16}
              avoidCollisions={true}
              className={`${styles.popoverContent} w-[290px] sm:w-[320px] rounded-lg border border-zinc-200/90 dark:border-white/[0.12] bg-[#faf9f6]/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-lg shadow-zinc-900/10 dark:shadow-black/50 text-left`}
            >
              <div className="p-3.5 space-y-2.5">
                {/* Repo Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600 dark:text-[#9e998e] truncate">
                    <GitHubIcon className="w-3.5 h-3.5 text-zinc-800 dark:text-[#eae6df] flex-shrink-0" />
                    <span className="truncate text-zinc-500 dark:text-[#9e998e]">
                      {owner}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-600">/</span>
                    <span className="font-medium text-zinc-900 dark:text-[#eae6df] truncate">
                      {repo}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-[#827d73] flex-shrink-0">
                    Public
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className="font-serif text-[14px] font-medium text-zinc-900 dark:text-[#eae6df] leading-tight">
                    {project.title}
                  </h4>
                  <p className="font-serif text-[12px] leading-[18px] text-zinc-600 dark:text-[#beb9ad] line-clamp-2">
                    {project.overview}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 dark:border-white/[0.06]">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-600 dark:text-[#9e998e]">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: langColor }}
                    />
                    <span>{primaryLang}</span>
                  </div>

                  <span className="font-mono text-[10px] text-zinc-400 dark:text-[#706c64]">
                    Repository
                  </span>
                </div>
              </div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      )}
    </div>
  );
}

export { MinimalProjectActions as MinimalActionPreview };
export default MinimalProjectActions;
