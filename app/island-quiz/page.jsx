import IslandQuizClient from './IslandQuizClient';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
import Footer from "@/app/components/Footer";
export const metadata = {
  title: { absolute: 'Which Greek Island Are You? | George Yachts' },
  description: 'Take our fun personality quiz and discover which Greek island matches your travel style. Are you Mykonos, Hydra, Santorini, or Paxos?',
  alternates: { canonical: 'https://georgeyachts.com/island-quiz' },
  openGraph: {
      type: "website",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    title: 'Which Greek Island Are You? | George Yachts',
    description: 'Discover your perfect Greek island match - take the quiz!',
    url: 'https://georgeyachts.com/island-quiz',
      siteName: "George Yachts Brokerage House",
      locale: "en_US",
  },
};

export default function IslandQuizPage() {
  return (
    <>
      <PageBreadcrumb path="/island-quiz" />
      <IslandQuizClient />
      {/* 2026-08-06 (job 9) — sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
