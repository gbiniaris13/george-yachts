import SeoLanding from "@/app/components/seo/SeoLanding";
import { getArticleBySlug } from "@/lib/articleSeo";

const SLUG = "whats-included-in-greek-yacht-charter-complete-2026-guide";
const PAGE = getArticleBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "article" },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
