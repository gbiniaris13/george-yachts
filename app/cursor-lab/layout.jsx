// A workbench, not a page of the site. Kept out of the index and out of the
// sitemap; it comes down once George has chosen.
export const metadata = {
  title: "Cursor lab",
  robots: { index: false, follow: false, nocache: true },
};

export default function CursorLabLayout({ children }) {
  return children;
}
