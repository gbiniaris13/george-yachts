// Visitor tracking — sends Telegram notification on new session visits
// Uses Vercel's free x-vercel-ip-country header for geo-detection
// Telegram Bot API is 100% free, no limits for this use case

export const runtime = 'edge';

const COUNTRY_FLAGS = {
  US: '🇺🇸', GB: '🇬🇧', GR: '🇬🇷', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸',
  CH: '🇨🇭', AT: '🇦🇹', NL: '🇳🇱', BE: '🇧🇪', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰',
  FI: '🇫🇮', PT: '🇵🇹', IE: '🇮🇪', PL: '🇵🇱', CZ: '🇨🇿', RO: '🇷🇴', HU: '🇭🇺',
  BG: '🇧🇬', HR: '🇭🇷', SK: '🇸🇰', SI: '🇸🇮', LT: '🇱🇹', LV: '🇱🇻', EE: '🇪🇪',
  CY: '🇨🇾', MT: '🇲🇹', LU: '🇱🇺', TR: '🇹🇷', RU: '🇷🇺', UA: '🇺🇦',
  AU: '🇦🇺', NZ: '🇳🇿', CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', AR: '🇦🇷',
  JP: '🇯🇵', CN: '🇨🇳', KR: '🇰🇷', IN: '🇮🇳', SG: '🇸🇬', HK: '🇭🇰',
  AE: '🇦🇪', SA: '🇸🇦', QA: '🇶🇦', KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲',
  IL: '🇮🇱', EG: '🇪🇬', ZA: '🇿🇦', NG: '🇳🇬', KE: '🇰🇪', MA: '🇲🇦',
  TH: '🇹🇭', VN: '🇻🇳', PH: '🇵🇭', MY: '🇲🇾', ID: '🇮🇩', TW: '🇹🇼',
  CO: '🇨🇴', CL: '🇨🇱', PE: '🇵🇪', MC: '🇲🇨', IS: '🇮🇸', RS: '🇷🇸',
};

const COUNTRY_NAMES = {
  US: 'United States', GB: 'United Kingdom', GR: 'Greece', DE: 'Germany',
  FR: 'France', IT: 'Italy', ES: 'Spain', CH: 'Switzerland', AT: 'Austria',
  NL: 'Netherlands', BE: 'Belgium', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
  FI: 'Finland', PT: 'Portugal', IE: 'Ireland', PL: 'Poland', CZ: 'Czech Republic',
  RO: 'Romania', HU: 'Hungary', BG: 'Bulgaria', HR: 'Croatia', TR: 'Turkey',
  RU: 'Russia', UA: 'Ukraine', AU: 'Australia', NZ: 'New Zealand', CA: 'Canada',
  MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', JP: 'Japan', CN: 'China',
  KR: 'South Korea', IN: 'India', SG: 'Singapore', HK: 'Hong Kong',
  AE: 'UAE', SA: 'Saudi Arabia', QA: 'Qatar', KW: 'Kuwait', BH: 'Bahrain',
  OM: 'Oman', IL: 'Israel', EG: 'Egypt', ZA: 'South Africa', NG: 'Nigeria',
  KE: 'Kenya', MA: 'Morocco', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines',
  MY: 'Malaysia', ID: 'Indonesia', TW: 'Taiwan', CO: 'Colombia', CL: 'Chile',
  PE: 'Peru', MC: 'Monaco', IS: 'Iceland', RS: 'Serbia',
  SK: 'Slovakia', SI: 'Slovenia', LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia',
  CY: 'Cyprus', MT: 'Malta', LU: 'Luxembourg',
};

function detectDevice(ua) {
  if (!ua) return '💻 Desktop';
  const lower = ua.toLowerCase();
  if (/iphone|android.*mobile|windows phone/i.test(lower)) return '📱 Mobile';
  if (/ipad|android(?!.*mobile)|tablet/i.test(lower)) return '📱 Tablet';
  return '💻 Desktop';
}

export async function POST(request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return new Response('OK', { status: 200 });
    }

    // Read visitor data
    const country = request.headers.get('x-vercel-ip-country') || '??';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const ua = request.headers.get('user-agent') || '';

    let body = {};
    try { body = await request.json(); } catch {}

    const page = body.page || '/';
    const referrer = body.referrer || 'Direct';
    const flag = COUNTRY_FLAGS[country] || '🌍';
    const countryName = COUNTRY_NAMES[country] || country;
    const device = detectDevice(ua);
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens' });

    // Build Telegram message
    const lines = [
      `🌐 *New Visitor on George Yachts*`,
      ``,
      `${flag} *${countryName}*${city ? ` — ${decodeURIComponent(city)}` : ''}`,
      `${device}`,
      `📄 Page: \`${page}\``,
      `🔗 Source: ${referrer === 'Direct' ? 'Direct / Bookmark' : referrer}`,
      `🕐 ${time} Athens time`,
    ];

    const text = lines.join('\n');

    // Send to Telegram (fire and don't worry if it fails)
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_notification: false,
      }),
    });

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('OK', { status: 200 });
  }
}
