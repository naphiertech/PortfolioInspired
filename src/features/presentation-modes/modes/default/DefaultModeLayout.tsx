import React from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { FieldNotesSection } from "@/components/FieldNotesSection";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Recommendations } from "@/components/Recommendations";
import { Gallery } from "@/components/Gallery";
import { FooterGrid } from "@/components/FooterGrid";
import { SnapSectionWrapper } from "@/components/SnapSectionWrapper";
import { EditorialDivider } from "@/components/EditorialDivider";
import { recommendations } from "@/lib/data";

/**
 * DefaultModeLayout
 *
 * Streamlined editorial homepage preview composition.
 * High-signal, engaging introduction with preview limits across projects,
 * tech, experience, and certs, linking out to dedicated full routes.
 */
export function DefaultModeLayout() {
  const hasApprovedRecommendations = recommendations.some(
    (rec) => rec.status === "approved" || (!rec.status && rec.quote)
  );

  return (
    <div className="w-full flex flex-col">
      {/* 1. Identity & Hero (Permanent - Never snapped) */}
      <ProfileHeader />

      {/* 3. Field Notes Index (Editorial Engineering Observations) */}
      <SnapSectionWrapper id="field-notes">
        <EditorialDivider className="mt-4 mb-6 sm:mt-6 sm:mb-8" />
        <FieldNotesSection />
      </SnapSectionWrapper>

      {/* 4. Selected Projects (Top 3 Strongest) */}
      <SnapSectionWrapper id="recent-projects">
        <EditorialDivider className="my-4 sm:my-6" />
        <RecentProjects />
      </SnapSectionWrapper>

      {/* 5. Tech Stack (Curated High-Signal Preview) */}
      <SnapSectionWrapper id="tech-stack" className="content-auto">
        <EditorialDivider className="my-4 sm:my-6" />
        <TechStack />
      </SnapSectionWrapper>

      {/* 6. Work Experience Timeline (Top 3 Recent Milestones) */}
      <SnapSectionWrapper id="experience" className="content-auto">
        <EditorialDivider className="my-4 sm:my-6" />
        <ExperienceTimeline />
      </SnapSectionWrapper>

      {/* 8. Recommendations (Rendered only when real approved recommendations exist) */}
      {hasApprovedRecommendations && (
        <SnapSectionWrapper id="recommendations" className="content-auto">
          <EditorialDivider className="my-4 sm:my-6" />
          <Recommendations />
        </SnapSectionWrapper>
      )}

      {/* 9. Compact Moments Gallery (4-Moment Preview) */}
      <SnapSectionWrapper id="gallery" className="content-auto">
        <EditorialDivider className="my-4 sm:my-6" />
        <Gallery />
      </SnapSectionWrapper>

      {/* 10. Contact, Social & Memberships Matrix (Permanent - Never snapped) */}
      <div className="content-auto">
        <EditorialDivider className="my-4 sm:my-6" />
        <FooterGrid />
      </div>
    </div>
  );
}

export default DefaultModeLayout;
