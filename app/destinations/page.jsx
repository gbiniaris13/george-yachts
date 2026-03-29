import DestinationsClient from './DestinationsClient';

export const metadata = {
  title: 'Greek Island Destinations | Charter Guide | George Yachts',
  description: 'Explore the best Greek islands for yacht charter — Cyclades, Ionian, Saronic, Sporades, Dodecanese. Insider restaurant tips, hidden beaches, yacht anchorages.',
  openGraph: {
    title: 'Greek Island Destinations | George Yachts',
    description: 'Insider guides to every Greek charter region — restaurants, beaches, anchorages, and secrets only locals know.',
  },
};

export default function DestinationsPage() {
  return <DestinationsClient />;
}
