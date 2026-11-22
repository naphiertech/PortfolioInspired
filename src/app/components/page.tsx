import type { Metadata } from "next";
import { ComponentsPresentationRoot } from "@/features/presentation-modes/components/ComponentsPresentationRoot";
import { COMPONENTS_CATALOG } from "@/lib/componentsCatalog";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const COMPONENTS_DESCRIPTION = `Browse ${SITE_NAME}'s public collection of interactive UI components and pixel-art scenes with live prop controls and copy-paste source files.`;

export const metadata: Metadata = {
  title: "Components",
  description: COMPONENTS_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/components`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Components | ${SITE_NAME}`,
    description: COMPONENTS_DESCRIPTION,
    url: `${SITE_URL}/components`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Components | ${SITE_NAME}`,
    description: COMPONENTS_DESCRIPTION,
  },
};

export default function ComponentsPage() {
  const jsonLd = buildCollectionPageJsonLd({
    path: "/components",
    name: "Components",
    description: COMPONENTS_DESCRIPTION,
    breadcrumbName: "Components",
    items: COMPONENTS_CATALOG.map((item) => ({
      name: item.title,
      url: `${SITE_URL}/components/${item.slug}`,
      description: item.summary,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComponentsPresentationRoot />
    </>
  );
}
