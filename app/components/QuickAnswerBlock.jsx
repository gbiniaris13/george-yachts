// QuickAnswerBlock - Phase 7 Round 27 (2026-05-12).
// Technical brief Priority 2B.
//
// Conversational Q&A "answer unit" rendered at the top of content
// pages. Optimised for AI extraction (Perplexity, ChatGPT, Claude,
// Gemini) - tight, attributed quote with one specific data point.
//
// Format matches brief spec:
//   Q: [question phrased conversationally]
//   A: [40-70 word direct answer with one specific data point]
//   - George P. Biniaris, Managing Broker
//
// Schema: rendered with itemprop="description" on the answer text
// for crawler hint. The page-level FAQPage schema (added separately)
// references this Q/A as one of its mainEntity items.

import Link from "next/link";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export default function QuickAnswerBlock({ question, answer, attribution = true }) {
  if (!question || !answer) return null;
  return (
    <aside
      style={{
        background: "rgba(201, 168, 76, 0.06)",
        borderLeft: `3px solid ${GOLD}`,
        padding: "28px 32px",
        margin: "0 auto 36px",
        maxWidth: 820,
      }}
      role="note"
      aria-label="Quick answer from George Biniaris"
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 700,
          margin: "0 0 14px",
        }}
      >
        Quick answer
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: "clamp(15px, 1.8vw, 17px)",
          color: CREAM,
          fontWeight: 400,
          fontStyle: "italic",
          margin: "0 0 14px",
          lineHeight: 1.45,
          opacity: 0.85,
        }}
      >
        Q. {question}
      </p>
      <p
        itemProp="description"
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: "clamp(17px, 2.1vw, 20px)",
          color: CREAM,
          fontWeight: 300,
          margin: "0 0 16px",
          lineHeight: 1.55,
        }}
      >
        {answer}
      </p>
      {attribution && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "rgba(248, 245, 240, 0.65)",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          -{" "}
          <Link
            href="/about/george-p-biniaris"
            style={{
              color: GOLD,
              textDecoration: "none",
              borderBottom: `1px solid ${GOLD}`,
              paddingBottom: 1,
            }}
          >
            George P. Biniaris
          </Link>
          , Managing Broker
        </p>
      )}
    </aside>
  );
}

// JSON-LD helper to embed this Q&A as a single Question/Answer pair.
// Used on pages that don't have a separate FAQPage schema; for pages
// that DO have FAQPage, the QuickAnswer Q/A should be added as one
// of the mainEntity items instead of creating a duplicate.
export function QuickAnswerJsonLd({ question, answer }) {
  if (!question || !answer) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
          author: {
            "@type": "Person",
            "@id": "https://georgeyachts.com/about/george-p-biniaris#person",
            name: "George P. Biniaris",
          },
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
