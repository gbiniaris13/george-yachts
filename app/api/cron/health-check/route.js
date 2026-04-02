// Site Down Alert — runs every 5 minutes via Vercel cron
// Pings georgeyachts.com, if down → urgent Telegram alert

import { sendTelegram } from '@/lib/telegram';

export const runtime = 'edge';

export async function GET(request) {
  // Verify cron secret (prevents unauthorized calls)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const start = Date.now();
    const res = await fetch('https://georgeyachts.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    const latency = Date.now() - start;

    if (!res.ok) {
      await sendTelegram(
        `🚨 *SITE DOWN — George Yachts*\n\n` +
        `❌ Status: ${res.status} ${res.statusText}\n` +
        `⏱ Response: ${latency}ms\n\n` +
        `_Check Vercel dashboard immediately!_`
      );
      return new Response(`DOWN: ${res.status}`, { status: 200 });
    }

    // Alert if response is very slow (> 5 seconds)
    if (latency > 5000) {
      await sendTelegram(
        `⚠️ *SLOW RESPONSE — George Yachts*\n\n` +
        `🐌 Response time: ${latency}ms\n` +
        `_Site is up but very slow._`,
        true // silent notification
      );
    }

    return new Response(`OK: ${latency}ms`, { status: 200 });
  } catch (err) {
    await sendTelegram(
      `🚨 *SITE UNREACHABLE — George Yachts*\n\n` +
      `❌ Error: ${err.message || 'Connection failed'}\n\n` +
      `_The site is completely unreachable! Check immediately!_`
    );
    return new Response('UNREACHABLE', { status: 200 });
  }
}
