// Phase 6.1 — Per-issue analytics counters.
//
// Each newsletter issue carries Resend tags (set in resend.js when
// the email goes out):
//
//     [
//       { name: "stream", value: "bridge" },
//       { name: "issue",  value: "2" },
//       { name: "kind",   value: "regular" | "queue-flush" | "topup" | "reengagement" },
//     ]
//
// Resend echoes those tags back in webhook events. The webhook handler
// (Phase 6.2) reads (stream, issue) from the event tags and routes the
// counter increment here. Two separate stores per issue:
//
//   issue_stats:<stream>:<num>             JSON aggregate counters
//   issue_opens:<stream>:<num>             Set<email> for unique-open
//   issue_clicks:<stream>:<num>            Set<email> for unique-click
//
// We track both totals and uniques because totals over-count repeat
// opens (user re-opens email, image proxies fire, etc.) — the unique
// figure is what George should look at for "how many people read it".
//
// Bounces / complaints / unsubscribes are also routed here so the
// 1h + 24h post-send pings (Phase 6.5) can compute deliverability.

import {
  kvGet,
  kvSet,
  kvSadd,
  kvScard,
} from "@/lib/kv";

const STATS_PREFIX = "issue_stats:";
const OPENS_PREFIX = "issue_opens:";
const CLICKS_PREFIX = "issue_clicks:";

function statsKey(stream, issueNum) {
  return `${STATS_PREFIX}${stream}:${issueNum}`;
}
function opensKey(stream, issueNum) {
  return `${OPENS_PREFIX}${stream}:${issueNum}`;
}
function clicksKey(stream, issueNum) {
  return `${CLICKS_PREFIX}${stream}:${issueNum}`;
}

function emptyStats() {
  return {
    sent: 0,
    delivered: 0,
    opened_total: 0,
    clicked_total: 0,
    bounced_hard: 0,
    bounced_soft: 0,
    complained: 0,
    unsubscribed: 0,
    delivery_delayed: 0,
    failed: 0,
    last_event_at: null,
    first_send_at: null,
  };
}

async function readStats(stream, issueNum) {
  try {
    const raw = await kvGet(statsKey(stream, issueNum));
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

async function writeStats(stream, issueNum, stats) {
  await kvSet(statsKey(stream, issueNum), JSON.stringify(stats));
}

/**
 * Apply a counter event to a specific issue. Called from:
 *   - resend.js sendNewsletterEmail (for "sent" — baseline before
 *     Resend webhook is wired)
 *   - webhooks/resend (for delivered/opened/clicked/bounced/complained)
 *   - approve handler (for "failed" entries that never even reached
 *     Resend, e.g. local validation rejections)
 *
 * @param {object} args
 * @param {string} args.stream
 * @param {number|string} args.issue
 * @param {string} args.event "sent" | "delivered" | "opened" | "clicked"
 *                            | "bounced_hard" | "bounced_soft"
 *                            | "complained" | "unsubscribed"
 *                            | "delivery_delayed" | "failed"
 * @param {string} [args.email] required for opened/clicked uniqueness
 */
export async function recordIssueEvent({ stream, issue, event, email }) {
  if (!stream || !issue || !event) return null;
  const issueNum = String(issue);
  const now = new Date().toISOString();
  const s = (await readStats(stream, issueNum)) ?? emptyStats();

  // Map external event names → counter keys. Opens/clicks have a
  // total counter PLUS a unique-set; we increment the total here and
  // the unique-set below. Other events map 1:1 to counter slots.
  const counterKey =
    event === "opened"
      ? "opened_total"
      : event === "clicked"
        ? "clicked_total"
        : event;
  if (Object.prototype.hasOwnProperty.call(s, counterKey)) {
    s[counterKey] = (s[counterKey] ?? 0) + 1;
  }
  s.last_event_at = now;
  if (event === "sent" && !s.first_send_at) {
    s.first_send_at = now;
  }
  await writeStats(stream, issueNum, s);

  // Unique tracking lives in separate Sets so we can compute unique
  // opens vs total opens cleanly. SADD is idempotent — a re-open
  // from the same address doesn't double-count.
  if (event === "opened" && email) {
    await kvSadd(opensKey(stream, issueNum), String(email).toLowerCase()).catch(
      () => {},
    );
  } else if (event === "clicked" && email) {
    await kvSadd(clicksKey(stream, issueNum), String(email).toLowerCase()).catch(
      () => {},
    );
  }

  return s;
}

/**
 * Read aggregate stats for one issue. Returns the raw counters plus
 * computed rates (open rate, click rate, bounce rate) and unique
 * counts. Null if the issue has no recorded events.
 */
export async function getIssueStats(stream, issueNum) {
  const s = await readStats(stream, issueNum);
  if (!s) return null;
  const [uniqueOpens, uniqueClicks] = await Promise.all([
    kvScard(opensKey(stream, issueNum)).catch(() => 0),
    kvScard(clicksKey(stream, issueNum)).catch(() => 0),
  ]);
  const sent = s.sent || 0;
  const delivered = s.delivered || sent; // fallback when webhook isn't wired
  const denominator = delivered || 1;
  return {
    stream,
    issue: Number(issueNum) || issueNum,
    counters: s,
    unique_opens: Number(uniqueOpens) || 0,
    unique_clicks: Number(uniqueClicks) || 0,
    open_rate: Number(((Number(uniqueOpens) / denominator) * 100).toFixed(1)),
    click_rate: Number(((Number(uniqueClicks) / denominator) * 100).toFixed(1)),
    bounce_rate: Number(
      (
        ((s.bounced_hard + s.bounced_soft) / Math.max(sent || 1, 1)) *
        100
      ).toFixed(2),
    ),
    complaint_rate: Number(
      ((s.complained / Math.max(delivered, 1)) * 100).toFixed(2),
    ),
  };
}

/**
 * Helper for the Resend webhook handler: pull stream + issue from
 * the event's tags array. Resend echoes the tags we set on the
 * outgoing email back into the event payload. Returns null if either
 * tag is missing — caller should silently no-op (still increment the
 * per-recipient engagement record though).
 */
export function tagsToStreamIssue(tags) {
  if (!Array.isArray(tags)) {
    // Resend sometimes delivers tags as { stream: "bridge", issue: "2" }
    if (tags && typeof tags === "object") {
      const stream = tags.stream ?? null;
      const issue = tags.issue ?? null;
      if (stream && issue) return { stream: String(stream), issue: String(issue) };
    }
    return null;
  }
  let stream = null;
  let issue = null;
  for (const t of tags) {
    if (!t || typeof t !== "object") continue;
    if (t.name === "stream") stream = t.value;
    else if (t.name === "issue") issue = t.value;
  }
  if (!stream || !issue) return null;
  return { stream: String(stream), issue: String(issue) };
}
