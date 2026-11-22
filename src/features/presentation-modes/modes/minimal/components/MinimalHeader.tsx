"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isComponents =
    pathname === "/components" || pathname.startsWith("/components/");

  return (
    <header data-creative-font-exempt className="w-full relative flex items-center justify-between pt-2 pb-10 border-b border-zinc-200/80 dark:border-white/[0.08] select-none z-[70]">
      {/* Quiet Identity & Page Link */}
      <div className="flex items-center gap-3.5 min-w-0">
        <Link
          href="/"
          className="font-mono text-xs text-zinc-500 dark:text-[#827d73] hover:text-zinc-900 dark:hover:text-[#eae6df] tracking-wide transition-colors"
        >
          naphiernode
        </Link>
        <span className="w-px h-3 bg-zinc-300/80 dark:bg-white/[0.12] flex-shrink-0" aria-hidden="true" />
        <Link
          href="/components"
          aria-current={isComponents ? "page" : undefined}
          className={`font-serif italic text-[14px] transition-colors ${
            isComponents
              ? "text-zinc-900 dark:text-[#eae6df] underline underline-offset-4 decoration-zinc-500 dark:decoration-[#9e998e]"
              : "text-zinc-600 dark:text-[#9e998e] hover:text-zinc-900 dark:hover:text-[#eae6df] underline underline-offset-4 decoration-zinc-300/70 dark:decoration-zinc-700/70"
          }`}
        >
          Components
        </Link>
      </div>

      {/* Global Utilities */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <PresentationModeSwitcher variant="minimal" />
        <span className="w-px h-3 bg-zinc-300/80 dark:bg-white/[0.12] mx-1 flex-shrink-0" aria-hidden="true" />
        <CreativeModeToggle variant="minimal" />
        <ThemeToggle variant="minimal" />
      </div>
    </header>
  );
}

export default MinimalHeader;
