// /app/api/track/route.js
// Visitor tracking API — real-time Telegram alerts + CRM enrichment.
//
// 2026-05-14 visitor-intelligence rebuild. New event surface:
//   new_visit / page_view / hot_lead / lead_captured / session_end  (existing)
//   scroll_depth / cta_click / copy_event / print_event              (new)
//
// New enrichment layers (all graceful no-ops if API key missing):
//   • Vercel Edge geo: lat / lng / region / postal / timezone
//   • IP enrichment via IPinfo or ipapi.co fallback → company / ASN
//   • Email enrichment via Apollo or Hunter on lead_captured
//   • Premium-yacht weighting (rate ≥ €100k/week)
//   • Composite hot-score (lib/hot-score.js) with explanation
//   • Device tier classification (lib/device-tier.js)

import { kvGet, kvSet } from '@/lib/kv';
import { enrichIP } from '@/lib/ip-enrich';
import { enrichEmail } from '@/lib/email-enrich';
import { countPremiumViews } from '@/lib/premium-yachts';
import { computeHotScore, explainScore, isHotLead } from '@/lib/hot-score';
import { parseUserAgent, scoreDeviceTier } from '@/lib/device-tier';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Per-event dedup TTL (seconds).
const TG_DEDUP_TTL = {
  new_visit: 4 * 60 * 60,
  hot_lead: 60 * 60,
  lead_captured: 60 * 60,
  session_end: 60 * 60,
};

async function shouldFireTelegram(eventName, ip) {
  if (!ip || ip === 'unknown') return true;
  const ttl = TG_DEDUP_TTL[eventName] ?? 60 * 60;
  const key = `track:tg-dedup:${eventName}:${ip}`;
  try {
    const already = await kvGet(key);
    if (already) return false;
    await kvSet(key, '1', ttl);
    return true;
  } catch {
    return true;
  }
}

// CRM Supabase connection (write leads + sessions to GY Command)
const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

async function writeToCRM(table, data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
    return null;
  } catch { return null; }
}

// Used to flag return visitors without relying on IPs (mobile-friendly).
async function hasPriorSession(visitorId) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !visitorId) return false;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/sessions?visitor_id=eq.${encodeURIComponent(visitorId)}&select=id&limit=1`,
      {
        headers: {
          'apikey': CRM_SUPABASE_KEY,
          'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch { return false; }
}

// Read the current session row (used by page_view to merge arrays + recompute score).
async function getCRMSession(sessionId) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !sessionId) return null;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=*&limit=1`,
      {
        headers: {
          'apikey': CRM_SUPABASE_KEY,
          'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0] || null;
  } catch { return null; }
}

async function updateCRMSession(sessionId, patch) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !sessionId) return null;
  try {
    const url = `${CRM_SUPABASE_URL}/rest/v1/sessions?session_id=eq.${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    });
    return res.ok ? true : null;
  } catch { return null; }
}

async function findCRMContact(email) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !email) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&limit=1`, {
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data?.[0] || null;
    }
    return null;
  } catch { return null; }
}

