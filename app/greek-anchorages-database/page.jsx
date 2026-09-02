import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLinkableAssetBySlug } from "@/lib/linkableAssetSeo";
import { ISLAND_ANCHORAGES } from "@/lib/islandAnchoragesSeo";

const SLUG = "greek-anchorages-database";
const BASE_PAGE = getLinkableAssetBySlug(SLUG);

const REGION_ORDER = ["Cyclades", "Ionian", "Saronic", "Sporades", "Dodecanese", "Crete"];

const GROUPS = REGION_ORDER.map((region) => ({
  label: region,
  links: ISLAND_ANCHORAGES.filter((a) => a.region === region)
    .map((a) => ({ href: a.urlPath, label: a.islandName }))
    .sort((a, b) => a.label.localeCompare(b.label)),
})).filter((g) => g.links.length > 0);

const GUIDE_COUNT = GROUPS.reduce((n, g) => n + g.links.length, 0);

const PAGE = {
  ...BASE_PAGE,
  linkIndex: {
    title: `The ${GUIDE_COUNT} island guides, one page per island`,
    intro:
      `Beyond the anchorage entries above, each island has its own guide: every documented anchorage on that island with depth, holding, shelter and shore access, plus how the meltemi behaves there. ${GUIDE_COUNT} islands, from the Ionian to the Dodecanese.`,
    groups: GROUPS,
  },
};

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
    images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
