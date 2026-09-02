"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { TechStackClient } from "@/app/tech-stack/TechStackClient";
import { FocusTechStackPage } from "../modes/focus/pages/FocusTechStackPage";

/**
 * TechStackPresentationRoot
 *
 * Presentation-aware dispatcher for /tech-stack.
 * Dispatches between Default categorized matrix and Focus tooling catalog.
 */
export function TechStackPresentationRoot() {
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
        {mode === "focus" ? <FocusTechStackPage /> : <TechStackClient />}
      </motion.div>
    </AnimatePresence>
  );
}

export default TechStackPresentationRoot;
