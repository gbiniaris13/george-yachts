import { notFound } from "next/navigation";
import SeoLanding from "@/app/components/seo/SeoLanding";
import { HEBREW_PAGES, getHebrewPageBySlug } from "@/lib/hebrewSeo";

// Hebrew-language landing page (2026-10-08, George's yes on the DataForSEO gap). Same
// SeoLanding template as every long-tail page, in RTL; content lives in
// lib/hebrewSeo.js. Served under /he/ so the English tree stays intact.

export const revalidate = 86400;

export function generateStaticParams() {
  return HEBREW_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getHebrewPageBySlug(slug);
  if (!page) return { title: "לא נמצא" };
  return {
    title: { absolute: page.seoTitle },
    description: page.seoDescription,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      url: page.canonical,
      type: "website",
      locale: "he_IL",
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

export default async function HebrewLandingPage({ params }) {
  const { slug } = await params;
  const page = getHebrewPageBySlug(slug);
  if (!page) notFound();
  return <SeoLanding pageData={page} />;
}
