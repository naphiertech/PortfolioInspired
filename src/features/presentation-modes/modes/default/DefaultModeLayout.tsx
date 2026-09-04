"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { NowSection } from "@/components/NowSection";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Recommendations } from "@/components/Recommendations";
import { Gallery } from "@/components/Gallery";
import { FooterGrid } from "@/components/FooterGrid";
import { SnapSectionWrapper } from "@/components/SnapSectionWrapper";
import { EditorialDivider } from "@/components/EditorialDivider";
import { recommendations } from "@/lib/data";
import {
  presentationContainerVariants,
  presentationItemVariants,
} from "@/lib/motion";

/**
 * DefaultModeLayout
 *
 * Streamlined editorial homepage preview composition.
 * High-signal, engaging introduction with preview limits across projects,
 * tech, experience, and certs, linking out to dedicated full routes.
 */
export function DefaultModeLayout() {
  const { previousMode, mode } = usePresentationMode();
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 640 : true;
  const isEnteringDefault =
    isDesktop &&
    !shouldReduceMotion &&
    previousMode !== null &&
    previousMode !== "default" &&
    mode === "default";

  const hasApprovedRecommendations = recommendations.some(
    (rec) => rec.status === "approved" || (!rec.status && rec.quote)
  );

  return (
    <motion.div
      initial={isEnteringDefault ? "initial" : false}
      animate="animate"
      variants={presentationContainerVariants}
      className="w-full flex flex-col will-change-[transform,opacity]"
    >
      {/* 1. Identity & Hero (Permanent - Never snapped) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <ProfileHeader />
      </motion.div>

      {/* 2. About Narrative */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="about">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <AboutSection />
        </SnapSectionWrapper>
      </motion.div>

      {/* 3. Live Focus & Development Activity (Merged Currently Building + Latest Activity) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="now">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <NowSection />
        </SnapSectionWrapper>
      </motion.div>

      {/* 4. Selected Projects (Top 3 Strongest) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="recent-projects">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <RecentProjects />
        </SnapSectionWrapper>
      </motion.div>

      {/* 5. Tech Stack (Curated High-Signal Preview) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="tech-stack">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <TechStack />
        </SnapSectionWrapper>
      </motion.div>

      {/* 6. Work Experience Timeline (Top 3 Recent Milestones) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="experience">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <ExperienceTimeline />
        </SnapSectionWrapper>
      </motion.div>

      {/* 8. Recommendations (Rendered only when real approved recommendations exist) */}
      {hasApprovedRecommendations && (
        <motion.div
          variants={
            isEnteringDefault && !shouldReduceMotion
              ? presentationItemVariants
              : undefined
          }
        >
          <SnapSectionWrapper id="recommendations">
            <EditorialDivider className="mb-10 sm:mb-12" />
            <Recommendations />
          </SnapSectionWrapper>
        </motion.div>
      )}

      {/* 9. Compact Moments Gallery (4-Moment Preview) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <SnapSectionWrapper id="gallery">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <Gallery />
        </SnapSectionWrapper>
      </motion.div>

      {/* 10. Contact, Social & Memberships Matrix (Permanent - Never snapped) */}
      <motion.div
        variants={
          isEnteringDefault && !shouldReduceMotion
            ? presentationItemVariants
            : undefined
        }
      >
        <EditorialDivider className="mb-10 sm:mb-12" />
        <FooterGrid />
      </motion.div>
    </motion.div>
  );
}

export default DefaultModeLayout;
