import DestinationComparison from "@/app/components/seo/DestinationComparison";
import { getComparisonBySlug } from "@/lib/destinationComparisonSeo";

const SLUG = "greek-yacht-charter-vs-italy";
const PAGE = getComparisonBySlug(SLUG);

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
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() {
  return <DestinationComparison pageData={PAGE} />;
}
