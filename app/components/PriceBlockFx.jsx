"use client";

// M.1 — Tiny client child of PriceBlock that surfaces the converted
// secondary line ("≈ $61,000 – $86,000") whenever a non-EUR currency
// is active. PriceBlock itself stays a server component; this is the
// only client island it embeds.

import { useCurrency } from "./CurrencyProvider";

export default function PriceBlockFx({ eurDisplay, size = "md" }) {
  const { currency, convert } = useCurrency();
  if (!eurDisplay || currency === "EUR") return null;
  const converted = convert(eurDisplay);
  if (!converted) return null;
  const fontSizes = { sm: 11, md: 12, lg: 13 };
  return (
    <span
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: fontSizes[size] || 12,
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.04em",
      }}
      data-no-translate="true"
    >
      {converted}
    </span>
  );
}
