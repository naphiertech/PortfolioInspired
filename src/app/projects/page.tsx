import type { Metadata } from "next";
import { ProjectsPageClient } from "@/app/projects/ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects | Naphier Awalie",
  description:
    "Explore a curated showcase of web development and design projects by Naphier Awalie.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
