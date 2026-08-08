import PricingCalendarClient from './PricingCalendarClient';
import { pageMeta } from '@/lib/pageMeta';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
import Footer from "@/app/components/Footer";
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
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
