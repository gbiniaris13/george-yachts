import SeoLanding from "@/app/components/seo/SeoLanding";
import { getComparisonBySlug } from "@/lib/comparisonSeo";

// 2026-05-11 - Phase 7 SEO comparison page. Content in lib data file.

const SLUG = "greece-vs-french-riviera-yacht-charter";
const PAGE = getComparisonBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: PAGE.canonical,
    type: "website",
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
