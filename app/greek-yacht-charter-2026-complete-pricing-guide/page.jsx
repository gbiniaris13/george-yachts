import SeoLanding from "@/app/components/seo/SeoLanding";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import { getArticleBySlug } from "@/lib/articleSeo";

const SLUG = "greek-yacht-charter-2026-complete-pricing-guide";
const PAGE = getArticleBySlug(SLUG);

export const revalidate = 86400;
export const metadata = {
  title: PAGE.seoTitle,
  description: PAGE.seoDescription,
  alternates: { canonical: PAGE.canonical },
  openGraph: { title: PAGE.seoTitle, description: PAGE.seoDescription, url: PAGE.canonical, type: "article", images: [`/api/og?title=${encodeURIComponent(PAGE.h1)}&eyebrow=${encodeURIComponent(PAGE.eyebrow)}`] },
};

// Phase 7 R23 (2026-05-12, technical brief Priority 1B) - pricing
// guide gets an inline Calendly embed after the SeoLanding content.
// This page is the highest commercial-intent reading surface and the
// natural decision moment for a discovery call.
export default function Page() {
  return (
    <>
      <SeoLanding pageData={PAGE} />
      <InlineCalendlySection
        heading="Want pricing for your specific charter?"
        subheading="Book a free 30-minute call with George to translate these tables into a real quote for your dates, party size, and yacht preferences."
      />
    </>
  );
}
