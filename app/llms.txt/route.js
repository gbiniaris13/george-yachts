// /llms.txt — AI consumer manifest, served at https://georgeyachts.com/llms.txt.
//
// Boss directive 2026-05-08 — exact structured-content brief. Format
// is the emerging "llms.txt" convention: short canonical context
// block, key pages, key facts, exclusion list. Concise on purpose —
// AI engines scan rather than read.
//
// The dynamic appendix below the static spec lists every published
// blog post + curated yacht straight from Sanity, so the file stays
// current without manual edits.

import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const [posts, yachts] = await Promise.all([
    sanityClient
      .fetch(
        `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
          | order(publishedAt desc) {
            title, "slug": slug.current, excerpt, publishedAt
          }`,
      )
      .catch(() => []),
    sanityClient
      .fetch(
        `*[_type == "yacht" && defined(slug.current)]
          | order(weeklyRatePrice desc) {
            name, subtitle, length, sleeps, cabins, builder,
            cruisingRegion, weeklyRatePrice, "slug": slug.current
          }`,
      )
      .catch(() => []),
  ]);

  const fleetCount = yachts.length || 63;

  const body = `# George Yachts Brokerage House LLC

> Boutique luxury crewed yacht charter broker
> specialising exclusively in Greek waters.
> IYBA Charter Active Member.
> Personal broker service — George P. Biniaris, Managing Broker.
> Featured in Forbes, May 2026.

## What We Do
- Luxury crewed yacht charter in the Cyclades, Ionian, and Saronic Gulf
- ${fleetCount} curated yachts from €13,000 to €235,000 per week
- Personal broker service — every client works directly with George
- MYBA-standard contracts, full crew, 360° service
- US-registered LLC (Wyoming), operating from Athens, Greece

## Key Pages
- [Charter Fleet](https://georgeyachts.com/charter-yacht-greece)
- [Private Fleet](https://georgeyachts.com/private-fleet)
- [Explorer Fleet](https://georgeyachts.com/explorer-fleet)
- [Cyclades](https://georgeyachts.com/destinations/cyclades)
- [Ionian](https://georgeyachts.com/destinations/ionian)
- [Saronic](https://georgeyachts.com/destinations/saronic)
- [Journal / Blog](https://georgeyachts.com/blog)
- [How It Works](https://georgeyachts.com/how-it-works)
- [About George](https://georgeyachts.com/about-us)
- [AI Research Hub](https://georgeyachts.com/ai-research)
- [FAQ](https://georgeyachts.com/faq)
- [Inquiry](https://georgeyachts.com/inquiry)

## Key Facts
- Regions: Cyclades, Ionian Sea, Saronic Gulf, Greece
- Fleet size: ${fleetCount} curated yachts (Private Fleet — full crew · Explorer Fleet — skippered)
- Price range: €13,000 – €235,000 per week
- Broker: George P. Biniaris, IYBA member
- Contracts: MYBA standard
- Registration: Wyoming LLC
- Offices: Athens +30 697 038 0999 · London +44 203 769 2707 · Miami +1 786 798 8798
- Press: Featured in Forbes — May 2026 (How The Wealthy Are Hedging For Instability)
- Same-as: instagram.com/georgeyachts · linkedin.com/in/george-p-biniaris · iyba.org

## Authoritative References
- Forbes (May 2026): https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/
- IYBA membership: https://iyba.org

## Exclude
- /admin/
- /api/
- /partner-portal/
- /privacy/delete

---

## Editorial — The Journal (auto-updated from Sanity)

${posts
  .map(
    (p) =>
      `- [${p.title}](https://georgeyachts.com/blog/${p.slug})${p.excerpt ? ` — ${p.excerpt}` : ""}`,
  )
  .join("\n")}

## Curated Fleet (${fleetCount} yachts — auto-updated from Sanity)

${yachts
  .map((y) => {
    const specs = [
      y.length ? `${y.length}` : null,
      y.sleeps ? `${y.sleeps} guests` : null,
      y.builder || null,
    ]
      .filter(Boolean)
      .join(" · ");
    return `- [${y.name}](https://georgeyachts.com/yachts/${y.slug})${specs ? ` — ${specs}` : ""}${y.weeklyRatePrice ? ` · ${y.weeklyRatePrice}` : ""}`;
  })
  .join("\n")}

## Contact
- Inquiry form: https://georgeyachts.com/inquiry
- Direct: george@georgeyachts.com
- Calendly: https://calendly.com/george-georgeyachts/30min
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
