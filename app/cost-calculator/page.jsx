import { sanityClient } from '@/lib/sanity';
import CostCalculatorClient from './CostCalculatorClient';
import { pageMeta } from '@/lib/pageMeta';

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
import Footer from "@/app/components/Footer";
export const revalidate = 3600;

// 2026-08-08 — this page and /tools/charter-cost-calculator are 68% the same
// content, and the numbers say only one of them is working. Over three months
// in Search Console /tools/charter-cost-calculator took 172 impressions and
// this URL does not appear at all; Bing's AI report credits that page with 92
// citations and this one with none.
//
// So the authority consolidates there. This page keeps working for anyone who
// has the link or arrives from the partner dashboard, which is why it is
// canonicalised rather than deleted or redirected: nothing that exists gets
// taken away, the search engines are simply told which address to rank.
export const metadata = pageMeta({
  title: 'Charter Cost Calculator | George Yachts',
  description:
    'Calculate the total cost of your Greek yacht charter. Transparent pricing with charter rate, APA, VAT, and transfer estimates. No hidden fees.',
  path: '/cost-calculator',
  canonicalPath: '/tools/charter-cost-calculator',
});

const QUERY = `*[_type == "yacht"] | order(weeklyRatePrice asc) {
  name, "slug": slug.current, weeklyRatePrice, sleeps, cabins, category, builder, length
}`;

const CATEGORY_TYPE_MAP = {
  'sailing-catamarans': 'Sailing Cat',
  'power-catamarans': 'Power Cat',
  'motor-yachts': 'Motor Yacht',
  'monohulls': 'Monohull',
};

function extractPrices(priceStr) {
  if (!priceStr) return null;
  const regex = /[\d,]+/g;
  const numbers = [];
  let m;
  while ((m = regex.exec(priceStr)) !== null) {
    const num = parseInt(m[0].replace(/,/g, ''));
    if (!isNaN(num) && num > 100) numbers.push(num);
  }
  if (numbers.length === 0) return null;
  return { low: numbers[0], high: numbers[numbers.length - 1] };
}

export default async function CostCalculatorPage() {
  let yachts = [];
  try {
    const raw = await sanityClient.fetch(QUERY);
    yachts = raw
      .map(y => {
        const prices = extractPrices(y.weeklyRatePrice);
        if (!prices) return null;
        return {
          name: y.name,
          slug: y.slug,
          low: prices.low,
          high: prices.high,
          guests: parseInt(y.sleeps) || 8,
          type: CATEGORY_TYPE_MAP[y.category] || 'Yacht',
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.low - b.low);
  } catch (e) {
    console.error('Failed to fetch yachts for cost calculator:', e);
  }

  return (


    <>


      <PageBreadcrumb path="/cost-calculator" />


      <CostCalculatorClient yachts={yachts} />


      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>


  );
}
