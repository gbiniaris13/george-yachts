// Resend free-tier quota tracking + queue helpers.
//
// Resend free: 100 emails/day, 3000/month. We enforce a soft daily
// cap at 95/day client-side so that:
//
//   - Welcome flow auto-fires (1 per signup) never push us over
//   - Cron retries have headroom
//   - We don't depend on Resend bouncing us at exactly 100
//
// KV keys:
//   daily_resend_count:<YYYY-MM-DD>   integer counter (UTC day)
//   monthly_resend_count:<YYYY-MM>    integer counter (UTC month)
//   pending_sends:<draft_id>          Set<email> — recipients to flush
//                                     in subsequent days
//   draft_in_flight:<draft_id>        marker that a draft is paused
//                                     mid-send and waiting for the
//                                     daily flush cron
//
// The flush cron at 00:30 UTC walks every `draft_in_flight:*` and
// drains up to DAILY_SOFT_CAP from each draft's pending set, then
// removes the marker once empty.

import { kvGet, kvSet, kvIncr, kvSadd, kvSrem, kvSmembers } from "@/lib/kv";

export const DAILY_SOFT_CAP = 95;
export const DAILY_HARD_CAP = 100; // Resend's actual cap
export const MONTHLY_SOFT_CAP = 2900;
export const MONTHLY_HARD_CAP = 3000;

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}
function thisMonthUtc() {
  return new Date().toISOString().slice(0, 7);
}

export async function getDailyCount(date = todayUtc()) {
  try {
    const v = await kvGet(`daily_resend_count:${date}`);
    return v ? Number(v) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function getMonthlyCount(month = thisMonthUtc()) {
  try {
    const v = await kvGet(`monthly_resend_count:${month}`);
    return v ? Number(v) || 0 : 0;
  } catch {
    return 0;
  }
}

/** Returns how many sends we have left in the day's soft cap. */
export async function getDailyHeadroom() {
  const used = await getDailyCount();
  return Math.max(0, DAILY_SOFT_CAP - used);
}

/** Atomically increment both counters. Returns the new daily count. */
export async function recordSend() {
  try {
    await kvIncr(`monthly_resend_count:${thisMonthUtc()}`).catch(() => {});
    const v = await kvIncr(`daily_resend_count:${todayUtc()}`);
    return Number(v) || 1;
  } catch {
    return 0;
  }
}

/** Pre-flight check — call before every Resend send. */
export async function canSendNow() {
  const [daily, monthly] = await Promise.all([
    getDailyCount(),
    getMonthlyCount(),
  ]);
  if (monthly >= MONTHLY_SOFT_CAP) {
    return {
      ok: false,
      reason: "monthly_cap",
      daily_used: daily,
      monthly_used: monthly,
    };
  }
  if (daily >= DAILY_SOFT_CAP) {
    return {
      ok: false,
      reason: "daily_cap",
      daily_used: daily,
      monthly_used: monthly,
    };
  }
  return {
    ok: true,
    reason: null,
    daily_used: daily,
    monthly_used: monthly,
  };
}

/** Queue any recipients we couldn't fit today into a draft's
 *  pending set, plus mark the draft as in-flight for the flush cron. */
export async function queueRemaining(draftId, emails) {
  if (!draftId || !Array.isArray(emails) || emails.length === 0) return 0;
  for (const e of emails) {
    await kvSadd(`pending_sends:${draftId}`, e).catch(() => {});
  }
  await kvSadd("draft_in_flight", draftId).catch(() => {});
  return emails.length;
}

/** Pull up to `limit` emails out of a draft's pending set. */
export async function popPending(draftId, limit) {
  const all = (await kvSmembers(`pending_sends:${draftId}`)) ?? [];
  const slice = all.slice(0, limit);
  for (const e of slice) {
    await kvSrem(`pending_sends:${draftId}`, e).catch(() => {});
  }
  return { taken: slice, remaining: all.length - slice.length };
}

/** Remove the in-flight marker once a draft's queue is fully drained. */
export async function markFlushed(draftId) {
  await kvSrem("draft_in_flight", draftId).catch(() => {});
}

export async function listInFlight() {
  return (await kvSmembers("draft_in_flight")) ?? [];
}
