"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fieldNotes } from "@/lib/fieldNotes";
import { useUISound } from "@/context/SoundContext";

/**
 * FocusFieldNotes
 *
 * Focus Mode presentation of Field Notes.
 * Technical engineering index with structured columns, numbered markers,
 * metadata badges, and deliberate hardware-accelerated micro-interactions.
 */
export function FocusFieldNotes() {
  const { playHover, playClick } = useUISound();

  return (
    <section
      data-guide="field-notes"
      aria-label="Field notes and engineering observations"
      className="w-full"
    >
      {/* Section Index Header */}
      <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/80 select-none mb-3.5">
        <h2 className="tracking-wider font-medium font-mono text-xs">
          [ 02 // FIELD NOTES ]
        </h2>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/70">
          ENGINEERING NOTES ({fieldNotes.length})
        </span>
      </div>

      {/* Structured Technical Index */}
      <div className="border-t border-b border-border-divider divide-y divide-border-divider">
        {fieldNotes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="group py-4 sm:py-4.5 px-1 sm:px-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 hover:bg-surface/30 focus-visible:bg-surface/50 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            {/* Left Column: Number marker & Technical Indicator */}
            <div className="flex items-center sm:items-start gap-2.5 sm:pt-0.5 flex-shrink-0">
              <span className="font-mono text-xs sm:text-[13px] font-semibold text-muted-foreground/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 tabular-nums">
                [ {note.number} ]
              </span>
            </div>

            {/* Middle Column: Technical metadata, Title, and Excerpt */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                <span className="text-emerald-500 font-bold">{"//"}</span>
                <span className="font-semibold text-ink/90 group-hover:text-ink">
                  {note.category}
                </span>
                <span className="text-border-divider">•</span>
                <span>{note.readTime}</span>
              </div>

              <h3 className="font-sans font-bold text-sm sm:text-base text-ink tracking-tight uppercase group-hover:text-brand transition-colors duration-150">
                <span className="inline-block transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none">
                  {note.title}
                </span>
              </h3>

              <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl pt-0.5">
                {note.excerpt}
              </p>
            </div>

            {/* Right Column: Date & Action Bracket */}
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0 self-stretch sm:self-start sm:pt-0.5 font-mono text-xs">
              <span className="text-[11px] sm:text-xs text-muted-foreground/75 tracking-wider">
                {note.date}
              </span>

              <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60 group-hover:text-ink transition-colors duration-150">
                <span className="hidden sm:inline uppercase text-[10px] tracking-wider">
                  read
                </span>
                <span className="inline-flex items-center justify-center transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FocusFieldNotes;
