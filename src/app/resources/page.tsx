import type { Metadata } from "next";
import { ResourcesPresentationRoot } from "@/features/presentation-modes/components/ResourcesPresentationRoot";
import { RESOURCE_CATEGORIES } from "@/features/resources-drawer";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

const RESOURCES_DESCRIPTION = `Browse ${SITE_NAME}'s curated directory of AI coding agents, engineering skills, workflow rules, and production software tooling.`;

export const metadata: Metadata = {
  title: "Resources & Toolbook",
  description: RESOURCES_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/resources`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Resources & Toolbook | ${SITE_NAME}`,
    description: RESOURCES_DESCRIPTION,
    url: `${SITE_URL}/resources`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Resources & Toolbook | ${SITE_NAME}`,
    description: `Browse ${SITE_NAME}'s curated directory of coding agents, skills, rules, and tooling.`,
  },
};

export default function ResourcesPage() {
  const jsonLd = buildCollectionPageJsonLd({
    path: "/resources",
    name: "Resources & Toolbook",
    description: RESOURCES_DESCRIPTION,
    breadcrumbName: "Resources",
    items: RESOURCE_CATEGORIES.flatMap((category) =>
      category.items.map((item) => ({
        name: item.name,
        url: item.url || `${SITE_URL}/resources`,
        description: `${category.title}: ${item.role}`,
      }))
    ),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourcesPresentationRoot />
    </>
  );
}
