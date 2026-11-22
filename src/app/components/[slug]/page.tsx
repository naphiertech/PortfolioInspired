import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COMPONENTS_CATALOG,
  getComponentBySlug,
  getNextPrevComponents,
} from "@/lib/componentsCatalog";
import { loadComponentSourceFiles } from "@/lib/componentSources.server";
import { ComponentDetailPresentationRoot } from "@/features/presentation-modes/components/ComponentDetailPresentationRoot";
import { AUTHOR_INFO, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPONENTS_CATALOG.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getComponentBySlug(slug);

  if (!item) {
    return {
      title: "Component Not Found",
      description: "The requested component could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${SITE_URL}/components/${slug}`;

  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      siteName: SITE_NAME,
      type: "article",
      url: canonicalUrl,
      title: `${item.title} | Components — ${SITE_NAME}`,
      description: item.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | Components — ${SITE_NAME}`,
      description: item.summary,
    },
  };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getComponentBySlug(slug);

  if (!item) {
    notFound();
  }

  const sourceFiles = loadComponentSourceFiles(item);
  const { prev, next } = getNextPrevComponents(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: item.title,
    description: item.description,
    url: `${SITE_URL}/components/${slug}`,
    programmingLanguage: "TypeScript",
    runtimePlatform: "React / Next.js",
    author: {
      "@type": "Person",
      name: AUTHOR_INFO.name,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComponentDetailPresentationRoot
        item={item}
        sourceFiles={sourceFiles}
        prevItem={prev}
        nextItem={next}
      />
    </>
  );
}
