// Glossary [slug] dynamic page — Phase 7 Round 15 (2026-05-12).
//
// One route, 30 pages. Iterates GLOSSARY_TERMS via
// generateStaticParams so every term gets pre-rendered as a static
// page at build time. ISR refresh every 24h via revalidate.

import { notFound } from "next/navigation";
import GlossaryTerm from "@/app/components/seo/GlossaryTerm";
import { GLOSSARY_TERMS, getGlossaryTermBySlug } from "@/lib/glossarySeo";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};
  return {
    title: term.seoTitle,
    description: term.seoDescription,
    alternates: { canonical: term.canonical },
    openGraph: {
      title: term.seoTitle,
      description: term.seoDescription,
      url: term.canonical,
      type: "article",
      images: [
        `/api/og?title=${encodeURIComponent(term.term)}&eyebrow=${encodeURIComponent("Glossary")}`,
      ],
    },
  };
}

export default async function GlossaryTermPage({ params }) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) notFound();
  return <GlossaryTerm termData={term} />;
}
