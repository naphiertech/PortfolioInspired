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

      {/* 1. Identity & Hero */}
      <ProfileHeader />

      {/* 2. About Narrative */}
      <AboutSection />

      {/* 2.5. Currently Building Live Dev Note */}
      <CurrentlyBuilding />

      {/* 2.75. Latest Development Activity */}
      <LatestActivity />

      {/* 3. Selected Projects (CAD Grid) */}
      <RecentProjects />

      {/* 4. Tech Stack (<categories/> & Vector Pills) */}
      <TechStack />

      {/* 5. Work Experience Timeline (Unboxed) */}
      <ExperienceTimeline />

      {/* 6. Recent Certifications (Unboxed) */}
      <Certifications />

      {/* 7. Recommendations */}
      <Recommendations />

      {/* 8. Gallery Moments */}
      <Gallery />

      {/* 9. Contact, Social & Memberships Matrix (Unboxed) */}
      <FooterGrid />
    </div>
  );
}
