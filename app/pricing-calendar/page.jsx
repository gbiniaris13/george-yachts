import PricingCalendarClient from './PricingCalendarClient';

export const metadata = {
  title: 'Charter Pricing Calendar | Best Time to Book | George Yachts',
  description: 'Visual pricing heatmap showing the best and most affordable weeks to charter a yacht in Greece. Green = best value, red = peak pricing.',
};

export default function PricingCalendarPage() {
  return <PricingCalendarClient />;
}
