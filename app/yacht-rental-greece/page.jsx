import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLongTailBySlug } from "@/lib/longTailSeo";

// 2026-10-08 (DataForSEO market gap): the American word for the product: 590 US + 260 UK searches a month.
// Content in lib/longTailSeo.js; this wrapper just imports + renders.

const SLUG = "yacht-rental-greece";
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
