import SeoLanding from "@/app/components/seo/SeoLanding";
import { getLongTailBySlug } from "@/lib/longTailSeo";

// 2026-05-11 - Phase 7 SEO landing page. Content in lib data file;
// this wrapper just imports + renders. See SeoLanding component for
// the JSX. Static metadata pre-computed at build time.

const SLUG = "all-inclusive-yacht-charter-greece";
const PAGE = getLongTailBySlug(SLUG);

export const revalidate = 86400;

export const metadata = {
  title: { absolute: PAGE.seoTitle },
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: {
    title: PAGE.seoTitle,
    description: PAGE.seoDescription,
    url: PAGE.canonical,
    type: "website",
  },
};

export default function Page() {
  return <SeoLanding pageData={PAGE} />;
}
