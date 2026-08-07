import React from "react";

/**
 * A plain, server-rendered question block for pages that had no FAQ at all.
 *
 * Deliberately not a client accordion: Google will only credit FAQPage schema
 * when the answer text is actually present and readable on the page, and an
 * engine reading the HTML should find the full answer without executing
 * anything. Native <details> gives the collapse behaviour with the text still
 * in the document.
 *
 * Renders the visible copy and the JSON-LD from the same array, so the two
 * cannot drift apart.
 */
export default function PageFaq({ faq, heading = "Questions people ask", eyebrow = "Straight answers" }) {
  if (!Array.isArray(faq) || faq.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      className="gy-faq"
      style={{
        background: "#0D1B2A",
        padding: "clamp(64px, 9vw, 120px) 24px",
        borderTop: "1px solid rgba(201,168,76,0.12)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* list-style:none alone leaves Safari's own disclosure triangle in
          place, and with no affordance at all the questions read as plain
          text nobody thinks to click. A thin gold rule that turns is enough. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .gy-faq summary::-webkit-details-marker { display: none; }
        .gy-faq summary { position: relative; padding-right: 44px; }
        .gy-faq summary::after,
        .gy-faq summary::before {
          content: ""; position: absolute; right: 6px; top: 50%;
          width: 15px; height: 1px; background: #C9A84C;
          transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .35s;
        }
        .gy-faq summary::before { transform: rotate(90deg); }
        .gy-faq details[open] summary::before { transform: rotate(0deg); opacity: 0; }
        .gy-faq summary:hover { color: #C9A84C; }
        .gy-faq summary { transition: color .3s ease; }
      `,
        }}
      />
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: "18px",
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(30px, 5vw, 46px)",
            fontWeight: 300,
            color: "#F8F5F0",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "44px",
          }}
        >
          {heading}
        </h2>

        {faq.map(({ q, a }, i) => (
          <details
            key={i}
            style={{
              borderTop: "1px solid rgba(248,245,240,0.10)",
              padding: "22px 0",
            }}
          >
            <summary
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: "16px",
                fontWeight: 500,
                color: "#F8F5F0",
                cursor: "pointer",
                listStyle: "none",
                lineHeight: 1.5,
              }}
            >
              {q}
            </summary>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: "15px",
                lineHeight: 1.9,
                color: "rgba(248,245,240,0.62)",
                marginTop: "16px",
              }}
            >
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
