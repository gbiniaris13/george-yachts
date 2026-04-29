// Bridge auto-cron — Update 3 §1 + §4 + §7 #3.
//
// Runs every Thursday 06:00 UTC. The cron NEVER autonomously creates
// a draft or sends an email. Its job is to wake George at the right
// moment with the right menu, gated by:
//
//   1. AUTO_MODE_ENABLED + AUTO_BRIDGE_ENABLED env toggles
//   2. getCurrentSeason() → cadence threshold
//   3. last_send_at:bridge → days-since-last check
//   4. content scan: recent blog post + eligible yacht + always-on
//      "Write /story" + "Skip this week"
//
// Output: a Telegram menu card with up to 4 URL buttons, each carrying
// an HMAC token bound to the cron's fire_id. George taps one, the
// /api/newsletter/auto-bridge-pick handler runs, which (for blog or
// yacht) calls the standard compose endpoint to create a draft +
// trigger the existing approval card flow.
//
// Idempotency: each Thursday gets a fire_id (the date in YYYY-MM-DD).
// Once a button is tapped, auto_bridge_processed:<fire_id> is set so
// subsequent taps gracefully no-op.

import { NextResponse } from "next/server";
import {
  shouldFireBridgeToday,
  recentBlogPostForBridge,
  eligibleYachtForBridge,
  getLastSendAt,
  bridgeFireIdForDate,
} from "@/lib/newsletter/auto-bridge";
import {
  autoModeEnabledFor,
  pausedAlertText,
} from "@/lib/newsletter/auto-mode";
import {
  sendTelegramText,
  sendTelegramWithUrlButtons,
  autoBridgePickUrl,
} from "@/lib/newsletter/telegram";
import { kvSmembers, kvGet } from "@/lib/kv";

/**
 * 2026-04-29 safety gate — refuse to nudge for a NEW Bridge issue
 * while the previous one is still being delivered to late recipients.
 *
 * Scenario this prevents: Issue #1 hit the Resend daily cap (95/day
 * free tier), late recipients are queued in pending_sends:<draftId>,
 * the flush cron is multi-day draining them. If the auto-cron fires
 * a menu for Issue #2 in the middle of that, George could approve a
 * second issue before some subscribers have even received the first.
 *
 * The check: walk every draft_in_flight entry, parse, see if any are
 * Bridge stream and not yet finalised. If yes, abort the menu and
 * Telegram a clear status note instead.
 */
