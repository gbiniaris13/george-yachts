import { notFound } from "next/navigation";
import SeoLanding from "@/app/components/seo/SeoLanding";
import { GREEK_PAGES, getGreekPageBySlug } from "@/lib/greekSeo";

// Greek-language landing pages (2026-07-14, George's yes). Same
// SeoLanding template as every long-tail page; content lives in
// lib/greekSeo.js. Served under /el/ so the English tree stays intact.

export const revalidate = 86400;

export function generateStaticParams() {
  return GREEK_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getGreekPageBySlug(slug);
  if (!page) return { title: "Δεν βρέθηκε" };
  return {
    title: { absolute: page.seoTitle },
    description: page.seoDescription,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: page.canonical,
      type: "website",
      locale: "el_GR",
      siteName: "George Yachts Brokerage House",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.seoDescription,
      images: ["https://georgeyachts.com/opengraph-image"],
    },
  };
}

export default async function GreekLandingPage({ params }) {
  const { slug } = await params;
  const page = getGreekPageBySlug(slug);
  if (!page) notFound();
  return <SeoLanding pageData={page} />;
}
