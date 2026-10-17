import type { Metadata } from "next";
import { ExperiencePresentationRoot } from "@/features/presentation-modes/components/ExperiencePresentationRoot";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Experience & Background | Naphier Awalie",
  description:
    `Explore ${SITE_NAME}'s engineering experience, work history, technical disciplines, and verified credentials in full-stack web and mobile development.`,
  alternates: {
    canonical: `${SITE_URL}/experience`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Experience & Background | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s engineering experience, work history, technical disciplines, and verified credentials in full-stack web and mobile development.`,
    url: `${SITE_URL}/experience`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Experience & Background | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s engineering experience, work history, technical disciplines, and verified credentials.`,
  },
};

export default function ExperiencePage() {
  return <ExperiencePresentationRoot />;
}
