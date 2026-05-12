import SeoLanding from "@/app/components/seo/SeoLanding";
import InlineCalendlySection from "@/app/components/InlineCalendlySection";
import PricingGuidePdfGate from "@/app/components/PricingGuidePdfGate";
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

// Phase 7 R23 + R25 (2026-05-12, technical brief Priorities 1B + 1D):
// - PricingGuidePdfGate captures email + delivers branded PDF (1D)
// - InlineCalendlySection embeds Calendly call widget (1B)
// PDF gate sits BEFORE SeoLanding so the visitor sees the lead-magnet
// offer first; SeoLanding renders the full content below for visitors
// who scroll past.
export default function Page() {
  return (
    <>
      <PricingGuidePdfGate />
      <SeoLanding pageData={PAGE} />
      <InlineCalendlySection
        heading="Want pricing for your specific charter?"
        subheading="Book a free 30-minute call with George to translate these tables into a real quote for your dates, party size, and yacht preferences."
      />
    </>
  );
}
