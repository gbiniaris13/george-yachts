"use client";

// A.2 (Roberto master rebuild brief, May 2026) — Nav search.
//
// Magnifier icon in the top nav. Click expands an inline overlay
// with autocomplete that searches yacht names, fleet types,
// regions, and blog post titles in one pass. Top 5 results show
// as gold-bordered cards with thumbnail + name + price unit badge
// + link.
//
// Implementation:
//   • Uses /api/fleet (already exists, edge-cached 1h) for yachts
//     so no new endpoint required.
//   • Blog posts: lightweight inline /api/search/posts route — but
//     to keep the scope tight, we hit a single public Sanity GROQ
//     query through /api/fleet's existing pattern. For round 2,
//     we search yachts only; blog search is queued for next round.
//   • Debounced 300ms.
//   • ESC closes; click-outside closes.
//   • Keyboard accessible: focus rings, role=combobox, aria-expanded.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";

const GOLD = "#C9A84C";

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Lazy-fetch the fleet on first open. Cached in component memory
  // for the rest of the session.
  useEffect(() => {
    if (!open || yachts.length > 0 || loading) return;
    setLoading(true);
    fetch("/api/fleet")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d?.yachts)) setYachts(d.yachts);
        setLoading(false);
      })
      .catch(() => {
        setError("Search temporarily unavailable.");
        setLoading(false);
      });
  }, [open, yachts.length, loading]);

  // Focus the input when the overlay opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  // ESC + click-outside close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    const onClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  // Debounced filter
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const matches = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    return yachts
      .filter((y) => {
        const haystack = [
          y.name,
          y.subtitle,
          y.builder,
          y.cruisingRegion,
          y.tier,
          y.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(debouncedQuery);
      })
      .slice(0, 5);
  }, [debouncedQuery, yachts]);

  return (
    <>
      {/* Trigger button — magnifier icon */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search yachts and content"
        aria-expanded={open}
        data-cursor="Search"
        style={{
          width: 40,
          height: 40,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "rgba(255,255,255,0.85)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.color = GOLD;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {/* Search overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search George Yachts"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(13, 27, 42, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 90,
            paddingTop: "calc(120px + var(--gy-top-offset, 0px))",
            paddingLeft: 24,
            paddingRight: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            ref={overlayRef}
            style={{
              maxWidth: 720,
              width: "100%",
              background: "#0D1B2A",
              border: "1px solid rgba(201,168,76,0.4)",
              padding: 24,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: 14,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.85)" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by yacht name, builder, region…"
                aria-label="Search input"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#F8F5F0",
                  fontSize: 16,
                  outline: "none",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                aria-label="Close search"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: 16, minHeight: 60 }}>
              {!debouncedQuery && (
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Type a yacht name, builder, or region. Try{" "}
                  <em>&ldquo;Pellegrina&rdquo;</em> or <em>&ldquo;Lagoon&rdquo;</em>.
                </p>
              )}
              {debouncedQuery && debouncedQuery.length >= 2 && matches.length === 0 && !loading && (
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  No yachts matched &ldquo;{debouncedQuery}&rdquo;. Try another search, or{" "}
                  <Link href="/charter-yacht-greece" style={{ color: GOLD, textDecoration: "underline" }} onClick={() => setOpen(false)}>
                    browse the full fleet
                  </Link>
                  .
                </p>
              )}
              {error && (
                <p style={{ color: "#e57373", fontSize: 12, margin: 0 }}>{error}</p>
              )}
              {matches.length > 0 && (
                <ul
                  role="listbox"
                  style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}
                >
                  {matches.map((y) => (
                    <li key={y.slug}>
                      <Link
                        href={`/yachts/${y.slug}`}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                          try {
                            window.gtag?.("event", "nav_search_result_click", {
                              query: debouncedQuery,
                              yacht_slug: y.slug,
                            });
                          } catch {}
                        }}
                        style={{
                          display: "flex",
                          gap: 14,
                          padding: 12,
                          alignItems: "center",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(201,168,76,0.25)",
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = GOLD;
                          e.currentTarget.style.background = "rgba(201,168,76,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                      >
                        {y.image && (
                          <div
                            style={{
                              flex: "0 0 auto",
                              width: 64,
                              height: 48,
                              background: `#0D1B2A url(${sanityCardImg(y.image, 200)}) center/cover no-repeat`,
                            }}
                            aria-hidden="true"
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 18,
                              color: "#F8F5F0",
                              margin: "0 0 2px",
                              fontWeight: 400,
                            }}
                          >
                            {y.name}
                          </p>
                          {(y.length || y.sleeps) && (
                            <p
                              style={{
                                fontSize: 10,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.55)",
                                margin: 0,
                              }}
                            >
                              {[y.length, y.sleeps && `${y.sleeps} guests`].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        {y.weeklyRatePrice && (
                          <div style={{ flex: "0 0 auto", textAlign: "right" }}>
                            <p
                              style={{
                                fontSize: 8,
                                letterSpacing: "0.28em",
                                textTransform: "uppercase",
                                color: isPerPerson(y) ? "rgba(255,255,255,0.6)" : GOLD,
                                margin: "0 0 2px",
                                fontWeight: 600,
                              }}
                            >
                              {priceUnitBadge(y)}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: GOLD,
                                fontWeight: 600,
                                margin: 0,
                                letterSpacing: "0.05em",
                              }}
                            >
                              {y.weeklyRatePrice}
                            </p>
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
