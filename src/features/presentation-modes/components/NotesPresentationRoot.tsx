"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { NotesPageClient } from "@/app/notes/NotesPageClient";
import dynamic from "next/dynamic";

const FocusNotesPage = dynamic(
  () =>
    import("../modes/focus/pages/FocusNotesPage").then(
      (module) => module.FocusNotesPage
    ),
  { ssr: true }
);

const MinimalNotesPage = dynamic(
  () =>
    import("../modes/minimal/pages/MinimalNotesPage").then(
      (module) => module.MinimalNotesPage
    ),
  { ssr: true }
);

/**
 * NotesPresentationRoot
 *
 * Presentation-aware dispatcher for /notes index page.
 * Dispatches between Default list index, Focus engineering dossier, and Minimal essay archive.
 */
export function NotesPresentationRoot() {
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
        <FocusNotesPage />
      ) : mode === "minimal" ? (
        <MinimalNotesPage />
      ) : (
        <NotesPageClient />
      )}
    </div>
  );
}

export default NotesPresentationRoot;
