import ItineraryBuilderClient from './ItineraryBuilderClient';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = {
  // 2026-06-25: was double-branded ("...| George Yachts" + the site-wide
  // "%s | George Yachts" template = 84 chars). `absolute` keeps one brand.
  title: { absolute: 'Build Your Greek Islands Itinerary | George Yachts' },
  description: 'Design your perfect Greek island-hopping route. Click islands on our interactive map, see distances in nautical miles, and send your dream itinerary to George for a personalized proposal.',
  alternates: { canonical: 'https://georgeyachts.com/itinerary-builder' },
  openGraph: {
      type: "website",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    title: 'Build Your Greek Islands Itinerary | George Yachts',
    description: 'Interactive route planner for luxury yacht charters in Greek waters.',
    url: 'https://georgeyachts.com/itinerary-builder',
  },
};

export default function ItineraryBuilderPage() {
  return (
    <>
      <PageBreadcrumb path="/itinerary-builder" />
      <ItineraryBuilderClient />
    </>
  );
}
