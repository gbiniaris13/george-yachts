import BottomFunnelPage from "@/app/components/seo/BottomFunnelPage";
import { getBottomFunnelPageBySlug } from "@/lib/bottomFunnelSeo";

const SLUG = "motor-yacht-charter-saronic-gulf";
const PAGE = getBottomFunnelPageBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: `https://georgeyachts.com/motor-yacht-charter-saronic-gulf` },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: `https://georgeyachts.com/motor-yacht-charter-saronic-gulf`,
    type: "article",
    images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`],
  },
};

export default function Page() {
  return <BottomFunnelPage pageData={PAGE} />;
}
