"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LuArrowRight, LuX, LuExternalLink } from "react-icons/lu";
import { fieldNotes, FieldNote } from "@/lib/fieldNotes";

export function NotesSection() {
  const [selectedNote, setSelectedNote] = useState<FieldNote | null>(null);

  // Lock body scroll and listen for Escape key when note modal is open
  useEffect(() => {
    if (selectedNote) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedNote(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedNote]);

  return (
    <div className="w-full flex flex-col items-center pt-8 sm:pt-10 pb-4 px-4 sm:px-6">
      {/* 1. Page Header */}
      <div className="w-full max-w-2xl text-center space-y-3 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-foreground">
          Field Notes
        </h2>
        <p className="font-sans font-medium text-sm md:text-base text-foreground/80 leading-relaxed max-w-xl mx-auto">
          Things I&apos;ve been thinking about while building. Reflections on interface design, system architecture, AI development, and software craft.
        </p>
      </div>

      {/* 2. Notes List Archive */}
      <section id="notes-list" className="w-full max-w-2xl sm:max-w-3xl space-y-4 pt-2 scroll-mt-20">
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-black/10 dark:border-white/10">
          <div className="space-y-1">
            <h3 className="font-mono text-xl font-semibold tracking-wider text-foreground">
              Journal &amp; Reflections
            </h3>
            <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
              Written essays, technical notes, and architectural observations.
            </p>
          </div>
          <span className="font-sans text-xs text-muted-foreground">
            {fieldNotes.length} Notes
          </span>
        </div>

        {/* Editorial Notes Stack */}
        <div className="divide-y divide-black/10 dark:divide-white/10 border-t border-b border-black/10 dark:border-white/10">
          {fieldNotes.map((note) => (
            <article
              key={note.slug}
              onClick={() => setSelectedNote(note)}
              className="group relative flex items-start gap-3 sm:gap-6 py-5 sm:py-6 px-1 sm:px-4 cursor-pointer hover:bg-foreground/[0.03] transition-colors rounded-xl"
            >
              {/* Note Sequential Number */}
              <span className="font-mono text-2xl sm:text-3xl font-normal text-foreground/35 group-hover:text-foreground transition-colors select-none tabular-nums w-8 sm:w-10 shrink-0 pt-0.5">
                {note.number}
              </span>

              {/* Note Details */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Header Line */}
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h4 className="font-mono text-lg sm:text-xl font-semibold tracking-tight text-foreground group-hover:underline">
                    {note.title}
                  </h4>
                  <div className="flex items-center gap-2 font-sans text-xs text-muted-foreground shrink-0">
                    <span>{note.formattedDate || note.date}</span>
                    <span>•</span>
                    <span>{note.readTime}</span>
                  </div>
                </div>

                {/* Category & Emerald Dot */}
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {note.category}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed line-clamp-2">
                  {note.excerpt}
                </p>

                {/* Tags & Action Link */}
                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-muted-foreground bg-black/[0.03] dark:bg-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors group-hover:translate-x-1 duration-200">
                    <span>Read Note</span>
                    <LuArrowRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. In-Place Note Reader Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div
            onClick={() => setSelectedNote(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer overflow-y-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[85vh] bg-background border border-black/10 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 cursor-default overflow-y-auto my-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                aria-label="Close note"
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LuX className="size-5" />
              </button>

              {/* Note Metadata Header */}
              <div className="border-b border-black/10 dark:border-white/10 pb-4 space-y-2">
                <div className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">NOTE {selectedNote.number}</span>
                  <span>•</span>
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{selectedNote.category}</span>
                  <span>•</span>
                  <span>{selectedNote.readTime}</span>
                </div>

                <h3 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  {selectedNote.title}
                </h3>
              </div>

              {/* Note Lead */}
              <p className="font-sans text-sm sm:text-base text-foreground/90 leading-relaxed italic border-l-2 border-black/20 dark:border-white/20 pl-4 py-1">
                {selectedNote.content.lead}
              </p>

              {/* Note Sections */}
              <div className="space-y-6 font-sans font-normal text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {selectedNote.content.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    {section.heading && (
                      <h4 className="font-mono text-base sm:text-lg font-semibold tracking-tight text-foreground pt-2">
                        {section.heading}
                      </h4>
                    )}
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {para}
                      </p>
                    ))}
                    {section.callout && (
                      <div className="p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 font-sans text-xs text-foreground/90 my-2">
                        💡 {section.callout}
                      </div>
                    )}
                    {section.codeSnippet && (
                      <pre className="p-4 rounded-xl bg-black text-zinc-100 font-prime text-xs overflow-x-auto border border-zinc-800 my-2">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                    )}
                  </div>
                ))}

                {selectedNote.content.conclusion && (
                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <p className="font-sans font-medium text-foreground/90">
                      {selectedNote.content.conclusion}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 flex-wrap gap-3">
                <Link
                  href={`/notes/${selectedNote.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-sans text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <span>Open Full Page</span>
                  <LuExternalLink className="size-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 font-sans text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotesSection;
