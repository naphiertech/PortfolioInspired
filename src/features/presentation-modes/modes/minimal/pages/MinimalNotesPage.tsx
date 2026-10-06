"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fieldNotes } from "@/lib/fieldNotes";
import { ebGaramond } from "../fonts";
import { MinimalHeader } from "../components/MinimalHeader";

/**
 * MinimalNotesPage
 *
 * Minimal Mode presentation for /notes archive index.
 * Calm, typography-driven reading index of engineering essays,
 * architectural observations, and software reflections.
 */
export function MinimalNotesPage() {
  return (
    <div
      className={`${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] transition-colors duration-200 py-2 sm:py-4 pb-16`}
    >
      {/* 1. Header with View Switcher & Theme Toggle */}
      <MinimalHeader />

      <div className="pt-8 sm:pt-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-[#827d73] hover:text-zinc-900 hover:dark:text-[#eae6df] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="font-serif italic text-sm">Home</span>
          </Link>
        </div>

        {/* Page Heading */}
        <header className="space-y-2 border-b border-zinc-200/80 dark:border-white/[0.08] pb-6">
          <h1 className="font-serif italic text-2xl sm:text-3xl text-zinc-900 dark:text-[#eae6df] font-normal tracking-tight">
            Field Notes Archive
          </h1>
          <p className="font-serif text-[15px] sm:text-[16px] text-zinc-600 dark:text-[#9e998e] leading-relaxed">
            Observations on interface ergonomics, system resilience, AI-assisted development velocity, and software craftsmanship.
          </p>
        </header>

        {/* Index of Notes */}
        <div className="space-y-8">
          {fieldNotes.map((note) => (
            <article key={note.slug} className="group space-y-2 border-b border-zinc-200/80 dark:border-white/[0.08] pb-8 last:border-b-0">
              {/* Title & Sequential Number */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-zinc-400 dark:text-[#827d73] tabular-nums select-none flex-shrink-0">
                  {note.number}
                </span>
                <h2 className="font-serif text-[18px] sm:text-[19px] text-zinc-900 dark:text-[#eae6df] font-medium tracking-tight">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 hover:dark:decoration-[#eae6df] transition-colors"
                  >
                    {note.title}
                  </Link>
                </h2>
              </div>

              {/* Excerpt */}
              <p className="font-serif text-[15px] sm:text-[16px] text-zinc-700 dark:text-[#beb9ad] leading-[26px] pl-6 sm:pl-7">
                {note.excerpt}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-[#827d73] pl-6 sm:pl-7 pt-1">
                <span>{note.category}</span>
                <span className="text-zinc-300 dark:text-white/[0.12] select-none">·</span>
                <time dateTime={note.date}>{note.formattedDate}</time>
                <span className="text-zinc-300 dark:text-white/[0.12] select-none">·</span>
                <span>{note.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MinimalNotesPage;
