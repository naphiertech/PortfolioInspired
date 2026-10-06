"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import type { FieldNote } from "@/lib/fieldNotes";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";
import { FocusNavigation } from "../components/FocusNavigation";

interface FocusNoteDetailPageProps {
  note: FieldNote;
  prevNote?: FieldNote;
  nextNote?: FieldNote;
  totalNotes: number;
}

/**
 * FocusNoteDetailPage
 *
 * Focus Mode presentation for /notes/[slug].
 * Structured engineering case briefing with technical metadata,
 * numbered section brackets, and high-signal typography.
 */
export function FocusNoteDetailPage({
  note,
  prevNote,
  nextNote,
  totalNotes,
}: FocusNoteDetailPageProps) {
  const { playHover, playClick } = useUISound();

  return (
    <div className="w-full select-none animate-in fade-in duration-200">
      {/* Focus Top Navigation */}
      <FocusNavigation />

      <article className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4 pb-12 sm:pb-16">
        {/* Top Header & Breadcrumb */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href="/#field-notes"
              onMouseEnter={playHover}
              onClick={playClick}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
              <span>cd .. / notes</span>
            </Link>

            <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground tabular-nums">
              [ {note.number} / {String(totalNotes).padStart(2, "0")} ]
            </span>
          </div>

          {/* Section Marker */}
          <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 select-none pt-1">
            <span className="tracking-wider font-medium text-emerald-500/90 dark:text-emerald-400/90">
              [ FIELD NOTE // BRIEFING {note.number} ]
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground/50">
              ENGINEERING ESSAY
            </span>
          </div>

          {/* Title & Metadata Strip */}
          <div className="space-y-2.5 pt-1">
            <h1 className="font-sans text-2xl sm:text-4xl font-extrabold text-ink tracking-tight uppercase leading-[1.18]">
              {note.title}
            </h1>

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
              <span className="text-ink font-semibold">{"//"} {note.category}</span>
              <span className="text-border-divider">•</span>
              <time dateTime={note.date}>{note.formattedDate}</time>
              <span className="text-border-divider">•</span>
              <span>{note.readTime}</span>
              {note.tags.length > 0 && (
                <>
                  <span className="text-border-divider hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-muted-foreground/75">
                    {note.tags.join(" · ")}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        <EditorialDivider className="my-5 sm:my-6" />

        {/* Structured Document Content */}
        <div className="space-y-7 sm:space-y-9">
          {/* Lead Paragraph */}
          <p className="font-sans text-base sm:text-lg text-ink/90 leading-relaxed font-normal">
            {note.content.lead}
          </p>

          {/* Structured Sections */}
          {note.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3.5">
              {section.heading && (
                <div className="pt-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 mb-1">
                    [ SEC // 0{idx + 1} ]
                  </div>
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-ink tracking-tight">
                    {section.heading}
                  </h2>
                </div>
              )}

              <div className="space-y-3.5 font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {section.callout && (
                <blockquote className="my-5 border-l-2 border-emerald-500 pl-4 py-2 bg-surface/30 font-sans text-sm sm:text-base italic text-ink/90">
                  &ldquo;{section.callout}&rdquo;
                </blockquote>
              )}

              {section.codeSnippet && (
                <div className="my-5 border border-border-divider bg-surface/40 overflow-hidden font-mono text-xs">
                  {section.codeSnippet.caption && (
                    <div className="px-3.5 py-2 border-b border-border-divider text-[11px] text-muted-foreground flex items-center justify-between bg-surface/60">
                      <span>{section.codeSnippet.caption}</span>
                      <span className="uppercase text-[10px] tracking-wider text-muted-foreground/60 font-semibold">
                        {section.codeSnippet.language}
                      </span>
                    </div>
                  )}
                  <pre className="p-3.5 sm:p-4 overflow-x-auto text-ink/90 leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}

          {/* Conclusion / Takeaway */}
          {note.content.conclusion && (
            <div className="pt-5 border-t border-border-divider space-y-1.5">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-emerald-500 font-semibold">
                [ DIRECTIVE // SUMMARY ]
              </span>
              <p className="font-sans text-sm sm:text-base text-ink/90 leading-relaxed italic">
                {note.content.conclusion}
              </p>
            </div>
          )}
        </div>

        <EditorialDivider className="my-6 sm:my-8" />

        {/* Bottom Navigation */}
        <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 font-mono text-xs">
          {prevNote ? (
            <Link
              href={`/notes/${prevNote.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="group flex flex-col items-start gap-1 py-1 text-left flex-1 hover:text-ink transition-colors"
            >
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 group-hover:text-emerald-400">
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                [ PREV // {prevNote.number} ]
              </span>
              <span className="font-sans text-sm font-semibold text-ink group-hover:text-brand truncate max-w-full">
                {prevNote.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          <Link
            href="/notes"
            onMouseEnter={playHover}
            onClick={playClick}
            className="py-2 px-3 text-center text-muted-foreground hover:text-ink font-mono text-xs flex items-center justify-center gap-1.5 self-center group transition-colors"
          >
            <List className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider group-hover:underline underline-offset-4">
              [ 00 // INDEX ]
            </span>
          </Link>

          {nextNote ? (
            <Link
              href={`/notes/${nextNote.slug}`}
              onMouseEnter={playHover}
              onClick={playClick}
              className="group flex flex-col items-end gap-1 py-1 text-right flex-1 hover:text-ink transition-colors"
            >
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 group-hover:text-emerald-400">
                [ NEXT // {nextNote.number} ]
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="font-sans text-sm font-semibold text-ink group-hover:text-brand truncate max-w-full">
                {nextNote.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}
        </footer>
      </article>
    </div>
  );
}

export default FocusNoteDetailPage;
