"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { WorkClient } from "@/app/work/WorkClient";
import dynamic from "next/dynamic";

const FocusWorkPage = dynamic(
  () => import("../modes/focus/pages/FocusWorkPage").then(module => module.FocusWorkPage),
);

/**
 * WorkPresentationRoot
 *
 * Presentation-aware dispatcher for /work.
 * Dispatches between Default work timeline and Focus experience ledger.
 */
export function WorkPresentationRoot() {
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
      {mode === "focus" ? <FocusWorkPage /> : <WorkClient />}
    </div>
  );
}

export default WorkPresentationRoot;
