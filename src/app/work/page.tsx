import type { Metadata } from "next";
import { WorkClient } from "./WorkClient";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Work & Experience",
  description:
    "Explore Naphier Awalie's developer background, technical journey, freelance availability, and engineering capabilities in full-stack web and mobile development.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Work & Experience | Naphier Awalie",
    description:
      "Explore Naphier Awalie's developer background, technical journey, freelance availability, and engineering capabilities in full-stack web and mobile development.",
    url: `${SITE_URL}/work`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Work & Experience | Naphier Awalie",
    description:
      "Explore Naphier Awalie's developer background, technical journey, freelance availability, and engineering capabilities.",
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
