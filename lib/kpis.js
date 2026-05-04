// N.3 (Roberto brief, May 2026) — KPI counters helper.
//
// Fire-and-forget incrementers used by inquiry / proposal / itinerary
// / privacy / ask-george endpoints. We intentionally keep this thin
// so any endpoint can call `bumpKpi("inquiry")` without worrying about
// KV connectivity. Failures are silent (KPIs are nice-to-have; we
// never block a user-facing flow on them).
//
// The `/api/admin/kpis` endpoint reads back the last 7 days for the
// at-a-glance Monday review, alongside the proper Looker Studio
// dashboard the brief calls out.

import { kvIncr, kvExpire, kvGet } from "@/lib/kv";

function todayUTC() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Increment a KPI counter for today.
 * Counters live at kpi:<event>:<YYYY-MM-DD> and auto-expire after 90
 * days so the KV namespace doesn't grow unbounded.
 */
export async function bumpKpi(event) {
  if (!event) return;
  if (!process.env.KV_REST_API_URL) return; // KV not configured → noop
  try {
    const key = `kpi:${event}:${todayUTC()}`;
    const n = await kvIncr(key);
    if (n === 1) await kvExpire(key, 90 * 86400);
  } catch {
    // intentionally silent
  }
}

/** Read counter for a single day. */
export async function readKpi(event, date) {
  if (!process.env.KV_REST_API_URL) return 0;
  try {
    const v = await kvGet(`kpi:${event}:${date}`);
    return Number(v) || 0;
  } catch {
    return 0;
  }
}

/** Read counters for the last N days inclusive of today. */
export async function readKpiSeries(event, days = 7) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    // eslint-disable-next-line no-await-in-loop
    const value = await readKpi(event, key);
    out.push({ date: key, value });
  }
  return out;
}

export const KPI_EVENTS = [
  "inquiry",                 // /api/inquiry submit
  "proposal_generated",      // /api/proposal-generate success
  "itinerary_saved",         // /api/itinerary-save success
  "privacy_deletion",        // /api/privacy-deletion submit
  "ask_george_message",      // /api/ask-george (assistant turn)
  "ask_george_followup",     // /api/ask-george saveForFollowUp
  "newsletter_signup",       // /api/newsletter signup
];
