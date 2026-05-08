import React from "react";
import Link from "next/link";
import { urlFor } from "../../lib/sanity";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";

const FORBES_ARTICLE_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

const INTERNAL_HOSTS = ["georgeyachts.com", "www.georgeyachts.com"];

const OWN_PROPERTIES = [
  "calendly.com/george-georgeyachts",
  "wa.me/17867988798",
  "linkedin.com/in/georgebiniaris",
  "instagram.com/georgeyachts",
];

const TRUSTED_AUTHORITIES = [
  "myba-association.com",
  "iyba.org",
  "ynanp.gr",
  "knightfrank.com",
  "schema.org",
  "google.com",
  "wikipedia.org",
];

function classifyLink(href) {
  try {
    const url = new URL(href, "https://georgeyachts.com");
    const host = url.hostname.toLowerCase();
    const fullUrl = url.href.toLowerCase();

    const isInternal = INTERNAL_HOSTS.some(
      (h) => host === h || host.endsWith("." + h)
    );
    const isOwnProperty = OWN_PROPERTIES.some((p) => fullUrl.includes(p));
    const isTrustedAuthority = TRUSTED_AUTHORITIES.some(
      (a) => host === a || host.endsWith("." + a)
    );

    return { isInternal, isOwnProperty, isTrustedAuthority };
  } catch {
    return { isInternal: true, isOwnProperty: false, isTrustedAuthority: false };
  }
}

const linkStyle =
  "text-[#C9A84C] hover:text-white border-b border-[#C9A84C]/30 hover:border-white transition-colors duration-300";

