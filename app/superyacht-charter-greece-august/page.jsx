import BottomFunnelPage from "@/app/components/seo/BottomFunnelPage";
import { getBottomFunnelPageBySlug } from "@/lib/bottomFunnelSeo";

const SLUG = "superyacht-charter-greece-august";
const PAGE = getBottomFunnelPageBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: `https://georgeyachts.com/superyacht-charter-greece-august` },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: `https://georgeyachts.com/superyacht-charter-greece-august`,
    type: "article",
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() {
  return <BottomFunnelPage pageData={PAGE} />;
}
