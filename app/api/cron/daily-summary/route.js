// Daily Summary — runs at 22:00 Athens time via Vercel cron
// Reads today's stats from KV and sends a formatted Telegram report

import { sendTelegram, getFlag, getCountryName } from '@/lib/telegram';
import { kvGet, kvHgetall, kvDel, todayKey } from '@/lib/kv';

export const runtime = 'edge';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const date = todayKey();

    // Fetch all stats in parallel
    const [visitors, inquiries, countriesRaw, pagesRaw, sourcesRaw] = await Promise.all([
      kvGet(`stats:${date}:visitors`),
      kvGet(`stats:${date}:inquiries`),
      kvHgetall(`stats:${date}:countries`),
      kvHgetall(`stats:${date}:pages`),
      kvHgetall(`stats:${date}:sources`),
    ]);

    const totalVisitors = parseInt(visitors) || 0;
    const totalInquiries = parseInt(inquiries) || 0;

    // Parse hash results (HGETALL returns flat array: [key, value, key, value, ...])
    function parseHash(raw) {
      if (!raw || !Array.isArray(raw)) return {};
      const result = {};
      for (let i = 0; i < raw.length; i += 2) {
        result[raw[i]] = parseInt(raw[i + 1]) || 0;
      }
      return result;
    }

    const countries = parseHash(countriesRaw);
    const pages = parseHash(pagesRaw);
    const sources = parseHash(sourcesRaw);

    // Sort by count descending
    const topCountries = Object.entries(countries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const topPages = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topSources = Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Build message
    const lines = [
      `📊 *Daily Report — George Yachts*`,
      `📅 ${date}`,
      ``,
      `👥 *${totalVisitors}* visitors today`,
      `📩 *${totalInquiries}* inquiries received`,
      ``,
    ];

    if (topCountries.length > 0) {
      lines.push(`🌍 *Top Countries:*`);
      topCountries.forEach(([code, count]) => {
        lines.push(`  ${getFlag(code)} ${getCountryName(code)}: ${count}`);
      });
      lines.push(``);
    }

    if (topPages.length > 0) {
      lines.push(`📄 *Top Pages:*`);
      topPages.forEach(([page, count]) => {
        lines.push(`  \`${page}\` — ${count} views`);
      });
      lines.push(``);
    }

    if (topSources.length > 0) {
      lines.push(`🔗 *Traffic Sources:*`);
      topSources.forEach(([source, count]) => {
        lines.push(`  ${source === 'Direct' ? 'Direct / Bookmark' : source}: ${count}`);
      });
      lines.push(``);
    }

    if (totalVisitors === 0) {
      lines.push(`_No visitors recorded today. KV storage may not be connected._`);
    }

    lines.push(`— _George Yachts Analytics Bot_ 🤖`);

    await sendTelegram(lines.join('\n'));

    // Clean up stats older than 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const oldDate = weekAgo.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' });
    await Promise.allSettled([
      kvDel(`stats:${oldDate}:visitors`),
      kvDel(`stats:${oldDate}:inquiries`),
      kvDel(`stats:${oldDate}:countries`),
      kvDel(`stats:${oldDate}:pages`),
      kvDel(`stats:${oldDate}:sources`),
    ]);

    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
