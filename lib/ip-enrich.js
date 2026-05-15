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

// Known datacenter / cloud / hosting ASN numbers. When IPinfo Lite +
// ipapi free both leave `is_hosting=null`, we still need a way to
// silently drop alerts coming from obvious bots running on Azure / AWS
// / GCP / etc. Maintained by hand — extend whenever a new DC ASN
// appears in the noise floor.
const DATACENTER_ASNS = new Set([
  'AS8075',   // Microsoft Corporation (Azure)
  'AS8068',   // Microsoft Corporation (Azure secondary)
  'AS8069',   // Microsoft Corporation (Azure secondary)
  'AS3598',   // Microsoft Corporation
  'AS16509',  // Amazon.com (AWS)
  'AS14618',  // Amazon.com (AWS)
  'AS39111',  // Amazon (AWS legacy)
  'AS62078',  // Amazon Data Services
  'AS15169',  // Google LLC (GCP + crawlers)
  'AS396982', // Google LLC
  'AS19527',  // Google LLC
  'AS14061',  // DigitalOcean
  'AS200130', // DigitalOcean
  'AS63949',  // Akamai/Linode
  'AS20473',  // Choopa/Vultr
  'AS24940',  // Hetzner Online
  'AS16276',  // OVH
  'AS3320',   // Deutsche Telekom hosting variant — exclude only if name matches OVH
  'AS13335',  // Cloudflare
  'AS209242', // Cloudflare crawlers
  'AS45102',  // Alibaba US
  'AS37963',  // Alibaba CN
  'AS132203', // Tencent Cloud
  'AS31898',  // Oracle Cloud
  'AS792',    // Oracle US
  'AS46606',  // Unified Layer
  'AS40021',  // Latitude.sh
  'AS20940',  // Akamai
  'AS54113',  // Fastly
  'AS19551',  // Incapsula / Imperva
  'AS395747', // QuadraNet bot infrastructure
  'AS136907', // Huawei Cloud
  'AS9009',   // M247 (commonly hosts bot scanners)
  'AS51167',  // Contabo
  'AS197540', // netcup
  'AS44477',  // STARK INDUSTRIES SOLUTIONS (known abuse net)
  'AS208046', // Internet Security Group (abuse)
  'AS210644', // AEZA INTERNATIONAL (abuse)
]);

// Regex hit-list for the ASN-name string (fallback when ASN number is
// missing — both ipapi.co and IPinfo's Lite tier strip the AS prefix
// sometimes). Patterns are anchored loosely so partial matches still
// fire (e.g. "Amazon Data Services Ireland" still trips "amazon").
const DATACENTER_NAME_PATTERNS = [
  /\bmicrosoft\s+corp/i,
  /\bazure\b/i,
  /\bamazon\b/i,
  /\baws\b/i,
  /\bgoogle\s+llc/i,
  /\bgoogle\s+cloud/i,
  /\bgcp\b/i,
  /\bdigitalocean\b/i,
  /\blinode\b/i,
  /\bakamai\b/i,
  /\bvultr\b/i,
  /\bchoopa\b/i,
  /\bhetzner\b/i,
  /\bovh\b/i,
  /\bcloudflare\b/i,
  /\balibaba\s+cloud/i,
  /\baliyun\b/i,
  /\btencent\s+cloud/i,
  /\boracle\s+cloud/i,
  /\bfastly\b/i,
  /\bcontabo\b/i,
  /\bnetcup\b/i,
  /\bhuawei\s+cloud/i,
  /\bstark\s+industries/i,
  /\bm247\b/i,
  /\bquadranet\b/i,
  /\bleaseweb\b/i,
  /\bscaleway\b/i,
  /\blatitude\.sh/i,
  /\boracle\s+corporation/i,
  /\bequinix\b/i,
  /\bdatacenter\b/i,
  /\bhosting\b/i,
  /\bcolocation\b/i,
  /\bcolo\b/i,
  /\bcloud\s+services/i,
];

function isDatacenterAsn(asn, asnName) {
  if (asn && DATACENTER_ASNS.has(asn.toUpperCase())) return true;
  if (asnName) {
    for (const re of DATACENTER_NAME_PATTERNS) {
      if (re.test(asnName)) return true;
    }
  }
  return false;
}

function decorateHostingFlag(result) {
  if (!result) return result;
  // Only OVERRIDE when upstream left it null; if IPinfo paid tier already
  // tagged is_hosting=true/false we trust that.
  if (result.is_hosting === null || result.is_hosting === undefined) {
    if (isDatacenterAsn(result.asn, result.asn_name)) {
      result.is_hosting = true;
    }
  }
  return result;
}

export async function enrichIP(ip) {
  if (isPrivateOrUnusable(ip)) return null;

  // Cache layer — 24h TTL. KV outages fail open (null).
  // 2026-05-14 — cache key bumped to v2 to invalidate pre-token
  // entries that locked-in the ipapi.co fallback.
  // 2026-05-15 — bumped to v3 to invalidate cached entries where
  // is_hosting=null but the DC-ASN decoration would now flip it true.
  const cacheKey = `ipenrich:v3:${ip}`;
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

  // Decorate hosting flag based on known DC/cloud ASNs so the bot gate
  // in /api/track works even on free-tier IP-enrich responses (which
  // always leave is_hosting=null).
  result = decorateHostingFlag(result);

  if (result) {
    try {
      await kvSet(cacheKey, JSON.stringify(result), CACHE_TTL_SECONDS);
    } catch {
      // ignore cache write failure
    }
  }
  return result;
}
