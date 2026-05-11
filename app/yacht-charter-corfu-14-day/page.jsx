import SeoLanding from "@/app/components/seo/SeoLanding";
import { getDurationBySlug } from "@/lib/durationSeo";

const SLUG = "yacht-charter-corfu-14-day";
const PAGE = getDurationBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "website" },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
