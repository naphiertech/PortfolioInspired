"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import type { FieldNote } from "@/lib/fieldNotes";
import { EditorialDivider } from "@/components/EditorialDivider";
import { useUISound } from "@/context/SoundContext";

interface NoteDetailClientProps {
  note: FieldNote;
  prevNote?: FieldNote;
  nextNote?: FieldNote;
  totalNotes: number;
}

export function NoteDetailClient({
  note,
  prevNote,
  nextNote,
  totalNotes,
}: NoteDetailClientProps) {
  const { playHover, playClick } = useUISound();

  return (
    <article className="w-full max-w-3xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-300 py-2 sm:py-4 pb-12 sm:pb-16">
      {/* Top Header & Breadcrumb */}
      <header className="space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/#field-notes"
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
            <span>FIELD-NOTES</span>
          </Link>

          <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground tabular-nums">
            {note.number} / {String(totalNotes).padStart(2, "0")}
          </span>
        </div>

        <div className="space-y-2.5 pt-2">
          {/* Note Title */}
          <h1 className="font-sans text-2xl sm:text-4xl lg:text-[40px] font-bold text-ink tracking-tight uppercase leading-[1.18]">
            {note.title}
          </h1>

          {/* Category Tag */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {note.category}
            </span>
          </div>

          {/* Date & Meta Details */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground/80 pt-1">
            <time dateTime={note.date}>{note.formattedDate}</time>
            <span className="text-border-hairline">•</span>
            <span>{note.readTime}</span>
            {note.tags.length > 0 && (
              <>
                <span className="text-border-hairline hidden sm:inline">•</span>
                <span className="hidden sm:inline text-muted-foreground/60">
                  {note.tags.join(" · ")}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <EditorialDivider className="my-6 sm:my-8" />

      {/* Main Document Content */}
      <div className="space-y-8 sm:space-y-10">
        {/* Lead paragraph */}
        <p className="font-sans text-base sm:text-lg text-ink/90 leading-relaxed font-normal">
          {note.content.lead}
        </p>

        {/* Structured Sections */}
        {note.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            {section.heading && (
              <h2 className="font-sans text-lg sm:text-xl font-bold text-ink tracking-tight pt-2 flex items-baseline gap-2.5">
                <span className="font-mono text-xs font-normal text-muted-foreground/60 select-none">
                  0{idx + 1}
                </span>
                <span>{section.heading}</span>
              </h2>
            )}

            <div className="space-y-4 font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>

            {section.callout && (
              <blockquote className="my-6 border-l-2 border-emerald-500/80 pl-4 sm:pl-5 py-1.5 bg-surface/20 font-sans text-sm sm:text-base italic text-ink/90">
                &ldquo;{section.callout}&rdquo;
              </blockquote>
            )}

            {section.codeSnippet && (
              <div className="my-6 border border-border-hairline bg-surface/40 overflow-hidden font-mono text-xs">
                {section.codeSnippet.caption && (
                  <div className="px-3.5 py-2 border-b border-border-divider text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{section.codeSnippet.caption}</span>
                    <span className="uppercase text-[10px] tracking-wider text-muted-foreground/60">
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

        {/* Conclusion */}
        {note.content.conclusion && (
          <div className="pt-6 sm:pt-8 border-t border-border-divider font-sans text-sm sm:text-base text-ink/90 leading-relaxed italic">
            {note.content.conclusion}
          </div>
        )}
      </div>

      <EditorialDivider className="my-8 sm:my-10" />

      {/* Bottom Previous / Next / Index Navigation */}
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 font-mono text-xs">
        {prevNote ? (
          <Link
            href={`/notes/${prevNote.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="group flex flex-col items-start gap-1 py-1 text-left flex-1 hover:text-ink transition-colors"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 group-hover:text-ink">
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
              PREVIOUS NOTE
            </span>
            <span className="font-sans text-sm font-semibold text-ink group-hover:text-brand truncate max-w-full">
              {prevNote.number} · {prevNote.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        <Link
          href="/#field-notes"
          onMouseEnter={playHover}
          onClick={playClick}
          className="py-2 px-3 text-center text-muted-foreground hover:text-ink font-mono text-xs flex items-center justify-center gap-1.5 self-center group transition-colors"
        >
          <List className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider group-hover:underline underline-offset-4">INDEX</span>
        </Link>

        {nextNote ? (
          <Link
            href={`/notes/${nextNote.slug}`}
            onMouseEnter={playHover}
            onClick={playClick}
            className="group flex flex-col items-end gap-1 py-1 text-right flex-1 hover:text-ink transition-colors"
          >
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 group-hover:text-ink">
              NEXT NOTE
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="font-sans text-sm font-semibold text-ink group-hover:text-brand truncate max-w-full">
              {nextNote.number} · {nextNote.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
      </footer>
    </article>
  );
}

export default NoteDetailClient;
