// Auto-send cadence. SUPERSEDED 25/11/2026: shouldFireToday() at the bottom
// now follows George's six-a-year client calendar; cadenceForMonth() below is
// kept only for the record of the earlier rhythm.
//
// Auto-send cadence — research-grounded (deep-research study 2026-06-23).
//
// Both bridge (clients) and wake (travel advisors) follow the same
// seasonal rhythm the research recommends for a premium audience:
//
//   Jan–Mar (planning peak) → 2/month  (biweekly, ~13d threshold)
//   Apr–Dec                 → 1/month  (monthly,  ~27d threshold)
//
// The crons fire weekly (bridge Tuesday, wake Thursday) but THIS gate
// decides whether enough time has elapsed since the last real send.
// A frequency cap of ~2/month/contact is the #1 anti-unsubscribe lever
// the research identified ("59% unsubscribe over too-frequent emails").

const BIWEEKLY_DAYS = 13;
const MONTHLY_DAYS = 27;

function athensMonth(now = new Date()) {
  const athens = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Athens" }),
  );
  return athens.getMonth() + 1; // 1..12
}

/**
 * Seasonal rhythm, decided with George on 2026-09-03 from The Helm's
 * own numbers (requests accelerating Jun 13 → Jul 20 → Aug 25, and
 * 12 of the 28 August requests already asking for 2027):
 *
 *   Sep–Oct  biweekly   the 2027 booking wave opens; advisors build
 *                       next year's catalogues in autumn
 *   Nov–Dec  monthly    quiet, one year-end note
 *   Jan–Mar  biweekly   the planning peak (research-backed)
 *   Apr–Jun  monthly    "what is left for this season"
 *   Jul–Aug  monthly    clients are on the boats, keep it light
 *
 * ~17 issues a year per contact, under the 2/month unsubscribe line.
 */
export function cadenceForMonth(month) {
  if (month >= 1 && month <= 3) return "biweekly";
  if (month === 9 || month === 10) return "biweekly";
  return "monthly";
}

// ── 25/11/2026: George's decision from the after-sales research ─────────────
// Clients (bridge): about SIX letters a year, in the booking window, none in
// July or August ("frequency is the first reason people unsubscribe"), each on
// a fixed Tuesday chosen so it never lands in the same fortnight as the
// personal notes of After sales (the 12 January note to lost requests, the
// Thanksgiving letters, the 15 September last note):
//
//   January  4th Tuesday      March 2nd Tuesday      May 2nd Tuesday
//   September last Tuesday    October 4th Tuesday    December 2nd Tuesday
//
// Travel advisors (wake): monthly, practical, every month except August.
export const BRIDGE_SCHEDULE = { 1: 4, 3: 2, 5: 2, 9: "last", 10: 4, 12: 2 };

function athensYmd(now) {
  const a = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Athens" }));
  return { y: a.getFullYear(), m: a.getMonth() + 1, d: a.getDate() };
}
/** Day of month of the n-th (or last) Tuesday. */
export function nthTuesday(y, m, n) {
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const tues = [];
  for (let d = 1; d <= days; d++) if (new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 2) tues.push(d);
  return n === "last" ? tues[tues.length - 1] : tues[n - 1];
}
/** The bridge letter dates of a year, "YYYY-MM-DD". */
export function bridgeDates(y) {
  return Object.entries(BRIDGE_SCHEDULE).map(([m, n]) => `${y}-${String(m).padStart(2, "0")}-${String(nthTuesday(y, Number(m), n)).padStart(2, "0")}`);
}

/**
 * Decide whether today's scheduled firing should actually send.
 * bridge: only on (or, if a run was missed, the week after) its six dates,
 * once per month. wake: monthly (27 days apart), never in August.
 * @returns {{ fire:boolean, cadence:string, threshold_days:number, days_since_last:number|null, reason?:string }}
 */
export function shouldFireToday(now = new Date(), lastSentAtIso = null, stream = "bridge") {
  const { y, m, d } = athensYmd(now);
  const lastMs = lastSentAtIso ? Date.parse(lastSentAtIso) : NaN;
  const days = Number.isNaN(lastMs) ? null : Number(((now.getTime() - lastMs) / 86400000).toFixed(1));
  if (stream === "bridge") {
    const n = BRIDGE_SCHEDULE[m];
    if (!n) return { fire: false, cadence: "six-a-year", threshold_days: 20, days_since_last: days, reason: "no client letter this month" };
    const day = nthTuesday(y, m, n);
    const inWindow = d >= day && d <= day + 7; // the date, or the next run if it was missed
    const alreadyThisMonth = days !== null && days < 20;
    return { fire: inWindow && !alreadyThisMonth, cadence: "six-a-year", threshold_days: 20, days_since_last: days, reason: inWindow ? (alreadyThisMonth ? "already sent this month" : undefined) : `this month's letter is on the ${day}th` };
  }
  if (m === 8) return { fire: false, cadence: "monthly", threshold_days: 27, days_since_last: days, reason: "no letter in August" };
  return { fire: days === null || days >= 27, cadence: "monthly", threshold_days: 27, days_since_last: days };
}
