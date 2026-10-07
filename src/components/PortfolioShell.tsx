"use client";

import React, { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { SnapRouteGuard } from "@/components/SnapRouteGuard";
import dynamic from "next/dynamic";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechnicalGrid } from "@/components/TechnicalGrid";

const VisitorPresence = dynamic(
  () => import("@/components/VisitorPresence").then((m) => m.VisitorPresence),
  {
    ssr: false,
  }
);

function DeferredVisitorPresence() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const trigger = () => setReady(true);
    const timer = setTimeout(trigger, 6000);
    const onInteract = () => {
      trigger();
      clearTimeout(timer);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };

    window.addEventListener("scroll", onInteract, { passive: true, once: true });
    window.addEventListener("touchstart", onInteract, { passive: true, once: true });
    window.addEventListener("pointerdown", onInteract, { passive: true, once: true });
    window.addEventListener("keydown", onInteract, { passive: true, once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  if (!ready) return null;
  return <VisitorPresence />;
}
import { SITE_NAME } from "@/lib/siteConfig";
import { BUILD_INFO } from "@/lib/buildInfo";
const MusicEdgeDrawer = dynamic(
  () => import("@/features/music-drawer").then((m) => m.MusicEdgeDrawer),
  { ssr: false }
);
const ResourcesEdgeDrawer = dynamic(
  () => import("@/features/resources-drawer").then((m) => m.ResourcesEdgeDrawer),
  { ssr: false }
);
import { SideDrawerProvider } from "@/features/side-drawers/SideDrawerProvider";
import styles from "./ContentSurfaces.module.css";
const CreativeModeHost = dynamic(
  () => import("@/features/creative-mode/components/CreativeModeHost").then((m) => m.CreativeModeHost),
  { ssr: false }
);
import { useCreativeMode } from "@/features/creative-mode";
import { CREATIVE_MAPPINGS, supportsCreativeMode } from "@/features/creative-mode/lib/creativeModeConfig";
const CreativeFontStyles = dynamic(
  () => import("@/features/creative-mode/components/CreativeFontStyles"),
  { ssr: false }
);
const LandscapeFooter = dynamic(
  () => import("./LandscapeFooter").then((m) => m.LandscapeFooter),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full" aria-hidden="true" />,
  }
);
const CreativeNotes = dynamic(
  () => import("@/features/creative-mode/components/CreativeNotes").then((m) => m.CreativeNotes),
  { ssr: false }
);

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
  const contentRef = useRef<HTMLElement>(null);
  const { mode } = usePresentationMode();
  const pathname = usePathname();
  const isFocus = mode === "focus";
  const isMinimal = mode === "minimal";
  const isAgent = mode === "agent";
  const isAgentHome = isAgent && pathname === "/";
  // Omit the scenic footer when reading an individual chosen field note (/notes/:slug)
  const isReadingNote = pathname.startsWith("/notes/") && pathname !== "/notes";
  const { state: creative, active: creativeActive, effectiveMotion } = useCreativeMode();
  const mapping = supportsCreativeMode(mode) ? CREATIVE_MAPPINGS[mode] : null;
  const radii = mapping?.radii[creative.corners];
  const motion = mapping?.motion[effectiveMotion];
  const isCustomFont = creativeActive && creative.fontPairing !== "original";

  return (
    <div
      style={{
        "--creative-grid-opacity": creativeActive ? 1 : 0,
        ...(creativeActive && mapping ? { maxWidth: mapping.widths[creative.contentWidth] } : {}),
        ...(mode !== "agent" ? { paddingBottom: 0 } : {}),
      } as React.CSSProperties}
      className={`${styles.content} w-full mx-auto relative min-h-screen flex flex-col justify-between z-10 ${
        isAgentHome
          ? "max-w-3xl px-3 sm:px-6 pt-3 sm:pt-4 pb-3 sm:pb-4 min-h-[100dvh] flex flex-col"
          : isMinimal
          ? "max-w-[640px] px-5 sm:px-6 md:px-8 pt-8 pb-20"
          : isFocus
          ? "max-w-[1020px] px-4 sm:px-6 md:px-8 pt-12 pb-32"
          : "max-w-reading px-4 sm:px-6 md:px-8 pt-12 pb-32"
      }`}
    >
      {/* Keep one player and resources toolbox across Default routes; leaving Default unmounts them. */}
      {mode === "default" && (
        <SideDrawerProvider>
          <MusicEdgeDrawer />
          <ResourcesEdgeDrawer />
        </SideDrawerProvider>
      )}
      <CreativeModeHost />

      {/* Document-Scoped Architectural Technical Grid (Smoothly faded in Minimal & Agent Home) */}
      <div
        className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMinimal || isAgentHome ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden="true"
      >
        <TechnicalGrid />
      </div>

      {/* Top Center Visitor Presence Indicator */}
      {!isAgentHome && !isMinimal && (
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center z-30 pointer-events-auto">
          <DeferredVisitorPresence />
        </div>
      )}

      <main
        ref={contentRef}
        className={`w-full relative z-10 ${isAgentHome ? "flex-1 flex flex-col" : ""}`}
        data-creative-mode={creativeActive ? "on" : undefined}
        data-creative-presentation={creativeActive ? mode : undefined}
        data-creative-font={isCustomFont ? creative.fontPairing : undefined}
        data-creative-corners={creativeActive ? creative.corners : undefined}
        data-creative-spacing={creativeActive ? creative.spacing : undefined}
        data-creative-motion={creativeActive ? effectiveMotion : undefined}
        style={creativeActive && mapping && radii && motion ? {
          "--creative-type-scale": mapping.type[creative.typeScale],
          "--creative-spacing": mapping.spacing[creative.spacing],
          "--creative-radius-card": `${radii.card}px`,
          "--creative-radius-control": `${radii.control}px`,
          "--creative-radius-panel": `${radii.panel}px`,
          "--creative-motion-duration": `${motion.duration}s`,
          "--creative-motion-distance": `${motion.distance}px`,
          "--creative-motion-scale": motion.scale,
        } as React.CSSProperties : undefined}
      >
        {creativeActive && <CreativeFontStyles fontPairing={creative.fontPairing} />}
        <SnapRouteGuard>{children}</SnapRouteGuard>
      </main>
      <CreativeNotes key={`${mode}:${pathname}`} contentRef={contentRef} />

      {/* Scenic ending for supported modes; Agent keeps its existing footer path; omitted when reading a chosen note */}
      {!isReadingNote && (
        <div
          className={`transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isAgentHome ? "hidden pointer-events-none" : "opacity-100"
          }`}
          aria-hidden={isAgentHome}
        >
          {mode !== "agent" ? <LandscapeFooter mode={mode} /> : <>
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
          </>}
        </div>
      )}
    </div>
  );
}

export default PortfolioShell;
