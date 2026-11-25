import { MetadataRoute } from "next";
import { fullProjects } from "@/lib/data";
import { fieldNotes } from "@/lib/fieldNotes";
import { COMPONENTS_CATALOG } from "@/lib/componentsCatalog";
import { SITE_URL } from "@/lib/siteConfig";

const SITE_RELEASE_DATE = new Date("2026-11-25T00:00:00.000Z");

function parseNoteLastModified(dotDate: string): Date {
  const match = /^(\d{4})\.(\d{2})$/.exec(dotDate.trim());
  if (!match) return SITE_RELEASE_DATE;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return new Date(Date.UTC(year, Math.max(0, month - 1), 1));
}

function parseProjectLastModified(yearStr: string): Date {
  const year = Number(yearStr);
  if (!Number.isFinite(year) || year < 2020) return SITE_RELEASE_DATE;
  return year >= 2026 ? SITE_RELEASE_DATE : new Date(Date.UTC(year, 11, 1));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: parseNoteLastModified(fieldNotes[0]?.date || ""),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/certifications`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tech-stack`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/music`,
      lastModified: new Date("2026-11-14T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: new Date("2026-11-14T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/components`,
      lastModified: SITE_RELEASE_DATE,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // Dynamic project detail routes derived from fullProjects
  const projectRoutes: MetadataRoute.Sitemap = fullProjects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: parseProjectLastModified(project.year),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Dynamic field note detail routes derived from fieldNotes
  const noteRoutes: MetadataRoute.Sitemap = fieldNotes.map((note) => ({
    url: `${SITE_URL}/notes/${note.slug}`,
    lastModified: parseNoteLastModified(note.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const componentRoutes: MetadataRoute.Sitemap = COMPONENTS_CATALOG.map((item) => ({
    url: `${SITE_URL}/components/${item.slug}`,
    lastModified: SITE_RELEASE_DATE,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...noteRoutes, ...componentRoutes];
}
