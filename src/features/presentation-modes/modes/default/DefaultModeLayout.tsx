import React from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { CurrentlyBuilding } from "@/components/CurrentlyBuilding";
import { LatestActivity } from "@/components/LatestActivity";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Certifications } from "@/components/Certifications";
import { Recommendations } from "@/components/Recommendations";
import { Gallery } from "@/components/Gallery";
import { FooterGrid } from "@/components/FooterGrid";
import { SnapSectionWrapper } from "@/components/SnapSectionWrapper";
import { EditorialDivider } from "@/components/EditorialDivider";

/**
 * DefaultModeLayout
 *
 * Full comprehensive editorial narrative layout (10 sequential sections).
 * Preserves all snap easter egg wrappers, section IDs, and architectural rails.
 */
export function DefaultModeLayout() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Identity & Hero (Permanent - Never snapped) */}
      <ProfileHeader />

      {/* 2. About Narrative */}
      <SnapSectionWrapper id="about">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <AboutSection />
      </SnapSectionWrapper>

      {/* 2.5. Currently Building Live Dev Note */}
      <SnapSectionWrapper id="currently-building">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <CurrentlyBuilding />
      </SnapSectionWrapper>

      {/* 2.75. Latest Development Activity */}
      <SnapSectionWrapper id="latest-activity">
        <LatestActivity />
      </SnapSectionWrapper>

      {/* 3. Selected Projects (CAD Grid) */}
      <SnapSectionWrapper id="recent-projects">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <RecentProjects />
      </SnapSectionWrapper>

      {/* 4. Tech Stack (<categories/> & Vector Pills) */}
      <SnapSectionWrapper id="tech-stack">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <TechStack />
      </SnapSectionWrapper>

      {/* 5. Work Experience Timeline */}
      <SnapSectionWrapper id="experience">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <ExperienceTimeline />
      </SnapSectionWrapper>

      {/* 6. Recent Certifications */}
      <SnapSectionWrapper id="certifications">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <Certifications />
      </SnapSectionWrapper>

      {/* 7. Recommendations */}
      <SnapSectionWrapper id="recommendations">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <Recommendations />
      </SnapSectionWrapper>

      {/* 8. Gallery Moments */}
      <SnapSectionWrapper id="gallery">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <Gallery />
      </SnapSectionWrapper>

      {/* 9. Contact, Social & Memberships Matrix (Permanent - Never snapped) */}
      <EditorialDivider className="mb-10 sm:mb-12" />
      <FooterGrid />
    </div>
  );
}

export default DefaultModeLayout;
