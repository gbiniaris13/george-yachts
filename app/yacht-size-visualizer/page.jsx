import { sanityClient } from '@/lib/sanity';
import SizeVisualizerClient from './SizeVisualizerClient';

export const revalidate = 3600;

export const metadata = {
  title: 'Yacht Size Visualizer | How Big Is Your Yacht? | George Yachts',
  description: 'See how big each yacht really is — compared to tennis courts, hotel suites, and swimming pools. Interactive size comparison tool.',
};

const QUERY = `*[_type == "yacht"] | order(length desc) {
  name, "slug": slug.current, length, category
}`;

const CATEGORY_TYPE_MAP = {
  'sailing-catamarans': 'Sailing Cat',
  'power-catamarans': 'Power Cat',
  'motor-yachts': 'Motor Yacht',
  'monohulls': 'Monohull',
};

// Estimate beam from category and length
function estimateBeam(category, lengthM) {
  if (category === 'sailing-catamarans' || category === 'power-catamarans') {
    // Catamarans: beam ≈ 50-60% of length
    if (lengthM >= 24) return 12;
    if (lengthM >= 19) return 10;
    if (lengthM >= 16) return 8.5;
    if (lengthM >= 13) return 7.7;
    return 7;
  }
  if (category === 'motor-yachts') {
    if (lengthM >= 40) return 9;
    if (lengthM >= 30) return 7.5;
    return 5.5;
  }
  // Monohulls: beam ≈ 20-25% of length
  if (lengthM >= 28) return 7;
  if (lengthM >= 24) return 5.5;
  return 5;
}

function parseLength(lengthStr) {
  if (!lengthStr) return null;
  const m = String(lengthStr).match(/([\d.]+)\s*m/i);
  if (m) return parseFloat(m[1]);
  const ft = String(lengthStr).match(/([\d.]+)\s*ft/i);
  if (ft) return Math.round(parseFloat(ft[1]) * 0.3048 * 10) / 10;
  const num = parseFloat(String(lengthStr).replace(/[^\d.]/g, ''));
  return !isNaN(num) && num > 5 && num < 200 ? (num > 100 ? Math.round(num * 0.3048 * 10) / 10 : num) : null;
}

export default async function SizeVisualizerPage() {
  let yachts = [];
  try {
    const raw = await sanityClient.fetch(QUERY);
    yachts = raw
      .map(y => {
        const lengthM = parseLength(y.length);
        if (!lengthM) return null;
        return {
          name: y.name,
          slug: y.slug,
          length: lengthM,
          beam: estimateBeam(y.category, lengthM),
          type: CATEGORY_TYPE_MAP[y.category] || 'Yacht',
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);
  } catch (e) {
    console.error('Failed to fetch yachts for size visualizer:', e);
  }

  return <SizeVisualizerClient yachts={yachts} />;
}
