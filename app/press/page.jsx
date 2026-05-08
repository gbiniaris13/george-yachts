// Tier 1.2 (Roberto Forbes integration brief, May 2026) — /press
//
// Press & Media Mentions hub. Currently one entry (Forbes May 2026)
// but the layout accepts more press cards as they land — sortable by
// date descending. Future entries follow the same template (logo,
// date, title, byline, pull quote, excerpt, CTA).
//
// Server-rendered: every word of the Forbes mention sits in the
// initial HTML response so Googlebot, ChatGPT, Perplexity, Claude,
// and Gemini can read the credential without JavaScript.

import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const FORBES = {
  url:
    "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/",
  date: "1 May 2026",
  isoDate: "2026-05-01",
  title: "How The Wealthy Are Hedging For Instability",
  authorName: "Jacques Ledbetter",
  authorRole: "Forbes Contributor",
  pullQuote:
    "That's the geopolitical shift playing out in real time on my desk.",
  attribution: "George P. Biniaris, Managing Broker",
  excerpt:
    "George Yachts was quoted alongside leaders from Sotheby's Caribbean, Arton Capital, and Cloud9 Concierge in this Forbes piece on how UHNW wealth is repositioning across geography, passports, and portfolios in 2026. The article positions Greek waters as a strategic destination absorbing charter demand previously deployed to the Gulf, Red Sea, and UAE.",
};

