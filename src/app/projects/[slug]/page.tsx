import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fullProjects, getProjectBySlug } from "@/lib/data";
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
      title: "Project Not Found | Naphier Awalie",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.title} | Naphier Awalie`,
    description: project.overview,
    openGraph: {
      title: `${project.title} | Naphier Awalie`,
      description: project.overview,
      images: [
        {
          url: project.image,
          alt: project.title,
        },
      ],
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

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
