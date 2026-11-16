import type { Metadata } from "next";
import { NotesPresentationRoot } from "@/features/presentation-modes/components/NotesPresentationRoot";
import { fieldNotes } from "@/lib/fieldNotes";
import { buildCollectionPageJsonLd } from "@/lib/seoSchemas";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

const NOTES_DESCRIPTION =
  "Personal engineering notes index on software, UI/UX, architecture, AI-assisted development, performance, and engineering.";

export const metadata: Metadata = {
  title: "Field Notes — Engineering & Design Journal",
  description: NOTES_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/notes`,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: `${SITE_URL}/notes`,
    title: `Field Notes — ${SITE_NAME}`,
    description:
      "Observations on interface design, system architecture, AI velocity, and software engineering.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Field Notes — ${SITE_NAME}`,
    description:
      "Observations on interface design, system architecture, AI velocity, and software engineering.",
  },
};

export default function NotesIndexPage() {
  const jsonLd = buildCollectionPageJsonLd({
    path: "/notes",
    name: "Field Notes — Engineering & Design Journal",
    description: NOTES_DESCRIPTION,
    breadcrumbName: "Field Notes",
    items: fieldNotes.map((note) => ({
      name: note.title,
      url: `/notes/${note.slug}`,
      description: note.excerpt,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotesPresentationRoot />
    </>
  );
}
