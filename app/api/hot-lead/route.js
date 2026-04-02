// Hot Lead Alert — fires when a visitor views 3+ yacht pages in one session
// Sends urgent Telegram notification with yacht names and visitor country

export const runtime = 'edge';

import { sendTelegram, getFlag, getCountryName, detectDevice, athensTime } from '@/lib/telegram';

export async function POST(request) {
  try {
    const country = request.headers.get('x-vercel-ip-country') || '??';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const ua = request.headers.get('user-agent') || '';

    let body = {};
    try { body = await request.json(); } catch {}

    const yachts = body.yachts || [];
    const flag = getFlag(country);
    const countryName = getCountryName(country);
    const device = detectDevice(ua);
    const time = athensTime();
    const cityStr = city ? ` — ${decodeURIComponent(city)}` : '';

    // Format yacht names nicely (remove slug format)
    const yachtNames = yachts.map(s =>
      s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    ).join(', ');

    const text = [
      `🔥 *HOT LEAD — George Yachts*`,
      ``,
      `${flag} *${countryName}*${cityStr}`,
      `${device}`,
      ``,
      `👀 Viewed *${yachts.length} yachts*:`,
      `${yachtNames}`,
      ``,
      `💡 _This visitor is seriously browsing. Consider reaching out!_`,
      `🕐 ${time} Athens time`,
    ].join('\n');

    await sendTelegram(text);

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('OK', { status: 200 });
  }
}
