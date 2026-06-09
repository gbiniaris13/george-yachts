// app/components/seo/LastUpdated.jsx
//
// Small, unobtrusive visible "Last updated {Month Year}" line. Pairs with
// the dateModified in each page's JSON-LD so the freshness signal is
// readable by BOTH humans and AI engines (engines read visible on-page
// dates, not just schema). Date comes from lib/contentFreshness.js, the
// single source of truth shared with the sitemap and structured data.
//
// Month-and-year granularity only: precise enough to signal recency,
// coarse enough that it never looks auto-generated per visit.

import { humanDate } from "@/lib/contentFreshness";

export default function LastUpdated({ date, align = "center" }) {
  const label = humanDate(date);
  if (!label) return null;
  return (
    <p
      style={{
        fontFamily: "var(--gy-font-ui)",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(248, 245, 240, 0.45)",
        fontWeight: 600,
        margin: "18px 0 0",
        textAlign: align,
      }}
    >
      Last updated {label}
    </p>
  );
}
