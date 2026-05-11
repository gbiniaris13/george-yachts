// lib/seo-apis.js — Google Search Console + Bing Webmaster API clients.
//
// Phase 6 V2 (2026-05-08, Boss directive). Pulls real ranking data
// for the weekly digest cron.
//
// Auth:
//   GSC  → service-account JSON (base64-encoded in env var
//          GOOGLE_SERVICE_ACCOUNT_B64). The account email must be
//          added to the GSC property as a "Restricted" or higher
//          user. We sign a JWT with the SA private key using node
//          crypto (no googleapis dep — keeps the bundle thin).
//   Bing → API key (env var BING_API_KEY). Bing Webmaster Tools →
//          Settings → API access → Generate API key.
//
// Both clients fail gracefully: if env var is missing, return null
// and the cron formatter prints "—" for those metrics. Lets us
// ship V1 and V2 from the same code path.

import crypto from "node:crypto";

// ─────────────────────────────────────────────────────────────────
// Google Search Console
// ─────────────────────────────────────────────────────────────────

const GSC_SITE = "sc-domain:georgeyachts.com";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function loadServiceAccount() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!b64) return null;
  try {
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const sa = JSON.parse(json);
    if (!sa.client_email || !sa.private_key) return null;
    return sa;
  } catch {
    return null;
  }
}

async function getGoogleAccessToken() {
  const sa = loadServiceAccount();
  if (!sa) return null;

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: sa.client_email,
    scope: GSC_SCOPE,
    aud: sa.token_uri || "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const signInput = `${encHeader}.${encPayload}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signInput);
  signer.end();
  const signature = base64UrlEncode(signer.sign(sa.private_key));
  const assertion = `${signInput}.${signature}`;

  const res = await fetch(payload.aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

export async function fetchGscWeekly() {
  const token = await getGoogleAccessToken();
  if (!token) return null;

  // Last 7 days of data, lagged by 3 days (GSC API typically lags
  // ~2-3 days behind real-time so we get a complete window).
  const end = new Date(Date.now() - 3 * 86_400_000);
  const start = new Date(end.getTime() - 6 * 86_400_000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const body = {
    startDate: fmt(start),
    endDate: fmt(end),
    dimensions: ["query"],
    rowLimit: 5,
    aggregationType: "auto",
  };

  // Overall totals — call once with no dimensions for the headline
  // clicks/impressions, then once with `query` for top-N queries.
  const headersAuth = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const base = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;

  const [totalsRes, queriesRes, pagesRes] = await Promise.all([
    fetch(base, {
      method: "POST",
      headers: headersAuth,
      body: JSON.stringify({
        startDate: body.startDate,
        endDate: body.endDate,
        dimensions: [],
      }),
    }),
    fetch(base, {
      method: "POST",
      headers: headersAuth,
      body: JSON.stringify(body),
    }),
    fetch(base, {
      method: "POST",
      headers: headersAuth,
      body: JSON.stringify({
        ...body,
        dimensions: ["page"],
      }),
    }),
  ]);

  if (!totalsRes.ok) return null;
  const totals = await totalsRes.json();
  const queries = queriesRes.ok ? await queriesRes.json() : { rows: [] };
  const pages = pagesRes.ok ? await pagesRes.json() : { rows: [] };

  const summary = totals.rows?.[0] || {};
  return {
    clicks: Math.round(summary.clicks || 0),
    impressions: Math.round(summary.impressions || 0),
    ctr: summary.ctr || 0,
    avgPosition: summary.position || 0,
    topQueries: (queries.rows || []).slice(0, 5).map((r) => ({
      query: r.keys?.[0] || "",
      clicks: Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
      position: r.position || 0,
    })),
    topPages: (pages.rows || []).slice(0, 5).map((r) => ({
      page: (r.keys?.[0] || "").replace("https://georgeyachts.com", ""),
      clicks: Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
    })),
    window: { from: body.startDate, to: body.endDate },
  };
}

// ─────────────────────────────────────────────────────────────────
// Bing Webmaster
// ─────────────────────────────────────────────────────────────────

const BING_SITE = "https://georgeyachts.com";

export async function fetchBingWeekly() {
  const apiKey = process.env.BING_API_KEY;
  if (!apiKey) return null;

  // Bing Webmaster JSON API. Documented at
  // https://learn.microsoft.com/en-us/bingwebmaster/.
  // GetRankAndTrafficStats returns daily clicks/impressions for the
  // last 6 months — we slice the last 7 days.
  const url = `https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?siteUrl=${encodeURIComponent(BING_SITE)}&apikey=${apiKey}`;

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rows = data?.d || [];

    // Sort by date desc, take last 7 days
    const sorted = rows
      .map((r) => ({
        date: r.Date,
        clicks: r.Clicks || 0,
        impressions: r.Impressions || 0,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);

    const totals = sorted.reduce(
      (acc, r) => ({
        clicks: acc.clicks + r.clicks,
        impressions: acc.impressions + r.impressions,
      }),
      { clicks: 0, impressions: 0 },
    );

    return {
      clicks: totals.clicks,
      impressions: totals.impressions,
      days: sorted.length,
    };
  } catch {
    return null;
  }
}
