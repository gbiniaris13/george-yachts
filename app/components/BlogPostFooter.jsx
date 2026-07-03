// F.1 + F.2 (Roberto brief, May 2026) — End-of-blog-post footer.
//
// F.1 — "Yachts to consider" block: 3 yacht cards at the close of
//      every article. Sanity field `relatedYachts` (array of yacht
//      refs, max 3) provides the curated list. When empty, an
//      auto-pick fallback isn't applied here — the front-end simply
//      hides the block. Boss decides per-article.
//
// F.2 — Author bio: George's portrait + name + role line + 2-line
//      bio + 3 CTAs (Calendly · WhatsApp · LinkedIn). Strict
//      adherence to identity rules — no years, no charters, no
//      "founder/owner".
//
// Server component — renders inline in the blog post page.

import Link from "next/link";
import Image from "next/image";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";

const GOLD = "#C9A84C";

export default function BlogPostFooter({ relatedYachts = [] }) {
  const yachts = Array.isArray(relatedYachts)
    ? relatedYachts.filter((y) => y && y.slug).slice(0, 3)
    : [];

  return (
    <>
      {yachts.length > 0 && (
        <section
          aria-label="Yachts to consider for this read"
          style={{
            background: "rgba(201,168,76,0.025)",
            borderTop: "1px solid rgba(201,168,76,0.18)",
            borderBottom: "1px solid rgba(201,168,76,0.18)",
            padding: "60px 24px",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 12px",
                textAlign: "center",
              }}
            >
              George&rsquo;s Yachts for This Read
            </p>
            <h3
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 36px",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Three yachts that fit this conversation
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {yachts.map((y) => (
                // 2026-05-07 — plain <a> + dropped inline onClick. The
                // explicit onClick AND any next/link inside this Server
                // Component renderer crashed /blog/[slug] with the
                // "Event handlers cannot be passed to Client Component
                // props" error. gtag tracking of this specific click
                // can be re-added later via a tiny Client wrapper.
                <a
                  key={y.slug}
                  href={`/yachts/${y.slug}`}
                  data-cursor="View"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    background: "rgba(248, 245, 240,0.03)",
                    border: "1px solid rgba(248, 245, 240,0.08)",
                    overflow: "hidden",
                    transition: "transform 0.4s ease, border-color 0.4s ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      background: y.image
                        ? `#0D1B2A url(${sanityCardImg(y.image, 600)}) center/cover no-repeat`
                        : "#0D1B2A",
                    }}
                    aria-hidden={!y.image}
                  />
                  <div style={{ padding: "16px 18px 20px" }}>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-editorial)",
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#F8F5F0",
                        margin: "0 0 4px",
                      }}
                    >
                      {y.name}
                    </p>
                    {(y.length || y.sleeps) && (
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: "rgba(248, 245, 240,0.65)",
                          margin: "0 0 8px",
                          textTransform: "uppercase",
                        }}
                      >
                        {[y.length, y.sleeps && `${y.sleeps} guests`]
                          .filter(Boolean)
                          .join("  ·  ")}
                      </p>
                    )}
                    {y.weeklyRatePrice && (
                      <div style={{ marginTop: 6 }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: 8,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: isPerPerson(y) ? "rgba(248, 245, 240,0.65)" : GOLD,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {priceUnitBadge(y)}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 12,
                            color: GOLD,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {y.weeklyRatePrice}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <a
                href="/charter-yacht-greece"
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: `1px solid ${GOLD}`,
                  paddingBottom: 2,
                }}
              >
                Or browse all yachts →
              </a>
            </p>
          </div>
        </section>
      )}

      {/* F.2 — Author bio (fixed copy, identity-rule compliant) */}
      <section
        aria-label="About the author"
        style={{
          background: "#0D1B2A",
          padding: "56px 24px",
          borderBottom: "1px solid rgba(248, 245, 240,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            gap: "24px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              width: 88,
              height: 88,
              borderRadius: "50%",
              overflow: "hidden",
              border: `1px solid ${GOLD}80`,
              position: "relative",
            }}
          >
            <Image
              src="/images/george.jpg"
              alt="George P. Biniaris, Managing Broker"
              fill
              sizes="88px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 22,
                color: "#F8F5F0",
                margin: "0 0 4px",
                fontWeight: 400,
              }}
            >
              Written by George P. Biniaris
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
              }}
            >
              Managing Broker · IYBA Member · Greek Waters Specialist
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 16,
                color: "rgba(248, 245, 240,0.85)",
                margin: "0 0 18px",
                lineHeight: 1.6,
              }}
            >
              George is the Managing Broker of George Yachts Brokerage House. He works
              hands-on with charter clients and central agents across Greek waters.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://calendly.com/george-georgeyachts/30min"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Book"
                style={btnGold}
              >
                Talk to George (30 min)
              </a>
              <a
                href="https://wa.me/17867988798"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="WhatsApp"
                style={btnGhost}
              >
                WhatsApp
              </a>
              <a
                href="https://www.linkedin.com/in/george-p-biniaris/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="LinkedIn"
                style={btnGhost}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const btnGold = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  fontWeight: 700,
  padding: "10px 18px",
  background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
  color: "#0D1B2A",
  border: "1px solid rgba(201,168,76,0.6)",
  textDecoration: "none",
};

const btnGhost = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  fontWeight: 600,
  padding: "10px 18px",
  background: "transparent",
  color: "rgba(248, 245, 240,0.85)",
  border: "1px solid rgba(248, 245, 240,0.25)",
  textDecoration: "none",
};
