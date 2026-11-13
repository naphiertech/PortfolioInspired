import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechStackSection } from "@/app/experience/ExperienceSections";
import { techSections } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const TECH_STACK_DESCRIPTION =
  "Frameworks, languages, databases, AI/ML tools, and cloud infrastructure used by Naphier Awalie across full-stack web and mobile applications.";

export const metadata: Metadata = {
  title: "Tech Stack",
  description: TECH_STACK_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/tech-stack`,
  },
  openGraph: {
    title: `Tech Stack | ${SITE_NAME}`,
    description: TECH_STACK_DESCRIPTION,
    url: `${SITE_URL}/tech-stack`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Tech Stack | ${SITE_NAME}`,
    description: TECH_STACK_DESCRIPTION,
  },
};

export default function TechStackPage() {
  const totalTools = techSections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <div className="w-full select-none pb-16">
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
              Tech Stack
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              {"// Languages, frameworks, databases, and engineering tooling"}
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground bg-muted-subtle px-2.5 py-1 rounded border border-border-hairline shrink-0">
            {totalTools} tools
          </span>
        </div>
      </div>

      <EditorialDivider className="mb-10 sm:mb-12" />

      <TechStackSection defaultShowAll />

      <div className="mt-14 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors"
        >
          <span>See Projects Built With These Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/certifications"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-ink transition-colors"
        >
          <span>View Certifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

