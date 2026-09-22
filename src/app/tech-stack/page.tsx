import React, { Suspense } from "react";
import type { Metadata } from "next";
import { TechStackPresentationRoot } from "@/features/presentation-modes/components/TechStackPresentationRoot";
import { RouteLoading } from "@/components/RouteLoading";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Tech Stack",
  description:
    `Explore the comprehensive toolchains, frontend frameworks, backend runtimes, databases, and UI motion libraries used by ${SITE_NAME}.`,
  alternates: {
    canonical: `${SITE_URL}/tech-stack`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Tech Stack | ${SITE_NAME}`,
    description:
      `Explore the comprehensive toolchains, frontend frameworks, backend runtimes, databases, and UI motion libraries used by ${SITE_NAME}.`,
    url: `${SITE_URL}/tech-stack`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Tech Stack | ${SITE_NAME}`,
    description:
      `Explore the frontend, backend, database, and dev tools used by ${SITE_NAME}.`,
  },
};

export default function TechStackPage() {
  return (
    <Suspense
      fallback={
        <RouteLoading view="tech" />
      }
    >
      <TechStackPresentationRoot />
    </Suspense>
  );
}
