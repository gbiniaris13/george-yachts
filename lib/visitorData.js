// lib/visitorData.js: reads the rows the Logbook feed is built from
// (/api/logbook/days): the visits the tracker recorded and the requests
// the forms left. The morning email (/api/cron/daily-summary) reads the
// same two tables with the same filters; it keeps its own copy of the
// reader so a change here can never stop the email.

import { SESSION_COLUMNS } from "@/lib/dailyReport";

const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

export const visitorDataConfigured = () => !!(CRM_SUPABASE_URL && CRM_SUPABASE_KEY);

// Reads every row of a query, a thousand at a time (the PostgREST cap).
async function readAll(path) {
  const rows = [];
  for (let from = 0; from < 40000; from += 1000) {
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
