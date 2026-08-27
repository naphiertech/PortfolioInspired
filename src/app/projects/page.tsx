import type { Metadata } from "next";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Projects",
  description:
    `Explore a curated showcase of full-stack web applications, frontend architectures, open-source tools, and logistics platforms built by ${SITE_NAME}.`,
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Projects | ${SITE_NAME}`,
    description:
      `Explore a curated showcase of full-stack web applications, frontend architectures, open-source tools, and logistics platforms built by ${SITE_NAME}.`,
    url: `${SITE_URL}/projects`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${SITE_NAME}`,
    description:
      `Explore a curated showcase of full-stack web applications and tools built by ${SITE_NAME}.`,
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
