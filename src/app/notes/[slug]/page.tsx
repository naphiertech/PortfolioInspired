import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fieldNotes,
  getFieldNoteBySlug,
  getNextPrevFieldNotes,
} from "@/lib/fieldNotes";
import { SITE_URL, SITE_NAME, AUTHOR_INFO } from "@/lib/siteConfig";
import { NoteDetailPresentationRoot } from "@/features/presentation-modes/components/NoteDetailPresentationRoot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return fieldNotes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);

  if (!note) {
    return {
      title: "Field Note Not Found",
      description: "The requested field note could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${SITE_URL}/notes/${slug}`;

  return {
    title: `${note.title} — Field Note ${note.number}`,
    description: note.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "article",
      url: canonicalUrl,
      title: `${note.title} | Field Notes — ${SITE_NAME}`,
      description: note.excerpt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${note.title} | Field Notes — ${SITE_NAME}`,
      description: note.excerpt,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const { prev, next } = getNextPrevFieldNotes(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: note.title,
    description: note.excerpt,
    datePublished: note.date,
    author: {
      "@type": "Person",
      name: AUTHOR_INFO.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_INFO.name,
    },
    url: `${SITE_URL}/notes/${slug}`,
    keywords: note.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoteDetailPresentationRoot
        note={note}
        prevNote={prev}
        nextNote={next}
        totalNotes={fieldNotes.length}
      />
    </>
  );
}