async function bridgeStillFlushing() {
  const inflight = (await kvSmembers("draft_in_flight")) ?? [];
  if (!Array.isArray(inflight) || inflight.length === 0) return null;
  for (const draftId of inflight) {
    try {
      const raw = await kvGet(`draft:${draftId}`);
      if (!raw) continue;
      const d = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (d?.stream !== "bridge") continue;
      if (d?.status === "sent" || d?.status === "aborted") continue;
      // Anything else (sending_paused, sending, pending) means we're
      // still mid-issue. Refuse to push a new menu.
      return { draftId, status: d.status, issue_number: d.issue_number ?? "?" };
    } catch {
      // skip malformed
    }
  }
  return null;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CRM_BASE =
  process.env.NEWSLETTER_CRM_BASE_URL || "https://command.georgeyachts.com";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET(request) {
  // Vercel cron auth — uses CRON_SECRET. Manual triggering also OK.
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fireId = bridgeFireIdForDate(now);

  // Gate 1 — auto-mode toggles. If paused, log + alert + exit.
  const auto = autoModeEnabledFor("bridge");
  if (!auto.enabled) {
    await sendTelegramText(
      pausedAlertText({
        stream: "bridge",
        reason: auto.reason,
        intended_action:
          "evaluate weekly cadence + send menu of /blog, yacht highlight, /story, or skip",
      }),
    ).catch(() => {});
    return NextResponse.json({
      ok: true,
      action: "paused",
      reason: auto.reason,
      fire_id: fireId,
    });
  }

  // Gate 2 — in-flight check. If a previous Bridge issue is still
  // being drained by the flush cron, never push a new menu. Telegram
  // a status note so George knows why he didn't get the usual menu
  // this Thursday.
  const stillFlushing = await bridgeStillFlushing();
  if (stillFlushing) {
    await sendTelegramText(
      [
        `⏳ <b>Bridge auto-cron deferred — previous issue still drained</b>`,
        ``,
        `Issue #${stillFlushing.issue_number} is in <code>${stillFlushing.status}</code> state`,
        `(draft <code>${stillFlushing.draftId}</code>) and the flush cron is still`,
        `delivering it to late recipients (free-tier 95/day cap).`,
        ``,
        `No menu sent this Thursday. Next auto-cron will check again`,
        `next Thursday — by then the flush cron will have caught up.`,
        ``,
        `Daily flush runs 00:30 UTC.`,
      ].join("\n"),
    ).catch(() => {});
    return NextResponse.json({
      ok: true,
      action: "deferred_in_flight",
      still_flushing: stillFlushing,
      fire_id: fireId,
    });
  }

  // Gate 3 — cadence + last_send_at. Skip silently with debug ping.
  const lastSent = await getLastSendAt("bridge");
  const decision = shouldFireBridgeToday(lastSent, now);
  if (!decision.fire) {
    // Silent skip with a small debug ping so George knows the cron
    // ran but chose not to nudge. Reduces "is the cron broken?" noise.
    await sendTelegramText(
      `🤖 Bridge auto-cron: skipped (${decision.cadence} cadence, ` +
        `last send ${decision.days_since_last}d ago vs ${decision.threshold}d threshold). ` +
        `Next check next Thursday.`,
    ).catch(() => {});
    return NextResponse.json({
      ok: true,
      action: "skipped",
      decision,
      fire_id: fireId,
    });
  }

  // Gate 3 — content scan. Find the available paths.
  const [blog, yacht] = await Promise.all([
    recentBlogPostForBridge(7, now),
    eligibleYachtForBridge(),
  ]);

  // Build the menu. Always include /story + skip; conditionally add
  // blog and yacht based on what the scan turned up. URL buttons —
  // not callback — so this stream stays out of the CRM bot's webhook.
  const buttons = [];

  if (blog) {
    buttons.push({
      text: `📰 /blog recap — ${blog.title.slice(0, 50)}${blog.title.length > 50 ? "…" : ""}`,
      url: autoBridgePickUrl({ action: "blog", fire_id: fireId, slug: blog.slug }),
    });
  }

  if (yacht) {
    buttons.push({
      text: `⛵ Highlight — ${yacht.name.slice(0, 50)}`,
      url: autoBridgePickUrl({ action: "yacht", fire_id: fireId, slug: yacht.slug }),
    });
  }

  // "Write /story" routes to the CRM Composer directly. No HMAC needed
  // for navigation; the CRM enforces its own auth on the dashboard.
  buttons.push({
    text: "✍️ Write /story",
    url: `${CRM_BASE}/dashboard/newsletter`,
  });

  buttons.push({
    text: "⏸ Skip this week",
    url: autoBridgePickUrl({ action: "skip", fire_id: fireId, slug: "" }),
  });

  // Body of the menu card.
  const lines = [
    `🤖 <b>Bridge auto-fire ready</b>`,
    `<i>${decision.cadence} cadence · ${
      decision.days_since_last !== undefined
        ? `${decision.days_since_last}d since last send`
        : "no prior send recorded"
    }</i>`,
    ``,
    `Pick the content path for this week:`,
    ``,
    blog
      ? `· <b>📰 /blog recap</b> — fresh post: <i>${escapeHtml(blog.title)}</i>`
      : `· <i>📰 No fresh blog post in last 7 days</i>`,
    yacht
      ? `· <b>⛵ Yacht highlight</b> — first unfeatured boat with voice fields: <i>${escapeHtml(yacht.name)}</i>`
      : `· <i>⛵ No eligible yacht (add captain_name / positioning_one_liner / idealFor in Sanity to surface candidates)</i>`,
    `· <b>✍️ Write /story</b> — opens Composer in CRM`,
    `· <b>⏸ Skip this week</b> — try again next Thursday`,
    ``,
    `<i>Tap any button to act. The cron will not re-prompt this week.</i>`,
  ].filter(Boolean).join("\n");

  const tg = await sendTelegramWithUrlButtons(lines, buttons);

  return NextResponse.json({
    ok: true,
    action: "menu_sent",
    fire_id: fireId,
    decision,
    candidates: {
      blog: blog ?? null,
      yacht: yacht ?? null,
    },
    telegram: tg,
  });
}
