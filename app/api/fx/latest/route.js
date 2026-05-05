// M.1 (Roberto brief, May 2026) — FX rates from a free, no-key API.
//
// Source: frankfurter.app — ECB-published reference rates, free,
// no API key, no rate limits per their docs. We cache the response
// in KV for 24h so the public endpoint we expose has predictable
// latency and costs nothing to call.
//
// GET /api/fx/latest → { ok, base: "EUR", rates: { USD, GBP, ... }, fetched }

import { kvGet, kvSet } from "@/lib/kv";

export const runtime = "nodejs";
export const revalidate = 86400;

const CACHE_KEY = "fx:latest";
const CACHE_TTL = 24 * 3600;
const FALLBACK_RATES = { USD: 1.08, GBP: 0.85 }; // shipped fallback if everything fails

async function fetchFresh() {
  const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP", {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const data = await res.json();
  if (!data?.rates?.USD || !data?.rates?.GBP) throw new Error("malformed");
  return {
    base: "EUR",
    rates: data.rates,
    fetched: data.date || new Date().toISOString().slice(0, 10),
  };
}

export async function GET() {
  // Try KV cache first
  try {
    const cached = await kvGet(CACHE_KEY);
    if (cached) {
      const data = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (data?.rates?.USD) {
        return Response.json({ ok: true, ...data, source: "kv" });
      }
    }
  } catch {}

  // Fresh fetch
  try {
    const fresh = await fetchFresh();
    try {
      await kvSet(CACHE_KEY, JSON.stringify(fresh), CACHE_TTL);
    } catch {}
    return Response.json({ ok: true, ...fresh, source: "fresh" });
  } catch {}

  // Fallback if KV + frankfurter both fail
  return Response.json({
    ok: true,
    base: "EUR",
    rates: FALLBACK_RATES,
    fetched: new Date().toISOString().slice(0, 10),
    source: "fallback",
  });
}
