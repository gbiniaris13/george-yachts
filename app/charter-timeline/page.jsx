import TimelineClient from './TimelineClient';
import { pageMeta } from '@/lib/pageMeta';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = pageMeta({
  title: 'Charter Experience Timeline | George Yachts',
  description:
    'From first inquiry to boarding day — follow your Greek charter journey step by step. Preference sheets, provisioning, captain briefing, and welcome aboard.',
  path: '/charter-timeline',
});

export default function TimelinePage() {
  return (
    <>
      <PageBreadcrumb path="/charter-timeline" />
      <TimelineClient />
    </>
  );
}
