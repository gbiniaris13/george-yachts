// Cached premium-yacht slug lookup.
//
// "Premium" = weekly rate >= €100,000. UHNW signal multiplier in
// hot-lead scoring. Cached in KV for 1 hour so /api/track doesn't
// query Sanity on every page_view event.

import { sanityClient } from '@/lib/sanity';
import { kvGet, kvSet } from '@/lib/kv';

const CACHE_KEY = 'premium-yacht-slugs:v1';
const CACHE_TTL = 60 * 60; // 1 hour
const PREMIUM_THRESHOLD_EUR_PER_WEEK = 100000;

let _memo = { ts: 0, set: null };
const MEMO_TTL_MS = 60_000; // in-process memo for hot loops (1 min)

async function fetchFromSanity() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current) && weeklyRatePrice >= $threshold]{ "slug": slug.current }`,
      { threshold: PREMIUM_THRESHOLD_EUR_PER_WEEK },
    );
    return Array.isArray(rows) ? rows.map((r) => r.slug).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function getPremiumYachtSlugs() {
  // Memo first.
  const now = Date.now();
  if (_memo.set && now - _memo.ts < MEMO_TTL_MS) {
    return _memo.set;
  }

  // KV cache.
  try {
    const cached = await kvGet(CACHE_KEY);
    if (cached) {
      const arr = typeof cached === 'string' ? JSON.parse(cached) : cached;
      if (Array.isArray(arr)) {
        const setOut = new Set(arr);
        _memo = { ts: now, set: setOut };
        return setOut;
      }
    }
  } catch {
    // ignore
  }

  // Cold path: hit Sanity, persist to KV.
  const slugs = await fetchFromSanity();
  const setOut = new Set(slugs);
  try {
    await kvSet(CACHE_KEY, JSON.stringify(slugs), CACHE_TTL);
  } catch {
    // ignore
  }
  _memo = { ts: now, set: setOut };
  return setOut;
}

export async function countPremiumViews(yachtSlugs = []) {
  if (!Array.isArray(yachtSlugs) || yachtSlugs.length === 0) return 0;
  const premium = await getPremiumYachtSlugs();
  let n = 0;
  for (const s of yachtSlugs) {
    if (premium.has(s)) n += 1;
  }
  return n;
}

export { PREMIUM_THRESHOLD_EUR_PER_WEEK };
