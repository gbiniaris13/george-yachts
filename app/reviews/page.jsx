// Public reviews aggregator page — /reviews
//
// 2026-05-11 Phase 7 Round 3 SEO execution. Section 8 Gap 1.
// Free replacement for Trustpilot. Renders all reviews from
// /lib/reviewsData.js with proper Review + AggregateRating JSON-LD
// so AI search engines + Google rich results pick them up.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { REVIEWS, getOverallAggregateRating, initials } from "@/lib/reviewsData";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";

export const metadata = {
  title: "Charter Reviews",
  description: "Verified yacht charter reviews from George Yachts clients across Greek waters. IYBA member, MYBA-standard contracts.",
  alternates: { canonical: "https://georgeyachts.com/reviews" },
  openGraph: {
    title: "Charter Reviews | George Yachts",
    description: "Verified yacht charter reviews from George Yachts clients across Greek waters. IYBA member, MYBA-standard contracts.",
    url: "https://georgeyachts.com/reviews",
  },
};

function ReviewJsonLd({ reviews, aggregate }) {
  if (!reviews || reviews.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://georgeyachts.com/#organization",
    name: "George Yachts Brokerage House",
    ...(aggregate ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregate.ratingValue,
        reviewCount: aggregate.reviewCount,
        bestRating: aggregate.bestRating,
        worstRating: aggregate.worstRating,
      },
    } : {}),
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: initials(r.author) },
      datePublished: r.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      name: r.title,
      reviewBody: r.body,
      ...(r.yachtName ? { itemReviewed: { "@type": "Product", name: r.yachtName } } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function Star({ filled }) {
  return (
    <span
      aria-hidden="true"
      style={{ color: filled ? GOLD : "rgba(248, 245, 240, 0.25)", fontSize: 16, marginRight: 2 }}
    >
      ★
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <article
      style={{
        border: "1px solid rgba(248, 245, 240, 0.1)",
        padding: "28px 30px",
        background: "rgba(248, 245, 240, 0.02)",
      }}
      itemScope
      itemType="https://schema.org/Review"
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }} aria-label={`${review.rating} of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= review.rating} />
        ))}
      </div>
      <h3
        itemProp="name"
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: 22,
          fontWeight: 400,
          color: "#F8F5F0",
          margin: "0 0 14px",
          lineHeight: 1.35,
        }}
      >
        {review.title}
      </h3>
      <p
        itemProp="reviewBody"
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 15,
          lineHeight: 1.7,
          color: "rgba(248, 245, 240, 0.82)",
          margin: "0 0 18px",
        }}
      >
        {review.body}
      </p>
      <div
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span itemProp="author">{initials(review.author)}</span>
        {review.country && <span style={{ color: "rgba(248, 245, 240, 0.45)" }}>{review.country}</span>}
        <span style={{ color: "rgba(248, 245, 240, 0.45)" }}>·</span>
        <time itemProp="datePublished" dateTime={review.date} style={{ color: "rgba(248, 245, 240, 0.55)" }}>
          {new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </time>
        {review.yachtSlug && (
          <>
            <span style={{ color: "rgba(248, 245, 240, 0.45)" }}>·</span>
            <Link
              href={`/yachts/${review.yachtSlug}`}
              style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}`, paddingBottom: 1 }}
            >
              {review.yachtName}
            </Link>
          </>
        )}
        {review.verified && (
          <>
            <span style={{ color: "rgba(248, 245, 240, 0.45)" }}>·</span>
            <span style={{ color: "rgba(248, 245, 240, 0.65)" }}>✓ Verified charter</span>
          </>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        border: "1px solid rgba(201, 168, 76, 0.25)",
        padding: "48px 36px",
        textAlign: "center",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 18px",
        }}
      >
        First reviews arriving 2026
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: 22,
          fontWeight: 300,
          color: "#F8F5F0",
          margin: "0 0 24px",
          lineHeight: 1.5,
        }}
      >
        We post reviews from completed charters here as we receive them.
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 14,
          lineHeight: 1.7,
          color: "rgba(248, 245, 240, 0.72)",
          margin: 0,
        }}
      >
        Every review is from a verified charter that we ran or coordinated. We post first
        name and last initial only, with explicit consent. If you chartered with us and
        would like to leave a review, write directly to <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>george@georgeyachts.com</a>.
      </p>
    </div>
  );
}

export default function ReviewsPage() {
  const aggregate = getOverallAggregateRating();

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Reviews", url: "https://georgeyachts.com/reviews" },
  ];

  return (
    <>
      <ReviewJsonLd reviews={REVIEWS} aggregate={aggregate} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh" }}>
        {/* HERO */}
        <header
          style={{
            padding: "120px 24px 64px",
            borderBottom: "1px solid rgba(201, 168, 76, 0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 18px",
              }}
            >
              Charter reviews
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(48px, 8vw, 110px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              What our clients say
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248, 245, 240, 0.78)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Every review from a verified charter. First name and last initial only, with
              explicit consent. IYBA member, MYBA-standard contracts.
            </p>
            {aggregate && (
              <div style={{ marginTop: 30, display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4 }} aria-label={`${aggregate.ratingValue} of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} filled={i <= Math.round(aggregate.ratingValue)} />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "var(--gy-font-display)",
                    fontSize: 24,
                    fontWeight: 300,
                    color: "#F8F5F0",
                  }}
                >
                  {aggregate.ratingValue}
                </span>
                <span
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 11,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "rgba(248, 245, 240, 0.55)",
                  }}
                >
                  {aggregate.reviewCount} verified charters
                </span>
              </div>
            )}
          </div>
        </header>

        {/* REVIEWS LIST */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {REVIEWS.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {REVIEWS.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        {/* HOW WE COLLECT REVIEWS */}
        <section
          style={{
            background: "rgba(201, 168, 76, 0.025)",
            borderTop: "1px solid rgba(201, 168, 76, 0.15)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 18px",
              }}
            >
              How we collect reviews
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240, 0.82)",
                margin: "0 0 18px",
              }}
            >
              Every charter ends with a brief follow-up from George. Clients who want to
              share an experience send notes by email, WhatsApp, or in person at later
              meetings. We post reviews on this page with explicit consent and using first
              name plus last initial only. We never post anonymous reviews. We never edit
              for tone.
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 16,
                lineHeight: 1.75,
                color: "rgba(248, 245, 240, 0.82)",
                margin: 0,
              }}
            >
              For privacy of UHNW clients, we are willing to verify reviews directly with
              prospective charterers on request. Contact{" "}
              <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>
                george@georgeyachts.com
              </a>{" "}
              for verification of any specific review.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 32px",
                lineHeight: 1.2,
              }}
            >
              Charter with us for 2026.
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/yacht-finder"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "14px 26px",
                  background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                  color: NAVY,
                  border: "1px solid rgba(201, 168, 76, 0.6)",
                  textDecoration: "none",
                }}
              >
                Find a yacht
              </Link>
              <Link
                href="/inquiry"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "14px 26px",
                  background: "transparent",
                  color: "rgba(248, 245, 240, 0.85)",
                  border: "1px solid rgba(248, 245, 240, 0.3)",
                  textDecoration: "none",
                }}
              >
                Or write to George
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
