"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { EditorialDivider } from "@/components/EditorialDivider";
import { FocusNavigation } from "./components/FocusNavigation";
import { FocusHero } from "./components/FocusHero";
import { FocusCapabilities } from "./components/FocusCapabilities";
import { FocusSelectedWork } from "./components/FocusSelectedWork";
import { FocusTechStack } from "./components/FocusTechStack";
import { FocusExperience } from "./components/FocusExperience";
import { FocusContact } from "./components/FocusContact";
import {
  presentationContainerVariants,
  presentationItemVariants,
  presentationNavVariants,
} from "@/lib/motion";

/**
 * FocusModeLayout
 *
 * High-signal engineering overview presentation.
 * Designed for recruiters, hiring managers, and quick technical evaluations.
 */
export function FocusModeLayout() {
  const { previousMode, mode } = usePresentationMode();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 640 : true;
  const isEnteringFocus =
    isDesktop &&
    !shouldReduceMotion &&
    previousMode !== null &&
    previousMode !== "focus" &&
    mode === "focus";

  return (
    <motion.div
      initial={isEnteringFocus ? "initial" : false}
      animate="animate"
      variants={presentationContainerVariants}
      className="w-full flex flex-col pt-1 pb-8 will-change-[transform,opacity]"
    >
      {/* Focus Top Navigation - anchors down from top */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationNavVariants
            : undefined
        }
      >
        <FocusNavigation />
      </motion.div>

      {/* 00 // PROFILE OVERVIEW */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusHero />
      </motion.div>

      {/* Structural Divider */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="my-6 sm:my-7" />
      </motion.div>

      {/* 01 // CORE ENGINEERING CAPABILITIES */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusCapabilities />
      </motion.div>

      {/* Structural Divider */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="my-6 sm:my-7" />
      </motion.div>

      {/* 02 // SELECTED FLAGSHIP SYSTEMS */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusSelectedWork />
      </motion.div>

      {/* Structural Divider */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="my-6 sm:my-7" />
      </motion.div>

      {/* 03 // TECHNICAL STACK */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusTechStack />
      </motion.div>

      {/* Structural Divider */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="my-6 sm:my-7" />
      </motion.div>

      {/* 04 // EXPERIENCE & EDUCATION TIMELINE */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusExperience />
      </motion.div>

      {/* Structural Divider */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="my-6 sm:my-7" />
      </motion.div>

      {/* 06 // CONTACT & AVAILABILITY */}
      <motion.div
        variants={
          isEnteringFocus && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <FocusContact />
      </motion.div>
    </motion.div>
  );
}

export default FocusModeLayout;
