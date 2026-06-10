// Best-yachts hub - Stage 2 (Extra Z). Browsable index of the "best yacht
// for X" guides (group size, occasion, use case).
import HubPage from "@/app/components/seo/HubPage";
import { BEST_YACHTS_PAGES } from "@/lib/bestYachtsSeo";
import { LAST_REFRESH } from "@/lib/contentFreshness";

export const revalidate = 86400;

const URL = "https://georgeyachts.com/best-yachts";

export const metadata = {
  title: "Best Yachts in Greece by Use Case",
  description:
    "Curated 'best yacht for...' guides for Greek charter - large groups, families, couples, corporate, speed, August superyachts and more.",
  alternates: { canonical: URL },
  openGraph: { title: "Best Yachts in Greece by Use Case", url: URL, type: "website" },
};

export default function BestYachtsHub() {
  const items = BEST_YACHTS_PAGES.map((p) => ({
    title: p.h1,
    url: p.urlPath,
    meta: p.eyebrow,
    blurb: p.tagline,
  }));
  return (
    <HubPage
      eyebrow="Curated shortlists"
      h1="Best Yachts in Greece, by Use Case"
      intro="Curated shortlists for the way you actually charter - by group size, occasion, and priority. Each guide gives the right yacht spec and price band."
      items={items}
      lastUpdated={LAST_REFRESH.BEST_YACHTS}
      collectionUrl={URL}
      breadcrumbs={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
        { name: "Best Yachts", url: URL },
      ]}
    />
  );
}
