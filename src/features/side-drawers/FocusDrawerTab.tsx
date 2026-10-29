"use client";

import { Boxes, Music2 } from "lucide-react";

export function FocusDrawerTab({ drawer, isOpen, onToggle }: {
  drawer: "music" | "resources";
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = drawer === "music" ? Music2 : Boxes;
  const label = drawer === "music" ? "Music" : "Resources";
  return (
    <button
      type="button"
      aria-label={`Open ${drawer}`}
      aria-controls={`${drawer}-drawer-panel`}
      aria-expanded={isOpen}
      onClick={onToggle}
      style={{ top: drawer === "music" ? "calc(50% - 64px)" : "calc(50% + 64px)" }}
      className="hidden sm:flex fixed left-0 -translate-y-1/2 z-[100] h-28 items-center justify-center gap-3 border border-border-hairline bg-page px-3 py-4 font-mono text-xs text-ink hover:bg-surface transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand [writing-mode:vertical-rl]"
    >
      <Icon size={16} className="h-4 w-4 shrink-0" aria-hidden="true" />{label}
    </button>
  );
}
