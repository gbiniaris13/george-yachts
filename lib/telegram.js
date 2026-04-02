// Shared Telegram helper — used by visitor-ping, hot-lead, contact, crons
// Reads env vars at call time (not module load) for Edge compatibility

const COUNTRY_FLAGS = {
  US: '🇺🇸', GB: '🇬🇧', GR: '🇬🇷', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸',
  CH: '🇨🇭', AT: '🇦🇹', NL: '🇳🇱', BE: '🇧🇪', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰',
  FI: '🇫🇮', PT: '🇵🇹', IE: '🇮🇪', PL: '🇵🇱', CZ: '🇨🇿', RO: '🇷🇴', HU: '🇭🇺',
  BG: '🇧🇬', HR: '🇭🇷', TR: '🇹🇷', RU: '🇷🇺', UA: '🇺🇦',
  AU: '🇦🇺', NZ: '🇳🇿', CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', AR: '🇦🇷',
  JP: '🇯🇵', CN: '🇨🇳', KR: '🇰🇷', IN: '🇮🇳', SG: '🇸🇬', HK: '🇭🇰',
  AE: '🇦🇪', SA: '🇸🇦', QA: '🇶🇦', KW: '🇰🇼', BH: '🇧🇭', OM: '🇴🇲',
  IL: '🇮🇱', EG: '🇪🇬', ZA: '🇿🇦', MC: '🇲🇨', IS: '🇮🇸',
  TH: '🇹🇭', VN: '🇻🇳', PH: '🇵🇭', MY: '🇲🇾', ID: '🇮🇩', TW: '🇹🇼',
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
  OM: 'Oman', IL: 'Israel', EG: 'Egypt', ZA: 'South Africa', MC: 'Monaco',
  IS: 'Iceland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines',
  MY: 'Malaysia', ID: 'Indonesia', TW: 'Taiwan',
};

export function getFlag(code) {
  return COUNTRY_FLAGS[code] || '🌍';
}

export function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}

export function detectDevice(ua) {
  if (!ua) return '💻 Desktop';
  if (/iphone|android.*mobile|windows phone/i.test(ua)) return '📱 Mobile';
  if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) return '📱 Tablet';
  return '💻 Desktop';
}

export function athensTime() {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens',
  });
}

export async function sendTelegram(text, silent = false) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_notification: silent,
      }),
    });
  } catch {}
}
