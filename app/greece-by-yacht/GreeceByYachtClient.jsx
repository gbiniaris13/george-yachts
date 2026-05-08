"use client";

// Phase 3 / E1 — /greece-by-yacht client renderer.
//
// Cinematic scroll experience. Each stop is a full-viewport section
// with a parallaxed yacht photo backdrop and editorial typography.
// A sticky right-edge stop indicator (1-10) tracks progress and lets
// guests jump to any stop in one click.
//
// When Boss drops drone footage at /public/videos/greece/<slug>.mp4
// the client tries the video first and falls back to the still photo
// gracefully. No stock fillers — empty visual = solid gradient.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { priceUnitBadge } from "@/lib/pricing";

// Where Boss can drop drone footage later. Naming convention matches
// the stop slug. Component falls back to the still photo if the video
// 404s or errors on load.
const VIDEO_BASE = "/videos/greece";

export default function GreeceByYachtClient({ stops, heroBackdrop }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observers = sectionsRef.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        { threshold: 0.55 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <main
      style={{
        background: "#0D1B2A",
        color: "#F8F5F0",
        position: "relative",
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 clamp(24px, 6vw, 96px) clamp(48px, 8vw, 96px)",
          overflow: "hidden",
          background: "#0D1B2A",
        }}
      >
        {/* Hero backdrop — uses an existing yacht hero image until
            Boss drops drone footage. */}
        {heroBackdrop && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
            }}
            className="gy-ken-burns"
          >
            <Image
              src={heroBackdrop}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(13, 27, 42,0.55) 0%, rgba(13, 27, 42,0.20) 30%, rgba(13, 27, 42,0.95) 100%)",
              }}
            />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200 }}>
          <p className="gy-eyebrow" style={{ marginBottom: 22 }}>
            Greece by Yacht · A broker's diary
          </p>
          <h1
            className="gy-display-xl"
            style={{
              maxWidth: "16ch",
              margin: 0,
              textShadow: "0 6px 32px rgba(13, 27, 42,0.6)",
            }}
          >
            Ten places we keep returning&nbsp;to.
          </h1>
          <p
            className="gy-lede"
            style={{
              marginTop: 32,
              maxWidth: "60ch",
              color: "rgba(248,245,240,0.78)",
            }}
          >
            Not a destination guide — a working broker's diary of the routes
            we plan over and over for our most particular guests. Read it
            slowly. Pick the week you want. Brief George with the rest.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 22, flexWrap: "wrap" }}>
            <Link href="/inquiry" className="gy-link-editorial">
              Brief George →
            </Link>
            <Link href="#stop-mykonos" className="gy-link-editorial" style={{ color: "rgba(248,245,240,0.6)" }}>
              Begin the journey ↓
            </Link>
          </div>
        </div>
      </section>

      {/* STICKY STOP INDICATOR */}
      <nav
        aria-label="Stop navigator"
        style={{
          position: "fixed",
          right: "clamp(12px, 2vw, 32px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          pointerEvents: "auto",
        }}
        className="gy-greece-nav"
      >
        {stops.map((s, i) => (
          <a
            key={s.slug}
            href={`#stop-${s.slug}`}
            title={s.name}
            aria-current={activeIdx === i ? "true" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 6px",
              textDecoration: "none",
              opacity: activeIdx === i ? 1 : 0.45,
              transition: "opacity 0.4s ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: activeIdx === i ? "#F8F5F0" : "rgba(248,245,240,0.55)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                opacity: activeIdx === i ? 1 : 0,
                transform: activeIdx === i ? "translateX(0)" : "translateX(8px)",
                transition: "all 0.4s ease",
              }}
            >
              {s.name}
            </span>
            <span
              style={{
                width: activeIdx === i ? 28 : 14,
                height: 1,
                background: activeIdx === i ? "#C9A84C" : "rgba(248,245,240,0.45)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </a>
        ))}
      </nav>

      {/* THE STOPS */}
      {stops.map((stop, i) => (
        <section
          key={stop.slug}
          id={`stop-${stop.slug}`}
          ref={(el) => (sectionsRef.current[i] = el)}
          aria-label={`Stop ${i + 1}: ${stop.name}`}
          data-gy-reveal="up"
          style={{
            position: "relative",
            minHeight: "100vh",
            padding: "clamp(80px, 10vw, 140px) clamp(24px, 6vw, 96px)",
            overflow: "hidden",
            background: "#0D1B2A",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Backdrop — try video, fall back to first yacht's hero photo */}
          <StopBackdrop stop={stop} />

          {/* Editorial content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: 56,
              width: "100%",
              maxWidth: 1280,
              marginInline: "auto",
            }}
            className="gy-stop-grid"
          >
            <div style={{ maxWidth: 720 }}>
              <p
                className="gy-eyebrow"
                style={{ margin: 0, color: "#C9A84C" }}
              >
                {stop.eyebrow}
              </p>
              <h2
                className="gy-display-lg"
                style={{
                  margin: "12px 0 0",
                  textShadow: "0 6px 28px rgba(13, 27, 42,0.55)",
                  letterSpacing: "-0.025em",
                }}
              >
                {stop.headline}
              </h2>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 1.7vw, 22px)",
                  color: "rgba(248,245,240,0.7)",
                  margin: "16px 0 32px",
                  fontWeight: 300,
                }}
              >
                {stop.sub}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {stop.whyAboard?.map((line, j) => (
                  <li
                    key={j}
                    style={{
                      position: "relative",
                      paddingLeft: 26,
                      fontFamily: "var(--gy-font-ui)",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "rgba(248,245,240,0.86)",
                      fontWeight: 300,
                      maxWidth: "62ch",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "0.7em",
                        width: 14,
                        height: 1,
                        background: "#C9A84C",
                      }}
                    />
                    {line}
                  </li>
                ))}
              </ul>

              {stop.tagline && (
                <blockquote
                  style={{
                    margin: "36px 0 0",
                    padding: "18px 0 0",
                    borderTop: "1px solid rgba(201,168,76,0.35)",
                    fontFamily: "var(--gy-font-editorial)",
                    fontStyle: "italic",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    color: "#F8F5F0",
                    fontWeight: 300,
                    maxWidth: "44ch",
                    lineHeight: 1.35,
                  }}
                >
                  &ldquo;{stop.tagline}&rdquo;
                </blockquote>
              )}
            </div>

            {/* Yachts that do this route well */}
            {stop.yachts?.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 28,
                  borderTop: "1px solid rgba(248,245,240,0.08)",
                }}
              >
                <p
                  className="gy-eyebrow-sm"
                  style={{ marginBottom: 18, color: "rgba(248,245,240,0.55)" }}
                >
                  Yachts we route through {stop.name}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 18,
                  }}
                >
                  {stop.yachts.map((y) => (
                    <Link
                      key={y._id}
                      href={`/yachts/${y.slug}`}
                      data-cursor="View"
                      className="gy-tilt-3d gy-depth-card"
                      style={{
                        position: "relative",
                        textDecoration: "none",
                        background: "rgba(13, 27, 42, 0.55)",
                        border: "1px solid rgba(248,245,240,0.08)",
                        overflow: "hidden",
                        display: "block",
                      }}
                    >
                      <div style={{ position: "relative", aspectRatio: "4/3" }}>
                        {y.imageUrl ? (
                          <Image
                            src={y.imageUrl}
                            alt={y.imageAlt || `${y.name} — luxury yacht charter Greece`}
                            fill
                            sizes="(max-width: 700px) 100vw, 280px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0D1B2A, #0D1B2A)" }} />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, transparent 50%, rgba(13, 27, 42,0.85) 100%)",
                          }}
                        />
                      </div>
                      <div style={{ padding: "16px 18px 18px" }}>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-editorial)",
                            fontSize: 22,
                            fontWeight: 400,
                            color: "#F8F5F0",
                            margin: 0,
                            lineHeight: 1.1,
                          }}
                        >
                          {y.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 10,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "rgba(248,245,240,0.55)",
                            margin: "6px 0 0",
                          }}
                        >
                          {y.length} · {y.sleeps} guests
                        </p>
                        {y.weeklyRatePrice && (
                          <p
                            style={{
                              fontFamily: "var(--gy-font-editorial)",
                              fontStyle: "italic",
                              fontSize: 14,
                              color: "#C9A84C",
                              margin: "10px 0 0",
                            }}
                          >
                            {y.weeklyRatePrice}
                            <span
                              style={{
                                marginLeft: 8,
                                fontFamily: "var(--gy-font-ui)",
                                fontSize: 8,
                                letterSpacing: "0.32em",
                                textTransform: "uppercase",
                                color: "rgba(248,245,240,0.4)",
                                fontStyle: "normal",
                              }}
                            >
                              {priceUnitBadge(y)}
                            </span>
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA AT THE END */}
      <section
        style={{
          padding: "clamp(96px, 12vw, 160px) 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(248,245,240,0.08)",
          background: "linear-gradient(180deg, #0D1B2A 0%, #0D1B2A 100%)",
        }}
      >
        <p className="gy-eyebrow" style={{ color: "#C9A84C" }}>
          Ten stops. One brief away.
        </p>
        <h2
          className="gy-display-md"
          style={{ margin: "16px auto 0", maxWidth: "20ch" }}
        >
          Pick the week you want — we'll route the rest.
        </h2>
        <p
          className="gy-lede"
          style={{
            margin: "24px auto 36px",
            maxWidth: "52ch",
            color: "rgba(248,245,240,0.7)",
          }}
        >
          Six quick questions. A real broker reply within 24 hours. No AI
          proposals — just our honest pick of three yachts we'd put on your
          shortlist for this week.
        </p>
        <Link
          href="/inquiry"
          className="gy-shimmer-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 40px",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#0D1B2A",
            textDecoration: "none",
            background: "linear-gradient(135deg, #C9A84C 0%, #C9A84C 100%)",
            border: "1px solid #C9A84C",
            boxShadow: "0 12px 32px rgba(201,168,76,0.22)",
          }}
        >
          Brief George →
        </Link>
      </section>

      {/* Page-scoped responsive grid for the editorial stop layout. */}
      <style jsx global>{`
        @media (min-width: 1100px) {
          .gy-stop-grid {
            grid-template-columns: minmax(0, 0.62fr) minmax(0, 0.38fr) !important;
            gap: clamp(48px, 6vw, 96px) !important;
          }
        }
        @media (max-width: 600px) {
          .gy-greece-nav { display: none !important; }
        }
      `}</style>
    </main>
  );
}

// Per-stop backdrop. Tries a video first (when Boss drops files at
// /public/videos/greece/<slug>.mp4) and falls back to the first yacht's
// hero image.
function StopBackdrop({ stop }) {
  const [videoOk, setVideoOk] = useState(true);
  const fallback = stop.yachts?.[0]?.imageUrl || null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {videoOk && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoOk(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.45,
          }}
        >
          <source src={`${VIDEO_BASE}/${stop.slug}.mp4`} type="video/mp4" />
        </video>
      )}
      {(!videoOk || true) && fallback && (
        <Image
          src={fallback}
          alt=""
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            opacity: videoOk ? 0 : 0.45,
            transition: "opacity 0.6s ease",
          }}
        />
      )}
      {!fallback && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0D1B2A 0%, #0D1B2A 100%)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(13, 27, 42,0.6) 0%, rgba(13, 27, 42,0.35) 35%, rgba(13, 27, 42,0.85) 100%)",
        }}
      />
    </div>
  );
}
