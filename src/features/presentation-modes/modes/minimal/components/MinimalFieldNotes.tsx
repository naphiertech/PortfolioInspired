"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FieldNote, fieldNotes } from "@/lib/fieldNotes";

const INITIAL_NOTES_COUNT = 2;

function MinimalNoteArticle({ note }: { note: FieldNote }) {
  return (
    <article className="group space-y-2">
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
  );
}

/**
 * MinimalFieldNotes
 *
 * Minimal Mode presentation for Field Notes:
 * - Shows 2 notes initially with an inline View More toggle
 * - Roman serif typography (EB Garamond) and quiet sequential numbering
 */
export function MinimalFieldNotes() {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  const visibleNotes = fieldNotes.slice(0, INITIAL_NOTES_COUNT);
  const extraNotes = fieldNotes.slice(INITIAL_NOTES_COUNT);

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
        {visibleNotes.map((note) => (
          <MinimalNoteArticle key={note.slug} note={note} />
        ))}

        <AnimatePresence initial={false}>
          {expanded && extraNotes.length > 0 && (
            <motion.div
              id="minimal-notes-more"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden"
            >
              <div className="space-y-7">
                {extraNotes.map((note) => (
                  <MinimalNoteArticle key={note.slug} note={note} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inline Expand Toggle + Quiet Link to Archive */}
      <div className="pt-2 pl-6 sm:pl-7 flex flex-wrap items-center gap-x-4 gap-y-2">
        {extraNotes.length > 0 && (
          <>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="minimal-notes-more"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[36px] font-serif italic text-[14px] sm:text-[15px] text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 hover:dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-400/50 hover:decoration-current transition-colors cursor-pointer"
            >
              <span>
                {expanded ? "Show less" : `View more (${extraNotes.length})`}
              </span>
              <span aria-hidden="true" className="not-italic font-mono text-xs">
                {expanded ? "↑" : "↓"}
              </span>
            </button>
            <span className="text-zinc-300 dark:text-white/[0.12] select-none" aria-hidden="true">
              ·
            </span>
          </>
        )}

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
