// 2026-07-30 — /admin/* is disallowed in robots.txt, but the pages
// themselves were still emitting "index, follow" (the Ahrefs crawl of
// 30/07/2026 picked up /admin/kpis with the homepage title and a 276-char
// description). robots.txt only asks crawlers not to fetch; it does not stop
// a URL that someone links to from being indexed. This adds the header-level
// noindex, which does, and it covers every current and future admin route.

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
