"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fieldNotes } from "@/lib/fieldNotes";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

/**
 * FocusNotesPage
 *
 * Focus Mode presentation for /notes archive index.
 * High-density technical dossier listing engineering essays,
 * architectural observations, and development mental models.
 */
export function FocusNotesPage() {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      <div className="space-y-6 sm:space-y-8 py-2 sm:py-4">
        {/* Top Header & Breadcrumb */}
        <div className="space-y-3">
          <Link
            href="/"
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>cd .. / home</span>
          </Link>

          <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none pt-1">
            <span className="tracking-wider font-medium text-emerald-500/90 dark:text-emerald-400/90">
              [ 02 // FIELD NOTES ]
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
              ARCHIVE ({fieldNotes.length} ESSAYS)
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase">
              FIELD NOTES ARCHIVE
            </h1>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Observations on interface ergonomics, system resilience, AI-assisted development velocity, and software craftsmanship.
            </p>
          </div>
        </div>

        <EditorialDivider className="my-5 sm:my-6" />

        {/* Structured Technical Index */}
        <div className="border-t border-b border-border-divider divide-y divide-border-divider">
          {fieldNotes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="group py-4 sm:py-5 px-1 sm:px-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 hover:bg-surface/30 focus-visible:bg-surface/50 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              {/* Left Column: Number marker */}
              <div className="flex items-center sm:items-start gap-2.5 sm:pt-0.5 flex-shrink-0">
                <span className="font-mono text-xs sm:text-[13px] font-semibold text-muted-foreground/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150 tabular-nums">
                  [ {note.number} ]
                </span>
              </div>

              {/* Middle Column: Metadata, Title, and Excerpt */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 uppercase tracking-wider">
                  <span className="text-emerald-500 font-bold">//</span>
                  <span className="font-semibold text-ink/90 group-hover:text-ink">
                    {note.category}
                  </span>
                  <span className="text-border-divider">•</span>
                  <span>{note.readTime}</span>
                </div>

                <h2 className="font-sans font-bold text-sm sm:text-base text-ink tracking-tight uppercase group-hover:text-brand transition-colors duration-150">
                  <span className="inline-block transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none">
                    {note.title}
                  </span>
                </h2>

                <p className="font-sans text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl pt-0.5">
                  {note.excerpt}
                </p>
              </div>

              {/* Right Column: Date & Action */}
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
      </div>
    </div>
  );
}

export default FocusNotesPage;
