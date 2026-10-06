"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { FieldNote } from "@/lib/fieldNotes";
import { ebGaramond } from "../fonts";
import { MinimalHeader } from "../components/MinimalHeader";

interface MinimalNoteDetailPageProps {
  note: FieldNote;
  prevNote?: FieldNote;
  nextNote?: FieldNote;
  totalNotes: number;
}

/**
 * MinimalNoteDetailPage
 *
 * Minimal Mode presentation for /notes/[slug].
 * Personal essay and technical journal feel:
 * - Scoped EB Garamond serif typography
 * - Generous whitespace and narrow, comfortable reading measure
 * - Quiet breadcrumb and bottom navigation
 * - Understated blockquotes and code styling
 */
export function MinimalNoteDetailPage({
  note,
  prevNote,
  nextNote,
  totalNotes,
}: MinimalNoteDetailPageProps) {
  return (
    <div
      className={`${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] transition-colors duration-200 py-2 sm:py-4 pb-16`}
    >
      {/* 1. Quiet Utility Header */}
      <MinimalHeader />

      <article className="w-full pt-8 sm:pt-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-[#827d73]">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 hover:dark:text-[#eae6df] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="font-serif italic text-sm">Field Notes</span>
          </Link>

          <span className="tabular-nums">
            {note.number} / {String(totalNotes).padStart(2, "0")}
          </span>
        </div>

        {/* Note Title & Header Metadata */}
        <header className="space-y-4 pt-2">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-zinc-900 dark:text-[#eae6df] font-normal leading-[1.22] tracking-tight">
              {note.title}
            </h1>

            <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 font-mono text-xs text-zinc-500 dark:text-[#827d73] pt-1">
              <span>{note.category}</span>
              <span className="text-zinc-300 dark:text-white/[0.12] select-none">·</span>
              <time dateTime={note.date}>{note.formattedDate}</time>
              <span className="text-zinc-300 dark:text-white/[0.12] select-none">·</span>
              <span>{note.readTime}</span>
            </div>
          </div>
        </header>

        {/* Essay Lead Paragraph */}
        <p className="font-serif text-[17px] sm:text-[18px] text-zinc-800 dark:text-[#dedad0] leading-[29px] italic border-l-2 border-zinc-200 dark:border-white/[0.12] pl-4 py-1">
          {note.content.lead}
        </p>

        {/* Essay Sections */}
        <div className="space-y-8 pt-2">
          {note.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="font-serif italic text-xl sm:text-2xl text-zinc-900 dark:text-[#eae6df] font-normal pt-2">
                  {section.heading}
                </h2>
              )}

              <div className="space-y-4 font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[28px]">
                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {section.callout && (
                <blockquote className="my-6 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 py-1 font-serif italic text-[16px] sm:text-[17px] text-zinc-800 dark:text-[#dedad0]">
                  &ldquo;{section.callout}&rdquo;
                </blockquote>
              )}

              {section.codeSnippet && (
                <div className="my-6 border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-black/40 overflow-hidden font-mono text-xs">
                  {section.codeSnippet.caption && (
                    <div className="px-4 py-2 border-b border-zinc-200/80 dark:border-white/[0.08] text-[11px] text-zinc-500 dark:text-[#827d73] flex items-center justify-between">
                      <span>{section.codeSnippet.caption}</span>
                      <span className="uppercase text-[10px] tracking-wider text-zinc-400 dark:text-zinc-500">
                        {section.codeSnippet.language}
                      </span>
                    </div>
                  )}
                  <pre className="p-4 overflow-x-auto text-zinc-800 dark:text-[#dedad0] leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}

          {/* Conclusion */}
          {note.content.conclusion && (
            <div className="pt-6 border-t border-zinc-200/80 dark:border-white/[0.08] space-y-2">
              <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73]">
                Closing note:
              </span>
              <p className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[28px] italic">
                {note.content.conclusion}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Editorial Navigation */}
        <footer className="pt-8 mt-12 border-t border-zinc-200/80 dark:border-white/[0.08]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline justify-between gap-6 font-serif">
            {prevNote ? (
              <Link
                href={`/notes/${prevNote.slug}`}
                className="group flex flex-col items-start gap-1 flex-1"
              >
                <span className="text-xs font-mono text-zinc-500 dark:text-[#827d73]">
                  ← Previous note
                </span>
                <span className="text-[15px] sm:text-[16px] text-zinc-900 dark:text-[#eae6df] group-hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600 transition-colors">
                  {prevNote.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}

            <div className="self-center">
              <Link
                href="/notes"
                className="font-serif italic text-sm text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors"
              >
                All notes
              </Link>
            </div>

            {nextNote ? (
              <Link
                href={`/notes/${nextNote.slug}`}
                className="group flex flex-col items-end gap-1 text-right flex-1"
              >
                <span className="text-xs font-mono text-zinc-500 dark:text-[#827d73]">
                  Next note →
                </span>
                <span className="text-[15px] sm:text-[16px] text-zinc-900 dark:text-[#eae6df] group-hover:underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600 transition-colors">
                  {nextNote.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}

export default MinimalNoteDetailPage;
