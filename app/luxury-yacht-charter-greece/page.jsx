import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLongTailBySlug } from "@/lib/longTailSeo";

// 2026-08-28 - The mother page of the luxury cluster (DataForSEO gap:
// 320 US searches/mo, KD 5, no dedicated page until today). Content in
// lib/longTailSeo.js;
// this wrapper just imports + renders. See SeoLanding component for
// the JSX. Static metadata pre-computed at build time.

const SLUG = "luxury-yacht-charter-greece";
const PAGE = getLongTailBySlug(SLUG);

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
    images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
