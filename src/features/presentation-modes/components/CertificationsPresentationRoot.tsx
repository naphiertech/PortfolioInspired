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
  const { mode } = usePresentationMode();

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  return (
    <div key={mode} className="w-full presentation-mode-enter">
      {mode === "focus" ? <FocusCertificationsPage /> : <CertificationsClient />}
    </div>
  );
}

export default CertificationsPresentationRoot;
