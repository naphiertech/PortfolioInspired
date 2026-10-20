import { MetadataRoute } from "next";
import { fullProjects } from "@/lib/data";
import { fieldNotes } from "@/lib/fieldNotes";
import { SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic project detail routes derived from fullProjects
  const projectRoutes: MetadataRoute.Sitemap = fullProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Dynamic field note detail routes derived from fieldNotes
  const noteRoutes: MetadataRoute.Sitemap = fieldNotes.map((note) => ({
    url: `${SITE_URL}/notes/${note.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes];
}
