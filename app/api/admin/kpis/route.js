// N.3 (Roberto brief, May 2026) — Internal KPI summary endpoint.
//
// JSON snapshot of the last 7 days of conversion-funnel events for
// the Monday review meeting. Complements the proper Looker Studio
// dashboard (which Boss connects to GA4 separately). This endpoint
// reads our own KV counters — useful when GA4 sampling is being
// stupid or when you want a fast at-a-glance number.
//
// Auth: requires `?key=<KPI_ADMIN_KEY>` matching the env var, OR
// `Authorization: Bearer <KPI_ADMIN_KEY>`. Returns 401 if missing.
// Without the env var, the endpoint refuses to serve at all (safer
// default than open).

import { readKpiSeries, KPI_EVENTS } from "@/lib/kpis";

export const runtime = "nodejs";

function isAuthed(req) {
  const expected = process.env.KPI_ADMIN_KEY;
  if (!expected) return false;
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("key");
  const auth = req.headers.get("authorization") || "";
  const fromHeader = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return fromQuery === expected || fromHeader === expected;
}

export async function GET(req) {
  if (!isAuthed(req)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const days = Math.min(
    Math.max(parseInt(new URL(req.url).searchParams.get("days") || "7", 10), 1),
    30
  );

  const series = {};
  for (const event of KPI_EVENTS) {
    // eslint-disable-next-line no-await-in-loop
    series[event] = await readKpiSeries(event, days);
  }

  // Totals + per-event week-over-week comparison when days >= 14
  const totals = {};
  for (const event of KPI_EVENTS) {
    totals[event] = (series[event] || []).reduce((sum, d) => sum + (d.value || 0), 0);
  }

  return Response.json({
    ok: true,
    range: {
      days,
      from: series[KPI_EVENTS[0]]?.[0]?.date,
      to: series[KPI_EVENTS[0]]?.[series[KPI_EVENTS[0]].length - 1]?.date,
    },
    totals,
    series,
  });
}
