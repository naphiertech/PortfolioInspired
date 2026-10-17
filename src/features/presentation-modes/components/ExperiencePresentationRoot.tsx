"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import dynamic from "next/dynamic";

const ExperienceClient = dynamic(
  () => import("@/app/experience/ExperienceClient").then((mod) => mod.ExperienceClient),
  {
    loading: () => (
      <div className="w-full min-h-[60vh] flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
        Loading experience...
      </div>
    ),
  }
);

const FocusExperiencePage = dynamic(
  () => import("../modes/focus/pages/FocusExperiencePage").then((mod) => mod.FocusExperiencePage),
  {
    loading: () => (
      <div className="w-full min-h-[60vh] flex items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
        Loading focus ledger...
      </div>
    ),
  }
);

/**
 * ExperiencePresentationRoot
 *
 * Presentation-aware dispatcher for /experience.
 * Unifies Work History, Technical Stack, and Verified Credentials.
 * Dispatches between Default standard editorial layout and Focus minimal ledger.
 */
export function ExperiencePresentationRoot() {
  const router = useRouter();
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      router.replace("/");
    }
  }, [mode, router]);

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "focus" ? <FocusExperiencePage /> : <ExperienceClient />}
    </div>
  );
}

export default ExperiencePresentationRoot;
