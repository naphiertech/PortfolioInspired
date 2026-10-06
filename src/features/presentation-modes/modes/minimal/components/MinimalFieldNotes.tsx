"use client";

import React from "react";
import Link from "next/link";
import { fieldNotes } from "@/lib/fieldNotes";

/**
 * MinimalFieldNotes
 *
 * Minimal Mode presentation for Field Notes:
 * - Roman serif typography (EB Garamond)
 * - Quiet sequential numbering (01, 02...)
 * - Editorial, document-like rhythm with generous whitespace
 * - Restrained link styling with subtle underlines, no cards or pill badges
 */
export function MinimalFieldNotes() {
  return (
    <section
      data-guide="field-notes"
      data-creative-note="field-notes"
      className="space-y-6 pt-8 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08]"
    >
      <div className="space-y-1">
        <h2 className="font-serif italic text-lg sm:text-xl text-zinc-800 dark:text-[#dedad0] font-normal">
          Field Notes
        </h2>
        <p className="font-serif italic text-zinc-600 dark:text-[#9e998e] text-[15px] sm:text-[16px]">
          A few things I&apos;ve been thinking about while building.
        </p>
      </div>

      <div className="space-y-7 pt-1">
        {fieldNotes.map((note) => (
          <article key={note.slug} className="group space-y-2">
            {/* Title & Sequential Number */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-zinc-400 dark:text-[#827d73] tabular-nums select-none flex-shrink-0">
                {note.number}
              </span>
              <h3 className="font-serif text-[17px] sm:text-[18px] text-zinc-900 dark:text-[#eae6df] font-medium tracking-tight">
                <Link
                  href={`/notes/${note.slug}`}
                  className="underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 hover:dark:decoration-[#eae6df] transition-colors"
                >
                  {note.title}
                </Link>
              </h3>
            </div>

            {/* Note Excerpt */}
            <p className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[26px] pl-6 sm:pl-7">
              {note.excerpt}
            </p>

            {/* Metadata */}
            <div className="font-mono text-xs text-zinc-500 dark:text-[#827d73] pl-6 sm:pl-7">
              <span>{note.category}</span>
              <span className="mx-2 select-none text-zinc-300 dark:text-white/[0.12]">·</span>
              <time dateTime={note.date}>{note.formattedDate}</time>
            </div>
          </article>
        ))}
      </div>

      {/* Quiet Link to Archive */}
      <div className="pt-2 pl-6 sm:pl-7">
        <Link
          href="/notes"
          className="font-serif text-[14px] sm:text-[15px] italic text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors"
        >
          All field notes ({fieldNotes.length}) ↗
        </Link>
      </div>
    </section>
  );
}

export default MinimalFieldNotes;
