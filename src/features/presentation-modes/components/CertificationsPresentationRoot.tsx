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
  const { mode, previousMode } = usePresentationMode();
  const isSwitch = previousMode !== null && previousMode !== mode;

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div
      key={mode}
      data-mode={mode}
      className={`w-full presentation-mode-enter ${
        isSwitch ? "presentation-mode-switch" : ""
      }`}
    >
      {mode === "focus" ? <FocusCertificationsPage /> : <CertificationsClient />}
    </div>
  );
}

export default CertificationsPresentationRoot;