async function getHotStageId() {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/pipeline_stages?name=eq.Hot&limit=1`, {
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data?.[0]?.id || null;
    }
    return null;
  } catch { return null; }
}

// Country code → flag emoji
function countryFlag(code) {
  if (!code || code.length !== 2) return '\u{1F30D}';
  const upper = code.toUpperCase();
  return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

// Country code → full name
function countryName(code) {
  const names = {
    GR: 'Greece', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
    FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands', CH: 'Switzerland',
    AT: 'Austria', BE: 'Belgium', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
    FI: 'Finland', PT: 'Portugal', IE: 'Ireland', PL: 'Poland', CZ: 'Czech Republic',
    RO: 'Romania', BG: 'Bulgaria', HR: 'Croatia', HU: 'Hungary', TR: 'Turkey',
    RU: 'Russia', CY: 'Cyprus', MT: 'Malta', LU: 'Luxembourg', AE: 'UAE',
    SA: 'Saudi Arabia', QA: 'Qatar', BH: 'Bahrain', KW: 'Kuwait', OM: 'Oman',
    IL: 'Israel', EG: 'Egypt', AU: 'Australia', NZ: 'New Zealand', CA: 'Canada',
    MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', JP: 'Japan', CN: 'China',
    KR: 'South Korea', IN: 'India', SG: 'Singapore', HK: 'Hong Kong', TH: 'Thailand',
    ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', MC: 'Monaco', ME: 'Montenegro',
    AL: 'Albania', RS: 'Serbia', BA: 'Bosnia',
  };
  return names[code?.toUpperCase()] || code || 'Unknown';
}

// Source classifier — turns a raw referrer URL into a clean channel label.
function classifySource(rawReferrer) {
  if (!rawReferrer) return 'Direct / Bookmark';
  const r = rawReferrer.toLowerCase();
  if (r.includes('google.')) return 'Google Search';
  if (r.includes('bing.')) return 'Bing';
  if (r.includes('duckduckgo.')) return 'DuckDuckGo';
  if (r.includes('chatgpt.com') || r.includes('chat.openai.com')) return 'ChatGPT';
  if (r.includes('perplexity.ai')) return 'Perplexity';
  if (r.includes('claude.ai')) return 'Claude';
  if (r.includes('gemini.google.com') || r.includes('bard.google.com')) return 'Gemini';
  if (r.includes('instagram.')) return 'Instagram';
  if (r.includes('facebook.') || r.includes('fb.me')) return 'Facebook';
  if (r.includes('linkedin.')) return 'LinkedIn';
  if (r.includes('twitter.') || r.includes('x.com')) return 'Twitter/X';
  if (r.includes('tiktok.')) return 'TikTok';
  if (r.includes('youtube.')) return 'YouTube';
  if (r.includes('reddit.')) return 'Reddit';
  if (r.includes('whatsapp.')) return 'WhatsApp';
  if (r.includes('telegram.')) return 'Telegram';
  if (r.includes('forbes.com')) return 'Forbes';
  try {
    return new URL(rawReferrer).hostname;
  } catch {
    return 'Unknown';
  }
}

// Send Telegram message
async function sendTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error('Telegram send error:', e);
  }
}

function formatDuration(seconds) {
  if (!seconds || seconds < 5) return 'just arrived';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

// ----- The high-leverage entry point -----
//
// Build the rich "new visitor" Telegram card. Pulled into its own
// helper so hot_lead and session_end can reuse the same formatter
// with extra context.
function buildVisitorCard({
  flag, country, city, region, postal, latLng,
  device, deviceTier, browser, browserVersion, os, osVersion,
  source, sourceUrl, attribution, locale,
  page, athensTime, ipEnrich, hotScore, scoreLines,
}) {
  const lines = [];
  lines.push(`${flag} ${flag} ${flag}`);
  lines.push('');
  if (hotScore !== null && hotScore !== undefined) {
    lines.push(`\u{1F525} *HOT VISITOR* — Score ${hotScore}`);
    lines.push('');
  } else {
    lines.push(`\u{1F464} *New Visitor on georgeyachts.com*`);
    lines.push('');
  }

  // Company / network line
  if (ipEnrich && (ipEnrich.company || ipEnrich.asn_name)) {
    let networkLabel = ipEnrich.company || ipEnrich.asn_name || '';
    if (ipEnrich.is_vpn) networkLabel += ' (VPN)';
    else if (ipEnrich.is_hosting) networkLabel += ' (hosting)';
    else if (ipEnrich.is_tor) networkLabel += ' (Tor)';
    lines.push(`\u{1F3E2} *Network:* ${networkLabel}${ipEnrich.asn ? ` (${ipEnrich.asn})` : ''}`);
  }

  // Geo line
  const geoBits = [country];
  if (city) geoBits.push(city);
  if (region) geoBits.push(region);
  if (postal) geoBits.push(postal);
  lines.push(`${flag} *${geoBits.join(' · ')}*${latLng ? `  (${latLng})` : ''}`);

  // Device line
  const devBits = [device.type || device];
  if (os) devBits.push(`${os}${osVersion ? ' ' + osVersion : ''}`);
  if (browser) devBits.push(`${browser}${browserVersion ? ' ' + browserVersion : ''}`);
  if (locale) devBits.push(locale);
  let deviceLine = `${device.icon || '\u{1F4BB}'} ${devBits.filter(Boolean).join(' · ')}`;
  if (deviceTier && deviceTier !== 'unknown') {
    deviceLine += `  — *${deviceTier} device*`;
  }
  lines.push(deviceLine);

  // Attribution
  lines.push('');
  lines.push(`\u{1F517} *Source:* ${source}`);
  if (sourceUrl && sourceUrl !== source) {
    lines.push(`\u{1F310} ${sourceUrl}`);
  }
  if (attribution && Object.keys(attribution).length > 0) {
    const attribBits = [];
    if (attribution.utm_source) attribBits.push(`utm_source=${attribution.utm_source}`);
    if (attribution.utm_medium) attribBits.push(`utm_medium=${attribution.utm_medium}`);
    if (attribution.utm_campaign) attribBits.push(`utm_campaign=${attribution.utm_campaign}`);
    if (attribution.utm_content) attribBits.push(`utm_content=${attribution.utm_content}`);
    if (attribution.gclid) attribBits.push(`gclid:✓`);
    if (attribution.fbclid) attribBits.push(`fbclid:✓`);
    if (attribution.msclkid) attribBits.push(`msclkid:✓`);
    if (attribution.li_fat_id) attribBits.push(`li_fat_id:✓`);
    if (attribBits.length) lines.push(`\u{1F4CA} ${attribBits.join(' · ')}`);
  }

  // Page
  lines.push('');
  lines.push(`\u{1F4C4} *Page:* ${page || '/'}`);

  // Score breakdown
  if (Array.isArray(scoreLines) && scoreLines.length > 0) {
    lines.push('');
    lines.push(`\u{1F3AF} *Score breakdown:*`);
    for (const sl of scoreLines) lines.push(`  ${sl}`);
  }

  // Time
  lines.push('');
  lines.push(`⏰ ${athensTime} Athens`);
  return lines.join('\n');
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    const body = await request.json();
    const {
      event, sessionId, visitorId, page,
      yachtsViewed, yachtSlugs, timeOnSite, activeSeconds, hiddenSeconds,
      referrer, isTest, leadData,
      attribution, client: clientSignals,
      intentFlags, tallies,
      depth, cta,
    } = body;

    // IP
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

    // Geo from Vercel Edge
    const countryCode = request.headers.get('x-vercel-ip-country') || '';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const postal = request.headers.get('x-vercel-ip-postal-code') || '';
    const lat = request.headers.get('x-vercel-ip-latitude') || '';
    const lng = request.headers.get('x-vercel-ip-longitude') || '';
    const tz = request.headers.get('x-vercel-ip-timezone') || '';
    const acceptLang = request.headers.get('accept-language') || '';
    const ua = request.headers.get('user-agent') || '';

    const uaParsed = parseUserAgent(ua);
    const device = uaParsed.os.includes('iOS') || uaParsed.os.includes('Android')
      ? { type: uaParsed.os === 'iOS' ? 'iPhone/iPad' : uaParsed.os, icon: '\u{1F4F1}' }
      : uaParsed.os === 'Windows'
        ? { type: 'Windows PC', icon: '\u{1F5A5}️' }
        : uaParsed.os === 'macOS'
          ? { type: 'Mac', icon: '\u{1F4BB}' }
          : { type: uaParsed.os || 'Desktop', icon: '\u{1F4BB}' };

    const deviceTier = scoreDeviceTier({
      os: uaParsed.os,
      dpr: clientSignals?.dpr,
      cores: clientSignals?.cores,
      screen_w: clientSignals?.screen_w,
      memory_gb: clientSignals?.memory_gb,
    });

    const flag = countryFlag(countryCode);
    const country = countryName(countryCode);
    const decodedCity = city ? decodeURIComponent(city) : '';
    const decodedRegion = region ? decodeURIComponent(region) : '';
    const decodedPostal = postal ? decodeURIComponent(postal) : '';
    const latLng = lat && lng ? `${lat},${lng}` : null;
    const testLabel = isTest ? '\u{1F9EA} *TEST* \u{1F9EA}\n\n' : '';
    const athensTime = new Date().toLocaleString('en-GB', {
      timeZone: 'Europe/Athens',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Locale derivation
    const browserLanguage = (clientSignals?.language)
      || (acceptLang.split(',')[0] || '').split(';')[0].trim()
      || null;

    // --- EVENT: New Visitor ---
    if (event === 'new_visit') {
      const source = classifySource(referrer);
      const sourceUrl = referrer || null;

      // IP enrichment (graceful — null on miss).
      const ipEnrich = await enrichIP(ip);

      // Skip Telegram entirely for known bots / hosting / Tor with NO engagement signal.
      const looksLikeBot =
        ipEnrich?.is_hosting === true ||
        ipEnrich?.is_tor === true ||
        /bot|crawler|spider|scraper|headless/i.test(ua);

      // Check if we've seen this visitor before.
      const isReturn = await hasPriorSession(visitorId);

      // Compute initial hot-score (mostly 0 — visit just started).
      const score = computeHotScore({
        uniqueYachts: 0,
        premiumYachtViews: 0,
        timeOnSiteSec: 0,
        activeSeconds: 0,
        isReturnVisitor: isReturn,
        deviceTier,
        comparePageVisited: false,
        costCalcUsed: false,
        yachtFinderUsed: false,
        pricingCalendarUsed: false,
        ctaClicks: 0,
        scrollDeep: false,
        copyEvents: 0,
        printEvents: 0,
      });

      // The base row contains every column that exists pre-migration.
      const baseRow = {
        session_id: sessionId,
        country: countryCode,
        city: decodedCity || null,
        device_type: device.type,
        referrer: source,
        pages_visited: [page || '/'],
        yachts_viewed: [],
      };
      // The extended row contains every NEW column the migration adds.
      // Supabase will silently 4xx if a column doesn't exist — we fall
      // back to baseRow on failure so the pipeline keeps working
      // pre-migration.
      const extendedRow = {
        ...baseRow,
        visitor_id: visitorId || null,
        is_return_visitor: isReturn,
        region: decodedRegion || null,
        postal: decodedPostal || null,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        timezone: tz || clientSignals?.timezone || null,
        locale: browserLanguage,
        languages: clientSignals?.languages || null,
        referrer_url: referrer || null,
        utm_source: attribution?.utm_source || null,
        utm_medium: attribution?.utm_medium || null,
        utm_campaign: attribution?.utm_campaign || null,
        utm_term: attribution?.utm_term || null,
        utm_content: attribution?.utm_content || null,
        gclid: attribution?.gclid || null,
        fbclid: attribution?.fbclid || null,
        msclkid: attribution?.msclkid || null,
        li_fat_id: attribution?.li_fat_id || null,
        ttclid: attribution?.ttclid || null,
        device_tier: deviceTier,
        dpr: clientSignals?.dpr ?? null,
        cores: clientSignals?.cores ?? null,
        memory_gb: clientSignals?.memory_gb ?? null,
        screen_w: clientSignals?.screen_w ?? null,
        screen_h: clientSignals?.screen_h ?? null,
        viewport_w: clientSignals?.viewport_w ?? null,
        viewport_h: clientSignals?.viewport_h ?? null,
        connection_type: clientSignals?.connection || null,
        save_data: clientSignals?.save_data ?? null,
        prefers_dark: clientSignals?.prefers_dark ?? null,
        prefers_reduced_motion: clientSignals?.prefers_reduced_motion ?? null,
        touch_points: clientSignals?.touch_points ?? null,
        os: uaParsed.os,
        os_version: uaParsed.os_version,
        browser: uaParsed.browser,
        browser_version: uaParsed.browser_version,
        ip_company: ipEnrich?.company || null,
        ip_company_domain: ipEnrich?.company_domain || null,
        ip_asn: ipEnrich?.asn || null,
        ip_asn_name: ipEnrich?.asn_name || null,
        ip_is_vpn: ipEnrich?.is_vpn ?? null,
        ip_is_hosting: ipEnrich?.is_hosting ?? null,
        ip_is_tor: ipEnrich?.is_tor ?? null,
        ip_enrich_source: ipEnrich?.source || null,
        hot_score: score,
        cta_clicks: 0,
        scroll_deep: false,
        copy_events: 0,
        print_events: 0,
        active_seconds: 0,
        hidden_seconds: 0,
        compare_used: false,
        cost_calc_used: false,
        yacht_finder_used: false,
        pricing_calendar_used: false,
      };

      const insertWithFallback = async () => {
        const firstTry = await writeToCRM('sessions', extendedRow);
        if (firstTry !== null) return firstTry;
        return writeToCRM('sessions', baseRow);
      };

      // Compose Telegram card. Skip alert for non-engaging bot traffic.
      if (looksLikeBot) {
        await insertWithFallback();
        return Response.json({ ok: true, suppressed: 'bot' }, { headers });
      }

      const card = testLabel + buildVisitorCard({
        flag, country, city: decodedCity, region: decodedRegion, postal: decodedPostal, latLng,
        device, deviceTier,
        browser: uaParsed.browser, browserVersion: uaParsed.browser_version,
        os: uaParsed.os, osVersion: uaParsed.os_version,
        source, sourceUrl, attribution, locale: browserLanguage,
        page,
        athensTime,
        ipEnrich,
        hotScore: null, // first event — no real score yet
        scoreLines: isReturn ? ['+2 return visitor'] : null,
      });

      const sendTg = await shouldFireTelegram('new_visit', ip);
      await Promise.allSettled([
        sendTg ? sendTelegram(card) : Promise.resolve(),
        insertWithFallback(),
      ]);
    }

    // --- EVENT: Page View Update (aggregated, no Telegram) ---
    if (event === 'page_view') {
      if (sessionId && CRM_SUPABASE_URL && CRM_SUPABASE_KEY) {
        try {
          const row = await getCRMSession(sessionId);
          const existingPages = Array.isArray(row?.pages_visited) ? row.pages_visited : [];
          const existingYachts = Array.isArray(row?.yachts_viewed) ? row.yachts_viewed : [];
          const nextPages = page && !existingPages.includes(page)
            ? [...existingPages, page]
            : existingPages;
          const incomingYachts = Array.isArray(yachtsViewed) ? yachtsViewed : [];
          const nextYachts = incomingYachts.length
            ? Array.from(new Set([...existingYachts.map(String), ...incomingYachts.map(String)]))
            : existingYachts;

          // Recompute hot-score with the latest tallies.
          const premiumViews = await countPremiumViews(Array.isArray(yachtSlugs) ? yachtSlugs : []);
          const score = computeHotScore({
            uniqueYachts: incomingYachts.length || nextYachts.length,
            premiumYachtViews: premiumViews,
            timeOnSiteSec: Math.round(timeOnSite || 0),
            activeSeconds: typeof activeSeconds === 'number' ? activeSeconds : null,
            isReturnVisitor: !!row?.is_return_visitor,
            deviceTier: row?.device_tier || deviceTier,
            comparePageVisited: !!(intentFlags?.compare || row?.compare_used),
            costCalcUsed: !!(intentFlags?.cost_calc || row?.cost_calc_used),
            yachtFinderUsed: !!(intentFlags?.yacht_finder || row?.yacht_finder_used),
            pricingCalendarUsed: !!(intentFlags?.pricing_calendar || row?.pricing_calendar_used),
            ctaClicks: tallies?.cta_clicks ?? row?.cta_clicks ?? 0,
            scrollDeep: !!(tallies?.scroll_deep || row?.scroll_deep),
            copyEvents: tallies?.copy_events ?? row?.copy_events ?? 0,
            printEvents: tallies?.print_events ?? row?.print_events ?? 0,
          });

          await updateCRMSession(sessionId, {
            time_on_site: Math.round(timeOnSite || 0),
            active_seconds: typeof activeSeconds === 'number' ? activeSeconds : undefined,
            hidden_seconds: typeof hiddenSeconds === 'number' ? hiddenSeconds : undefined,
            pages_visited: nextPages,
            yachts_viewed: nextYachts,
            premium_yacht_views: premiumViews,
            compare_used: !!(intentFlags?.compare || row?.compare_used),
            cost_calc_used: !!(intentFlags?.cost_calc || row?.cost_calc_used),
            yacht_finder_used: !!(intentFlags?.yacht_finder || row?.yacht_finder_used),
            pricing_calendar_used: !!(intentFlags?.pricing_calendar || row?.pricing_calendar_used),
            cta_clicks: tallies?.cta_clicks ?? row?.cta_clicks ?? 0,
            copy_events: tallies?.copy_events ?? row?.copy_events ?? 0,
            print_events: tallies?.print_events ?? row?.print_events ?? 0,
            scroll_deep: !!(tallies?.scroll_deep || row?.scroll_deep),
            hot_score: score,
            is_hot_lead: isHotLead(score),
          });
        } catch { /* best-effort */ }
      }
    }

    // --- EVENT: Scroll Depth Milestone ---
    if (event === 'scroll_depth' && depth) {
      // Per-page max stored as a JSONB column scroll_depths_by_page if you want
      // a heatmap later. For now we just bump scroll_deep boolean.
      if (sessionId && depth >= 90) {
        await updateCRMSession(sessionId, { scroll_deep: true });
      }
    }

    // --- EVENT: CTA Click ---
    if (event === 'cta_click' && cta && sessionId) {
      const row = await getCRMSession(sessionId);
      const current = row?.cta_clicks || 0;
      await updateCRMSession(sessionId, {
        cta_clicks: current + 1,
        last_cta: cta,
      });
    }

    // --- EVENT: Copy Event ---
    if (event === 'copy_event' && sessionId) {
      const row = await getCRMSession(sessionId);
      const current = row?.copy_events || 0;
      await updateCRMSession(sessionId, { copy_events: current + 1 });
    }

    // --- EVENT: Print Event ---
    if (event === 'print_event' && sessionId) {
      const row = await getCRMSession(sessionId);
      const current = row?.print_events || 0;
      await updateCRMSession(sessionId, { print_events: current + 1 });
    }

    // --- EVENT: Hot Lead Detected ---
    if (event === 'hot_lead') {
      const row = await getCRMSession(sessionId);
      const ipEnrich = await enrichIP(ip);
      const premiumViews = await countPremiumViews(Array.isArray(yachtSlugs) ? yachtSlugs : []);
      const scoreInputs = {
        uniqueYachts: (yachtsViewed || []).length,
        premiumYachtViews: premiumViews,
        timeOnSiteSec: Math.round(timeOnSite || 0),
        activeSeconds: typeof activeSeconds === 'number' ? activeSeconds : null,
        isReturnVisitor: !!row?.is_return_visitor,
        deviceTier: row?.device_tier || deviceTier,
        comparePageVisited: !!(intentFlags?.compare || row?.compare_used),
        costCalcUsed: !!(intentFlags?.cost_calc || row?.cost_calc_used),
        yachtFinderUsed: !!(intentFlags?.yacht_finder || row?.yacht_finder_used),
        pricingCalendarUsed: !!(intentFlags?.pricing_calendar || row?.pricing_calendar_used),
        ctaClicks: tallies?.cta_clicks ?? row?.cta_clicks ?? 0,
        scrollDeep: !!(tallies?.scroll_deep || row?.scroll_deep),
        copyEvents: tallies?.copy_events ?? row?.copy_events ?? 0,
        printEvents: tallies?.print_events ?? row?.print_events ?? 0,
      };
      const score = computeHotScore(scoreInputs);
      const scoreLines = explainScore(scoreInputs);

      const yachtList = (yachtsViewed || []).map(y => `  • ${y}`).join('\n');

      const source = classifySource(row?.referrer_url || referrer || '');
      const card = testLabel + [
        `\u{1F525}\u{1F525}\u{1F525} *HOT LEAD DETECTED!* — Score ${score}`,
        '',
        ipEnrich?.company || ipEnrich?.asn_name
          ? `\u{1F3E2} *Network:* ${ipEnrich.company || ipEnrich.asn_name}${ipEnrich.asn ? ` (${ipEnrich.asn})` : ''}`
          : null,
        `${flag} *${country}*${decodedCity ? ` (${decodedCity})` : ''}${decodedRegion ? ` · ${decodedRegion}` : ''}${latLng ? `  (${latLng})` : ''}`,
        `${device.icon} ${device.type} · ${uaParsed.browser || ''}${uaParsed.browser_version ? ' ' + uaParsed.browser_version : ''}${browserLanguage ? ' · ' + browserLanguage : ''}${(row?.device_tier || deviceTier) !== 'unknown' ? `  — *${row?.device_tier || deviceTier} device*` : ''}`,
        '',
        `\u{1F517} *Source:* ${source}`,
        `⏱ *Time on site:* ${formatDuration(timeOnSite)}${typeof activeSeconds === 'number' ? `  (active ${formatDuration(activeSeconds)})` : ''}`,
        '',
        `\u{1F6A2} *Yachts viewed (${(yachtsViewed || []).length}${premiumViews ? `, ${premiumViews} premium` : ''}):*`,
        yachtList || '  (none)',
        '',
        `\u{1F3AF} *Score breakdown:*`,
        ...scoreLines.map(l => `  ${l}`),
        '',
        `\u{26A0}️ _Popup shown to capture their details._`,
      ].filter(Boolean).join('\n');

      const hotLeadDesc = `${country}${decodedCity ? ` (${decodedCity})` : ''} — ${formatDuration(timeOnSite)} — ${(yachtsViewed || []).length} yachts (${premiumViews} premium) — score ${score}${ipEnrich?.company ? ` — ${ipEnrich.company}` : ''}`;
      const sendTg = await shouldFireTelegram('hot_lead', ip);
      await Promise.allSettled([
        sendTg ? sendTelegram(card) : Promise.resolve(),
        updateCRMSession(sessionId, {
          is_hot_lead: true,
          hot_score: score,
          time_on_site: Math.round(timeOnSite || 0),
          active_seconds: typeof activeSeconds === 'number' ? activeSeconds : undefined,
          hidden_seconds: typeof hiddenSeconds === 'number' ? hiddenSeconds : undefined,
          yachts_viewed: yachtsViewed || [],
          premium_yacht_views: premiumViews,
        }),
        writeToCRM('notifications', {
          type: 'hot_lead',
          title: `${flag} Hot lead from ${country} — score ${score}`,
          description: hotLeadDesc,
          link: '/dashboard/visitors',
        }),
      ]);
    }

    // --- EVENT: Lead Captured ---
    if (event === 'lead_captured' && leadData) {
      const enriched = await enrichEmail(leadData.email);
      const ipEnrich = await enrichIP(ip);
      const premiumViews = await countPremiumViews(Array.isArray(yachtSlugs) ? yachtSlugs : []);

      const msg = testLabel + [
        `\u{1F389}\u{1F389}\u{1F389} *NEW LEAD CAPTURED!* \u{1F389}\u{1F389}\u{1F389}`,
        '',
        `${flag} *${country}*${decodedCity ? ` (${decodedCity})` : ''}`,
        '',
        `\u{1F464} *Name:* ${leadData.name || 'N/A'}`,
        `\u{1F4E7} *Email:* ${leadData.email || 'N/A'}`,
        `\u{1F4DE} *Phone:* ${leadData.phone || 'N/A'}`,
        enriched?.company ? `\u{1F3E2} *Company:* ${enriched.company}${enriched.company_size ? ` · ${enriched.company_size}` : ''}${enriched.company_industry ? ` · ${enriched.company_industry}` : ''}` : null,
        enriched?.job_title ? `\u{1F4BC} *Title:* ${enriched.job_title}${enriched.seniority ? ` (${enriched.seniority})` : ''}` : null,
        enriched?.person_linkedin ? `\u{1F517} ${enriched.person_linkedin}` : (enriched?.company_linkedin ? `\u{1F517} ${enriched.company_linkedin}` : null),
        ipEnrich?.company && !enriched?.company ? `\u{1F310} *Network:* ${ipEnrich.company}` : null,
        '',
        `\u{1F6A2} *Yachts viewed (${(yachtsViewed || []).length}${premiumViews ? `, ${premiumViews} premium` : ''}):*`,
        ...(yachtsViewed || []).map(y => `  • ${y}`),
        '',
        `⏱ *Time on site:* ${formatDuration(timeOnSite)}`,
        `${device.icon} ${device.type}`,
        '',
        `✅ _Auto-added to CRM_`,
      ].filter(Boolean).join('\n');

      const nameParts = (leadData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const existingContact = await findCRMContact(leadData.email);
      const hotStageId = await getHotStageId();

      if (existingContact) {
        const updateUrl = `${CRM_SUPABASE_URL}/rest/v1/contacts?id=eq.${existingContact.id}`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'apikey': CRM_SUPABASE_KEY,
            'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: leadData.phone || existingContact.phone,
            yachts_viewed: yachtsViewed || [],
            time_on_site: timeOnSite || 0,
            pipeline_stage_id: hotStageId || existingContact.pipeline_stage_id,
            last_activity_at: new Date().toISOString(),
            company: enriched?.company || existingContact.company,
            company_domain: enriched?.company_domain || existingContact.company_domain,
            company_size: enriched?.company_size || existingContact.company_size,
            company_industry: enriched?.company_industry || existingContact.company_industry,
            company_linkedin: enriched?.company_linkedin || existingContact.company_linkedin,
            job_title: enriched?.job_title || existingContact.job_title,
            person_linkedin: enriched?.person_linkedin || existingContact.person_linkedin,
            seniority: enriched?.seniority || existingContact.seniority,
            enrichment_source: enriched?.source || existingContact.enrichment_source,
          }),
        }).catch(() => {});

        writeToCRM('activities', {
          contact_id: existingContact.id,
          type: 'lead_captured',
          description: `Website lead merged — viewed ${(yachtsViewed || []).join(', ')}${enriched?.company ? ` — ${enriched.company}` : ''}`,
          metadata: { yachts_viewed: yachtsViewed, time_on_site: timeOnSite, source: 'website_popup', enrichment: enriched },
        }).catch(() => {});
      } else {
        const newContact = await writeToCRM('contacts', {
          first_name: firstName,
          last_name: lastName,
          email: leadData.email || null,
          phone: leadData.phone || null,
          country: countryCode || null,
          city: decodedCity || null,
          source: 'website_lead',
          pipeline_stage_id: hotStageId,
          yachts_viewed: yachtsViewed || [],
          time_on_site: timeOnSite || 0,
          company: enriched?.company || null,
          company_domain: enriched?.company_domain || null,
          company_size: enriched?.company_size || null,
          company_industry: enriched?.company_industry || null,
          company_linkedin: enriched?.company_linkedin || null,
          job_title: enriched?.job_title || null,
          person_linkedin: enriched?.person_linkedin || null,
          seniority: enriched?.seniority || null,
          enrichment_source: enriched?.source || null,
        });

        if (newContact?.[0]?.id) {
          writeToCRM('activities', {
            contact_id: newContact[0].id,
            type: 'lead_captured',
            description: `Captured from website popup — ${country}, viewed ${(yachtsViewed || []).join(', ')}${enriched?.company ? ` — ${enriched.company}` : ''}`,
            metadata: { yachts_viewed: yachtsViewed, time_on_site: timeOnSite, device: device.type, referrer, enrichment: enriched },
          }).catch(() => {});
        }
      }

      await updateCRMSession(sessionId, {
        lead_captured: true,
        is_hot_lead: true,
        time_on_site: Math.round(timeOnSite || 0),
        yachts_viewed: yachtsViewed || [],
        premium_yacht_views: premiumViews,
      });

      await writeToCRM('notifications', {
        type: 'lead',
        title: `\u{1F389} New lead captured: ${leadData.name || leadData.email || 'Unknown'}${enriched?.company ? ` — ${enriched.company}` : ''}`,
        description: `${country}${decodedCity ? ` (${decodedCity})` : ''} — ${leadData.email ?? ''}${(yachtsViewed || []).length ? ` — viewed ${(yachtsViewed || []).join(', ')}` : ''}`,
        link: '/dashboard/contacts',
      });

      if (await shouldFireTelegram('lead_captured', ip)) {
        await sendTelegram(msg);
      }
    }

    // --- EVENT: Session End ---
    if (event === 'session_end') {
      const premiumViews = await countPremiumViews(Array.isArray(yachtSlugs) ? yachtSlugs : []);
      const row = await getCRMSession(sessionId);
      const finalScoreInputs = {
        uniqueYachts: (yachtsViewed || []).length,
        premiumYachtViews: premiumViews,
        timeOnSiteSec: Math.round(timeOnSite || 0),
        activeSeconds: typeof activeSeconds === 'number' ? activeSeconds : null,
        isReturnVisitor: !!row?.is_return_visitor,
        deviceTier: row?.device_tier || deviceTier,
        comparePageVisited: !!(intentFlags?.compare || row?.compare_used),
        costCalcUsed: !!(intentFlags?.cost_calc || row?.cost_calc_used),
        yachtFinderUsed: !!(intentFlags?.yacht_finder || row?.yacht_finder_used),
        pricingCalendarUsed: !!(intentFlags?.pricing_calendar || row?.pricing_calendar_used),
        ctaClicks: tallies?.cta_clicks ?? row?.cta_clicks ?? 0,
        scrollDeep: !!(tallies?.scroll_deep || row?.scroll_deep),
        copyEvents: tallies?.copy_events ?? row?.copy_events ?? 0,
        printEvents: tallies?.print_events ?? row?.print_events ?? 0,
      };
      const finalScore = computeHotScore(finalScoreInputs);

      const yachtList = (yachtsViewed || []).length > 0
        ? (yachtsViewed || []).map(y => `  • ${y}`).join('\n')
        : '  (none)';

      const msg = testLabel + [
        `\u{1F44B} *Visitor Left* — final score ${finalScore}`,
        '',
        `${flag} *${country}*${decodedCity ? ` (${decodedCity})` : ''}`,
        `${device.icon} ${device.type}`,
        `⏱ *Session:* ${formatDuration(timeOnSite)}${typeof activeSeconds === 'number' ? `  (active ${formatDuration(activeSeconds)})` : ''}`,
        `\u{1F4C4} *Pages:* ${body.pagesVisited || 1}`,
        '',
        `\u{1F6A2} *Yachts viewed${premiumViews ? ` (${premiumViews} premium)` : ''}:*`,
        yachtList,
      ].join('\n');

      await updateCRMSession(sessionId, {
        time_on_site: Math.round(timeOnSite || 0),
        active_seconds: typeof activeSeconds === 'number' ? activeSeconds : undefined,
        hidden_seconds: typeof hiddenSeconds === 'number' ? hiddenSeconds : undefined,
        ended_at: new Date().toISOString(),
        pages_visited: Array.isArray(body.pagesVisited) ? body.pagesVisited : undefined,
        yachts_viewed: yachtsViewed || [],
        premium_yacht_views: premiumViews,
        hot_score: finalScore,
        is_hot_lead: isHotLead(finalScore),
      });

      if (timeOnSite > 30 && (await shouldFireTelegram('session_end', ip))) {
        await sendTelegram(msg);
      }
    }

    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error('Track API error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
