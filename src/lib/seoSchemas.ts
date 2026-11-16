import { SITE_URL, SITE_NAME, AUTHOR_INFO } from "./siteConfig";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface CollectionListItem {
  name: string;
  url: string;
  description?: string;
}

/**
 * Builds a schema.org BreadcrumbList node anchored to SITE_URL.
 */
export function buildBreadcrumbNode(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

/**
 * Builds a CollectionPage + BreadcrumbList + ItemList JSON-LD graph for index routes.
 */
export function buildCollectionPageJsonLd({
  path,
  name,
  description,
  breadcrumbName,
  items,
  pageType = "CollectionPage",
}: {
  path: string;
  name: string;
  description: string;
  breadcrumbName: string;
  items: CollectionListItem[];
  pageType?: "CollectionPage" | "ProfilePage";
}) {
  const pageUrl = `${SITE_URL}${path === "/" ? "/" : path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": pageType,
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${name} | ${SITE_NAME}`,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        author: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-US",
      },
      buildBreadcrumbNode([
        { name: "Home", path: "/" },
        { name: breadcrumbName, path },
      ]),
      ...(items.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#itemlist`,
              numberOfItems: items.length,
              itemListElement: items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
                ...(item.description ? { description: item.description } : {}),
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * Builds ProfilePage + BreadcrumbList + Person summary JSON-LD for /experience.
 */
export function buildExperiencePageJsonLd({
  description,
  sameAs,
}: {
  description: string;
  sameAs: string[];
}) {
  const pageUrl = `${SITE_URL}/experience`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Experience & Background | ${SITE_NAME}`,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: AUTHOR_INFO.name,
          url: SITE_URL,
          jobTitle: AUTHOR_INFO.jobTitle,
          sameAs,
        },
        inLanguage: "en-US",
      },
      buildBreadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Experience", path: "/experience" },
      ]),
    ],
  };
}
