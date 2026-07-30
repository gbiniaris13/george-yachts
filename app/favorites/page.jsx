import FavoritesContent from './FavoritesContent';

export const metadata = {
  title: { absolute: 'My Favorites | George Yachts Brokerage House' },
  description: 'Your saved yachts - review your favorites and send them to George for a personalized charter proposal.',
  // 2026-07-30 — noindex. The page renders one visitor's own saved yachts
  // from local state, so there is no stable public content here: to a
  // crawler it is a permanently empty shell. It was indexable and absent
  // from the sitemap, which is exactly the combination that wastes crawl
  // budget. follow stays on so the links out of it still pass through.
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return <FavoritesContent />;
}
