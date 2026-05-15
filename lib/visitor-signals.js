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

  // ── Advanced fingerprint signals (added 2026-05-15) ──────────────
  // Cheap, synchronous, fail-safe. Each one fails silently to null so
  // the rest of the payload survives older browsers / privacy modes.

  // WebGL — exposes GPU vendor + renderer string. Strong proxy for
  // hardware tier ("Apple M3 Pro" + "ANGLE Metal Renderer" vs
  // "Intel HD Graphics 4000"). Also stable across sessions for the
  // same physical device → return-visitor confirmation even when
  // the user clears cookies.
  let webglVendor = null;
  let webglRenderer = null;
  let webglSig = null;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      webglVendor = dbg
        ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR);
      webglRenderer = dbg
        ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
      // Tiny stable hash of the renderer string for compact storage.
      const s = String(webglRenderer || '');
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
      }
      webglSig = (h >>> 0).toString(36);
    }
  } catch {
    // ignore
  }

  // Canvas fingerprint — render a known string with anti-aliasing,
  // emojis and curves; hash the resulting pixel data. Different OS
  // font-stacks / GPU rendering paths produce slightly different
  // outputs → stable per-device signature.
  let canvasSig = null;
  try {
    const c = document.createElement('canvas');
    c.width = 220;
    c.height = 30;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('GY · 0123 · ⚓', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('GY · 0123 · ⚓', 4, 17);
      const data = c.toDataURL();
      // Hash to a short stable signature.
      let h = 5381;
      for (let i = 0; i < data.length; i++) {
        h = ((h * 33) ^ data.charCodeAt(i)) >>> 0;
      }
      canvasSig = h.toString(36);
    }
  } catch {
    // ignore
  }

  // Plugin + MIME-type counts (still works on desktop Chrome/Firefox).
  // Headless browsers / scrapers typically have plugins=[]/mime=[],
  // while a real desktop visitor has 3–10 plugins.
  let pluginCount = null;
  let mimeCount = null;
  try {
    if (nav.plugins && typeof nav.plugins.length === 'number') {
      pluginCount = nav.plugins.length;
    }
    if (nav.mimeTypes && typeof nav.mimeTypes.length === 'number') {
      mimeCount = nav.mimeTypes.length;
    }
  } catch {
    // ignore
  }

  // PDF viewer present — distinguishes Brave / privacy-config Firefox
  // (often pdfViewerEnabled=true) from headless scrapers (false).
  let pdfViewer = null;
  try {
    if (typeof nav.pdfViewerEnabled === 'boolean') {
      pdfViewer = nav.pdfViewerEnabled;
    }
  } catch {
    // ignore
  }

  // Webdriver flag — Selenium / Puppeteer / Playwright set this true.
  // Free, zero-noise bot tell. Modern stealth scripts patch it out
  // but a surprising number still leak it.
  let webdriver = null;
  try {
    webdriver =
      typeof nav.webdriver === 'boolean' ? nav.webdriver : null;
  } catch {
    // ignore
  }

  // Color depth + pixel depth — most modern monitors report 24/30.
  // Some headless setups still report 24 but with wrong screen.width
  // ratios.
  const colorDepth =
    typeof scr.colorDepth === 'number' ? scr.colorDepth : null;

  // Timezone offset in minutes (negative for east of UTC). Combined
  // with `timezone` above it lets the server flag spoofed timezones:
  // if the IANA tz says Europe/Athens (+180) but the offset says -420,
  // the visitor is masking with a VPN that didn't sync the JS clock.
  let tzOffsetMin = null;
  try {
    tzOffsetMin = new Date().getTimezoneOffset();
  } catch {
    // ignore
  }

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
    // Advanced fingerprint
    webgl_vendor: webglVendor ? String(webglVendor).slice(0, 100) : null,
    webgl_renderer: webglRenderer ? String(webglRenderer).slice(0, 150) : null,
    webgl_sig: webglSig,
    canvas_sig: canvasSig,
    plugin_count: pluginCount,
    mime_count: mimeCount,
    pdf_viewer: pdfViewer,
    webdriver,
    color_depth: colorDepth,
    tz_offset_min: tzOffsetMin,
    // Audio signature is async — populated by VisitorTracker on session
    // start, then read from sessionStorage on every subsequent signal
    // collection so beacons stay sync.
    audio_sig: (function () {
      try {
        return sessionStorage.getItem('gy-audio-sig') || null;
      } catch {
        return null;
      }
    })(),
  };
}

// Audio fingerprint — async because OfflineAudioContext needs to
// render. We call this once per session (lazy) and cache the hash in
// sessionStorage so subsequent beacons can attach it cheaply.
// Returns null on any failure / unsupported browser.
export async function collectAudioFingerprint() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem('gy-audio-sig');
    if (cached) return cached;
  } catch {
    // ignore
  }
  try {
    const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx(1, 5000, 44100);
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 1000;
    const compressor = ctx.createDynamicsCompressor();
    // Property setters wrapped in try/catch — older browsers reject
    // setValueAtTime on some params.
    try { compressor.threshold.setValueAtTime(-50, ctx.currentTime); } catch {}
    try { compressor.knee.setValueAtTime(40, ctx.currentTime); } catch {}
    try { compressor.ratio.setValueAtTime(12, ctx.currentTime); } catch {}
    try { compressor.attack.setValueAtTime(0, ctx.currentTime); } catch {}
    try { compressor.release.setValueAtTime(0.25, ctx.currentTime); } catch {}
    osc.connect(compressor);
    compressor.connect(ctx.destination);
    osc.start(0);
    const rendered = await new Promise((resolve) => {
      const safety = setTimeout(() => resolve(null), 1500);
      ctx
        .startRendering()
        .then((buf) => {
          clearTimeout(safety);
          resolve(buf);
        })
        .catch(() => {
          clearTimeout(safety);
          resolve(null);
        });
    });
    if (!rendered) return null;
    const data = rendered.getChannelData(0);
    let sum = 0;
    for (let i = 4500; i < 5000; i++) sum += Math.abs(data[i]);
    const sig = sum.toString(16).replace('.', '').slice(0, 14);
    try {
      sessionStorage.setItem('gy-audio-sig', sig);
    } catch {
      // ignore
    }
    return sig;
  } catch {
    return null;
  }
}

// Compose a per-event payload. Used by VisitorTracker so every beacon
// carries the same shape; the server decides what to persist.
export function buildBeaconExtras() {
  return {
    attribution: captureAttribution() || undefined,
    client: collectClientSignals(),
  };
}
