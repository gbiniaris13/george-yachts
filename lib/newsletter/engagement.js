// Phase 5.1 — Per-recipient engagement tracker.
//
// Resend webhook events flow through here. Every send / open / click
// updates a small JSON record per email address so we can:
//
//   1. Identify inactive subscribers for re-engagement (Phase 5.3+)
//   2. Compute open + click rates per issue (Phase 6 analytics)
//   3. Surface "this person is paying attention" signals to George
//      when he's prepping a /announce or /offer
//
// KV key:  engagement:<email>
//
// Record shape (all timestamps ISO, all counts integers):
//
//   {
//     email,
//     first_seen,            ISO when we first saw any event for this
//                            address (defensive: even if we miss events,
//                            we know roughly when this address became
//                            tracked)
//     last_send,             last delivered or attempted send
//     last_open,             null if never opened
//     last_click,            null if never clicked
//     sends_total,
//     opens_total,
//     clicks_total,
//     last_event,            "send" | "open" | "click" | "bounce" | "complaint"
//   }
//
// All writes go through markEvent() so the per-event logic stays in
// one place. Reads are direct kvGet for individual lookups, and a
// scan helper for cohort queries (re-engagement, analytics).

import { kvGet, kvSet } from "@/lib/kv";

const KEY_PREFIX = "engagement:";

function key(email) {
  return `${KEY_PREFIX}${String(email).trim().toLowerCase()}`;
}

async function readRecord(email) {
  try {
    const raw = await kvGet(key(email));
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function writeRecord(record) {
  await kvSet(key(record.email), JSON.stringify(record));
}

function emptyRecord(email, now = new Date().toISOString()) {
  return {
    email: String(email).trim().toLowerCase(),
    first_seen: now,
    last_send: null,
    last_open: null,
    last_click: null,
    sends_total: 0,
    opens_total: 0,
    clicks_total: 0,
    last_event: null,
  };
}

/**
 * Apply a single event to the engagement record. Idempotent in the
 * sense that re-applying the same event timestamp is harmless (same
 * counters, same last_*); we don't dedupe at this layer because
 * Resend itself dedupes events before delivering.
 *
 * @param {object} args
 * @param {string} args.email
 * @param {"send"|"open"|"click"} args.event
 * @param {string} [args.at]   ISO timestamp; defaults to now
 */
export async function markEvent({ email, event, at }) {
  const e = String(email ?? "").trim().toLowerCase();
  if (!e) return null;
  const now = at || new Date().toISOString();
  const r = (await readRecord(e)) ?? emptyRecord(e, now);

  switch (event) {
    case "send":
      r.last_send = now;
      r.sends_total += 1;
      break;
    case "open":
      r.last_open = now;
      r.opens_total += 1;
      break;
    case "click":
      r.last_click = now;
      r.clicks_total += 1;
      break;
    default:
      // unknown event types are recorded as last_event only, no counter
      break;
  }
  r.last_event = event;
  await writeRecord(r);
  return r;
}

/**
 * Read the engagement record for a single address. Null if never seen.
 */
export async function getEngagement(email) {
  return readRecord(email);
}

/**
 * Compute "engaged" status. By default: opened OR clicked anything
 * within the last 90 days. Re-engagement candidate = NOT engaged AND
 * has been a subscriber long enough that we'd expect engagement.
 */
export function isEngaged(record, now = new Date(), windowDays = 90) {
  if (!record) return false;
  const cutoff = now.getTime() - windowDays * 24 * 3600 * 1000;
  const lastOpen = record.last_open ? Date.parse(record.last_open) : 0;
  const lastClick = record.last_click ? Date.parse(record.last_click) : 0;
  return Math.max(lastOpen, lastClick) >= cutoff;
}

/**
 * Detect re-engagement candidates from a list of subscriber emails.
 * Returns those who:
 *   - Have at least N sends in the record (we sent them stuff)
 *   - Have NOT opened or clicked anything in `inactivityDays` days
 *   - First seen at least `minTenureDays` days ago (so we don't
 *     surprise people who just joined)
 *
 * Caller passes the full subscriber list — we don't scan KV here
 * because Vercel KV's REST shim doesn't support SCAN cleanly. The
 * subscribers:bridge / :wake / :compass / :greece sets are the
 * canonical iteration source.
 */
export async function findReEngagementCandidates({
  subscribers,
  inactivityDays = 180,
  minTenureDays = 90,
  minSends = 2,
  now = new Date(),
}) {
  const cutoffInactivity = now.getTime() - inactivityDays * 24 * 3600 * 1000;
  const cutoffTenure = now.getTime() - minTenureDays * 24 * 3600 * 1000;
  const candidates = [];
  for (const email of subscribers) {
    const r = await readRecord(email);
    if (!r) continue;
    if ((r.sends_total ?? 0) < minSends) continue;
    if (Date.parse(r.first_seen) > cutoffTenure) continue;
    const lastEngagement = Math.max(
      r.last_open ? Date.parse(r.last_open) : 0,
      r.last_click ? Date.parse(r.last_click) : 0,
    );
    if (lastEngagement >= cutoffInactivity) continue;
    candidates.push(r);
  }
  return candidates;
}
