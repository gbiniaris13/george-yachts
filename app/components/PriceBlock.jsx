// Section 0.7 (Roberto brief, May 2026) — PriceBlock component.
//
// The single source of truth for how a yacht price is rendered
// anywhere on the site. Unit badge sits ABOVE the price line, in
// gold uppercase Montserrat at 9px tracking 0.3em — small enough
// not to compete with the price, big enough that no visitor can
// claim "I didn't see it".
//
// Used in:
//   • Yacht detail hero price block
//   • Fleet card
//   • Trending Yachts carousel cards
//   • Inline yacht spotlights
//   • SignatureYacht card
//
// Server component (no hooks, no client APIs) so it works in any
// SSR context without bloating the client bundle.

import React from "react";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";
import PriceBlockFx from "./PriceBlockFx";

export default function PriceBlock({
  yacht,
  size = "md",
  showApaNote = false,
  className = "",
}) {
  if (!yacht) return null;

  const badge = priceUnitBadge(yacht);
  const price = yacht.weeklyRatePrice || "On Request";
  const showApa = showApaNote && yacht.weeklyRatePrice;

  // Three sizes — keeps callers from re-implementing typography.
  const sizes = {
    sm: { badge: "8px", price: "13px", note: "9px", gap: "6px" },
    md: { badge: "9px", price: "18px", note: "10px", gap: "8px" },
    lg: { badge: "10px", price: "26px", note: "11px", gap: "10px" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: s.gap }}>
      <span
        aria-label={`Pricing unit: ${badge}`}
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: s.badge,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#C9A84C",
          fontWeight: 600,
        }}
      >
        {badge}
      </span>
      <span
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: s.price,
          fontWeight: 400,
          color: "#F8F5F0",
          letterSpacing: "0.01em",
          lineHeight: 1.2,
        }}
      >
        {price}
      </span>
      {/* M.1 — converted secondary line, only renders client-side
          when the visitor has switched away from EUR. */}
      <PriceBlockFx eurDisplay={price} size={size} />
      {showApa && (
        <span
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: s.note,
            color: "rgba(248, 245, 240,0.65)",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
            maxWidth: "32ch",
          }}
        >
          {isPerPerson(yacht)
            ? "All-in per person · APA + VAT included"
            : "Plus VAT at the yacht's certified rate + APA 25-35%"}
        </span>
      )}
    </div>
  );
}
