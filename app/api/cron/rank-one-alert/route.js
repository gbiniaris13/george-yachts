// /api/cron/rank-one-alert — email George the moment we actually reach
// position 1 on Google for a query that matters.
//
// George asked for this on 2026-08-06, alongside the goal itself: page one,
// then position one, for weekly crewed charter. An alert is only worth having
// if it is right, so three things had to be decided before writing it.
//
// 1. BRANDED QUERIES ARE EXCLUDED. "george yachts" is already number one and
//    always will be. An alert that fires on it is an alert George learns to
//    ignore, and then it is worth nothing on the day a real query lands.
//
// 2. THREE CONSECUTIVE DAYS. Search Console position is a daily average
//    across every impression. A query with four impressions can average 1.0
//    for one day on noise alone. Requiring the same query to hold the top
//    slot three days running is what separates arrival from a flicker.
//
// 3. IT NEVER REPEATS ITSELF. Once a query has been announced it goes on a
//    won list and stays there. George should hear about a query once.
//
// Runs daily. Silent on every day nothing has been won, which will be most
// of them.

import { NextResponse } from "next/server";
import { getGscAccessToken, GSC_SITE } from "@/lib/gscAuth";
import { emailGeorge, telegramGeorgeFull } from "@/lib/notifyGeorge";

export const dynamic = "force-dynamic";

// A query counts as branded if it contains the house name in any form we
// have actually seen in Search Console. Winning our own name proves nothing.
const BRANDED = /george\s*yacht|georgeyachts|γιωργο|μπινιαρη|biniaris/i;

// Position 1.0 exactly is rare even when you own the top slot, because the
// average includes the impressions where a competitor's rich result pushed
// you a notch. 1.5 is the honest threshold for "top of the page".
const POSITION_CEILING = 1.5;

// A query needs real demand behind it before an alert is worth sending.
const MIN_IMPRESSIONS_PER_DAY = 3;

const CONSECUTIVE_DAYS = 3;

const SUPA_URL = process.env.CRM_SUPABASE_URL;
const SUPA_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

// State lives in the CRM settings table, the same key/value store the Gmail
// refresh token uses. One row, one JSON blob: the queries already announced.
const STATE_KEY = "rank_one_announced";

async function readAnnounced() {
  if (!SUPA_URL || !SUPA_KEY) return new Set();
  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/settings?key=eq.${STATE_KEY}&select=value`,
      {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return new Set();
    const rows = await res.json();
    const raw = rows?.[0]?.value;
    if (!raw) return new Set();
    return new Set(JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw)));
  } catch {
    return new Set();
  }
}

async function writeAnnounced(set) {
  if (!SUPA_URL || !SUPA_KEY) return false;
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/settings`, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: STATE_KEY, value: JSON.stringify([...set]) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const ymd = (d) => d.toISOString().slice(0, 10);

// One Search Console call per day, split by query, so we can see whether a
// win held rather than only that it happened once inside a window.
async function fetchDay(token, day) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: day,
        endDate: day,
        dimensions: ["query"],
        rowLimit: 25000,
        type: "web",
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data.rows) ? data.rows : [];
}

export async function GET(req) {
  const secret = req.headers.get("x-cron-secret");
  const isVercelCron = req.headers.get("user-agent")?.includes("vercel-cron");
  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = await getGscAccessToken();
  if (!token) {
    // Say so rather than reporting a quiet success. A silent alert that can
    // never fire is worse than no alert, because it is trusted.
    await telegramGeorgeFull(
      "⚠️ Rank-1 alert could not reach Search Console (no access token). The daily check did not run."
    );
    return NextResponse.json({ ok: false, reason: "no-gsc-token" }, { status: 200 });
  }

  // Search Console lags roughly two to three days. Start from the last day
  // that is reliably complete and walk backwards.
  const lastComplete = new Date(Date.now() - 3 * 86_400_000);
  const days = Array.from({ length: CONSECUTIVE_DAYS }, (_, i) =>
    ymd(new Date(lastComplete.getTime() - i * 86_400_000))
  );

  const perDay = [];
  for (const d of days) {
    const rows = await fetchDay(token, d);
    if (rows === null) {
      return NextResponse.json({ ok: false, reason: `gsc-failed-${d}` }, { status: 200 });
    }
    perDay.push(
      new Map(
        rows
          .filter(
            (r) =>
              r.position <= POSITION_CEILING &&
              r.impressions >= MIN_IMPRESSIONS_PER_DAY &&
              !BRANDED.test(r.keys?.[0] || "")
          )
          .map((r) => [r.keys[0], r])
      )
    );
  }

  // Held the top slot on every one of the days, not just the best one.
  const held = [...perDay[0].keys()].filter((q) =>
    perDay.every((m) => m.has(q))
  );

  const announced = await readAnnounced();
  const fresh = held.filter((q) => !announced.has(q));

  if (fresh.length === 0) {
    return NextResponse.json({
      ok: true,
      checked: days,
      holdingTopSlot: held.length,
      new: 0,
    });
  }

  const detail = fresh
    .map((q) => {
      const rows = perDay.map((m) => m.get(q));
      const impressions = rows.reduce((a, r) => a + r.impressions, 0);
      const clicks = rows.reduce((a, r) => a + r.clicks, 0);
      const best = Math.min(...rows.map((r) => r.position));
      return { q, impressions, clicks, best };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const plural = fresh.length === 1 ? "query" : "queries";
  const subject =
    fresh.length === 1
      ? `Position 1 on Google: "${detail[0].q}"`
      : `Position 1 on Google: ${fresh.length} new queries`;

  const rows = detail
    .map(
      (d) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;font-weight:600">${d.q}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right">${d.best.toFixed(1)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right">${d.impressions}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;text-align:right">${d.clicks}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;color:#0D1B2A">
      <p style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#DAA110;margin:0 0 8px">Google, position 1</p>
      <h1 style="font-size:24px;font-weight:400;margin:0 0 16px">
        ${fresh.length} new ${plural} at the top of Google
      </h1>
      <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 20px">
        Each one held position ${POSITION_CEILING} or better on
        ${days[days.length - 1]}, ${days[1]} and ${days[0]}, three days running.
        Branded searches are excluded, so none of this is our own name.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="text-align:left;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#DAA110">
            <th style="padding:8px 14px">Query</th>
            <th style="padding:8px 14px;text-align:right">Best position</th>
            <th style="padding:8px 14px;text-align:right">Impressions</th>
            <th style="padding:8px 14px;text-align:right">Clicks</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:13px;line-height:1.7;color:#666;margin:22px 0 0">
        Impressions and clicks are the three-day totals. You will not hear about
        these queries again; the alert only reports the first time each one arrives.
      </p>
    </div>`;

  await emailGeorge({ subject, html });
  await telegramGeorgeFull(
    `🥇 <b>Position 1 on Google</b>\n\n` +
      detail
        .slice(0, 8)
        .map((d) => `• <b>${d.q}</b> (${d.best.toFixed(1)}, ${d.impressions} impressions)`)
        .join("\n") +
      (detail.length > 8 ? `\n\n...and ${detail.length - 8} more, see the email.` : "")
  );

  fresh.forEach((q) => announced.add(q));
  const saved = await writeAnnounced(announced);

  return NextResponse.json({
    ok: true,
    checked: days,
    announced: fresh,
    statePersisted: saved,
  });
}
