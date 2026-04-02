import { sanityClient } from '@/lib/sanity';
import CostCalculatorClient from './CostCalculatorClient';

export const revalidate = 3600;

export const metadata = {
  title: 'Charter Cost Calculator | George Yachts',
  description: 'Calculate the total cost of your Greek yacht charter. Transparent pricing with charter rate, APA, VAT, and transfer estimates. No hidden fees.',
  openGraph: {
    title: 'Charter Cost Calculator | George Yachts',
    description: 'See exactly what your yacht charter will cost — charter rate, APA, VAT, transfers. Complete transparency.',
  },
};

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

  return <CostCalculatorClient yachts={yachts} />;
}
