import SeoLanding from "@/app/components/seo/SeoLanding";
import { getYachtTypeBySlug } from "@/lib/yachtTypeSeo";

// 2026-07-03 (Wave 2, catamaran cluster) — the power-catamaran page.
// Content in lib/yachtTypeSeo.js; this wrapper imports + renders.
// The URL previously 301'd to the fast-motor-yachts page (see
// next.config.mjs note); the real page now owns its inbound interest.

const SLUG = "power-catamaran";
const PAGE = getYachtTypeBySlug(SLUG);

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
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
