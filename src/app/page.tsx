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
import { SITE_URL, SITE_NAME, SITE_DEFAULT_DESCRIPTION, AUTHOR_INFO } from "@/lib/siteConfig";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DEFAULT_DESCRIPTION,
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_INFO.name,
        url: `${SITE_URL}/`,
        jobTitle: AUTHOR_INFO.jobTitle,
        alumniOf: {
          "@type": "EducationalOrganization",
          name: AUTHOR_INFO.affiliation,
        },
        sameAs: AUTHOR_INFO.socials,
        knowsAbout: [
          "Web Development",
          "Full-Stack Engineering",
          "TypeScript",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Supabase",
          "PostgreSQL",
          "UI/UX Design",
        ],
      },
    ],
  };

  return (
    <div className="w-full flex flex-col">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
