// Composite device-tier scorer.
//
// Combines four orthogonal signals to classify the visitor's hardware:
//
//   • OS family       (Mac/iOS strongly correlate with UHNW)
//   • DPR             (Retina/HiDPI almost mandatory for premium devices)
//   • Hardware cores  (8+ = workstation tier, 4-7 = mid, ≤3 = budget)
//   • Screen size     (≥2880 px wide = 5K iMac/external display, etc)
//
// Returns one of: 'premium' | 'mid' | 'budget' | 'unknown'.
//
// Used by /api/track to enrich the `sessions.device_tier` column and
// boost the hot-lead score for premium hardware (UHNW signal).

export function scoreDeviceTier({ os, dpr, cores, screen_w, memory_gb }) {
  let score = 0;

  // OS — Mac/iOS = +3 (Apple ecosystem prevalence among UHNW);
  // Windows/Android = +1; Linux = +1 (developer/researcher); unknown = 0.
  const o = (os || '').toLowerCase();
  if (/mac|ios|iphone|ipad/.test(o)) score += 3;
  else if (/windows|android/.test(o)) score += 1;
  else if (/linux/.test(o)) score += 1;

  // DPR — 3+ = top-tier (iPhone Pro, M3 Pro Retina), 2+ = Retina-class,
  // 1 = legacy display.
  if (typeof dpr === 'number') {
    if (dpr >= 3) score += 3;
    else if (dpr >= 2) score += 2;
    else if (dpr >= 1.5) score += 1;
  }

  // CPU cores — 10+ = pro workstation (M-series Pro/Max), 8+ = standard
  // premium laptop, 4-7 = mid, ≤3 = budget mobile.
  if (typeof cores === 'number') {
    if (cores >= 10) score += 3;
    else if (cores >= 8) score += 2;
    else if (cores >= 4) score += 1;
  }

  // RAM (only Chromium reports this; treat null as no-info, not penalty).
  if (typeof memory_gb === 'number') {
    if (memory_gb >= 8) score += 2;
    else if (memory_gb >= 4) score += 1;
  }

  // Screen — wider than 2560 px = professional external monitor or 5K
  // iMac; common UHNW office setup.
  if (typeof screen_w === 'number') {
    if (screen_w >= 2880) score += 2;
    else if (screen_w >= 1920) score += 1;
  }

  // Bucket: 9+ = premium, 5-8 = mid, 1-4 = budget, 0 = unknown.
  if (score >= 9) return 'premium';
  if (score >= 5) return 'mid';
  if (score >= 1) return 'budget';
  return 'unknown';
}

// Map x-vercel-* + UA → readable signals. Server-only.
export function parseUserAgent(ua = '') {
  const lower = ua.toLowerCase();
  let os = 'Unknown';
  let osVersion = null;
  let browser = 'Unknown';
  let browserVersion = null;

  // OS
  if (/iphone|ipad|ipod/.test(lower)) {
    os = 'iOS';
    const m = lower.match(/os (\d+[_\.]\d+(?:[_\.]\d+)?)/);
    if (m) osVersion = m[1].replace(/_/g, '.');
  } else if (/macintosh|mac os/.test(lower)) {
    os = 'macOS';
    const m = lower.match(/mac os x (\d+[_\.]\d+(?:[_\.]\d+)?)/);
    if (m) osVersion = m[1].replace(/_/g, '.');
  } else if (/android/.test(lower)) {
    os = 'Android';
    const m = lower.match(/android (\d+(?:\.\d+)?)/);
    if (m) osVersion = m[1];
  } else if (/windows/.test(lower)) {
    os = 'Windows';
    if (/windows nt 10/.test(lower)) osVersion = '10/11';
    else if (/windows nt 6\.3/.test(lower)) osVersion = '8.1';
  } else if (/linux/.test(lower)) {
    os = 'Linux';
  } else if (/cros/.test(lower)) {
    os = 'ChromeOS';
  }

  // Browser
  if (/edg\//.test(lower)) {
    browser = 'Edge';
    const m = lower.match(/edg\/([\d.]+)/);
    if (m) browserVersion = m[1];
  } else if (/firefox\//.test(lower)) {
    browser = 'Firefox';
    const m = lower.match(/firefox\/([\d.]+)/);
    if (m) browserVersion = m[1];
  } else if (/chrome\//.test(lower) && !/edg|opr\//.test(lower)) {
    browser = 'Chrome';
    const m = lower.match(/chrome\/([\d.]+)/);
    if (m) browserVersion = m[1];
  } else if (/safari\//.test(lower) && !/chrome\//.test(lower)) {
    browser = 'Safari';
    const m = lower.match(/version\/([\d.]+)/);
    if (m) browserVersion = m[1];
  } else if (/opr\/|opera/.test(lower)) {
    browser = 'Opera';
  }

  return { os, os_version: osVersion, browser, browser_version: browserVersion };
}
