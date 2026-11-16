import type { Metadata } from "next";
import { ExperiencePresentationRoot } from "@/features/presentation-modes/components/ExperiencePresentationRoot";
import { buildExperiencePageJsonLd } from "@/lib/seoSchemas";
import { SITE_URL, SITE_NAME, SOCIAL_PROFILES } from "@/lib/siteConfig";

const EXPERIENCE_DESCRIPTION = `Explore ${SITE_NAME}'s engineering experience, work history, technical disciplines, and verified credentials in full-stack web and mobile development.`;

export const metadata: Metadata = {
  title: "Experience & Background",
  description: EXPERIENCE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/experience`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Experience & Background | ${SITE_NAME}`,
    description: EXPERIENCE_DESCRIPTION,
    url: `${SITE_URL}/experience`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Experience & Background | ${SITE_NAME}`,
    description: `Explore ${SITE_NAME}'s engineering experience, work history, technical disciplines, and verified credentials.`,
  },
};

export default function ExperiencePage() {
  const jsonLd = buildExperiencePageJsonLd({
    description: EXPERIENCE_DESCRIPTION,
    sameAs: [
      SOCIAL_PROFILES.github,
      SOCIAL_PROFILES.linkedin,
      SOCIAL_PROFILES.twitter,
      SOCIAL_PROFILES.instagram,
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExperiencePresentationRoot />
    </>
  );
}
