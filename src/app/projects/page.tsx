import type { Metadata } from "next";
import { ProjectsPresentationRoot } from "@/features/presentation-modes/components/ProjectsPresentationRoot";
import { fullProjects } from "@/lib/data";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

const PROJECTS_DESCRIPTION = `Explore a curated showcase of full-stack web applications, frontend architectures, open-source tools, and logistics platforms built by ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Projects | ${SITE_NAME}`,
    description: PROJECTS_DESCRIPTION,
    url: `${SITE_URL}/projects`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${SITE_NAME}`,
    description: `Explore a curated showcase of full-stack web applications and tools built by ${SITE_NAME}.`,
  },
};

export default function ProjectsPage() {
  const jsonLd = buildCollectionPageJsonLd({
    path: "/projects",
    name: "Projects",
    description: PROJECTS_DESCRIPTION,
    breadcrumbName: "Projects",
    items: fullProjects.map((project) => ({
      name: project.title,
      url: `/projects/${project.slug}`,
      description: project.overview,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsPresentationRoot />
    </>
  );
}
