// /api/cron/daily-summary: the daily visitor report, by EMAIL.
//
// 2026-11-06 (George): "this analysis should come to me by email, every
// day, and be more detailed and better". Until today this route sent a
// short Telegram message built from four KV counters, into the same chat
// where every visitor ping lands, and its visitor number counted every
// crawler that ran the page script (about two thirds of the total).
//
// Now it reads the per-visit rows the tracker writes (table `sessions`),
// separates people from machines, and emails George a full report: who
// came, how many from the US, who looked seriously and at which yachts,
// where they came from, what they read, the requests, and the last seven
// days side by side. The logic lives in lib/dailyReport.js.
//
// Window: the 24 hours that end at the top of the hour the cron fires.
// The cron runs at 05:00 UTC = 07:00 in Athens in winter, which is midnight
// in New York, so the report holds one complete American day.
//
// Never silent: if the email cannot be sent, or the data cannot be read,
// a short Telegram message says so.
//
// GET ?preview=1 (with the cron secret) returns the HTML and sends nothing.

import { emailGeorge } from "@/lib/notifyGeorge";
import { sendTelegram } from "@/lib/telegram";
import { kvDel } from "@/lib/kv";
import {
  SESSION_COLUMNS,
  buildDailyReport,
  renderReportHtml,
  reportSubject,
  reportFallbackText,
} from "@/lib/dailyReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
// Seven days for the table, three more so a browser that reloads all week
// without ever doing anything is recognised as a monitor.
const LOOKBACK_DAYS = 10;

// Reads every row of a query, a thousand at a time (the PostgREST cap).
async function readAll(path) {
  const rows = [];
  for (let from = 0; from < 20000; from += 1000) {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: CRM_SUPABASE_KEY,
        Authorization: `Bearer ${CRM_SUPABASE_KEY}`,
        Range: `${from}-${from + 999}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`${path.split("?")[0]} answered ${res.status}`);
    const page = await res.json();
    if (!Array.isArray(page)) throw new Error(`${path.split("?")[0]} did not return rows`);
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

// 2026-11-06 (evening): the requests come from The Helm. The first version
// counted the notes two of this site's forms leave in this app's database,
// and George saw at once that the months could not be right: July showed
// 6 requests where The Helm holds 23. A request is what is in The Helm,
// however it arrived (a form, an email, WhatsApp, a travel agent), so the
// email asks the CRM for the list, the same list the Logbook page shows.
// Returns null when the CRM cannot be reached; the caller then falls back
// to the forms' notes and the email says so.
async function readHelmRequests(since, until) {
  const secret = process.env.NEWSLETTER_PROXY_SECRET;
  if (!secret) return null;
  const base = (process.env.GY_COMMAND_URL || "https://command.georgeyachts.com").replace(/\/$/, "");
  try {
    const res = await fetch(
      `${base}/api/hooks/logbook-requests?since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) throw new Error(`the CRM answered ${res.status}`);
    const body = await res.json();
    if (!body?.ok || !Array.isArray(body.requests)) throw new Error("the CRM returned no list");
    return body.requests;
  } catch (e) {
    console.error("daily-summary: The Helm could not be read:", e?.message);
    return null;
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const preview = url.searchParams.get("preview") === "1";
  const endParam = Date.parse(url.searchParams.get("end") || "");
  const endMs = Number.isFinite(endParam) ? endParam : Math.floor(Date.now() / HOUR_MS) * HOUR_MS;
  const since = new Date(endMs - LOOKBACK_DAYS * DAY_MS).toISOString();
  const until = new Date(endMs).toISOString();

  let report;
  try {
    if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) throw new Error("the visitor database is not configured");
    const [sessions, helmRequests] = await Promise.all([
      readAll(`sessions?select=${SESSION_COLUMNS}&started_at=gte.${since}&started_at=lt.${until}&order=started_at.asc`),
      readHelmRequests(since, until),
    ]);
    // The request list is a nicety: if neither source can be read the
    // report still goes out, with the visitors.
    const requests =
      helmRequests ||
      (await readAll(
        `notifications?select=title,description,created_at&type=eq.form_submission&created_at=gte.${since}&created_at=lt.${until}&order=created_at.asc`,
      ).catch((e) => {
        console.error("daily-summary: requests could not be read:", e?.message);
        return [];
      }));
    report = buildDailyReport({ sessions, requests, endMs, requestsFromHelm: !!helmRequests });
  } catch (err) {
    console.error("daily-summary: could not build the report:", err?.message);
    if (!preview) {
      await sendTelegram(
        `Η ημερήσια αναφορά επισκεπτών δεν βγήκε σήμερα: τα δεδομένα δεν διαβάστηκαν (${String(err?.message || "άγνωστο σφάλμα").slice(0, 120)}).`,
      );
    }
    return Response.json({ ok: false, error: "report_failed" }, { status: 500 });
  }

  const subject = reportSubject(report);
  const html = renderReportHtml(report);

  if (preview) {
    return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } });
  }

  let emailed = false;
  try {
    emailed = await emailGeorge({ subject, html });
  } catch (err) {
    console.error("daily-summary: email failed:", err?.message);
  }
  let telegramFallback = false;
  if (!emailed) telegramFallback = await sendTelegram(reportFallbackText(report));

  // The KV day counters the old report used are still written by
  // /api/visitor-ping. Keep clearing the ones older than a week.
  const oldDate = new Date(Date.now() - 7 * DAY_MS).toLocaleDateString("en-CA", { timeZone: "Europe/Athens" });
  await Promise.allSettled(
    ["visitors", "inquiries", "countries", "pages", "sources"].map((k) => kvDel(`stats:${oldDate}:${k}`)),
  );

  return Response.json(
    { ok: emailed || telegramFallback, emailed, telegramFallback, subject, counts: report.counts },
    { status: emailed || telegramFallback ? 200 : 502 },
  );
}
