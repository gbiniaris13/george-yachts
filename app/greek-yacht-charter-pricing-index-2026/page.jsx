import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLinkableAssetBySlug } from "@/lib/linkableAssetSeo";

const SLUG = "greek-yacht-charter-pricing-index-2026";
const PAGE = getLinkableAssetBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: PAGE.canonical,
    type: "article",
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
