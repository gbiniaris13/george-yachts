// Yacht-types hub - Stage 2 (Extra Z). Browsable index of the yacht types we
// charter, linking each dedicated type page.
import HubPage from "@/app/components/seo/HubPage";
import { YACHT_TYPES } from "@/lib/yachtTypeSeo";
import { LAST_REFRESH } from "@/lib/contentFreshness";

export const revalidate = 86400;

const URL = "https://georgeyachts.com/yacht-types";

export const metadata = {
  title: "Yacht Types for Charter in Greece",
  description:
    "Motor yachts, sailing yachts, catamarans, gulets and more - the yacht types we charter in Greek waters, with the trade-offs of each and who they suit.",
  alternates: { canonical: URL },
  openGraph: { title: "Yacht Types for Charter in Greece", url: URL, type: "website" },
};

export default function YachtTypesHub() {
  const items = YACHT_TYPES.map((t) => ({
    title: t.h1,
    url: t.urlPath,
    blurb: t.tagline,
  }));
  return (
    <HubPage
      eyebrow="Choose your yacht"
      h1="Yacht Types for Charter in Greece"
      intro="The yacht types we charter in Greek waters, with the honest trade-offs of each. Choose a type to see the fleet and who it suits best."
      items={items}
      lastUpdated={LAST_REFRESH.YACHT_TYPES}
      collectionUrl={URL}
      breadcrumbs={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
        { name: "Yacht Types", url: URL },
      ]}
    />
  );
}
