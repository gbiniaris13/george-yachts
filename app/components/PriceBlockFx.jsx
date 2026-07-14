"use client";

// M.1 — Tiny client child of PriceBlock that surfaces the converted
// secondary line ("≈ $61,000 – $86,000") whenever a non-EUR currency
// is active. PriceBlock itself stays a server component; this is the
// only client island it embeds.

import { useCurrency } from "./CurrencyProvider";

export default function PriceBlockFx({ eurDisplay, size = "md" }) {
  const { currency, convert } = useCurrency();
  // 2026-07-14 (George): the site quotes EUR ONLY - the MYBA agreement is
  // signed in EUR and a $-figure sets the wrong expectation. American trust
  // comes from the U.S. company (Wyoming), not from currency conversion.
  return null;
  // eslint-disable-next-line no-unreachable
  if (!eurDisplay || currency === "EUR") return null;
  const converted = convert(eurDisplay);
  if (!converted) return null;
  const fontSizes = { sm: 11, md: 12, lg: 13 };
  return (
    <span
      style={{
        fontFamily: "var(--gy-font-ui)",
        fontSize: fontSizes[size] || 12,
        color: "rgba(248,245,240,0.6)",
        letterSpacing: "0.04em",
      }}
      data-no-translate="true"
    >
      {converted}
    </span>
  );
}
