import SeoLanding from "@/app/components/seo/SeoLanding";
import { getArticleBySlug } from "@/lib/articleSeo";

const SLUG = "meltemi-wind-guide-greek-yacht-charter";
const PAGE = getArticleBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "article" },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
