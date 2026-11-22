import React from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { FieldNotesSection } from "@/components/FieldNotesSection";
import { RecentProjects } from "@/components/RecentProjects";
import { TechStack } from "@/components/TechStack";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Recommendations } from "@/components/Recommendations";
import { ReadingShelf } from "@/components/ReadingShelf";
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
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <FieldNotesSection />
      </SnapSectionWrapper>

      {/* 4. Selected Projects (Top 3 Strongest) */}
      <SnapSectionWrapper id="recent-projects">
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <RecentProjects />
      </SnapSectionWrapper>

      {/* 5. Tech Stack (Curated High-Signal Preview) */}
      <SnapSectionWrapper id="tech-stack">
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <TechStack />
      </SnapSectionWrapper>

      {/* 6. Work Experience Timeline (Top 3 Recent Milestones) */}
      <SnapSectionWrapper id="experience">
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <div className="content-auto">
          <ExperienceTimeline />
        </div>
      </SnapSectionWrapper>

      {/* 8. Recommendations (Rendered only when real approved recommendations exist) */}
      {hasApprovedRecommendations && (
        <SnapSectionWrapper id="recommendations">
          <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
          <div className="content-auto">
            <Recommendations />
          </div>
        </SnapSectionWrapper>
      )}

      {/* 8.5 Reading Shelf (Books I keep coming back to) */}
      <SnapSectionWrapper id="reading-shelf">
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <ReadingShelf variant="default" />
      </SnapSectionWrapper>

      {/* 9. Compact Moments Gallery (4-Moment Preview) */}
      <SnapSectionWrapper id="gallery">
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <div className="content-auto">
          <Gallery />
        </div>
      </SnapSectionWrapper>

      {/* 10. Contact, Social & Memberships Matrix (Permanent - Never snapped) */}
      <div>
        <EditorialDivider variant="hatch" className="my-3 sm:my-4" />
        <div className="content-auto">
          <FooterGrid />
        </div>
      </div>
    </div>
  );
}

export default DefaultModeLayout;
