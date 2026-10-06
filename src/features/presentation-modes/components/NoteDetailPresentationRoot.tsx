"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import type { FieldNote } from "@/lib/fieldNotes";
import { NoteDetailClient } from "@/app/notes/[slug]/NoteDetailClient";
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
export function NoteDetailPresentationRoot({
  note,
  prevNote,
  nextNote,
  totalNotes,
}: NoteDetailPresentationRootProps) {
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

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
