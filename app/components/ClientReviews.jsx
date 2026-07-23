// Client reviews band - the REAL five-star Google reviews, made visible.
//
// 2026-06-28. George's three genuine five-star Google reviews live in
// lib/reviewsData.js (and drive the AggregateRating schema). This surfaces
// them ON the homepage with visible stars + the aggregate, high up, as social
// proof. Renders nothing until at least one real review exists (no fabrication).

import Link from "next/link";
import { REVIEWS, getOverallAggregateRating, initials } from "@/lib/reviewsData";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

function Stars({ n = 5, size = 16 }) {
  return (
    <span aria-hidden="true" style={{ color: GOLD, fontSize: size, letterSpacing: "2px", lineHeight: 1 }}>
      {"★".repeat(n)}
    </span>
  );
}

function trim(text, max = 168) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).trim() + "…";
}

export default function ClientReviews() {
  const agg = getOverallAggregateRating();
  if (!agg || !Array.isArray(REVIEWS) || REVIEWS.length === 0) return null;

  // Show up to 3, most recent first.
  const shown = [...REVIEWS].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 3);

  return (
    <section className="relative py-24 md:py-28" style={{ backgroundColor: CREAM }} aria-label="Client reviews">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Aggregate header — centered via inline styles (not reliant on
            utility classes) so the stars + rating + count always sit centred. */}
        <div style={{ textAlign: "center", marginBottom: "48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, fontWeight: 400, letterSpacing: "clamp(0.2em, 0.8vw, 0.4em)", textTransform: "uppercase", color: NAVY, opacity: 0.5, margin: "0 0 18px" }}>
            What our clients say
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Stars n={5} size={22} />
            <span style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 30, fontWeight: 300, color: NAVY, lineHeight: 1 }}>
              {agg.ratingValue}
            </span>
          </div>
          {/* George 2026-07-22: never show the review COUNT — it goes
              stale the moment a new review lands (said "4" while Google
              showed 5). Score + the reviews themselves carry the proof. */}
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, letterSpacing: "0.08em", color: "rgba(13,27,42,0.6)", margin: "14px 0 0", textAlign: "center" }}>
            Five-star reviews on Google
          </p>
        </div>

        {/* Review cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {shown.map((r) => (
            <figure key={r.id} style={{ margin: 0, borderTop: `1px solid rgba(201,168,76,0.4)`, paddingTop: 22 }}>
              <Stars n={Math.round(r.rating) || 5} size={13} />
              <blockquote style={{ fontFamily: "var(--gy-font-editorial)", fontStyle: "italic", fontSize: 16, lineHeight: 1.65, fontWeight: 400, color: NAVY, margin: "14px 0 16px" }}>
                &ldquo;{trim(r.body)}&rdquo;
              </blockquote>
              <figcaption style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.06em", color: "rgba(13,27,42,0.7)" }}>
                <span style={{ fontWeight: 600 }}>{initials(r.author)}</span>
                <span style={{ opacity: 0.6 }}> · Google review</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Link to all reviews */}
        <div className="text-center" style={{ marginTop: "44px" }}>
          <Link href="/reviews" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, color: NAVY, textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: 4 }}>
            Read every review
          </Link>
        </div>
      </div>
    </section>
  );
}
