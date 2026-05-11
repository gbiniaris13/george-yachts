"use client";

// Phase 7 follow-up (2026-05-11) — smart 404 suggestions.
//
// Reads the attempted URL via window.location.pathname, parses it
// for intent tokens (island, yacht-type, use-case keywords), and
// returns 6 semantically-close suggestions using the same
// seoInternalLinks engine that powers the "Continue exploring"
// widget elsewhere. Client component so SSR stays static.

import { useEffect, useState } from "react";
import Link from "next/link";
import { relatedFor } from "@/lib/seoInternalLinks";

const ISLAND_SLUGS = [
  "mykonos", "santorini", "paros", "corfu", "hydra", "milos",
  "folegandros", "lefkada", "spetses", "kefalonia", "naxos",
  "rhodes", "skiathos", "zakynthos", "ithaca", "paxos", "symi",
  "crete-chania", "sifnos", "athens", "crete", "chania",
];
const YACHT_TYPE_TOKENS = [
  "motor-yacht", "sailing-yacht", "power-catamaran", "catamaran",
  "gulet", "superyacht", "mega-yacht",
];
const USECASE_TOKENS = [
  "honeymoon", "family", "corporate", "wedding", "anniversary",
  "bachelor", "milestone", "birthday",
];

// Best-effort: turn an arbitrary 404'd path into the closest
// canonical URL we DO serve, so the relatedFor() catalog has
// something useful to score against.
function inferCanonicalFromAttempt(pathname) {
  if (!pathname || pathname === "/") return "/";
  const slug = pathname.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();

  // Detected island + yacht-type → guess combo URL
  const yachtType = YACHT_TYPE_TOKENS.find((t) => slug.includes(t));
  const island = ISLAND_SLUGS.find((i) => new RegExp(`(?:^|-)${i}(?:-|$)`).test(slug));
  const usecase = USECASE_TOKENS.find((u) => slug.includes(u));

  if (yachtType && island) return `/${yachtType}-charter-${island}`;
  if (usecase && island) return `/${usecase}-yacht-charter-${island}`;
  if (usecase && !island) return `/${usecase}-yacht-charter-greece`;
  if (yachtType && !island) return `/${yachtType}-charter-greece`;
  if (island) return `/yacht-charter-${island}`;
  // No tokens — fall through to generic Greek-charter root, which
  // makes relatedFor return the highest-traffic catalog entries.
  return "/charter-yacht-greece";
}

export default function NotFoundSuggestions() {
  const [items, setItems] = useState([]);
  const [attempted, setAttempted] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    setAttempted(path);
    const canonical = inferCanonicalFromAttempt(path);
    try {
      const related = relatedFor(canonical, { max: 6 });
      setItems(related);
      window.gtag?.("event", "404_suggested_routes", {
        attempted_path: path,
        inferred_canonical: canonical,
        suggestions_count: related.length,
      });
    } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto 48px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "#C9A84C",
          fontWeight: 600,
          margin: "0 0 14px",
          textAlign: "center",
        }}
      >
        Perhaps you were after one of these
      </p>
      <h3
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: "clamp(22px, 3vw, 30px)",
          fontWeight: 300,
          color: "#F8F5F0",
          margin: "0 0 28px",
          textAlign: "center",
          lineHeight: 1.2,
          fontStyle: "italic",
        }}
      >
        Closest routes on our chart
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {items.map((r) => (
          <Link
            key={r.urlPath}
            href={r.urlPath}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(248, 245, 240, 0.12)",
              padding: "16px 18px",
              background: "rgba(13, 27, 42, 0.55)",
              transition: "border-color 0.3s ease",
            }}
          >
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                margin: "0 0 6px",
              }}
            >
              {r.eyebrow}
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 16,
                fontWeight: 400,
                color: "#F8F5F0",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {r.title}
            </p>
          </Link>
        ))}
      </div>
      {attempted && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: "rgba(248, 245, 240, 0.4)",
            textAlign: "center",
            margin: "20px 0 0",
            fontStyle: "italic",
          }}
        >
          You tried {attempted}
        </p>
      )}
    </section>
  );
}
