"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fieldNotes } from "@/lib/fieldNotes";
import { SectionHeader } from "@/components/SectionHeader";
import { useUISound } from "@/context/SoundContext";

export function NotesPageClient() {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 py-2 sm:py-4">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/"
          onMouseEnter={playHover}
          onClick={playClick}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>
      </div>

      {/* Header */}
      <SectionHeader
        label="FIELD-NOTES"
        description="Things I've been thinking about while building. Reflections on UI/UX, software architecture, AI development, and craft."
        className="mb-4 pb-2 border-b border-border-divider"
      />

      {/* List-Based Editorial Index */}
      <div className="w-full border-t border-b border-border-divider divide-y divide-border-divider">
        {fieldNotes.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="group relative flex items-start gap-4 sm:gap-6 py-4.5 sm:py-5 px-2.5 sm:px-3 hover:bg-surface/35 focus-visible:bg-surface/50 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-none"
          >
            {/* Large Sequential Number */}
            <span className="font-mono text-xl sm:text-2xl font-light text-muted-foreground/45 group-hover:text-ink transition-colors duration-150 select-none tabular-nums w-7 sm:w-8 flex-shrink-0 pt-0.5">
              {note.number}
            </span>

            {/* Main Content Column */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {/* Header Line: Note Title + Date & Read Time */}
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-sans text-sm sm:text-base font-semibold text-ink tracking-tight uppercase group-hover:text-brand transition-colors duration-150">
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                    {note.title}
                  </span>
                </h2>
                <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-muted-foreground/75 tracking-wider flex-shrink-0">
                  <span>{note.date}</span>
                  <span className="text-border-hairline hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-muted-foreground/60">{note.readTime}</span>
                </div>
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
    </div>
  );
}

export default NotesPageClient;
