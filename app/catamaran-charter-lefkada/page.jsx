import SeoLanding from "@/app/components/seo/SeoLanding";
import { getComboBySlug } from "@/lib/comboSeo";

const SLUG = "catamaran-charter-lefkada";
const PAGE = getComboBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "website", images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`] },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
