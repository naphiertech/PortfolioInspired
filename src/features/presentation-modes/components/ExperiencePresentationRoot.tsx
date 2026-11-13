"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ExperienceClient } from "@/app/experience/ExperienceClient";
import dynamic from "next/dynamic";

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
    if (typeof window === "undefined") return;
    if (mode === "minimal") {
      router.replace("/");
    } else if (mode === "agent" && previousMode !== null && previousMode !== mode) {
      router.replace("/?tab=experience");
    }
  }, [mode, previousMode, router]);

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
