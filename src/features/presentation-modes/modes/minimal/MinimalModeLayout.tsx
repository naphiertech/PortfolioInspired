"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { ebGaramond } from "./fonts";
import { MinimalHeader } from "./components/MinimalHeader";
import { MinimalIntro } from "./components/MinimalIntro";
import { MinimalProjects } from "./components/MinimalProjects";
import { MinimalStack } from "./components/MinimalStack";
import { MinimalCurrent } from "./components/MinimalCurrent";
import { MinimalContributions } from "./components/MinimalContributions";
import { MinimalConnect } from "./components/MinimalConnect";

/**
 * MinimalModeLayout
 *
 * One-page, text-first personal presentation mode inspired by classical editorial typography.
 * - Old-style Roman serif typography (EB Garamond) scoped to this layout
 * - Narrow centered reading width (~640px) with generous whitespace
 * - Only 6 curated sections: Intro, Selected Work, What I Work With, Currently, GitHub Contributions, Connect
 * - Subtle editorial page reveal animation on active mode switch (opacity 0->1, y 12->0, blur 2px->0)
 */
export function MinimalModeLayout() {
  const { previousMode, mode } = usePresentationMode();
  const shouldReduceMotion = useReducedMotion();

  // Active intentional transition into Minimal from another mode (Default or Focus)
  const isEnteringMinimal =
    previousMode !== null && previousMode !== "minimal" && mode === "minimal";

  const contentVariants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      filter: shouldReduceMotion ? "none" : "blur(2px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.4,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div
      className={`${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] transition-colors duration-200`}
    >
      {/* 1. Header with View Switcher & Theme Toggle - Remains stable */}
      <MinimalHeader />

      {/* 2. Main Minimal Content - Subtle editorial page reveal */}
      <motion.div
        initial={isEnteringMinimal ? "initial" : false}
        animate="animate"
        variants={contentVariants}
        className="w-full will-change-[transform,opacity]"
      >
        {/* 2. Introduction & Identity */}
        <MinimalIntro />

        {/* 3. Selected Work */}
        <MinimalProjects />

        {/* 4. What I Work With */}
        <MinimalStack />

        {/* 5. Currently */}
        <MinimalCurrent />

        {/* 6. GitHub Contributions */}
        <MinimalContributions />

        {/* 7. Connect & Minimal Footer */}
        <MinimalConnect />
      </motion.div>
    </div>
  );
}

export default MinimalModeLayout;
