// Remove a subscriber from one or more streams. Mirror of
// /api/admin/newsletter-add-subscribers. Idempotent — removing an
// address that wasn't on the set is a no-op.
//
// POST JSON  { email, stream?, suppress? }
//   stream    optional — defaults to all 4 + legacy
//   suppress  optional — if true, also adds to `suppression:emails`
//             so the address can never be re-added accidentally
//
// Auth: NEWSLETTER_UNSUB_SECRET or CRON_SECRET.

import { NextResponse } from "next/server";
import { kvSrem, kvSadd, kvGet, kvSet } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};
const LEGACY_SET = "newsletter:subscribers";

async function notifyTelegram(text) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!t || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chat,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // best-effort
  }
}

function maskEmail(e) {
  const at = String(e || "").indexOf("@");
  if (at < 1) return e;
  const local = e.slice(0, at);
  const dom = e.slice(at);
  if (local.length <= 3) return `${local[0]}…${dom}`;
  return `${local.slice(0, 2)}…${local.slice(-1)}${dom}`;
}

function authOk(provided) {
  return (
    (process.env.CRON_SECRET && provided === process.env.CRON_SECRET) ||
    (process.env.NEWSLETTER_UNSUB_SECRET &&
      provided === process.env.NEWSLETTER_UNSUB_SECRET)
  );
}

async function handle({ email, stream, suppress }) {
  const lower = String(email || "").trim().toLowerCase();
  if (!lower || !lower.includes("@")) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }
  const setsToHit =
    stream && STREAM_SETS[stream] ? [STREAM_SETS[stream]] : Object.values(STREAM_SETS);
  // Always also try the legacy set (best-effort cleanup).
  setsToHit.push(LEGACY_SET);

  const removedFrom = [];
  for (const setKey of setsToHit) {
    try {
      const r = await kvSrem(setKey, lower);
      if (r === 1 || r === "1") removedFrom.push(setKey);
    } catch {
      // ignore
    }
  }

  // Patch the profile hash if it exists.
  try {
    const raw = await kvGet(`profile:${lower}`);
    if (raw) {
      const existing = typeof raw === "string" ? JSON.parse(raw) : raw;
      const removedList = stream ? [stream] : Object.keys(STREAM_SETS);
      const remainingLists = Array.isArray(existing.lists)
        ? existing.lists.filter((s) => !removedList.includes(s))
        : [];
      const updated = {
        ...existing,
        lists: remainingLists,
        unsubscribed_lists: Array.from(
          new Set([
            ...(Array.isArray(existing.unsubscribed_lists)
              ? existing.unsubscribed_lists
              : []),
            ...removedList,
          ]),
        ),
        last_engaged_at: new Date().toISOString(),
        newsletter_opt_out:
          remainingLists.length === 0 ? true : existing.newsletter_opt_out ?? false,
      };
      await kvSet(`profile:${lower}`, JSON.stringify(updated));
    }
  } catch {
    // best-effort
  }

  let suppressed = false;
  if (suppress) {
    await kvSadd("suppression:emails", lower).catch(() => {});
    suppressed = true;
  }

  await notifyTelegram(
    [
      `🗑 <b>Subscriber removed</b>`,
      `Email: ${maskEmail(lower)}`,
      `Stream: ${stream ?? "all"}`,
      `Removed from sets: ${removedFrom.length}`,
      suppressed ? `Added to suppression list: yes` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json({
    ok: true,
    email: lower,
    stream: stream ?? "all",
    removed_from_sets: removedFrom.length,
    suppressed,
  });
}

export async function POST(request) {
  const url = new URL(request.url);
  const provided =
    url.searchParams.get("key") ||
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!authOk(provided)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  return handle({
    email: body.email,
    stream: body.stream ? String(body.stream).toLowerCase() : null,
    suppress: body.suppress === true,
  });
}

export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  if (!authOk(provided)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return handle({
    email: url.searchParams.get("email"),
    stream: url.searchParams.get("stream"),
    suppress: url.searchParams.get("suppress") === "1",
  });
}
