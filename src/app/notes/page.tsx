import type { Metadata } from "next";
import { NotesPresentationRoot } from "@/features/presentation-modes/components/NotesPresentationRoot";
import { SITE_URL, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Field Notes — Engineering & Design Journal",
  description:
    "Personal engineering notes index on software, UI/UX, architecture, AI-assisted development, performance, and engineering.",
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
  return <NotesPresentationRoot />;
}
