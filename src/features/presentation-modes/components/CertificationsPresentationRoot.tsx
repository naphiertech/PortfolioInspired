"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePresentationMode } from "../context/PresentationModeContext";
import { CertificationsClient } from "@/app/certifications/CertificationsClient";
import dynamic from "next/dynamic";
import { RouteLoading } from "@/components/RouteLoading";

const FocusCertificationsPage = dynamic(
  () => import("../modes/focus/pages/FocusCertificationsPage").then(module => module.FocusCertificationsPage),
  { loading: () => <RouteLoading view="certifications" /> },
);

/**
 * CertificationsPresentationRoot
 *
 * Presentation-aware dispatcher for /certifications.
 * Dispatches between Default verified certifications and Focus credential dossier.
 */
export function CertificationsPresentationRoot() {
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
      {mode === "focus" ? <FocusCertificationsPage /> : <CertificationsClient />}
    </div>
  );
}

export default CertificationsPresentationRoot;
