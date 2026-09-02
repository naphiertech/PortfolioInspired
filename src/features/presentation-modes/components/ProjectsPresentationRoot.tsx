"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import { FocusProjectsPage } from "../modes/focus/pages/FocusProjectsPage";

/**
 * ProjectsPresentationRoot
 *
 * Presentation-aware dispatcher for /projects.
 * Dispatches between Default CAD project gallery and Focus engineering index.
 */
export function ProjectsPresentationRoot() {
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
        {mode === "focus" ? <FocusProjectsPage /> : <ProjectsPageClient />}
      </motion.div>
    </AnimatePresence>
  );
}

export default ProjectsPresentationRoot;
