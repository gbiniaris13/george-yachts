// Shared "Closely related to this page" block.
//
// 2026-08-06 (job 18) — extracted from SeoLanding, which was the only place
// that rendered it. That made the COHORTS mechanism in lib/seoInternalLinks.js
// invisible to every hand-written page on the site, and the cost cluster is
// mostly hand-written: /weekly-yacht-charter-rates-greece,
// /tools/charter-cost-calculator, /greek-charter-index-2026 and
// /glossary/day-charter each linked to exactly ONE of their six siblings.
//
// That cluster is the biggest commercial demand we have (127 queries, 918
// impressions, two clicks) and every query in it was being split across three
// to five of our own pages. Separating the titles was half the fix. This is
// the other half: the cohort finally reaches the pages that need it.
//
// Markup and styles are a verbatim copy of the SeoLanding block so the two
// render identically wherever they appear.

import Link from "next/link";
import { relatedFor } from "@/lib/seoInternalLinks";

const GOLD = "#DAA110";

export default function RelatedPages({ path, limit = 6, greek = false }) {
  // relatedFor(path, opts) takes an OBJECT, not a number. Passing the bare
  // integer happened to work only because (6).max is undefined and the default
  // is also 6, so the limit argument was silently ignored. Caught 2026-08-06
  // while checking why the 2027 month pages render no related block at all.
  const related = relatedFor(path, { max: limit }) || [];
  if (!related.length) return null;

  return (
    <section style={{ padding: "72px 24px", borderTop: "1px solid rgba(248, 245, 240,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px", textAlign: "center" }}>
          {greek ? "Συνεχίστε την εξερεύνηση" : "Continue exploring"}
        </p>
        <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 3.4vw, 34px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 36px", textAlign: "center", lineHeight: 1.2 }}>
          {greek ? "Σχετικές σελίδες" : "Closely related to this page"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {related.map((r) => (
            <Link
              key={r.urlPath}
              href={r.urlPath}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid rgba(248, 245, 240,0.1)",
                padding: "18px 20px",
                background: "rgba(248, 245, 240,0.02)",
                transition: "border-color 0.3s ease",
              }}
            >
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 8px" }}>
                {r.eyebrow}
              </p>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 17, fontWeight: 400, color: "#F8F5F0", margin: 0, lineHeight: 1.3 }}>
                {r.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
