"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (mode === "minimal" && typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [mode]);

  const transitionConfig = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.18,
        ease: "easeOut" as const,
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transitionConfig}
        className="w-full"
      >
        {mode === "focus" ? <FocusCertificationsPage /> : <CertificationsClient />}
      </motion.div>
    </AnimatePresence>
  );
}

export default CertificationsPresentationRoot;
