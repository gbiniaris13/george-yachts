// E4 — Similar yachts rail.
// Server component. Renders below the main yacht detail content with
// up to 4 similar yachts computed by lib/yacht-similarity. Pure
// algorithmic matches — same fleet tier, same category, similar
// length/guests/price. No LLM, no API calls, no extra runtime cost.

import Link from "next/link";

export default function SimilarYachts({ items = [] }) {
  if (!items.length) return null;
  return (
    <section
      style={{
        background: "#000",
        padding: "100px 24px",
        borderTop: "1px solid rgba(218,165,32,0.1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.4em",
              color: "rgba(218,165,32,0.85)",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            You might also like
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(26px, 3vw, 38px)",
              fontWeight: 300,
              color: "#fff",
              margin: 0,
              letterSpacing: "0.01em",
            }}
          >
            Similar yachts in our fleet
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((y) => (
            <Link
              key={y._id || y.slug}
              href={`/yachts/${y.slug}`}
              style={{
                display: "block",
                textDecoration: "none",
                background: "#050505",
                border: "1px solid rgba(218,165,32,0.15)",
                overflow: "hidden",
                transition: "transform 0.5s ease, border-color 0.5s ease",
              }}
              className="similar-yacht-card"
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  background:
                    "linear-gradient(135deg, #000 0%, #0a0a0a 50%, #000 100%)",
                  overflow: "hidden",
                }}
              >
                {y.imageUrl ? (
                  <img
                    src={`${y.imageUrl}?w=640&h=480&fit=crop&auto=format&q=75`}
                    alt={y.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.6) 100%)",
                  }}
                />
              </div>
              <div style={{ padding: "18px 20px 20px" }}>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(218,165,32,0.8)",
                    fontWeight: 600,
                    margin: "0 0 6px",
                  }}
                >
                  {y.builder || "George Yachts"}
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "#fff",
                    margin: "0 0 6px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {y.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.48)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {[y.length, y.sleeps ? `${y.sleeps} guests` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {y.weeklyRatePrice ? (
                  <p
                    style={{
                      marginTop: 10,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      color: "rgba(218,165,32,0.9)",
                      fontWeight: 600,
                    }}
                  >
                    FROM {y.weeklyRatePrice} / WEEK
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .similar-yacht-card:hover {
            border-color: rgba(218,165,32,0.45) !important;
            transform: translateY(-4px);
          }
        `}</style>
      </div>
    </section>
  );
}
