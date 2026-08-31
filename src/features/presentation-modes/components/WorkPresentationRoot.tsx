"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { WorkClient } from "@/app/work/WorkClient";
import { FocusWorkPage } from "../modes/focus/pages/FocusWorkPage";

/**
 * WorkPresentationRoot
 *
 * Presentation-aware dispatcher for /work.
 * Dispatches between Default work timeline and Focus experience ledger.
 */
export function WorkPresentationRoot() {
  const { mode } = usePresentationMode();
  const shouldReduceMotion = useReducedMotion();

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
        {mode === "focus" ? <FocusWorkPage /> : <WorkClient />}
      </motion.div>
    </AnimatePresence>
  );
}

export default WorkPresentationRoot;
