// /api/logbook/days: the feed for "The Logbook" page in GY Command.
//
// 2026-11-06 (George): a page in the Command Center that shows how each
// day went at a glance and keeps the whole history. The Command Center
// cannot see the visits (the tracker writes them to this app's database)
// and must not count them its own way, so it asks here once a day and
// stores what it gets. One rule, one place: lib/dailyReport.js, the same
// functions that build the morning email.
//
// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD  (at most 35 days per call)
//   -> { days: [snapshot...], unique: { people, us, ai }, yachts: [[name, visits]...] }
// A day runs 24 hours from 05:00 UTC, like the email. Only finished days
// are returned. `unique` counts different people over the whole span.
//
// Auth: Bearer NEWSLETTER_PROXY_SECRET (the secret this app and the CRM
// already share) or the cron secret. Read only: nothing is written, sent
// or changed.

import { buildLogbookDays, logbookWindow, LOGBOOK_LOOKBACK_DAYS } from "@/lib/dailyReport";
import { readSessions, readRequests } from "@/lib/visitorData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 35;
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(`${v}T00:00:00Z`));

function authorized(request) {
  const header = request.headers.get("authorization") || "";
  const allowed = [process.env.NEWSLETTER_PROXY_SECRET, process.env.CRON_SECRET].filter(Boolean);
  return allowed.some((secret) => header === `Bearer ${secret}`);
}

export async function GET(request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to") || from;
  if (!isDate(from) || !isDate(to) || to < from) {
    return Response.json({ ok: false, error: "from and to must be dates (YYYY-MM-DD), to not before from" }, { status: 400 });
  }
  if ((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS >= MAX_DAYS) {
    return Response.json({ ok: false, error: `at most ${MAX_DAYS} days per call` }, { status: 400 });
  }

  try {
    const since = new Date(logbookWindow(from).startMs - LOGBOOK_LOOKBACK_DAYS * DAY_MS).toISOString();
    const until = new Date(Math.min(logbookWindow(to).endMs, Date.now())).toISOString();
    const [sessions, requests] = await Promise.all([readSessions(since, until), readRequests(since, until)]);
    const { days, unique, yachts } = buildLogbookDays({ sessions, requests, from, to });
    return Response.json(
      { ok: true, from, to, days, unique, yachts },
      { headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } },
    );
  } catch (err) {
    console.error("logbook/days: could not build:", err?.message);
    return Response.json({ ok: false, error: "data_unavailable" }, { status: 502 });
  }
}
