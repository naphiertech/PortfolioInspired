import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EditorialDivider } from "@/components/EditorialDivider";
import { TechStackSection } from "@/app/experience/ExperienceSections";
import { getProjectsUsingTech, techSections, techStackIntro } from "@/lib/data";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import { TechStackPresentationRoot } from "@/features/presentation-modes/components/TechStackPresentationRoot";

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
  const jsonLd = buildCollectionPageJsonLd({
    path: "/tech-stack",
    name: "Tech Stack",
    description: TECH_STACK_DESCRIPTION,
    breadcrumbName: "Tech Stack",
    items: techSections.map((section) => ({
      name: section.title,
      url: `${SITE_URL}/tech-stack`,
      description: section.items.join(", "),
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TechStackPresentationRoot>
        <div className="w-full select-none pb-16">
          <div className="space-y-2 pt-4 sm:pt-5">
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

      <EditorialDivider className="my-4 sm:my-5" />

      <TechStackSection defaultShowAll />

      <section
        aria-label="Technology index and project mapping"
        className="mt-12 space-y-5"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            &lt;stack-index/&gt;
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {techSections.length} categories
          </span>
        </div>

        <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {techStackIntro.headline} {techStackIntro.footer}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techSections.map((section) => {
            const linkedProjectsMap = new Map<string, string>();
            for (const tool of section.items) {
              for (const proj of getProjectsUsingTech(tool)) {
                if (!linkedProjectsMap.has(proj.slug)) {
                  linkedProjectsMap.set(proj.slug, proj.title);
                }
              }
            }
            const linkedProjects = Array.from(linkedProjectsMap.entries());

            return (
              <div
                key={section.title}
                className="p-4 rounded-xl bg-surface/30 border border-border-hairline space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-wide text-ink">
                    {section.title}
                  </h3>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {section.items.length} tools
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {section.items.join(" · ")}
                </p>
                {linkedProjects.length > 0 && (
                  <div className="pt-2 border-t border-border-hairline/40 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 mr-1">
                      Used in:
                    </span>
                    {linkedProjects.map(([slug, title]) => (
                      <Link
                        key={slug}
                        href={`/projects/${slug}`}
                        className="font-mono text-[11px] text-ink/80 hover:text-brand underline underline-offset-4 transition-colors"
                      >
                        {title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

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
      </TechStackPresentationRoot>
    </>
  );
}

