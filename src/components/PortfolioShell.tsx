"use client";

import React, { ReactNode } from "react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { SnapRouteGuard } from "@/components/SnapRouteGuard";
import { EditorialDivider } from "@/components/EditorialDivider";
import { SITE_NAME } from "@/lib/siteConfig";
import { BUILD_INFO } from "@/lib/buildInfo";

interface PortfolioShellProps {
  children: ReactNode;
}

/**
 * PortfolioShell
 *
 * Responsive layout container that dynamically adapts max-width based on presentation mode.
 * - Default Mode: Centered 760px editorial reading measure (max-w-reading)
 * - Focus Mode: Expanded 1020px engineering dossier canvas across homepage and deep routes (max-w-[1020px])
 */
export function PortfolioShell({ children }: PortfolioShellProps) {
  const { mode } = usePresentationMode();
  const isFocus = mode === "focus";

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-32 relative min-h-screen flex flex-col justify-between z-10 transition-all duration-200 ${
        isFocus ? "max-w-[1020px]" : "max-w-reading"
      }`}
    >
      <main className="w-full">
        <SnapRouteGuard>{children}</SnapRouteGuard>
      </main>

      {/* Minimalist Tech Footer with Editorial Rail */}
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
  );
}

export default PortfolioShell;
