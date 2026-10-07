import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLongTailBySlug } from "@/lib/longTailSeo";

const SLUG = "motor-yacht-charter-greece-3-or-4-couples-100000-usd";
const PAGE = getLongTailBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "website", images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
    siteName: "George Yachts Brokerage House",
    locale: "en_US", },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
