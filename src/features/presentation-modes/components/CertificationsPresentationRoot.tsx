"use client";

import React from "react";
import { usePresentationMode } from "../context/PresentationModeContext";
import { CertificationsClient } from "@/app/certifications/CertificationsClient";
import { FocusCertificationsPage } from "../modes/focus/pages/FocusCertificationsPage";

/**
 * CertificationsPresentationRoot
 *
 * Presentation-aware dispatcher for /certifications.
 * Dispatches between Default verified certifications and Focus credential dossier.
 */
export function CertificationsPresentationRoot() {
  const { mode, previousMode, clearPreviousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isSwitch) {
      clearPreviousMode();
    }
  };

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div
      key={mode}
      data-mode={mode}
      data-previous-mode={previousMode ?? undefined}
      onAnimationEnd={handleAnimationEnd}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "focus" ? <FocusCertificationsPage /> : <CertificationsClient />}
    </div>
  );
}

export default CertificationsPresentationRoot;
