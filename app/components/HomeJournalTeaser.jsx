"use client";

// Phase 27 (Forbes-launch eve, 2026-05-05) — converted to client so
// it can use the i18n t() function. SSR fallback returns the English
// strings (the t() helper returns the second arg if locale lacks the
// key), so SEO/AI crawlers still see the editorial copy.
//
// B.6 (Roberto brief, May 2026) — Homepage blog teaser.

import Link from "next/link";
import { sanityCardImg } from "@/lib/sanity-image";
import { useI18n } from "@/lib/i18n/I18nProvider";

const GOLD = "#DAA520";

export default function HomeJournalTeaser({ posts = [] }) {
  const { t } = useI18n();
  const list = Array.isArray(posts)
    ? posts.filter((p) => p && p.slug).slice(0, 3)
    : [];
  if (list.length < 1) return null;

  return (
    <section
      aria-label="Latest from The Journal"
      style={{
        background: "#000",
        padding: "80px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 9,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 12px",
            }}
          >
            {t("journal.eyebrow", "The Journal")}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            {t("journal.title", "Maritime Intelligence")}
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(14px, 1.4vw, 18px)",
              color: "rgba(255,255,255,0.7)",
              margin: 0,
            }}
          >
            {t("journal.subtitle", "Curated stories from Greek waters")}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
          }}
        >
          {list.map((p) => {
            const date = p.publishedAt
              ? new Date(p.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                data-cursor="Read"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  transition: "border-color 0.4s ease, transform 0.4s ease",
                }}
                onClick={() => {
                  try {
                    window.gtag?.("event", "homepage_blog_click", {
                      slug: p.slug,
                    });
                  } catch {}
                }}
              >
                {p.imageUrl && (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 10",
                      background: `#0a0a0a url(${sanityCardImg(p.imageUrl, 720)}) center/cover no-repeat`,
                    }}
                    aria-hidden="true"
                  />
                )}
                <div style={{ padding: "20px 22px 24px" }}>
                  {date && (
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 9,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.55)",
                        margin: "0 0 10px",
                        fontWeight: 500,
                      }}
                    >
                      {date}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 22,
                      lineHeight: 1.25,
                      color: "#fff",
                      margin: "0 0 10px",
                      fontWeight: 400,
                    }}
                  >
                    {p.title}
                  </p>
                  {p.excerpt && (
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.75)",
                        margin: "0 0 14px",
                      }}
                    >
                      {p.excerpt.length > 110 ? p.excerpt.slice(0, 107) + "…" : p.excerpt}
                    </p>
                  )}
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: GOLD,
                      fontWeight: 600,
                    }}
                  >
                    Read →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 36 }}>
          <Link
            href="/blog"
            style={{
              fontFamily: "'Montserrat', sans-serif",
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
            {t("journal.cta", "View the full Journal →")}
          </Link>
        </p>
      </div>
    </section>
  );
}
