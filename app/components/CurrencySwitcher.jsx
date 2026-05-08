"use client";

// M.1 — Compact € / $ / £ pill that surfaces the active currency
// and lets visitors toggle. Mounts inside the nav (NavDrawerSystem)
// or anywhere a small switcher fits.

import { useCurrency } from "./CurrencyProvider";
import { CURRENCY_SYMBOLS, SUPPORTED_CURRENCIES } from "@/lib/currency";

export default function CurrencySwitcher({ compact = true }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      role="group"
      aria-label="Display currency"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0,
        border: "1px solid rgba(201,168,76,0.4)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        padding: 2,
      }}
      data-no-translate="true"
    >
      {SUPPORTED_CURRENCIES.map((code) => {
        const active = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            aria-label={`Switch to ${code}`}
            title={code}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: compact ? 11 : 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: compact ? "4px 8px" : "6px 10px",
              minWidth: compact ? 26 : 32,
              background: active ? "rgba(201,168,76,0.85)" : "transparent",
              color: active ? "#0D1B2A" : "rgba(255,255,255,0.7)",
              border: "none",
              cursor: "pointer",
              transition: "background 0.18s ease, color 0.18s ease",
            }}
          >
            {CURRENCY_SYMBOLS[code] || code}
          </button>
        );
      })}
    </div>
  );
}
