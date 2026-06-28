import SeoLanding from "@/app/components/seo/SeoLanding";
import { getArticleBySlug } from "@/lib/articleSeo";

const SLUG = "motor-yacht-charter-running-costs-greece-apa-fuel-2026";
const PAGE = getArticleBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "article", images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`] },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
