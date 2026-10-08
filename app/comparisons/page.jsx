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
  openGraph: { title: "Greece vs Other Charter Destinations", url: URL, type: "website",
    images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    siteName: "George Yachts Brokerage House",
    locale: "en_US", },
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
      intro="A crewed week in Greece starts from EUR 17,000 per yacht, about EUR 22,000 all in; here is how it compares with the other Mediterranean and Caribbean destinations, side by side."
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
