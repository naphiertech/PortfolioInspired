"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePresentationMode } from "../context/PresentationModeContext";
import type { FieldNote } from "@/lib/fieldNotes";
import { NoteDetailClient } from "@/app/notes/[slug]/NoteDetailClient";
import { ArtisanPortfolioLayout } from "../modes/artisan/ArtisanPortfolioLayout";
import dynamic from "next/dynamic";

const FocusNoteDetailPage = dynamic(
  () =>
    import("../modes/focus/pages/FocusNoteDetailPage").then(
      (module) => module.FocusNoteDetailPage
    ),
  { ssr: true }
);

const MinimalNoteDetailPage = dynamic(
  () =>
    import("../modes/minimal/pages/MinimalNoteDetailPage").then(
      (module) => module.MinimalNoteDetailPage
    ),
  { ssr: true }
);

interface NoteDetailPresentationRootProps {
  note: FieldNote;
  prevNote?: FieldNote;
  nextNote?: FieldNote;
  totalNotes: number;
}

/**
 * NoteDetailPresentationRoot
 *
 * Presentation-aware dispatcher for /notes/[slug].
 * Renders the layout-specific presentation according to the active mode:
 * - Focus: Structured technical case briefing with numbered brackets
 * - Minimal: Editorial personal essay in Roman serif (EB Garamond)
 * - Default: CAD/technical dark-glass editorial article
 */
function ArtisanNoteDetailStandalone({
  note,
  prevNote,
  nextNote,
}: {
  note: FieldNote;
  prevNote?: FieldNote;
  nextNote?: FieldNote;
}) {
  return (
    <article className="w-full max-w-2xl mx-auto pt-10 sm:pt-12 pb-6 px-5 sm:px-6 space-y-8">
      <Link
        href="/notes"
        className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        <span>Back to Field Notes</span>
      </Link>

      <header className="space-y-3 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="flex flex-wrap items-center gap-2 font-sans text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.18em] text-[11px] text-foreground/80">
            Note {note.number}
          </span>
          <span aria-hidden="true">•</span>
          <span>{note.category}</span>
          <span aria-hidden="true">•</span>
          <span>{note.formattedDate || note.date}</span>
          <span aria-hidden="true">•</span>
          <span>{note.readTime}</span>
        </div>

        <h1 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
          {note.title}
        </h1>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-sans px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-muted-foreground bg-black/[0.03] dark:bg-white/[0.04]"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <p className="font-sans text-sm sm:text-base text-foreground/90 leading-relaxed italic border-l-2 border-black/20 dark:border-white/20 pl-4 py-1">
        {note.content.lead}
      </p>

      <div className="space-y-7 font-sans text-sm sm:text-[15px] text-foreground/85 leading-relaxed">
        {note.content.sections.map((section, sIdx) => (
          <section key={sIdx} className="space-y-3">
            {section.heading && (
              <h2 className="font-mono text-lg sm:text-xl font-semibold tracking-tight text-foreground pt-2">
                {section.heading}
              </h2>
            )}
            {section.paragraphs.map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
            {section.callout && (
              <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-xs sm:text-sm text-foreground/90">
                {section.callout}
              </div>
            )}
            {section.codeSnippet && (
              <pre className="p-4 rounded-xl bg-black text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                <code>{section.codeSnippet.code}</code>
              </pre>
            )}
          </section>
        ))}

        {note.content.conclusion && (
          <div className="pt-5 border-t border-black/10 dark:border-white/10">
            <p className="font-medium text-foreground/90">{note.content.conclusion}</p>
          </div>
        )}
      </div>

      {(prevNote || nextNote) && (
        <nav
          aria-label="Adjacent field notes"
          className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 font-sans text-xs"
        >
          {prevNote ? (
            <Link
              href={`/notes/${prevNote.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>{prevNote.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextNote && (
            <Link
              href={`/notes/${nextNote.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{nextNote.title}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

export function NoteDetailPresentationRoot({
  note,
  prevNote,
  nextNote,
  totalNotes,
}: NoteDetailPresentationRootProps) {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  if (mode === "agent") {
    return (
      <ArtisanPortfolioLayout
        defaultTab="notes"
        initialSectionNode={
          <ArtisanNoteDetailStandalone
            note={note}
            prevNote={prevNote}
            nextNote={nextNote}
          />
        }
      />
    );
  }

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "focus" ? (
        <FocusNoteDetailPage
          note={note}
          prevNote={prevNote}
          nextNote={nextNote}
          totalNotes={totalNotes}
        />
      ) : mode === "minimal" ? (
        <MinimalNoteDetailPage
          note={note}
          prevNote={prevNote}
          nextNote={nextNote}
          totalNotes={totalNotes}
        />
      ) : (
        <NoteDetailClient
          note={note}
          prevNote={prevNote}
          nextNote={nextNote}
          totalNotes={totalNotes}
        />
      )}
    </div>
  );
}

export default NoteDetailPresentationRoot;
