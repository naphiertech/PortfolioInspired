import type { Metadata } from "next";
import { ResourcesPresentationRoot } from "@/features/presentation-modes/components/ResourcesPresentationRoot";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Resources & Toolbook",
  description:
    `Browse ${SITE_NAME}'s curated directory of AI coding agents, engineering skills, workflow rules, and production software tooling.`,
  alternates: {
    canonical: `${SITE_URL}/resources`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Resources & Toolbook | ${SITE_NAME}`,
    description:
      `Browse ${SITE_NAME}'s curated directory of AI coding agents, engineering skills, workflow rules, and production software tooling.`,
    url: `${SITE_URL}/resources`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Resources & Toolbook | ${SITE_NAME}`,
    description:
      `Browse ${SITE_NAME}'s curated directory of coding agents, skills, rules, and tooling.`,
  },
};

export default function ResourcesPage() {
  return <ResourcesPresentationRoot />;
}
