"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { fieldNotes } from "@/lib/fieldNotes";
import { SectionHeader } from "./SectionHeader";
import { useUISound } from "@/context/SoundContext";
import { sectionContainerVariants } from "@/lib/motion";

const FloatingTerrain = dynamic(
  () => import("./FloatingTerrain").then((m) => m.FloatingTerrain),
  {
    ssr: false,
    loading: () => <div className="w-full aspect-[760/172]" aria-hidden="true" />,
  }
);

/**
 * FieldNotesSection
 *
 * Editorial list-based content index communicating engineering thought,
 * UI/UX principles, system architecture, and development craft.
 * Replaces the former project/activity card grid without repeating project content.
 */
export function FieldNotesSection() {
  const { playHover, playClick } = useUISound();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={false}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={shouldReduceMotion ? undefined : sectionContainerVariants}
      className="w-full space-y-4 select-none mb-0"
      aria-label="Field Notes"
    >
      {/* Section Header */}
      <SectionHeader
        label="FIELD-NOTES"
        description="Things I've been thinking about while building."
        actionHref="/notes"
        actionLabel="all notes"
        className="mb-4 pb-2 border-b border-border-divider"
      />

      {/* Editorial Content Index Container */}
      <div className="relative">
        <div className="w-full border-t border-b border-border-divider divide-y divide-border-divider relative z-10 bg-transparent">
          {fieldNotes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              prefetch={false}
              onMouseEnter={playHover}
              onClick={playClick}
              className="group relative flex items-start gap-4 sm:gap-6 py-4 sm:py-5 px-2.5 sm:px-3 hover:bg-surface/35 focus-visible:bg-surface/50 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-none"
            >
              {/* Large Sequential Number */}
              <span className="font-mono text-xl sm:text-2xl font-light text-muted-foreground/45 group-hover:text-ink transition-colors duration-150 select-none tabular-nums w-7 sm:w-8 flex-shrink-0 pt-0.5">
                {note.number}
              </span>

              {/* Main Content Column */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Header Line: Note Title + Date */}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-sans text-sm sm:text-base font-semibold text-ink tracking-tight uppercase group-hover:text-brand transition-colors duration-150">
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                      {note.title}
                    </span>
                  </h3>
                  <span className="font-mono text-[11px] sm:text-xs text-muted-foreground/75 tracking-wider flex-shrink-0">
                    {note.date}
                  </span>
                </div>

                {/* Sub-line: Category with subtle emerald accent */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 group-hover:bg-emerald-500 transition-colors duration-150 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90 group-hover:text-ink transition-colors duration-150">
                    {note.category}
                  </span>
                </div>

                {/* Bottom Line: Description + Right-aligned Arrow */}
                <div className="flex items-end justify-between gap-4 pt-0.5">
                  <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                    {note.excerpt}
                  </p>
                  <span className="inline-flex items-center justify-center text-muted-foreground/50 group-hover:text-ink transition-colors duration-150 flex-shrink-0 mb-0.5">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transform-none" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Floating Pixel Terrain Foundation directly attached beneath the list */}
        <FloatingTerrain variant="now" />
      </div>
    </motion.section>
  );
}

export default FieldNotesSection;