export const RichTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="relative w-full h-[50vh] md:h-[70vh] my-16 border border-white/10">
          <img
            src={urlFor(value).width(1200).format('webp').quality(75).url()}
            alt={value.alt || "Editorial Image"}
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    },
    table: ({ value }) => {
      const { rows = [], headerRow = true, caption } = value;
      if (!rows.length) return null;

      const headerData = headerRow ? rows[0] : null;
      const bodyRows = headerRow ? rows.slice(1) : rows;

      const cellStyle = (isHeader) => ({
        padding: "12px 16px",
        textAlign: "left",
        color: isHeader ? "#F8F5F0" : "#0D1B2A",
        fontFamily: isHeader
          ? "var(--font-montserrat), Montserrat, sans-serif"
          : "Lato, var(--font-sans), sans-serif",
        fontWeight: isHeader ? 600 : 300,
        fontSize: "0.95rem",
        lineHeight: 1.6,
        borderBottom: isHeader ? "2px solid #C9A84C" : "1px solid #F8F5F0",
      });

      return (
        <div className="my-12">
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderLeft: "3px solid #C9A84C",
                minWidth: "480px",
              }}
            >
              {headerData && (
                <thead>
                  <tr style={{ backgroundColor: "#0D1B2A" }}>
                    {(headerData.cells || []).map((cell, i) => (
                      <th key={i} style={cellStyle(true)}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, bodyIdx) => (
                  <tr
                    key={bodyIdx}
                    style={{
                      backgroundColor: bodyIdx % 2 === 0 ? "#ffffff" : "#F8F5F0",
                    }}
                  >
                    {(row.cells || []).map((cell, i) => (
                      <td key={i} style={cellStyle(false)}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {caption && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "0.8rem",
                color: "rgba(248, 245, 240,0.4)",
                fontStyle: "italic",
                fontFamily: "var(--font-sans), sans-serif",
              }}
            >
              {caption}
            </p>
          )}
        </div>
      );
    },

    // F.3 (Roberto master rebuild brief, May 2026) — Inline yacht
    // callout. Editor inserts this Sanity block mid-article with a
    // reference to a yacht; the renderer dereferences it (the post
    // GROQ expands `yacht->{...}`) and shows a quote-styled yacht
    // card with thumbnail + name + length·guests + unit-aware price
    // + "View this yacht →".
    yachtCallout: ({ value }) => {
      const y = value?.yacht;
      if (!y || !y.slug) return null;
      const slug = typeof y.slug === "object" ? y.slug.current : y.slug;
      const leadIn = value?.leadIn;
      // 2026-05-07 — plain <a> (not next/link) to avoid the Next 15
      // Server→Client onClick boundary error that 500'd /blog/[slug]
      // when this callout (or any internal auto-link) rendered.
      return (
        <aside
          className="my-12 not-prose"
          aria-label={`Yacht callout: ${y.name || slug}`}
        >
          <a
            href={`/yachts/${slug}`}
            data-cursor="View"
            className="yacht-callout-card"
            style={{
              display: "flex",
              gap: 18,
              alignItems: "stretch",
              padding: 18,
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 0,
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}
          >
            {y.image && (
              <div
                style={{
                  flex: "0 0 auto",
                  width: 130,
                  minHeight: 100,
                  background: `#0D1B2A url(${sanityCardImg(y.image, 320)}) center/cover no-repeat`,
                }}
                aria-hidden="true"
              />
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
              {leadIn && (
                <span
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                    fontWeight: 600,
                  }}
                >
                  {leadIn}
                </span>
              )}
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "#F8F5F0",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {y.name}
              </p>
              {(y.length || y.sleeps) && (
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(248, 245, 240,0.6)",
                    margin: 0,
                  }}
                >
                  {[y.length, y.sleeps && `${y.sleeps} guests`].filter(Boolean).join(" · ")}
                </p>
              )}
              {y.weeklyRatePrice && (
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      display: "inline-block",
                      marginRight: 8,
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 8,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: isPerPerson(y) ? "rgba(248, 245, 240,0.7)" : "#C9A84C",
                      fontWeight: 600,
                    }}
                  >
                    {priceUnitBadge(y)}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 12,
                      color: "#C9A84C",
                      fontWeight: 600,
                    }}
                  >
                    {y.weeklyRatePrice}
                  </span>
                </div>
              )}
              <span
                style={{
                  marginTop: 6,
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  fontWeight: 600,
                }}
              >
                View this yacht →
              </span>
            </div>
          </a>
        </aside>
      );
    },

    // Forbes Tier 3.2 — Inline Forbes citation block. Hard-coded
    // wordmark + byline + date so the editor only fills the quote.
    // Wraps to a Forbes article opened in a new tab.
    forbesCitationBlock: ({ value }) => {
      const { quote, leadIn } = value || {};
      if (!quote) return null;
      return (
        <aside
          className="my-12 not-prose"
          aria-label="Forbes citation"
          style={{
            padding: "28px 32px",
            background: "rgba(13,27,42,0.6)",
            borderTop: "1px solid rgba(201,168,76,0.45)",
            borderBottom: "1px solid rgba(201,168,76,0.45)",
          }}
        >
          <p
            aria-label="Forbes"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              margin: "0 0 14px",
              lineHeight: 1,
            }}
          >
            Forbes
          </p>
          {leadIn && (
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                margin: "0 0 12px",
              }}
            >
              {leadIn}
            </p>
          )}
          <blockquote
            cite={FORBES_ARTICLE_URL}
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.5,
              color: "#F8F5F0",
              margin: "0 0 16px",
              padding: "0 0 0 18px",
              borderLeft: "3px solid #C9A84C",
              fontWeight: 300,
            }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 13,
              color: "rgba(248,245,240,0.75)",
              margin: 0,
              fontWeight: 300,
            }}
          >
            — George P. Biniaris in{" "}
            <a
              href={FORBES_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#C9A84C",
                textDecoration: "underline",
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Forbes
            </a>{" "}
            &middot; 1 May 2026 &middot;{" "}
            <a
              href={FORBES_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#C9A84C", textDecoration: "underline" }}
            >
              Read the full piece →
            </a>
          </p>
        </aside>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-white/70 font-sans font-light text-base md:text-lg leading-loose mb-8">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl text-white font-marcellus mt-16 mb-6 uppercase tracking-wide">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl text-[#C9A84C] font-marcellus mt-12 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#C9A84C] pl-6 md:pl-8 my-12 py-2">
        <p className="text-2xl md:text-3xl text-white italic font-marcellus leading-relaxed opacity-90">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const { isInternal, isOwnProperty, isTrustedAuthority } = classifyLink(href);

      // Internal link — plain <a> (not next/link). Next 15 + Server-
      // Component-rendered <Link> injects an internal onClick that
      // crashes the Server→Client serialization. Loses prefetch but
      // keeps /blog/[slug] alive. Same root-cause + fix as
      // yachtCallout above (2026-05-07).
      if (isInternal) {
        const path = href.replace(/^https?:\/\/(www\.)?georgeyachts\.com/, "") || "/";
        return (
          <a href={path} className={linkStyle}>
            {children}
          </a>
        );
      }

      // Own property (Calendly, WhatsApp, LinkedIn, Instagram) — dofollow, new tab
      if (isOwnProperty) {
        return (
          <a href={href} target="_blank" rel="noopener" className={linkStyle}>
            {children}
          </a>
        );
      }

      // Trusted authority (MYBA, IYBA, Greek gov) — dofollow for E-E-A-T, new tab
      if (isTrustedAuthority) {
        return (
          <a href={href} target="_blank" rel="noopener" className={linkStyle}>
            {children}
          </a>
        );
      }

      // All other external — nofollow + noopener, new tab
      return (
        <a href={href} target="_blank" rel="nofollow noopener" className={linkStyle}>
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="text-white font-semibold tracking-wide">
        {children}
      </strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 md:pl-8 space-y-4 text-white/70 font-sans font-light text-base md:text-lg mb-8">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 md:pl-8 space-y-4 text-white/70 font-sans font-light text-base md:text-lg mb-8">
        {children}
      </ol>
    ),
  },
};
