// Inquiry Response Reminder — runs every 30 minutes via Vercel cron
// Checks for unanswered inquiries older than 2 hours and sends Telegram reminder

import { sendTelegram } from '@/lib/telegram';
import { kvLrange, kvLrem } from '@/lib/kv';

export const runtime = 'edge';

const TWO_HOURS = 2 * 60 * 60 * 1000;

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get all pending inquiries
    const pending = await kvLrange('inquiries:pending', 0, -1);
    if (!pending || pending.length === 0) {
      return new Response('No pending inquiries', { status: 200 });
    }

    const now = Date.now();
    const overdue = [];

    for (const raw of pending) {
      try {
        const inquiry = JSON.parse(raw);
        const age = now - inquiry.ts;

        if (age >= TWO_HOURS) {
          overdue.push({ ...inquiry, hoursAgo: Math.round(age / 3600000 * 10) / 10 });
          // Remove from pending list (already reminded)
          await kvLrem('inquiries:pending', 1, raw);
        }
      } catch {}
    }

    if (overdue.length === 0) {
      return new Response('No overdue inquiries', { status: 200 });
    }

    // Send reminder for each overdue inquiry
    for (const inq of overdue) {
      const text = [
        `⏱ *REMINDER — Unanswered Inquiry*`,
        ``,
        `👤 *${inq.name}* (${inq.email})`,
        `⛵ Interested in: ${inq.yacht_type || 'N/A'}`,
        `⏰ Submitted *${inq.hoursAgo}h ago*`,
        ``,
        `⚠️ _Please respond ASAP — response time affects conversion!_`,
      ].join('\n');

      await sendTelegram(text);
    }

    return new Response(`Reminded: ${overdue.length}`, { status: 200 });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
