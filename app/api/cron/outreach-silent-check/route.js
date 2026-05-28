// Silent-bot watchdog for the outreach pipeline.
//
// WHY: On 2026-05-03 a hardcoded emergency-pause was added to
// /api/outreach/health to silence both bots after Meta actioned the
// IG account. Only Eleanna's Apps Script honoured that pause — and
// nobody noticed she stopped sending entirely for ~25 days, until
// the boss happened to ask. The asymmetry hid the failure.
//
// HOW: Daily cron pulls outreach:deliveries (last 2000 records,
// covers ~10 days). For each tracked bot, finds the most recent
// 'sent' record. If older than SILENCE_HOURS (or absent entirely),
// emits a Telegram alert. Runs once a day so a persistently silent
// bot keeps surfacing in Telegram instead of being swallowed.
//
// Schedule: once daily at 17:00 Athens (14:00 UTC) — late enough
// that any bot that's going to send today already has, early enough
// to act on the alert before EOD.

import { NextResponse } from 'next/server';
import { kvLrange } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TRACKED_BOTS = ['george', 'eleanna'];
const SILENCE_HOURS = 24;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );
  } catch {}
}

function fmtHours(ms) {
  if (ms == null) return 'never';
  const h = Math.round(ms / (60 * 60 * 1000));
  if (h < 48) return h + 'h';
  return Math.round(h / 24) + 'd';
}

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected = process.env.CRON_SECRET;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const raw = (await kvLrange('outreach:deliveries', 0, 1999)) || [];
  const records = raw
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter(Boolean);

  const now = Date.now();
  const threshold = now - SILENCE_HOURS * 60 * 60 * 1000;

  const lastSentByBot = {};
  for (const r of records) {
    if (r.status !== 'sent') continue;
    const b = r.bot;
    if (!b) continue;
    if (!lastSentByBot[b] || r.ts > lastSentByBot[b]) {
      lastSentByBot[b] = r.ts;
    }
  }

  const silent = [];
  const healthy = [];
  for (const bot of TRACKED_BOTS) {
    const lastTs = lastSentByBot[bot];
    if (!lastTs || lastTs < threshold) {
      silent.push({
        bot,
        lastTs: lastTs || null,
        silentFor: lastTs ? now - lastTs : null,
      });
    } else {
      healthy.push({ bot, lastTs, ageHours: (now - lastTs) / 3600000 });
    }
  }

  if (silent.length > 0) {
    const lines = silent.map(
      (s) =>
        '• `' + s.bot + '` — silent for ' + fmtHours(s.silentFor)
    );
    await sendTelegram(
      '🚨 *Outreach silent-bot alert*\n\n' +
        lines.join('\n') +
        '\n\nNo `sent` events in last ' +
        SILENCE_HOURS +
        'h. Check /api/outreach/health + Apps Script triggers.'
    );
  }

  return NextResponse.json({
    silent,
    healthy,
    threshold_hours: SILENCE_HOURS,
    alerted: silent.length > 0,
  });
}
