import type { Metadata } from "next";
import { CertificationsClient } from "@/app/certifications/CertificationsClient";

export const metadata: Metadata = {
  title: "Certifications | Naphier Awalie",
  description: "Explore the verified professional certifications, achievements, and credentials earned by Naphier Awalie.",
};

export default function CertificationsPage() {
  return <CertificationsClient />;
}
