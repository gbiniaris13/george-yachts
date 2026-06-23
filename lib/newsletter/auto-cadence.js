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

/** "biweekly" for the Jan–Mar planning peak, "monthly" otherwise. */
export function cadenceForMonth(month) {
  return month >= 1 && month <= 3 ? "biweekly" : "monthly";
}

/**
 * Decide whether today's scheduled firing should actually send.
 * @returns {{ fire:boolean, cadence:string, threshold_days:number, days_since_last:number|null, reason?:string }}
 */
export function shouldFireToday(now = new Date(), lastSentAtIso = null) {
  const month = athensMonth(now);
  const cadence = cadenceForMonth(month);
  const threshold = cadence === "biweekly" ? BIWEEKLY_DAYS : MONTHLY_DAYS;

  if (!lastSentAtIso) {
    return {
      fire: true,
      cadence,
      threshold_days: threshold,
      days_since_last: null,
      reason: "never sent",
    };
  }
  const lastMs = Date.parse(lastSentAtIso);
  if (Number.isNaN(lastMs)) {
    return {
      fire: true,
      cadence,
      threshold_days: threshold,
      days_since_last: null,
      reason: "bad last_send_at; firing safely",
    };
  }
  const days = (now.getTime() - lastMs) / 86400000;
  return {
    fire: days >= threshold,
    cadence,
    threshold_days: threshold,
    days_since_last: Number(days.toFixed(1)),
  };
}
