"use client";

import React from "react";
import { PresentationModeSwitcher } from "../../../components/PresentationModeSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * MinimalHeader
 *
 * Quiet, understated top utility bar for Minimal Mode.
 * Exposes PresentationModeSwitcher (variant="minimal") and ThemeToggle.
 */
export function MinimalHeader() {
  return (
    <header className="w-full flex items-center justify-between pt-2 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08] select-none">
      {/* Quiet Identity Label */}
      <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73] tracking-wide">
        naphiernode
      </span>

      {/* Global Utilities */}
      <div className="flex items-center gap-2.5">
        <PresentationModeSwitcher variant="minimal" />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default MinimalHeader;
