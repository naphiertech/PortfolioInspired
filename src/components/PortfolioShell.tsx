"use client";

import React, { ReactNode } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { SnapRouteGuard } from "@/components/SnapRouteGuard";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechnicalGrid } from "@/components/TechnicalGrid";
import { SITE_NAME } from "@/lib/siteConfig";
import { BUILD_INFO } from "@/lib/buildInfo";

interface PortfolioShellProps {
  children: ReactNode;
}

/**
 * PortfolioShell
 *
 * Responsive layout container that dynamically adapts max-width and structural chrome
 * based on the active presentation mode:
 * - Default Mode: Centered 760px editorial reading measure (max-w-reading) with TechnicalGrid
 * - Focus Mode: Expanded 1020px engineering dossier canvas (max-w-[1020px]) with TechnicalGrid
 * - Minimal Mode: Narrow 640px Roman-serif reading column with clean background (no TechnicalGrid)
 */
export function PortfolioShell({ children }: PortfolioShellProps) {
  const { mode } = usePresentationMode();
  const isFocus = mode === "focus";
  const isMinimal = mode === "minimal";

  return (
    <div
      className={`w-full mx-auto relative min-h-screen flex flex-col justify-between z-10 transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        isMinimal
          ? "max-w-[640px] px-5 sm:px-6 md:px-8 pt-8 pb-20"
          : isFocus
          ? "max-w-[1020px] px-4 sm:px-6 md:px-8 pt-12 pb-32"
          : "max-w-reading px-4 sm:px-6 md:px-8 pt-12 pb-32"
      }`}
    >
      {/* Document-Scoped Architectural Technical Grid (Smoothly faded in Minimal) */}
      <div
        className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMinimal ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <TechnicalGrid />
      </div>

      <main className="w-full relative z-10">
        <SnapRouteGuard>{children}</SnapRouteGuard>
      </main>

      {/* Minimalist Tech Footer with Editorial Rail (Default and Focus only) */}
      <div
        className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMinimal ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <EditorialDivider className="mt-16 mb-6" />
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground select-none">
          <p>
            &copy; 2026 {SITE_NAME}. Designed with precision & craft.
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground/80">
            <span>Portfolio build ·</span>
            <time dateTime={BUILD_INFO.isoDate} className="text-ink/90 font-medium">
              {BUILD_INFO.formattedDate}
            </time>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default PortfolioShell;
