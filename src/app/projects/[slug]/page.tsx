import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fullProjects, getProjectBySlug } from "@/lib/data";
import { SITE_URL, AUTHOR_INFO } from "@/lib/siteConfig";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fullProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${SITE_URL}/projects/${slug}`;
  const ogImage = project.image.startsWith("http")
    ? project.image
    : `${SITE_URL}${project.image}`;

  return {
    title: project.title,
    description: project.overview,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: `${project.title} | Naphier Awalie`,
      description: project.overview,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — ${project.category}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Naphier Awalie`,
      description: project.overview,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = fullProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? fullProjects[currentIndex - 1] : undefined;
  const nextProject =
    currentIndex < fullProjects.length - 1
      ? fullProjects[currentIndex + 1]
      : undefined;

  const projectImageUrl = project.image.startsWith("http")
    ? project.image
    : `${SITE_URL}${project.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.overview,
    applicationCategory: project.category,
    operatingSystem: "Web Browser",
    author: {
      "@type": "Person",
      name: AUTHOR_INFO.name,
      url: SITE_URL,
    },
    url: `${SITE_URL}/projects/${slug}`,
    image: projectImageUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailClient
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
