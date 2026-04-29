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

export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  const expected =
    process.env.NEWSLETTER_UNSUB_SECRET || process.env.CRON_SECRET;
  if (!expected || provided !== expected) {
    return NextResponse.json(
      { error: "unauthorized — pass ?key=<NEWSLETTER_UNSUB_SECRET or CRON_SECRET>" },
      { status: 401 },
    );
  }

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

  return NextResponse.json({
    ok: true,
    flag,
    subscriber_count: count,
    subscribers,
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
  });
}
