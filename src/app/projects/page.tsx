import type { Metadata } from "next";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore a curated showcase of full-stack web applications, frontend architectures, open-source tools, and logistics platforms built by Naphier Awalie.",
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: "Projects | Naphier Awalie",
    description:
      "Explore a curated showcase of full-stack web applications, frontend architectures, open-source tools, and logistics platforms built by Naphier Awalie.",
    url: `${SITE_URL}/projects`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Naphier Awalie",
    description:
      "Explore a curated showcase of full-stack web applications and tools built by Naphier Awalie.",
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
