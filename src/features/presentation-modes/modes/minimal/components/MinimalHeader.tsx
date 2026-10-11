"use client";

import { PresentationModeSwitcher } from "../../../components/PresentationModeSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreativeModeToggle } from "@/features/creative-mode/components/CreativeModeToggle";

/**
 * MinimalHeader
 *
 * Quiet, understated top utility bar for Minimal Mode.
 * Exposes PresentationModeSwitcher (variant="minimal") and ThemeToggle.
 */
export function MinimalHeader() {
  return (
    <header data-creative-font-exempt className="w-full relative flex items-center justify-between pt-2 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08] select-none z-[70]">
      {/* Quiet Identity Label */}
      <span className="font-mono text-xs text-zinc-500 dark:text-[#827d73] tracking-wide">
        naphiernode
      </span>

      {/* Global Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        <PresentationModeSwitcher variant="minimal" />
        <div className="hidden min-[380px]:block">
          <CreativeModeToggle />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default MinimalHeader;
