import BestYachtsPage from "@/app/components/seo/BestYachtsPage";
import { getBestYachtsPageBySlug } from "@/lib/bestYachtsSeo";

const SLUG = "best-superyachts-greece-august";
const PAGE = getBestYachtsPageBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: `https://georgeyachts.com/best-superyachts-greece-august` },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: `https://georgeyachts.com/best-superyachts-greece-august`,
    type: "article",
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() { return <BestYachtsPage pageData={PAGE} />; }
