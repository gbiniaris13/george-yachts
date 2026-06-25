import SeoLanding from "@/app/components/seo/SeoLanding";
import { getDurationBySlug } from "@/lib/durationSeo";

const SLUG = "yacht-charter-hydra-14-day";
const PAGE = getDurationBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "website", images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`] },
};
export default function Page() { return <SeoLanding pageData={PAGE} />; }
