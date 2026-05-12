import MarketReport from "@/app/components/seo/MarketReport";
import { getMarketReportBySlug } from "@/lib/marketReportsSeo";

const SLUG = "q1-2026-greek-yacht-charter-market-retrospective";
const PAGE = getMarketReportBySlug(SLUG);

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
    publishedTime: PAGE.publishedAt,
    authors: ["George P. Biniaris"],
    images: [`/api/og?title=${encodeURIComponent(PAGE.period)}&eyebrow=${encodeURIComponent("Market Research")}`],
  },
};

export default function Page() {
  return <MarketReport reportData={PAGE} />;
}
