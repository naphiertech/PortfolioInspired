"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
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
 * - Agent Folio Mode: Focused 768px minimal AI workspace on home, standard reading container on subpages
 */
export function PortfolioShell({ children }: PortfolioShellProps) {
  const { mode } = usePresentationMode();
  const pathname = usePathname();
  const isFocus = mode === "focus";
  const isMinimal = mode === "minimal";
  const isAgent = mode === "agent";
  const isAgentHome = isAgent && pathname === "/";

  return (
    <div
      className={`w-full mx-auto relative min-h-screen flex flex-col justify-between z-10 transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        isAgentHome
          ? "max-w-3xl px-3 sm:px-6 pt-3 sm:pt-4 pb-3 sm:pb-4 min-h-[100dvh] flex flex-col"
          : isMinimal
          ? "max-w-[640px] px-5 sm:px-6 md:px-8 pt-8 pb-20"
          : isFocus
          ? "max-w-[1020px] px-4 sm:px-6 md:px-8 pt-12 pb-32"
          : "max-w-reading px-4 sm:px-6 md:px-8 pt-12 pb-32"
      }`}
    >
      {/* Document-Scoped Architectural Technical Grid (Smoothly faded in Minimal & Agent Home) */}
      <div
        className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMinimal || isAgentHome ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <TechnicalGrid />
      </div>

      <main className={`w-full relative z-10 ${isAgentHome ? "flex-1 flex flex-col" : ""}`}>
        <SnapRouteGuard>{children}</SnapRouteGuard>
      </main>

      {/* Minimalist Tech Footer with Editorial Rail (Default and Focus only) */}
      <div
        className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMinimal || isAgentHome ? "hidden pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={isMinimal || isAgentHome}
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
