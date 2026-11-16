import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EditorialDivider } from "@/components/EditorialDivider";
import { CertificationsSection } from "@/app/experience/ExperienceSections";
import {
  certifications,
  getCertificationGroups,
  getVerifyHref,
} from "@/lib/data";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const CERTIFICATIONS_DESCRIPTION =
  "Verified technical courses and community credentials earned by Naphier Awalie across cybersecurity, networking, and AI development (Cisco Networking Academy, Google Developer Groups, DICT).";

export const metadata: Metadata = {
  title: "Certifications",
  description: CERTIFICATIONS_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/certifications`,
  },
  openGraph: {
    title: `Certifications | ${SITE_NAME}`,
    description: CERTIFICATIONS_DESCRIPTION,
    url: `${SITE_URL}/certifications`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Certifications | ${SITE_NAME}`,
    description: CERTIFICATIONS_DESCRIPTION,
  },
};

export default function CertificationsPage() {
  const groups = getCertificationGroups();
  const jsonLd = buildCollectionPageJsonLd({
    path: "/certifications",
    name: "Certifications",
    description: CERTIFICATIONS_DESCRIPTION,
    breadcrumbName: "Certifications",
    items: certifications.map((cert) => ({
      name: `${cert.name} — ${cert.issuer}`,
      url: getVerifyHref(cert) || `${SITE_URL}/certifications`,
      description: cert.issuedAt
        ? `Issued ${cert.issuedAt} by ${cert.issuer}`
        : `Credential ID ${cert.code ?? "verified"} issued by ${cert.issuer}`,
    })),
  });

  return (
    <div className="w-full select-none pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-10 space-y-2 pt-4 sm:pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors duration-150 mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd .. / home</span>
        </Link>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Certifications
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Organized across technical courses, workshops, and community credentials"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline shrink-0">
            {certifications.length} verified
          </span>
        </div>
      </div>

      <EditorialDivider className="mb-10 sm:mb-12" />

      <CertificationsSection />

      <section
        aria-label="Credential focus and verification"
        className="mt-12 p-5 rounded-xl bg-surface/30 border border-border-hairline space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
            &lt;verification-notes/&gt;
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {groups.length} tracks
          </span>
        </div>
        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Credentials are grouped into {groups.map((g) => `${g.label} (${g.items.length})`).join(" and ")}.
          Technical course badges from Cisco Networking Academy verify live through Credly covering network communication fundamentals, IPv4/IPv6 addressing, cybersecurity defense, and threat awareness, while Google Developer Groups and DICT certificates include original verification IDs and inspectable source documents.
        </p>
      </section>

      <div className="mt-14 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/experience"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors"
        >
          <span>Full Experience &amp; Background</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/tech-stack"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors"
        >
          <span>Explore Tech Stack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

