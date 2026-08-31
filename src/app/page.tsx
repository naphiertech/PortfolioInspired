import React from "react";
import { PresentationModeRoot } from "@/features/presentation-modes/components/PresentationModeRoot";
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
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Presentation Mode Root Dispatcher */}
      <PresentationModeRoot />
    </>
  );
}
