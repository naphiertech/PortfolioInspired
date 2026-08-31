"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "../context/PresentationModeContext";
import { FullProjectItem } from "@/lib/data";
import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";
import { FocusProjectDetailPage } from "../modes/focus/pages/FocusProjectDetailPage";

interface ProjectDetailPresentationRootProps {
  project: FullProjectItem;
  prevProject?: FullProjectItem;
  nextProject?: FullProjectItem;
}

/**
 * ProjectDetailPresentationRoot
 *
 * Presentation-aware dispatcher for /projects/[slug].
 * Dispatches between Default case study and Focus engineering case file.
 */
export function ProjectDetailPresentationRoot({
  project,
  prevProject,
  nextProject,
}: ProjectDetailPresentationRootProps) {
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
        {mode === "focus" ? (
          <FocusProjectDetailPage
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        ) : (
          <ProjectDetailClient
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ProjectDetailPresentationRoot;
