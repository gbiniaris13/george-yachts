// /app/api/track/route.js
// Visitor tracking API — sends real-time Telegram alerts for site visitors
// FREE: uses Vercel geo headers + Telegram Bot API

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Country code → flag emoji
function countryFlag(code) {
  if (!code || code.length !== 2) return '\u{1F30D}'; // globe
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

// Parse device type from user agent
function getDevice(ua) {
  if (!ua) return { type: 'Unknown', icon: '\u{1F4BB}' };
  const lower = ua.toLowerCase();
  if (/iphone|ipad/.test(lower)) return { type: 'iPhone/iPad', icon: '\u{1F4F1}' };
  if (/android/.test(lower)) return { type: 'Android', icon: '\u{1F4F1}' };
  if (/macintosh|mac os/.test(lower)) return { type: 'Mac', icon: '\u{1F4BB}' };
  if (/windows/.test(lower)) return { type: 'Windows PC', icon: '\u{1F5A5}\uFE0F' };
  if (/linux/.test(lower)) return { type: 'Linux', icon: '\u{1F4BB}' };
  return { type: 'Desktop', icon: '\u{1F4BB}' };
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

// Format time on site
function formatDuration(seconds) {
  if (!seconds || seconds < 5) return 'just arrived';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    const body = await request.json();
    const { event, sessionId, page, yachtsViewed, timeOnSite, referrer, isTest, leadData } = body;

    // Get geo from Vercel headers
    const countryCode = request.headers.get('x-vercel-ip-country') || '';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const ua = request.headers.get('user-agent') || '';
    const device = getDevice(ua);
    const flag = countryFlag(countryCode);
    const country = countryName(countryCode);
    const testLabel = isTest ? '\u{1F9EA} *TEST* \u{1F9EA}\n\n' : '';

    // --- EVENT: New Visitor ---
    if (event === 'new_visit') {
      const source = referrer
        ? (referrer.includes('google') ? 'Google Search'
          : referrer.includes('instagram') ? 'Instagram'
          : referrer.includes('facebook') ? 'Facebook'
          : referrer.includes('linkedin') ? 'LinkedIn'
          : referrer.includes('tiktok') ? 'TikTok'
          : referrer.includes('youtube') ? 'YouTube'
          : new URL(referrer).hostname)
        : 'Direct';

      const msg = [
        testLabel + flag + flag + flag,
        '',
        `\u{1F464} *New Visitor on georgeyachts.com*`,
        '',
        `${flag} *Country:* ${country}${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} *Device:* ${device.type}`,
        `\u{1F517} *Source:* ${source}`,
        `\u{1F4C4} *Page:* ${page || '/'}`,
        '',
        `\u23F0 ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit' })} Athens`,
      ].join('\n');

      await sendTelegram(msg);
    }

    // --- EVENT: Hot Lead Detected ---
    if (event === 'hot_lead') {
      const yachtList = (yachtsViewed || []).map(y => `  \u2022 ${y}`).join('\n');
      const msg = [
        testLabel + `\u{1F525}\u{1F525}\u{1F525} *HOT LEAD DETECTED!* \u{1F525}\u{1F525}\u{1F525}`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} ${device.type}`,
        `\u23F1 *Time on site:* ${formatDuration(timeOnSite)}`,
        '',
        `\u{1F6A2} *Yachts viewed:*`,
        yachtList,
        '',
        `\u{26A0}\uFE0F _This visitor is very interested!_`,
        `_Popup shown to capture their details._`,
      ].join('\n');

      await sendTelegram(msg);
    }

    // --- EVENT: Lead Captured (form submitted from popup) ---
    if (event === 'lead_captured' && leadData) {
      const msg = [
        testLabel + `\u{1F389}\u{1F389}\u{1F389} *NEW LEAD CAPTURED!* \u{1F389}\u{1F389}\u{1F389}`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        '',
        `\u{1F464} *Name:* ${leadData.name || 'N/A'}`,
        `\u{1F4E7} *Email:* ${leadData.email || 'N/A'}`,
        `\u{1F4DE} *Phone:* ${leadData.phone || 'N/A'}`,
        '',
        `\u{1F6A2} *Yachts they viewed:*`,
        ...(yachtsViewed || []).map(y => `  \u2022 ${y}`),
        '',
        `\u23F1 *Time on site:* ${formatDuration(timeOnSite)}`,
        `${device.icon} ${device.type}`,
        '',
        `\u2705 _Add to CRM & follow up!_`,
      ].join('\n');

      await sendTelegram(msg);
    }

    // --- EVENT: Page View Update (aggregated) ---
    if (event === 'page_view') {
      // We don't send Telegram for every page view — too noisy
      // This is just logged for session tracking
    }

    // --- EVENT: Session Summary (when visitor leaves) ---
    if (event === 'session_end') {
      const yachtList = (yachtsViewed || []).length > 0
        ? (yachtsViewed || []).map(y => `  \u2022 ${y}`).join('\n')
        : '  (none)';

      const msg = [
        testLabel + `\u{1F44B} *Visitor Left*`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} ${device.type}`,
        `\u23F1 *Session:* ${formatDuration(timeOnSite)}`,
        `\u{1F4C4} *Pages:* ${body.pagesVisited || 1}`,
        '',
        `\u{1F6A2} *Yachts viewed:*`,
        yachtList,
      ].join('\n');

      // Only send if they spent more than 30 seconds
      if (timeOnSite > 30) {
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
