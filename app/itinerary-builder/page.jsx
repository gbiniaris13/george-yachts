import ItineraryBuilderClient from './ItineraryBuilderClient';

export const metadata = {
  title: 'Build Your Itinerary | George Yachts — Greek Islands Route Planner',
  description: 'Design your perfect Greek island-hopping route. Click islands on our interactive map, see distances in nautical miles, and send your dream itinerary to George for a personalized proposal.',
  openGraph: {
    title: 'Build Your Greek Islands Itinerary | George Yachts',
    description: 'Interactive route planner for luxury yacht charters in Greek waters.',
  },
};

export default function ItineraryBuilderPage() {
  return <ItineraryBuilderClient />;
}
