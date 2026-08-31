"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { DefaultModeLayout } from "../modes/default/DefaultModeLayout";
import { FocusModeLayout } from "../modes/focus/FocusModeLayout";

/**
 * PresentationModeRoot
 *
 * Top-level presentation layout dispatcher.
 * Features a lightweight 180ms crossfade transition between active modes
 * with immediate reduced-motion fallback.
 */
export function PresentationModeRoot() {
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
        {mode === "focus" ? <FocusModeLayout /> : <DefaultModeLayout />}
      </motion.div>
    </AnimatePresence>
  );
}

export default PresentationModeRoot;
