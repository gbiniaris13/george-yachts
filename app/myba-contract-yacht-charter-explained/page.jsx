import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLinkableAssetBySlug } from "@/lib/linkableAssetSeo";

const SLUG = "myba-contract-yacht-charter-explained";
const PAGE = getLinkableAssetBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: PAGE.seoTitle,
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
