import { sanityClient } from '@/lib/sanity';
import YachtFinderQuiz from './YachtFinderQuiz';

export const revalidate = 3600;

export const metadata = {
  title: 'Find Your Perfect Yacht | George Yachts Brokerage House',
  description: 'Answer 5 simple questions and we\'ll match you with the ideal yacht for your Greek charter. Personalized recommendations from our curated fleet.',
  openGraph: {
    title: 'Find Your Perfect Yacht | George Yachts',
    description: 'Answer 5 questions. Get your perfect yacht match in Greek waters.',
  },
};

const QUERY = `*[_type == "yacht"] | order(weeklyRatePrice asc) {
  name, "slug": slug.current, weeklyRatePrice, sleeps, cabins, category, builder, length, idealFor,
  "imageUrl": images[0].asset->url
}`;

const CATEGORY_TYPE_MAP = {
  'sailing-catamarans': 'sailing-cat',
  'power-catamarans': 'power-cat',
  'motor-yachts': 'motor',
  'monohulls': 'sailing-mono',
};

function extractPrice(priceStr) {
  if (!priceStr) return 0;
  const m = String(priceStr).match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, '')) : 0;
}

function deriveTags(yacht) {
  const tags = [];
  const price = extractPrice(yacht.weeklyRatePrice);
  const idealLower = (yacht.idealFor || '').toLowerCase();

  // Price-based tags
  if (price <= 20000) tags.push('budget', 'value', 'entry-level');
  else if (price <= 50000) tags.push('mid-range');
  else tags.push('luxury');
  if (price >= 80000) tags.push('superyacht');

  // Category-based tags
  const cat = yacht.category;
  if (cat === 'sailing-catamarans' || cat === 'monohulls') tags.push('sailing');
  if (cat === 'power-catamarans' || cat === 'motor-yachts') tags.push('speed');

  // Derived from idealFor field
  if (idealLower.includes('family') || idealLower.includes('families') || idealLower.includes('children')) tags.push('families');
  if (idealLower.includes('couple') || idealLower.includes('romance') || idealLower.includes('honeymoon') || idealLower.includes('intimate')) tags.push('romance');
  if (idealLower.includes('adventure') || idealLower.includes('diving') || idealLower.includes('sport')) tags.push('adventure', 'watersports');
  if (idealLower.includes('cuisine') || idealLower.includes('food') || idealLower.includes('chef') || idealLower.includes('cooking')) tags.push('cuisine');
  if (idealLower.includes('relax') || idealLower.includes('quiet') || idealLower.includes('privacy')) tags.push('relaxation');
  if (idealLower.includes('first') || idealLower.includes('first-time')) tags.push('first-time');
  if (idealLower.includes('group') || idealLower.includes('large')) tags.push('families');
  if (idealLower.includes('eco') || idealLower.includes('sustainable')) tags.push('eco');
  if (idealLower.includes('design') || idealLower.includes('modern') || idealLower.includes('contemporary')) tags.push('design');
  if (idealLower.includes('classic') || idealLower.includes('traditional')) tags.push('classic');

  // Ensure at least a few tags
  if (tags.length < 3) tags.push('first-time');

  return [...new Set(tags)];
}

export default async function YachtFinderPage() {
  let fleet = [];
  try {
    const raw = await sanityClient.fetch(QUERY);
    fleet = raw
      .map(y => {
        const price = extractPrice(y.weeklyRatePrice);
        if (price === 0) return null;
        return {
          slug: y.slug,
          name: y.name,
          type: CATEGORY_TYPE_MAP[y.category] || 'sailing-cat',
          guests: parseInt(y.sleeps) || 8,
          cabins: parseInt(y.cabins) || 4,
          price,
          builder: y.builder || '',
          length: y.length || '',
          img: y.imageUrl || '/images/yacht-1.jpeg',
          tags: deriveTags(y),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.price - a.price);
  } catch (e) {
    console.error('Failed to fetch yachts for yacht finder:', e);
  }

  return <YachtFinderQuiz fleet={fleet} />;
}
