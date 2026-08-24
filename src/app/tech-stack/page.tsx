import React, { Suspense } from "react";
import type { Metadata } from "next";
import { TechStackClient } from "./TechStackClient";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Tech Stack",
  description:
    "Explore the comprehensive toolchains, frontend frameworks, backend runtimes, databases, and UI motion libraries used by Naphier Awalie.",
  alternates: {
    canonical: `${SITE_URL}/tech-stack`,
  },
  openGraph: {
    title: "Tech Stack | Naphier Awalie",
    description:
      "Explore the comprehensive toolchains, frontend frameworks, backend runtimes, databases, and UI motion libraries used by Naphier Awalie.",
    url: `${SITE_URL}/tech-stack`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Stack | Naphier Awalie",
    description:
      "Explore the frontend, backend, database, and dev tools used by Naphier Awalie.",
  },
};

export default function TechStackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-12 flex justify-center items-center text-muted-foreground font-mono text-xs">
          Loading tech stack...
        </div>
      }
    >
      <TechStackClient />
    </Suspense>
  );
}
