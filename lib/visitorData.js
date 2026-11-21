// lib/visitorData.js: reads the rows the Logbook feed is built from
// (/api/logbook/days): the visits the tracker recorded and the requests
// the forms left. The morning email (/api/cron/daily-summary) reads the
// same two tables with the same filters; it keeps its own copy of the
// reader so a change here can never stop the email.

import { SESSION_COLUMNS } from "@/lib/dailyReport";

const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

// 2026-11-21: since fc60d6e0 (19 November) app/api/track writes visitor
// sessions to the live CRM project (GYC_SUPABASE_*). This reader stayed on
// CRM_SUPABASE_*, the project the CRM left in June, so from that afternoon
// it found no visits and the 20 November report said 0 people. Sessions
// are now read where they are written; notifications keep their old path,
// as they do in app/api/track. The fallback keeps local dev working.
const SESSIONS_URL = process.env.GYC_SUPABASE_URL || CRM_SUPABASE_URL;
const SESSIONS_KEY = process.env.GYC_SUPABASE_SERVICE_ROLE_KEY || CRM_SUPABASE_KEY;
const baseFor = (path) =>
  path.startsWith("sessions")
    ? { url: SESSIONS_URL, key: SESSIONS_KEY }
    : { url: CRM_SUPABASE_URL, key: CRM_SUPABASE_KEY };

export const visitorDataConfigured = () =>
  !!(SESSIONS_URL && SESSIONS_KEY && CRM_SUPABASE_URL && CRM_SUPABASE_KEY);

// Reads every row of a query, a thousand at a time (the PostgREST cap).
async function readAll(path) {
  const rows = [];
  for (let from = 0; from < 40000; from += 1000) {
    const { url, key } = baseFor(path);
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
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

// Visits that started in [sinceIso, untilIso), oldest first.
export function readSessions(sinceIso, untilIso) {
  if (!visitorDataConfigured()) throw new Error("the visitor database is not configured");
  return readAll(
    `sessions?select=${SESSION_COLUMNS}&started_at=gte.${sinceIso}&started_at=lt.${untilIso}&order=started_at.asc`,
  );
}

// Requests from the site's forms in the same span. The list is a nicety:
// if it cannot be read the report still goes out, with the visitors.
export function readRequests(sinceIso, untilIso) {
  return readAll(
    `notifications?select=title,description,created_at&type=eq.form_submission&created_at=gte.${sinceIso}&created_at=lt.${untilIso}&order=created_at.asc`,
  ).catch((e) => {
    console.error("visitorData: requests could not be read:", e?.message);
    return [];
  });
}
