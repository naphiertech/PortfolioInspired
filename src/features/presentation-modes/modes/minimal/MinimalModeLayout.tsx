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
import {
  presentationContainerVariants,
  presentationItemVariants,
  presentationNavVariants,
} from "@/lib/motion";

/**
 * MinimalModeLayout
 *
 * One-page, text-first personal presentation mode inspired by classical editorial typography.
 * - Old-style Roman serif typography (EB Garamond) scoped to this layout
 * - Narrow centered reading width (~640px) with generous whitespace
 * - Only 6 curated sections: Intro, Selected Work, What I Work With, Currently, GitHub Contributions, Connect
 * - Subtle editorial progressive reveal animation on active mode switch
 */
export function MinimalModeLayout() {
  const { previousMode, mode } = usePresentationMode();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 640 : true;

  // Active intentional transition into Minimal from another mode (Default or Focus)
  const isEnteringMinimal =
    isDesktop &&
    !shouldReduceMotion &&
    previousMode !== null &&
    previousMode !== "minimal" &&
    mode === "minimal";

  return (
    <div
      className={`${ebGaramond.variable} font-serif w-full max-w-[640px] mx-auto text-zinc-800 dark:text-[#beb9ad] selection:bg-[#343532] selection:text-[#eae6df] transition-colors duration-200`}
    >
      {/* 1. Header with View Switcher & Theme Toggle */}
      <motion.div
        variants={
          isEnteringMinimal
            ? presentationNavVariants
            : undefined
        }
      >
        <MinimalHeader />
      </motion.div>

      {/* 2. Main Minimal Content - Progressive editorial reveal */}
      <motion.div
        initial={isEnteringMinimal ? "initial" : false}
        animate="animate"
        variants={presentationContainerVariants}
        className="w-full will-change-[transform,opacity]"
      >
        {/* 2. Introduction & Identity */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalIntro />
        </motion.div>

        {/* 3. Selected Work */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalProjects />
        </motion.div>

        {/* 4. What I Work With */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalStack />
        </motion.div>

        {/* 5. Currently */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalCurrent />
        </motion.div>

        {/* 6. GitHub Contributions */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalContributions />
        </motion.div>

        {/* 7. Connect & Minimal Footer */}
        <motion.div
          variants={
            isEnteringMinimal && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <MinimalConnect />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MinimalModeLayout;
