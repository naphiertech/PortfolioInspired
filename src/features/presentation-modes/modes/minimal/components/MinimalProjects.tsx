"use client";

import React, { useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Calculator,
  Columns2,
  FileText,
  Globe,
  MapPin,
  QrCode,
  ScanFace,
  ScanSearch,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { FullProjectItem, fullProjects } from "@/lib/data";
import { MinimalProjectActions } from "./MinimalActionPreview";
import { PROJECT_CURSOR_LABELS } from "@/lib/cursorConfig";
import { hasTechIcon, TechIcon } from "@/components/TechIcon";
import { useUISound } from "@/context/SoundContext";

const INITIAL_PROJECTS_COUNT = 2;

const STACK_TILTS = [
  { rest: "-rotate-[7deg] translate-y-[0.5px]", fan: "group-hover/stack:-rotate-[3deg]" },
  { rest: "rotate-[5deg] -translate-y-[0.5px]", fan: "group-hover/stack:rotate-[2deg]" },
  { rest: "-rotate-[4deg] translate-y-[0.5px]", fan: "group-hover/stack:-rotate-[2deg]" },
  { rest: "rotate-[6deg] -translate-y-[0.5px]", fan: "group-hover/stack:rotate-[3deg]" },
  { rest: "-rotate-[5deg] translate-y-[0.5px]", fan: "group-hover/stack:-rotate-[2deg]" },
] as const;

interface WorkInlineChipProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  chipHoverClass?: string;
  iconHoverClass?: string;
  onHover?: () => void;
}

