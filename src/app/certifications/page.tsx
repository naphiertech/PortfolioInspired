import type { Metadata } from "next";
import { CertificationsClient } from "./CertificationsClient";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    `Explore the verified professional credentials, Google Developer Groups achievements, and technology certifications earned by ${SITE_NAME}.`,
  alternates: {
    canonical: `${SITE_URL}/certifications`,
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `Certifications | ${SITE_NAME}`,
    description:
      `Explore the verified professional credentials, Google Developer Groups achievements, and technology certifications earned by ${SITE_NAME}.`,
    url: `${SITE_URL}/certifications`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Certifications | ${SITE_NAME}`,
    description:
      `Explore the verified professional credentials and certificates earned by ${SITE_NAME}.`,
  },
};

export default function CertificationsPage() {
  return <CertificationsClient />;
}