export const metadata = {
  title: "Press & Media Mentions",
  description:
    "George Yachts in independent journalism. Featured in Forbes, May 2026, on the wealth-relocation patterns reshaping Greek waters charters.",
  alternates: {
    canonical: "https://georgeyachts.com/press",
  },
  openGraph: {
    title: "Press & Media Mentions — George Yachts",
    description:
      "George Yachts in independent journalism. Featured in Forbes, May 2026.",
    url: "https://georgeyachts.com/press",
    type: "website",
    images: [
      {
        url: "/press/opengraph-image",
        width: 1200,
        height: 630,
        alt: "George Yachts — Featured in Forbes, May 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media Mentions — George Yachts",
    description:
      "George Yachts in Forbes — May 2026.",
    images: ["/press/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

function CollectionPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Press & Media Mentions — George Yachts",
    url: "https://georgeyachts.com/press",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "NewsArticle",
            headline: FORBES.title,
            url: FORBES.url,
            datePublished: FORBES.isoDate,
            author: {
              "@type": "Person",
              name: FORBES.authorName,
              jobTitle: FORBES.authorRole,
            },
            publisher: {
              "@type": "Organization",
              name: "Forbes",
              url: "https://www.forbes.com",
            },
            mentions: {
              "@type": "Organization",
              name: "George Yachts",
              url: "https://georgeyachts.com",
            },
          },
        },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Addendum v2 — FAQPage JSON-LD. AI search engines (ChatGPT,
// Perplexity, Claude, Google AI Overviews) extract answers in Q&A
// format. By providing structured answers to predictable questions
// about the Forbes feature, the /press page becomes the primary
// citation source for AI-generated answers about George Yachts in
// connection with Forbes.
function PressFaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is George Yachts featured for?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "George Yachts was featured in Forbes on 1 May 2026, in a piece by Forbes Contributor Jacques Ledbetter analyzing how ultra-high-net-worth wealth is repositioning across geography, passports, and portfolios in 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Why Greek waters specifically?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "According to the Forbes piece, Greek waters have absorbed displaced charter demand for several reasons: operation entirely within EU and NATO waters, no elevated security advisories, and a mature crewed charter infrastructure regulated under MYBA standards.",
        },
      },
      {
        "@type": "Question",
        name: "Who else was featured in the article?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The Forbes piece included perspectives from Sotheby's, Arton Capital, Cloud9 Concierge, Suite Sojourn, and Onirikos Milan. George Yachts was the sole yacht brokerage featured.",
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function PressPage() {
  return (
    <div style={{ background: "#0D1B2A", color: "#F8F5F0", minHeight: "100vh" }}>
      <CollectionPageSchema />
      <PressFaqSchema />

      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Press" },
        ]}
      />

      {/* Hero */}
      <section
        style={{
          padding: "100px 24px 60px",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 600,
            margin: "0 0 14px",
          }}
        >
          George Yachts &middot; Independent Journalism
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(40px, 7vw, 88px)",
            fontWeight: 300,
            color: "#F8F5F0",
            margin: "0 0 16px",
            lineHeight: 1.05,
            letterSpacing: "0.005em",
          }}
        >
          In the Press
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(16px, 1.8vw, 22px)",
            color: "rgba(248,245,240,0.8)",
            margin: 0,
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}
        >
          Independent journalism that takes our work seriously.
        </p>
      </section>

      {/* Featured entry — Forbes */}
      <section
        aria-label="Forbes feature"
        style={{
          background: "#0D1B2A",
          borderTop: "1px solid rgba(201,168,76,0.25)",
          borderBottom: "1px solid rgba(201,168,76,0.25)",
          padding: "70px 24px 80px",
        }}
      >
        <article
          style={{
            maxWidth: "880px",
            margin: "0 auto",
          }}
        >
          {/* Forbes wordmark — text-based, intentionally smaller than
              the George Yachts header logo so the brand-equality rule
              from the brief holds. */}
          <p
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              margin: "0 0 14px",
              lineHeight: 1,
            }}
          >
            Forbes
          </p>

          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
              margin: "0 0 22px",
            }}
          >
            As Featured · {FORBES.date}
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 300,
              color: "#F8F5F0",
              margin: "0 0 14px",
              lineHeight: 1.18,
              letterSpacing: "0.005em",
            }}
          >
            {FORBES.title}
          </h2>

          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              color: "rgba(248,245,240,0.7)",
              margin: "0 0 36px",
              letterSpacing: "0.05em",
            }}
          >
            By {FORBES.authorName}, {FORBES.authorRole}
          </p>

          {/* Pull quote — Cormorant italic 24px, gold left rule 3px */}
          <blockquote
            cite={FORBES.url}
            style={{
              borderLeft: "3px solid #C9A84C",
              paddingLeft: 22,
              margin: "0 0 36px",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.4vw, 28px)",
                lineHeight: 1.5,
                color: "#F8F5F0",
                margin: "0 0 12px",
                fontWeight: 300,
              }}
            >
              &ldquo;{FORBES.pullQuote}&rdquo;
            </p>
            <cite
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontStyle: "normal",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.85)",
                fontWeight: 600,
              }}
            >
              — {FORBES.attribution}
            </cite>
          </blockquote>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.75,
              color: "rgba(248,245,240,0.85)",
              margin: "0 0 40px",
              fontWeight: 300,
            }}
          >
            {FORBES.excerpt}
          </p>

          <p>
            <a
              href={FORBES.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Read"
              style={{
                display: "inline-block",
                padding: "14px 30px",
                background:
                  "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                color: "#0D1B2A",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid rgba(201,168,76,0.6)",
              }}
            >
              Read the full article on Forbes →
            </a>
          </p>
        </article>
      </section>

      {/* Addendum v2 — About this Feature (Q&A block).
          AI-search engines extract answers in Q&A format. The visible
          copy + the matching FAQPage JSON-LD make this page the
          primary citation source for AI-generated answers about
          "George Yachts in Forbes". Server-rendered. */}
      <section
        aria-label="About this feature — frequently asked questions"
        style={{
          padding: "60px 24px 70px",
          maxWidth: "780px",
          margin: "0 auto",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 80,
            height: 1,
            background: "rgba(201,168,76,0.4)",
            margin: "0 auto 36px",
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 600,
            margin: "0 0 32px",
            textAlign: "center",
          }}
        >
          About this feature
        </p>

        {[
          {
            q: "What is George Yachts featured for?",
            a: "George Yachts was featured in Forbes on 1 May 2026, in a piece by Forbes Contributor Jacques Ledbetter analyzing how ultra-high-net-worth wealth is repositioning across geography, passports, and portfolios in 2026. George P. Biniaris, Managing Broker of George Yachts, was quoted on the rapid shift of charter demand from Gulf, Red Sea, and UAE-based summer experiences toward Greek waters.",
          },
          {
            q: "Why Greek waters specifically?",
            a: "According to the Forbes piece, Greek waters have absorbed displaced charter demand for several reasons: operation entirely within EU and NATO waters, no elevated security advisories, and a mature crewed charter infrastructure regulated under MYBA standards. The article reports that peak-season availability in the 20-to-40-metre range has tightened materially compared to the same period in 2025.",
          },
          {
            q: "Who else was featured in the article?",
            a: "The Forbes piece included perspectives from Sotheby's (Caribbean real estate), Arton Capital (citizenship and residency), Cloud9 Concierge (Mykonos villas and yachts), Suite Sojourn (private villas), and Onirikos Milan (luxury travel). George Yachts was the sole yacht brokerage featured.",
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: 32,
              paddingBottom: 32,
              borderBottom:
                i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.4vw, 26px)",
                fontWeight: 400,
                color: "#F8F5F0",
                margin: "0 0 14px",
                lineHeight: 1.35,
                letterSpacing: "0.005em",
              }}
            >
              {item.q}
            </h3>
            <p
              style={{
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.85)",
                margin: 0,
                fontWeight: 300,
              }}
            >
              {item.a}
            </p>
          </div>
        ))}
      </section>

      {/* Future entries — placeholder so layout is ready */}
      <section
        style={{
          padding: "20px 24px 60px",
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(248,245,240,0.5)",
            fontWeight: 500,
            textAlign: "center",
            margin: 0,
          }}
        >
          More press to follow
        </p>
      </section>

      {/* Press / media inquiries CTA */}
      <section
        aria-label="Press inquiries"
        style={{
          padding: "60px 24px 100px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#C9A84C",
            fontWeight: 600,
            margin: "0 0 14px",
          }}
        >
          Press inquiries
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 300,
            color: "#F8F5F0",
            margin: "0 0 20px",
          }}
        >
          For interviews and commentary
        </h2>
        <p>
          <Link
            href="mailto:george@georgeyachts.com?subject=Press%20enquiry"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#C9A84C",
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "1px solid #C9A84C",
              paddingBottom: 2,
            }}
          >
            george@georgeyachts.com →
          </Link>
        </p>
      </section>

      {/* Mandatory legal disclaimer per Roberto legal directive §1 (4 May 2026).
          Exact text required — do not paraphrase. Lato Light 9px, color #9CA3AF,
          single-line, centered. Frames Forbes / MYBA / IYBA references on this
          page as nominative fair use, not endorsement. */}
      <section
        aria-label="Editorial citation disclaimer"
        style={{
          padding: "0 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Lato', 'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: 9,
            color: "#9CA3AF",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "880px",
            marginInline: "auto",
            fontStyle: "italic",
          }}
        >
          Forbes, MYBA, and IYBA references on this page are made under nominative
          fair use principles for factual identification of editorial coverage,
          contract standards, and membership status. Editorial mentions do not
          constitute endorsement.
        </p>
      </section>

      <Footer />
    </div>
  );
}