function WorkInlineChip({
  icon,
  children,
  chipHoverClass = "hover:-translate-y-[1.5px] hover:-rotate-[1deg]",
  iconHoverClass = "group-hover/chip:scale-110",
  onHover,
}: WorkInlineChipProps) {
  return (
    <span
      onMouseEnter={onHover}
      className={`group/chip inline-flex items-center gap-1 rounded-[4px] px-1.5 py-[0.5px] bg-zinc-100/85 dark:bg-white/[0.055] border border-zinc-200/90 dark:border-white/[0.11] text-zinc-900 dark:text-[#eeeae1] hover:bg-zinc-200/75 dark:hover:bg-white/[0.1] hover:border-zinc-400/70 dark:hover:border-white/[0.24] font-sans text-[12px] sm:text-[12.5px] font-medium leading-[1.3] align-baseline whitespace-nowrap cursor-default select-none transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${chipHoverClass}`}
    >
      <span
        className={`inline-flex items-center justify-center opacity-75 group-hover/chip:opacity-100 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none ${iconHoverClass}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{children}</span>
    </span>
  );
}

function MinimalProjectOverview({
  project,
  onHover,
}: {
  project: FullProjectItem;
  onHover: () => void;
}) {
  switch (project.slug) {
    case "audit-web":
      return (
        <p className="font-serif text-[15px] sm:text-[15.5px] text-zinc-700 dark:text-[#beb9ad] leading-[1.78]">
          AUDIT/WEB is an evidence-based{" "}
          <WorkInlineChip
            icon={<ScanSearch className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-110"
            onHover={onHover}
          >
            interface inspection
          </WorkInlineChip>{" "}
          workbench that measures{" "}
          <WorkInlineChip
            icon={<Accessibility className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
            iconHoverClass="group-hover/chip:rotate-[10deg]"
            onHover={onHover}
          >
            accessibility
          </WorkInlineChip>
          , UX, visual design, typography, colour, and metadata from{" "}
          <WorkInlineChip
            icon={<Globe className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:rotate-[16deg]"
            onHover={onHover}
          >
            rendered pages
          </WorkInlineChip>
          .
        </p>
      );

    case "mkb-ridertrack":
      return (
        <p className="font-serif text-[15px] sm:text-[15.5px] text-zinc-700 dark:text-[#beb9ad] leading-[1.78]">
          MKBRiderTrack is an enterprise workforce and{" "}
          <WorkInlineChip
            icon={<Truck className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
            iconHoverClass="group-hover/chip:translate-x-[1.5px]"
            onHover={onHover}
          >
            rider logistics
          </WorkInlineChip>{" "}
          system combining{" "}
          <WorkInlineChip
            icon={<ScanFace className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-110"
            onHover={onHover}
          >
            biometric verification
          </WorkInlineChip>
          ,{" "}
          <WorkInlineChip
            icon={<MapPin className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
            iconHoverClass="group-hover/chip:-translate-y-[1px]"
            onHover={onHover}
          >
            GPS geofencing
          </WorkInlineChip>
          , parcel auditing, role-based portals, and{" "}
          <WorkInlineChip
            icon={<Calculator className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-110"
            onHover={onHover}
          >
            automated payroll
          </WorkInlineChip>
          .
        </p>
      );

    case "naphix-resume":
      return (
        <p className="font-serif text-[15px] sm:text-[15.5px] text-zinc-700 dark:text-[#beb9ad] leading-[1.78]">
          Naphix Résumé is a{" "}
          <WorkInlineChip
            icon={<ShieldCheck className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-110"
            onHover={onHover}
          >
            privacy-first
          </WorkInlineChip>{" "}
          résumé builder with a real-time{" "}
          <WorkInlineChip
            icon={<Columns2 className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-105"
            onHover={onHover}
          >
            split-screen editor
          </WorkInlineChip>
          , live A4 preview, drag-and-drop customization, and native{" "}
          <WorkInlineChip
            icon={<FileText className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:-translate-y-[1px]"
            onHover={onHover}
          >
            PDF &amp; Word
          </WorkInlineChip>{" "}
          export.
        </p>
      );

    case "assetlink":
      return (
        <p className="font-serif text-[15px] sm:text-[15.5px] text-zinc-700 dark:text-[#beb9ad] leading-[1.78]">
          AssetLink is a school asset and repair tracking system powered by{" "}
          <WorkInlineChip
            icon={<QrCode className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:rotate-[1deg]"
            iconHoverClass="group-hover/chip:scale-110"
            onHover={onHover}
          >
            QR scanning
          </WorkInlineChip>{" "}
          so teachers and staff can{" "}
          <WorkInlineChip
            icon={<Wrench className="w-3 h-3" />}
            chipHoverClass="hover:-translate-y-[1.5px] hover:-rotate-[1deg]"
            iconHoverClass="group-hover/chip:rotate-[14deg]"
            onHover={onHover}
          >
            report &amp; track
          </WorkInlineChip>{" "}
          maintenance issues seamlessly with faculty teams.
        </p>
      );

    default:
      return (
        <p className="font-serif text-[15px] sm:text-[15.5px] text-zinc-700 dark:text-[#beb9ad] leading-[1.78]">
          {project.overview}
        </p>
      );
  }
}

function MinimalProjectArticle({ project }: { project: FullProjectItem }) {
  const { playHover } = useUISound();
  const highlights = project.features?.slice(0, 3) || [];
  const primaryTags = project.tags.slice(0, 5);

  // Separate tags that have a recognized monochrome brand icon from text-only tools
  const iconTags = primaryTags.filter((tag) => hasTechIcon(tag));
  const textOnlyTags = primaryTags.filter((tag) => !hasTechIcon(tag));

  return (
    <article
      data-cursor-label={PROJECT_CURSOR_LABELS[project.slug] || "One of my full-stack projects."}
      className="space-y-3"
    >
      {/* Project Title & Direct Links */}
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-serif text-[17px] sm:text-[18px] text-zinc-900 dark:text-[#eae6df] font-medium tracking-tight">
          {project.title}
        </h3>

        <MinimalProjectActions project={project} />
      </div>

      {/* Kinetic Inline-Chip Description */}
      <MinimalProjectOverview project={project} onHover={playHover} />

      {/* Key Highlights */}
      <ul className="font-serif text-[14px] sm:text-[14.5px] text-zinc-600 dark:text-[#beb9ad]/90 leading-relaxed space-y-1 list-disc list-inside pl-1">
        {highlights.map((highlight, idx) => (
          <li key={idx}>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      {/* Compact Hairline Stack & Meta Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 pb-1.5 border-t border-zinc-200/70 dark:border-white/[0.08]">
        {/* Interactive Fanned Tech Sticker Deck + Text-Only Tool Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {iconTags.length > 0 && (
            <div
              className="group/stack inline-flex items-center select-none"
              aria-label={`Built with ${iconTags.join(", ")}`}
            >
              {iconTags.map((tech, index) => {
                const tilt = STACK_TILTS[index % STACK_TILTS.length];
                return (
                  <span
                    key={tech}
                    onMouseEnter={playHover}
                    className={`group/tile relative inline-flex items-center justify-center w-[22px] h-[22px] sm:w-[23px] sm:h-[23px] rounded-[6px] bg-white dark:bg-[#1a1b1a] border border-zinc-200/95 dark:border-white/[0.13] text-zinc-900 dark:text-[#eeeae1] shadow-[0_1.5px_4px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.5)] cursor-default transition-[transform,margin] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none hover:!-translate-y-[5px] hover:!rotate-0 hover:scale-110 hover:z-30 ${
                      index > 0 ? "-ml-1.5 group-hover/stack:ml-0.5" : ""
                    } ${tilt.rest} ${tilt.fan}`}
                    style={{ zIndex: index + 1 }}
                  >
                    <TechIcon name={tech} monochrome className="w-3 h-3" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded font-mono text-[9.5px] leading-tight whitespace-nowrap bg-zinc-900 dark:bg-[#eae6df] text-white dark:text-[#111211] opacity-0 translate-y-1 group-hover/tile:opacity-100 group-hover/tile:translate-y-0 transition-all duration-150"
                    >
                      {tech}
                    </span>
                  </span>
                );
              })}
            </div>
          )}

          {textOnlyTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {textOnlyTags.map((tag) => (
                <span
                  key={tag}
                  onMouseEnter={playHover}
                  className="inline-flex items-center px-1.5 py-[1px] rounded-[4px] border border-zinc-200/85 dark:border-white/[0.1] bg-zinc-100/75 dark:bg-white/[0.04] font-mono text-[10px] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df] hover:-translate-y-[1px] transition-[transform,color] duration-150 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quiet Monospace Category & Year */}
        <span className="font-mono text-[10.5px] text-zinc-500 dark:text-[#827d73] tabular-nums">
          {project.category} · {project.year}
        </span>
      </div>
    </article>
  );
}

/**
 * MinimalProjects
 *
 * Selected work presented in a refined editorial, text-first format:
 * - Kinetic inline domain chips & fanned monochrome tech sticker decks
 * - Shows 2 featured projects initially with an inline View More toggle
 * - Quiet external links directly to Live and GitHub repositories
 */
export function MinimalProjects() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  const targetSlugs = ["audit-web", "mkb-ridertrack", "naphix-resume", "assetlink"];
  const projects = targetSlugs
    .map((slug) => fullProjects.find((p) => p.slug === slug))
    .filter((p): p is FullProjectItem => Boolean(p));

  const visibleProjects = projects.slice(0, INITIAL_PROJECTS_COUNT);
  const extraProjects = projects.slice(INITIAL_PROJECTS_COUNT);

  return (
    <TooltipPrimitive.Provider delayDuration={100} skipDelayDuration={150}>
      <section data-guide="projects" data-creative-note="projects" className="space-y-6 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          Selected Work
        </h2>

        <div className="space-y-8">
          {visibleProjects.map((project) => (
            <MinimalProjectArticle key={project.slug} project={project} />
          ))}

          <AnimatePresence initial={false}>
            {expanded && extraProjects.length > 0 && (
              <motion.div
                id="minimal-projects-more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <div className="space-y-8">
                  {extraProjects.map((project) => (
                    <MinimalProjectArticle key={project.slug} project={project} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {extraProjects.length > 0 && (
          <div>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="minimal-projects-more"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[36px] font-serif italic text-[14px] sm:text-[15px] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors cursor-pointer"
            >
              <span>
                {expanded ? "Show less" : `View more (${extraProjects.length})`}
              </span>
              <span aria-hidden="true" className="not-italic font-mono text-xs">
                {expanded ? "↑" : "↓"}
              </span>
            </button>
          </div>
        )}
      </section>
    </TooltipPrimitive.Provider>
  );
}

export default MinimalProjects;
