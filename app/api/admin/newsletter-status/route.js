// Read-only diagnostic for the weekly-newsletter pipeline.
//
// Returns:
//   - flag value of NEWSLETTER_WEEKLY_ENABLED ("true" / "false" / unset)
//   - subscriber count + the actual list (sorted, deduped, lowercased)
//   - presence of CRON_SECRET (boolean only)
//   - presence of GMAIL_USER / GMAIL_PASS (boolean only)
//   - presence of KV_REST_API_URL / KV_REST_API_TOKEN (boolean only)
//
// Auth: lightweight `?key=` shared secret using NEWSLETTER_UNSUB_SECRET
// (already in use by the unsubscribe + cron). Falls back to CRON_SECRET.
// Returns 401 if neither is set or doesn't match.

import { NextResponse } from "next/server";
import { kvSmembers, kvScard } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUBSCRIBERS_SET = "newsletter:subscribers";

// Privacy split:
//   - Without ?key=… : returns flag value, total subscriber count,
//                      domain breakdown (anonymised), env presence.
//                      Safe to leave public.
//   - With matching ?key=… (NEWSLETTER_UNSUB_SECRET or CRON_SECRET):
//                      additionally returns the full sorted email list.
export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  const expected =
    process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  const showFullEmails = !!expected && provided === expected;

  const enabledRaw = process.env.NEWSLETTER_WEEKLY_ENABLED;
  const flag = {
    var_name: "NEWSLETTER_WEEKLY_ENABLED",
    raw_value: enabledRaw ?? null,
    is_unset: enabledRaw === undefined,
    will_send: enabledRaw === "true",
    note:
      enabledRaw === "true"
        ? "Live: cron will actually send."
        : "Dry run: cron generates the email + Telegrams a preview but DOES NOT send.",
  };

  let count = null;
  let subscribers = [];
  try {
    count = await kvScard(SUBSCRIBERS_SET);
    const members = await kvSmembers(SUBSCRIBERS_SET);
    subscribers = Array.isArray(members)
      ? members.map((s) => String(s)).sort()
      : [];
  } catch (e) {
    return NextResponse.json({
      ok: true,
      flag,
      subscribers_error: e?.message ?? "kv read failed",
      env_presence: {
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      },
    });
  }

  // Anonymised domain breakdown — safe to expose without auth.
  const domainCounts = {};
  for (const s of subscribers) {
    const at = s.indexOf("@");
    if (at === -1) continue;
    const dom = s.slice(at + 1);
    domainCounts[dom] = (domainCounts[dom] ?? 0) + 1;
  }

  // Mask each email: keep first 2 chars + last 1 of local part.
  // e.g. "travel@royalairtrip.com" → "tr…l@royalairtrip.com"
  const maskedSubscribers = subscribers.map((s) => {
    const at = s.indexOf("@");
    if (at < 1) return s;
    const local = s.slice(0, at);
    const dom = s.slice(at);
    if (local.length <= 3) return `${local[0]}…${dom}`;
    return `${local.slice(0, 2)}…${local.slice(-1)}${dom}`;
  });

  return NextResponse.json({
    ok: true,
    flag,
    subscriber_count: count,
    subscribers_by_domain: domainCounts,
    subscribers_masked: maskedSubscribers,
    subscribers: showFullEmails ? subscribers : undefined,
    env_presence: {
      CRON_SECRET: !!process.env.CRON_SECRET,
      NEWSLETTER_UNSUB_SECRET: !!process.env.NEWSLETTER_UNSUB_SECRET,
      NEWSLETTER_WEEKLY_ENABLED_set: enabledRaw !== undefined,
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_PASS: !!process.env.GMAIL_PASS,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
    },
    note: showFullEmails
      ? "Full email list included (auth ok)."
      : "Full emails hidden. Pass ?key=<NEWSLETTER_UNSUB_SECRET or CRON_SECRET> to see them.",
  });
}
