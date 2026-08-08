import TimelineClient from './TimelineClient';
import { pageMeta } from '@/lib/pageMeta';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
import Footer from "@/app/components/Footer";
export const metadata = pageMeta({
  title: 'Charter Experience Timeline | George Yachts',
  description:
    'From first inquiry to boarding day - follow your Greek charter journey step by step. Preference sheets, provisioning, captain briefing, and welcome aboard.',
  path: '/charter-timeline',
});

export default function TimelinePage() {
  return (
    <>
      <PageBreadcrumb path="/charter-timeline" />
      <TimelineClient />
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
