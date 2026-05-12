// Visitor tracking — sends Telegram notification + stores stats for daily summary
// Uses Vercel's free x-vercel-ip-country header for geo-detection
//
// 2026-05-12 — added Telegram dedup. Before this, EVERY POST fired a
// fresh '🌐 New Visitor' alert to George's Telegram, including anonymous
// curl requests with empty body. Anyone could flood. Now the Telegram
// fires at most once per IP per 4 hours; the KV stats keep accumulating
// on every call so daily totals stay accurate.

export const runtime = 'edge';

import { sendTelegram, getFlag, getCountryName, detectDevice, athensTime } from '@/lib/telegram';
import { kvIncr, kvHincrby, kvSet, kvGet, todayKey } from '@/lib/kv';

export async function POST(request) {
  try {
    const country = request.headers.get('x-vercel-ip-country') || '??';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const ua = request.headers.get('user-agent') || '';
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';

    let body = {};
    try { body = await request.json(); } catch {}

    const page = body.page || '/';
    const referrer = body.referrer || 'Direct';
    const flag = getFlag(country);
    const countryName = getCountryName(country);
    const device = detectDevice(ua);
    const time = athensTime();
    const cityStr = city ? ` — ${decodeURIComponent(city)}` : '';
    const date = todayKey();

    // Telegram dedup: one alert per IP per 4 hours. The dedup key
    // is intentionally short so a real returning visitor on the same
    // device gets a fresh ping per session, but an attacker flooding
    // sees at most 6 alerts/day.
    const dedupKey = `visitor-ping:tg:${ip}`;
    const alreadyAlerted = await kvGet(dedupKey).catch(() => null);

    const writes = [
      kvIncr(`stats:${date}:visitors`),
      kvHincrby(`stats:${date}:countries`, country),
      kvHincrby(`stats:${date}:pages`, page),
      kvHincrby(`stats:${date}:sources`, referrer),
    ];

    if (!alreadyAlerted) {
      const text = [
        `🌐 *New Visitor on George Yachts*`,
        ``,
        `${flag} *${countryName}*${cityStr}`,
        `${device}`,
        `📄 Page: \`${page}\``,
        `🔗 Source: ${referrer === 'Direct' ? 'Direct / Bookmark' : referrer}`,
        `🕐 ${time} Athens time`,
      ].join('\n');
      writes.push(sendTelegram(text));
      writes.push(kvSet(dedupKey, '1', 4 * 60 * 60)); // 4h TTL
    }

    await Promise.allSettled(writes);

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('OK', { status: 200 });
  }
}
