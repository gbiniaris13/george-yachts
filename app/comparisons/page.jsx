// Comparisons hub - Stage 2 (Extra Z). Browsable index of the Greece-vs-X
// destination comparison guides.
import HubPage from "@/app/components/seo/HubPage";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";
import { LAST_REFRESH } from "@/lib/contentFreshness";

export const revalidate = 86400;

const URL = "https://georgeyachts.com/comparisons";

export const metadata = {
  title: "Greece vs Other Charter Destinations",
  description:
    "How Greek yacht charter compares to Croatia, the French Riviera, Italy, Turkey and the Caribbean - honest UHNW decision guides on price, weather and crowds.",
  alternates: { canonical: URL },
  openGraph: { title: "Greece vs Other Charter Destinations", url: URL, type: "website" },
};

export default function ComparisonsHub() {
  const items = DESTINATION_COMPARISONS.map((c) => ({
    title: c.h1,
    url: c.urlPath,
    blurb: c.tagline,
  }));
  return (
    <HubPage
      eyebrow="Decision guides"
      h1="Greece vs Other Charter Destinations"
      intro="How Greek charter compares to the other major Mediterranean and Caribbean destinations - honest, side-by-side, for UHNW decision-making."
      items={items}
      lastUpdated={LAST_REFRESH.DEST_COMPARISONS}
      collectionUrl={URL}
      breadcrumbs={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
        { name: "Destination Comparisons", url: URL },
      ]}
    />
  );
}
