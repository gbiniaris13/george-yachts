// IP → company / ASN / privacy-flag enrichment.
//
// Tries IPinfo first (50k free req/mo with Lite plan), falls back to
// ipapi.co (1k free req/day, no signup) so the feature works
// out-of-the-box without any API key — and gets BETTER when George
// drops an IPINFO_TOKEN env var in.
//
// Returns null on every error path. Callers must treat null as
// "no enrichment data available" and continue normally.
//
// Cached in Vercel KV by IP for 24 hours to avoid burning quota on
// the same visitor across sessions / page-views.

import { kvGet, kvSet } from '@/lib/kv';

const CACHE_TTL_SECONDS = 24 * 60 * 60;

function isPrivateOrUnusable(ip) {
  if (!ip || ip === 'unknown') return true;
  // IPv4 RFC1918 + loopback + carrier-grade NAT.
  if (/^10\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
  if (/^127\./.test(ip)) return true;
  if (/^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(ip)) return true;
  // IPv6 loopback + link-local.
  if (ip === '::1' || /^fe80:/i.test(ip) || /^fc/i.test(ip) || /^fd/i.test(ip)) return true;
  return false;
}

async function fetchIPinfo(ip, token) {
  try {
    const url = `https://ipinfo.io/${encodeURIComponent(ip)}?token=${token}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      // Vercel edge fetch tolerates this — 4s budget.
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    // IPinfo returns: ip, city, region, country, loc, org ("AS15169 Google LLC"),
    // postal, timezone. Lite plan also returns asn / company / privacy on paid
    // tiers, but the free token still returns org which we parse for ASN+name.
    let asn = null;
    let asnName = null;
    if (j.org && typeof j.org === 'string') {
      const m = j.org.match(/^(AS\d+)\s+(.*)$/i);
      if (m) {
        asn = m[1].toUpperCase();
        asnName = m[2].trim();
      } else {
        asnName = j.org;
      }
    }
    return {
      country: j.country || null,
      region: j.region || null,
      city: j.city || null,
      postal: j.postal || null,
      timezone: j.timezone || null,
      lat_lng: j.loc || null,
      asn,
      asn_name: asnName,
      company: asnName, // free tier has no separate company; ASN org is the proxy
      company_domain: null,
      is_hosting: null,
      is_vpn: null,
      is_tor: null,
      source: 'ipinfo',
    };
  } catch {
    return null;
  }
}

async function fetchIpapi(ip) {
  try {
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'georgeyachts.com bot' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    if (j.error) return null;
    return {
      country: j.country_code || null,
      region: j.region || null,
      city: j.city || null,
      postal: j.postal || null,
      timezone: j.timezone || null,
      lat_lng: j.latitude && j.longitude ? `${j.latitude},${j.longitude}` : null,
      asn: j.asn || null,
      asn_name: j.org || null,
      company: j.org || null,
      company_domain: null,
      is_hosting: null,
      is_vpn: null,
      is_tor: null,
      source: 'ipapi',
    };
  } catch {
    return null;
  }
}

export async function enrichIP(ip) {
  if (isPrivateOrUnusable(ip)) return null;

  // Cache layer — 24h TTL. KV outages fail open (null).
  const cacheKey = `ipenrich:v1:${ip}`;
  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      try {
        return typeof cached === 'string' ? JSON.parse(cached) : cached;
      } catch {
        // fallthrough — re-fetch
      }
    }
  } catch {
    // KV down — proceed without cache.
  }

  const token = process.env.IPINFO_TOKEN;
  let result = null;
  if (token) {
    result = await fetchIPinfo(ip, token);
  }
  if (!result) {
    // Fallback to ipapi.co (no token needed, lower quota).
    result = await fetchIpapi(ip);
  }

  if (result) {
    try {
      await kvSet(cacheKey, JSON.stringify(result), CACHE_TTL_SECONDS);
    } catch {
      // ignore cache write failure
    }
  }
  return result;
}
