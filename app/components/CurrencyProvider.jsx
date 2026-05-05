"use client";

// M.1 — Currency context. Reads/writes the gy_currency cookie,
// fetches FX rates from /api/fx/latest once per session, exposes
// useCurrency() for components that want to render a converted
// secondary line alongside the canonical EUR display.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { convertEurDisplay, SUPPORTED_CURRENCIES } from "@/lib/currency";

const CurrencyContext = createContext({
  currency: "EUR",
  setCurrency: () => {},
  rates: null,
  convert: () => "",
});

const COOKIE = "gy_currency";

function readCookie() {
  if (typeof document === "undefined") return "EUR";
  const m = document.cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
  const v = m?.[1];
  return SUPPORTED_CURRENCIES.includes(v) ? v : "EUR";
}

function writeCookie(value) {
  if (typeof document === "undefined") return;
  // 365-day cookie, root path, SameSite Lax
  document.cookie = `${COOKIE}=${value}; Path=/; Max-Age=${365 * 24 * 3600}; SameSite=Lax`;
}

// Best-effort default detection from Accept-Language hints.
// Server-side IP geolocation could improve this but adds a Vercel
// request hop; the cookie wins as soon as the user picks anything.
function detectDefault() {
  if (typeof navigator === "undefined") return "EUR";
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("en-us")) return "USD";
  if (lang.startsWith("en-gb")) return "GBP";
  return "EUR";
}

export default function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("EUR");
  const [rates, setRates] = useState(null);

  // Initial currency: cookie if set; else accept-language fallback
  useEffect(() => {
    const cookieVal = readCookie();
    if (cookieVal !== "EUR" || document.cookie.includes(`${COOKIE}=`)) {
      setCurrencyState(cookieVal);
    } else {
      setCurrencyState(detectDefault());
    }
  }, []);

  // Fetch rates once per mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/fx/latest", { cache: "default" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && data?.rates) setRates(data.rates);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setCurrency = (next) => {
    if (!SUPPORTED_CURRENCIES.includes(next)) return;
    setCurrencyState(next);
    writeCookie(next);
    try { window.gtag?.("event", "currency_switched", { currency: next }); } catch {}
  };

  const value = useMemo(() => {
    const rate = currency === "EUR" ? 1 : rates?.[currency];
    return {
      currency,
      setCurrency,
      rates,
      convert: (eurDisplay) => {
        if (!rate || currency === "EUR") return "";
        return convertEurDisplay(eurDisplay, rate, currency);
      },
    };
  }, [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
