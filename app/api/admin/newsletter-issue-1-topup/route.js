// Issue #1 top-up — send Issue #1 to anyone on Bridge who didn't get
// the original send. Used after George kept adding subscribers AFTER
// the first ✅ tap and so we ended up with subscribers:bridge > issue
// recipients.
//
// Two modes:
//
//   1. POST { already_received: [email1, email2, ...] }
//      We trust George (or Resend logs) for who already got Issue #1,
//      pre-populate issue_sent:bridge:1, then send to everyone in
//      Bridge MINUS that set. Cleanest — no duplicates.
//
//   2. POST {} (no body / no already_received)
//      Fall back to "send to all current Bridge". The 25 who got it
//      first time will receive a duplicate. Acceptable for Issue #1
//      ever-only since this is the welcome.
//
// Both modes write to issue_sent:bridge:1 as they go, so a third run
// (or any future Issue #1 add via welcome flow) is automatically a
// no-op for everyone already covered. Future issues use the same
// dedup primitive and never duplicate.
//
// Auth: NEWSLETTER_UNSUB_SECRET or CRON_SECRET.

import { NextResponse } from "next/server";
import {
  kvSmembers,
  kvSadd,
  kvSismember,
} from "@/lib/kv";
import { sendNewsletterEmail, isSuppressed, unsubscribeUrlFor } from "@/lib/newsletter/resend";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";
import {
  ISSUE_1_SUBJECT,
  ISSUE_1_PREHEADER,
  ISSUE_1_BODY_TEXT,
  ISSUE_1_HERO_IMAGE_URL,
} from "@/lib/newsletter/issue-1";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const ISSUE_KEY = "issue_sent:bridge:1";

function authOk(provided) {
  return (
    (process.env.CRON_SECRET && provided === process.env.CRON_SECRET) ||
    (process.env.NEWSLETTER_UNSUB_SECRET &&
      provided === process.env.NEWSLETTER_UNSUB_SECRET)
  );
}

async function notifyTelegram(text) {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!t || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch {
    // best-effort
  }
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

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // Mode 1 — bootstrap the dedup set with addresses George says
  // already received Issue #1.
  const alreadyReceived = Array.isArray(body.already_received)
    ? body.already_received
        .map((s) => String(s).trim().toLowerCase())
        .filter((s) => s && s.includes("@"))
    : [];
  let bootstrapped = 0;
  for (const e of alreadyReceived) {
    await kvSadd(ISSUE_KEY, e).catch(() => {});
    bootstrapped += 1;
  }

  // Resolve current Bridge audience.
  const bridgeMembers = (await kvSmembers("subscribers:bridge")) ?? [];
  const audience = Array.from(
    new Set(
      bridgeMembers
        .map((m) => String(m).trim().toLowerCase())
        .filter((s) => s && s.includes("@")),
    ),
  );

  let sent = 0;
  let alreadyHad = 0;
  let suppressedCount = 0;
  let failed = 0;
  const failures = [];

  for (const email of audience) {
    // Per-issue dedup — never re-deliver Issue #1 to the same address.
    try {
      const already = await kvSismember(ISSUE_KEY, email);
      if (already === 1 || already === "1") {
        alreadyHad += 1;
        continue;
      }
    } catch {
      // ignore — best-effort
    }

    if (await isSuppressed(email)) {
      suppressedCount += 1;
      continue;
    }

    const built = buildNewsletterEmail({
      stream: "bridge",
      subject: ISSUE_1_SUBJECT,
      preheader: ISSUE_1_PREHEADER,
      body_text: ISSUE_1_BODY_TEXT,
      hero_image_url: ISSUE_1_HERO_IMAGE_URL,
      unsubscribe_url: unsubscribeUrlFor(email, { list: "bridge" }),
    });
    const result = await sendNewsletterEmail({
      to: email,
      subject: built.subject,
      html: built.html,
      text: built.text,
      list: "bridge",
      tags: [
        { name: "stream", value: "bridge" },
        { name: "issue", value: "1" },
        { name: "kind", value: "topup" },
      ],
    });
    if (result.ok) {
      sent += 1;
      await kvSadd(ISSUE_KEY, email).catch(() => {});
    } else if (result.suppressed) {
      suppressedCount += 1;
    } else {
      failed += 1;
      failures.push({ email, error: result.error });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  await notifyTelegram(
    [
      `📨 <b>Issue #1 — top-up</b>`,
      `Bridge audience: ${audience.length}`,
      `Bootstrapped (already-received): ${bootstrapped}`,
      `Sent in this run: ${sent}`,
      `Already received (skipped): ${alreadyHad}`,
      suppressedCount ? `Suppressed: ${suppressedCount}` : "",
      failed ? `Failed: ${failed}` : "",
      "",
      `Total received Issue #1 to date: ${bootstrapped + sent + alreadyHad}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json({
    ok: true,
    audience_size: audience.length,
    bootstrapped,
    sent,
    already_had: alreadyHad,
    suppressed: suppressedCount,
    failed,
    failures: failures.slice(0, 20),
  });
}
