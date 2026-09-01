import React from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { NowSection } from "@/components/NowSection";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Certifications } from "@/components/Certifications";
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

      {/* 2. About Narrative */}
      <SnapSectionWrapper id="about">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <AboutSection />
      </SnapSectionWrapper>

      {/* 3. Live Focus & Development Activity (Merged Currently Building + Latest Activity) */}
      <SnapSectionWrapper id="now">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <NowSection />
      </SnapSectionWrapper>

      {/* 4. Selected Projects (Top 3 Strongest) */}
      <SnapSectionWrapper id="recent-projects">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <RecentProjects />
      </SnapSectionWrapper>

      {/* 5. Tech Stack (Curated High-Signal Preview) */}
      <SnapSectionWrapper id="tech-stack">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <TechStack />
      </SnapSectionWrapper>

      {/* 6. Work Experience Timeline (Top 3 Recent Milestones) */}
      <SnapSectionWrapper id="experience">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <ExperienceTimeline />
      </SnapSectionWrapper>

      {/* 7. Key Certifications (Top 3 Credentials) */}
      <SnapSectionWrapper id="certifications">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <Certifications />
      </SnapSectionWrapper>

      {/* 8. Recommendations (Rendered only when real approved recommendations exist) */}
      {hasApprovedRecommendations && (
        <SnapSectionWrapper id="recommendations">
          <EditorialDivider className="mb-10 sm:mb-12" />
          <Recommendations />
        </SnapSectionWrapper>
      )}

      {/* 9. Compact Moments Gallery (4-Moment Preview) */}
      <SnapSectionWrapper id="gallery">
        <EditorialDivider className="mb-10 sm:mb-12" />
        <Gallery />
      </SnapSectionWrapper>

      {/* 10. Contact, Social & Memberships Matrix (Permanent - Never snapped) */}
      <EditorialDivider className="mb-10 sm:mb-12" />
      <FooterGrid />
    </div>
  );
}

export default DefaultModeLayout;
