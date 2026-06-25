import BestYachtsPage from "@/app/components/seo/BestYachtsPage";
import { getBestYachtsPageBySlug } from "@/lib/bestYachtsSeo";

const SLUG = "best-yachts-greece-stabilizers-smooth-sailing";
const PAGE = getBestYachtsPageBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: `https://georgeyachts.com/best-yachts-greece-stabilizers-smooth-sailing` },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: `https://georgeyachts.com/best-yachts-greece-stabilizers-smooth-sailing`,
    type: "article",
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() { return <BestYachtsPage pageData={PAGE} />; }
