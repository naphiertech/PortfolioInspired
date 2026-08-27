import type { Metadata } from "next";
import { WorkClient } from "./WorkClient";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Work & Experience",
  description:
    `Explore ${SITE_NAME}'s developer background, technical journey, freelance availability, and engineering capabilities in full-stack web and mobile development.`,
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Work & Experience | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s developer background, technical journey, freelance availability, and engineering capabilities in full-stack web and mobile development.`,
    url: `${SITE_URL}/work`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Work & Experience | ${SITE_NAME}`,
    description:
      `Explore ${SITE_NAME}'s developer background, technical journey, freelance availability, and engineering capabilities.`,
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
