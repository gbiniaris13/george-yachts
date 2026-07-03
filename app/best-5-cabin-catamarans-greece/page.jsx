import BestYachtsPage from "@/app/components/seo/BestYachtsPage";
import { getBestYachtsPageBySlug } from "@/lib/bestYachtsSeo";

// 2026-07-03 (Wave 2, catamaran cluster) — 5-cabin listicle with
// named fleet yachts + live rates. Content in lib/bestYachtsSeo.js.

const SLUG = "best-5-cabin-catamarans-greece";
const PAGE = getBestYachtsPageBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: `https://georgeyachts.com/${SLUG}` },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: `https://georgeyachts.com/${SLUG}`,
    type: "article",
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() {
  return <BestYachtsPage pageData={PAGE} />;
}
