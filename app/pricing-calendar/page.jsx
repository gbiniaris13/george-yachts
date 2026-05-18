import PricingCalendarClient from './PricingCalendarClient';
import { pageMeta } from '@/lib/pageMeta';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = pageMeta({
  title: 'Charter Pricing Calendar | George Yachts',
  description:
    'Visual pricing heatmap showing the best and most affordable weeks to charter a yacht in Greece. Green = best value, red = peak pricing.',
  path: '/pricing-calendar',
});

export default function PricingCalendarPage() {
  return (
    <>
      <PageBreadcrumb path="/pricing-calendar" />
      <PricingCalendarClient />
    </>
  );
}
