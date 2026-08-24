import type { Metadata } from "next";
import { CertificationsClient } from "./CertificationsClient";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Explore the verified professional credentials, Google Developer Groups achievements, and technology certifications earned by Naphier Awalie.",
  alternates: {
    canonical: `${SITE_URL}/certifications`,
  },
  openGraph: {
    title: "Certifications | Naphier Awalie",
    description:
      "Explore the verified professional credentials, Google Developer Groups achievements, and technology certifications earned by Naphier Awalie.",
    url: `${SITE_URL}/certifications`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Certifications | Naphier Awalie",
    description:
      "Explore the verified professional credentials and certificates earned by Naphier Awalie.",
  },
};

export default function CertificationsPage() {
  return <CertificationsClient />;
}
