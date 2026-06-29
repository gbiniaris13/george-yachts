import IslandAnchorages from "@/app/components/seo/IslandAnchorages";
import { getAnchorageGuideBySlug } from "@/lib/islandAnchoragesSeo";

const SLUG = "patmos";
const PAGE = getAnchorageGuideBySlug(SLUG);

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
    images: [`/api/og?title=${encodeURIComponent(PAGE.islandName + " Anchorages")}&eyebrow=${encodeURIComponent("Guide")}`],
  },
};

export default function Page() {
  return <IslandAnchorages guideData={PAGE} />;
}
