// Islands hub - Stage 2 (Extra Z). Browsable index of every Greek island we
// charter. Leaf pages live at /yacht-charter-{slug}; this concentrates their
// internal links and gives a CollectionPage entry point.
import HubPage from "@/app/components/seo/HubPage";
import { ISLANDS } from "@/lib/islands";
import { LAST_REFRESH } from "@/lib/contentFreshness";

export const revalidate = 86400;

const URL = "https://georgeyachts.com/islands";

export const metadata = {
  title: "Yacht Charter by Greek Island",
  description:
    "Every Greek island we charter, by region - Cyclades, Ionian, Saronic, Dodecanese, Sporades. Matched yachts, sample routes, and seasonality for each.",
  alternates: { canonical: URL },
  openGraph: { title: "Yacht Charter by Greek Island", url: URL, type: "website" },
};

export default function IslandsHub() {
  const items = ISLANDS.map((i) => ({
    title: `Yacht Charter ${i.name}`,
    url: `/yacht-charter-${i.slug}`,
    meta: i.region,
    blurb: i.tagline,
  }));
  return (
    <HubPage
      eyebrow="Destinations"
      h1="Yacht Charter by Greek Island"
      intro="Every Greek island we charter, organised by region. Choose a destination to see matched yachts, sample itineraries, and seasonality."
      items={items}
      lastUpdated={LAST_REFRESH.ISLANDS}
      collectionUrl={URL}
      breadcrumbs={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
        { name: "Greek Islands", url: URL },
      ]}
    />
  );
}
