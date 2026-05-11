// Cross-bot outreach dashboard — static server-rendered HTML.
//
// Shows a single pane of glass for both bots: sends today, opens,
// bounces, unsubs, cross-bot skips, and the last 50 delivery records
// colored by status. Auth is the same OUTREACH_SECRET passed as a
// query token so George can bookmark it:
//
//   https://georgeyachts.com/api/outreach/dashboard?k=<secret>
//
// No client JS. Refresh the page to refresh the data. Every box uses
// inline styles so there are no external CSS/JS fetches to pay for.

import {
  kvLrange,
  kvScard,
} from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function h(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function unauthorizedPage() {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Unauthorized</title>
<style>body{font-family:system-ui;background:#0b1020;color:#e7ecf2;
display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}</style>
</head><body><div><h1>401 — bad or missing key.</h1></div></body></html>`;
}

export async function GET(request) {
  const expected = process.env.OUTREACH_SECRET || process.env.CRON_SECRET;
  const url = new URL(request.url);
  const key = url.searchParams.get('k') || '';
  if (!expected || key !== expected) {
    return new Response(unauthorizedPage(), {
      status: 401,
      headers: { 'content-type': 'text/html' },
    });
  }

  // Pull recent activity + cardinalities in parallel so the dashboard
  // stays snappy even when KV has a few hundred thousand records.
  const [recent, opens, totalSent, unsub, bounced] = await Promise.all([
    kvLrange('outreach:deliveries', 0, 199),
    kvLrange('outreach:opens', 0, 499),
    kvScard('outreach:all-sent'),
    kvScard('outreach:unsubscribed'),
    kvScard('outreach:bounced'),
  ]);

  const records = (recent || [])
    .map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    })
    .filter(Boolean);

  // Athens midnight in UTC millis — same definition both bots use.
  const now = new Date();
  const athensYmd = now
    .toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' });
  const athensMidnightUtc =
    new Date(athensYmd + 'T00:00:00+03:00').getTime();

  const today = records.filter((r) => r.ts >= athensMidnightUtc);
  const byBot = { george: { sent: 0, skipped: 0 }, eleanna: { sent: 0, skipped: 0 }, other: { sent: 0, skipped: 0 } };
  for (const r of today) {
    const k = byBot[r.bot] ? r.bot : 'other';
    if (r.status === 'sent') byBot[k].sent += 1;
    else byBot[k].skipped += 1;
  }
  const opensToday = (opens || [])
    .map((s) => { try { return JSON.parse(s); } catch { return null; } })
    .filter(Boolean)
    .filter((o) => o.ts >= athensMidnightUtc).length;

  const box = (title, value, hint) =>
    `<div style="flex:1;min-width:160px;background:#141a2e;border:1px solid #26304f;
border-radius:10px;padding:18px 20px;">
<div style="font-size:12px;color:#6e778a;text-transform:uppercase;
letter-spacing:.08em;">${h(title)}</div>
<div style="font-size:32px;color:#d8b65d;font-weight:700;margin-top:6px;">${h(value)}</div>
${hint ? `<div style="font-size:12px;color:#8a93a8;margin-top:4px;">${h(hint)}</div>` : ''}
</div>`;

  const statusColor = {
    sent: '#6ee7a3',
    skipped_duplicate: '#f5c76e',
    skipped_unsubscribed: '#c97b7b',
    skipped_bounced: '#c97b7b',
  };

  const table = `
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:13px;">
<thead><tr style="text-align:left;color:#6e778a;">
<th style="padding:8px 10px;border-bottom:1px solid #26304f;">Time</th>
<th style="padding:8px 10px;border-bottom:1px solid #26304f;">Bot</th>
<th style="padding:8px 10px;border-bottom:1px solid #26304f;">Stage</th>
<th style="padding:8px 10px;border-bottom:1px solid #26304f;">Email</th>
<th style="padding:8px 10px;border-bottom:1px solid #26304f;">Status</th>
</tr></thead><tbody>
${records.slice(0, 50).map((r) => `
<tr>
<td style="padding:6px 10px;color:#b7c0d0;">${h(new Date(r.ts).toLocaleString('en-GB', { timeZone: 'Europe/Athens' }))}</td>
<td style="padding:6px 10px;">${h(r.bot || '')}</td>
<td style="padding:6px 10px;color:#8a93a8;">${h(r.stage || '')}</td>
<td style="padding:6px 10px;font-family:ui-monospace,Menlo,monospace;color:#d6def0;">${h(r.email || '')}</td>
<td style="padding:6px 10px;color:${statusColor[r.status] || '#b7c0d0'};">${h(r.status || '')}</td>
</tr>`).join('')}
</tbody></table>`;

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Outreach dashboard — George Yachts</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
     background:#0b1020;color:#e7ecf2;padding:32px 24px;}
h1{margin:0 0 8px;color:#d8b65d;font-size:22px;letter-spacing:.01em;}
.sub{color:#8a93a8;margin-bottom:24px;font-size:14px;}
.row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px;}
</style>
</head><body>
<h1>George Yachts \u2014 Outreach dashboard</h1>
<div class="sub">Refreshed ${h(now.toLocaleString('en-GB', { timeZone: 'Europe/Athens' }))} Athens time. Today = ${h(athensYmd)}.</div>

<div class="row">
  ${box('Sent today (total)', today.filter((r) => r.status === 'sent').length)}
  ${box('Opens today', opensToday)}
  ${box('Cross-bot skips today', today.filter((r) => r.status === 'skipped_duplicate').length)}
  ${box('Unsub/bounced skips', today.filter((r) => r.status === 'skipped_unsubscribed' || r.status === 'skipped_bounced').length)}
</div>
<div class="row">
  ${box('George sends today', byBot.george.sent, byBot.george.skipped ? byBot.george.skipped + ' skipped' : '')}
  ${box('Eleanna sends today', byBot.eleanna.sent, byBot.eleanna.skipped ? byBot.eleanna.skipped + ' skipped' : '')}
  ${box('Lifetime contacts', totalSent, 'unique addresses')}
  ${box('Unsubscribed', unsub)}
  ${box('Bounced', bounced)}
</div>

<h2 style="margin:32px 0 0;color:#b7c0d0;font-size:15px;font-weight:500;">Last 50 delivery events</h2>
${table}

</body></html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
