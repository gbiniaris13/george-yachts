// Browser-side signal collectors used by VisitorTracker.
//
// Every helper is null-safe (SSR-tolerant) and gracefully degrades on
// browsers that don't support a given API. The shape of the returned
// objects matches the Supabase `sessions` columns introduced in the
// 2026-05-14 visitor-intelligence migration (see
// `lib/migrations/2026-05-14-visitor-intelligence.sql`).

const ATTRIBUTION_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'li_fat_id',
  'ttclid', // TikTok
  'igshid', // Instagram share
  'twclid', // Twitter / X
];

const ATTRIBUTION_STORAGE_KEY = 'gy-attribution-v1';

// Pull attribution off the URL on first hit, persist to sessionStorage
// so later beacons in the same session still carry it (sessionStorage
// because attribution is per-session not per-visitor).
export function captureAttribution() {
  if (typeof window === 'undefined') return null;
  try {
    // Already captured this session? Reuse.
    const cached = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallthrough — re-derive
      }
    }
    const params = new URLSearchParams(window.location.search);
    const out = {};
    let any = false;
    for (const k of ATTRIBUTION_PARAM_KEYS) {
      const v = params.get(k);
      if (v) {
        out[k] = v.slice(0, 500); // cap to avoid abuse
        any = true;
      }
    }
    if (any || !cached) {
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(out));
    }
    return out;
  } catch {
    return null;
  }
}

// Pull every client-side environmental signal in one call so the
// VisitorTracker only has to ship one payload upstream.
export function collectClientSignals() {
  if (typeof window === 'undefined') return {};

  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const scr = typeof screen !== 'undefined' ? screen : {};

  // Device pixel ratio — Retina/HiDPI detection. UHNW devices are
  // almost always 2x+ (Retina Mac, iPhone, premium Android).
  const dpr =
    typeof window.devicePixelRatio === 'number'
      ? Math.round(window.devicePixelRatio * 100) / 100
      : null;

  // CPU concurrency — premium laptops report 8-16, mid-range 4-8,
  // budget Android 2-4. Composite signal for device tier.
  const cores =
    typeof nav.hardwareConcurrency === 'number'
      ? nav.hardwareConcurrency
      : null;

  // RAM hint — only Chromium exposes this. 4+ GB = premium device.
  const memoryGb =
    typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null;

  // Connection — 4g/wifi vs slow-2g signals presence in low-bandwidth
  // markets; saveData toggles when user is roaming/metered.
  let connection = null;
  let saveData = null;
  try {
    const c = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (c) {
      connection = c.effectiveType || null;
      saveData = typeof c.saveData === 'boolean' ? c.saveData : null;
    }
  } catch {
    // ignore
  }

  // Screen size + viewport — together with DPR these compose the
  // device-tier score on the server side.
  const screenW = scr.width || null;
  const screenH = scr.height || null;
  const viewportW = window.innerWidth || null;
  const viewportH = window.innerHeight || null;

  // Locale — browser's PREFERRED display language. Different from
  // the Accept-Language header which can include weighted alternates.
  const language = nav.language || null;
  const languages =
    Array.isArray(nav.languages) && nav.languages.length
      ? nav.languages.slice(0, 5)
      : language
        ? [language]
        : [];

  // Visitor's own clock timezone. Far more precise than Vercel's
  // IP-derived timezone (works through VPN, mobile carrier hopping,
  // travelling executives).
  let timezone = null;
  try {
    timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    timezone = null;
  }

  // Touch capability — disambiguates desktop-class iPad from a Mac.
  const touchPoints =
    typeof nav.maxTouchPoints === 'number' ? nav.maxTouchPoints : null;

  // Preferences — small but real signals.
  let prefersDark = null;
  let prefersReducedMotion = null;
  try {
    if (typeof window.matchMedia === 'function') {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
    }
  } catch {
    // ignore
  }

  // Full referrer URL — kept verbatim so the server can extract
  // ?article=… or #anchor without losing it. The current pipeline
  // only kept `hostname`, which lost most of the value.
  const referrer = (typeof document !== 'undefined' && document.referrer) || '';

  return {
    dpr,
    cores,
    memory_gb: memoryGb,
    connection,
    save_data: saveData,
    screen_w: screenW,
    screen_h: screenH,
    viewport_w: viewportW,
    viewport_h: viewportH,
    language,
    languages,
    timezone,
    touch_points: touchPoints,
    prefers_dark: prefersDark,
    prefers_reduced_motion: prefersReducedMotion,
    referrer_url: referrer.slice(0, 1000),
  };
}

// Compose a per-event payload. Used by VisitorTracker so every beacon
// carries the same shape; the server decides what to persist.
export function buildBeaconExtras() {
  return {
    attribution: captureAttribution() || undefined,
    client: collectClientSignals(),
  };
}
