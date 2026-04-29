// Bulk add subscribers — admin convenience for the first-issue push.
//
// George wants to grow the Bridge audience before tapping ✅ on Issue #1.
// This endpoint:
//
//   1. Takes a list of emails (POST JSON or GET ?emails=a@b.com,c@d.com)
//   2. Validates each (basic syntax + drop obvious test fixtures)
//   3. Checks the suppression list — refuses to re-add a complainant
//   4. SADDs to subscribers:<stream> + the legacy set
//   5. Writes / merges profile:<email> with consent record
//   6. Telegram-notifies George with a clean summary + masked list
//
// Auth: NEWSLETTER_UNSUB_SECRET or CRON_SECRET.
// Idempotent — re-adding the same email is a no-op (KV set semantics).
//
// Optional `?send_welcome=1` triggers Issue #1 (or the configured
// per-stream welcome) to fire immediately to each newly-added contact.
// Default OFF — safer to add silently and let George approve in batch.

import { NextResponse } from "next/server";
import { kvSadd, kvGet, kvSet, kvSismember } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};
const LEGACY_SET = "newsletter:subscribers";
const VALID_STREAMS = new Set(Object.keys(STREAM_SETS));

function isObviousJunk(email) {
  const e = String(email || "").trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.length < 5 || e.length > 254) return true;
  const domain = e.slice(e.indexOf("@") + 1);
  if (
    domain === "test.invalid" ||
    domain === "example.com" ||
    domain === "example.org" ||
    domain.endsWith(".invalid") ||
    domain.endsWith(".test") ||
    domain.endsWith(".localhost") ||
    !domain.includes(".")
  ) {
    return true;
  }
  // Strict-enough RFC-5322 subset for emails we'd actually keep.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return true;
  return false;
}

function maskEmail(email) {
  const at = email.indexOf("@");
  if (at < 1) return email;
  const local = email.slice(0, at);
  const dom = email.slice(at);
  if (local.length <= 3) return `${local[0]}…${dom}`;
  return `${local.slice(0, 2)}…${local.slice(-1)}${dom}`;
}

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

async function upsertProfile(email, stream, source) {
  const key = `profile:${email}`;
  let existing = null;
  try {
    const raw = await kvGet(key);
    existing = raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : null;
  } catch {
    existing = null;
  }
  if (existing) {
    const lists = Array.isArray(existing.lists) ? existing.lists : [];
    if (!lists.includes(stream)) lists.push(stream);
    const updated = {
      ...existing,
      lists,
      newsletter_opt_out: false,
      last_engaged_at: new Date().toISOString(),
    };
    await kvSet(key, JSON.stringify(updated));
    return { existed: true };
  }
  const profile = {
    email,
    lists: [stream],
    source,
    subscribed_at: new Date().toISOString(),
    last_engaged_at: new Date().toISOString(),
    unsubscribed_lists: [],
    language: "en",
    notes: "",
    gy_command_contact_id: null,
    consent_record: [
      {
        list: stream,
        method: "manual_admin_add",
        timestamp: new Date().toISOString(),
        ip_address: null,
        user_agent: "newsletter-add-subscribers",
      },
    ],
  };
  await kvSet(key, JSON.stringify(profile));
  return { existed: false };
}

async function authOk(provided) {
  return (
    (process.env.CRON_SECRET && provided === process.env.CRON_SECRET) ||
    (process.env.NEWSLETTER_UNSUB_SECRET &&
      provided === process.env.NEWSLETTER_UNSUB_SECRET)
  );
}

async function handle({ stream, emails, source, sendWelcome }) {
  if (!VALID_STREAMS.has(stream)) {
    return NextResponse.json(
      { error: `bad stream "${stream}"; one of ${[...VALID_STREAMS].join(",")}` },
      { status: 400 },
    );
  }
  const setKey = STREAM_SETS[stream];

  const seen = new Set();
  const accepted = [];
  const rejected = [];
  const suppressed = [];
  for (const raw of emails) {
    const e = String(raw).trim().toLowerCase();
    if (seen.has(e)) continue;
    seen.add(e);
    if (isObviousJunk(e)) {
      rejected.push({ email: e, reason: "invalid syntax / test fixture" });
      continue;
    }
    try {
      const isSupp = await kvSismember("suppression:emails", e);
      if (isSupp === 1 || isSupp === "1") {
        suppressed.push(e);
        continue;
      }
    } catch {
      // ignore — suppression check is best-effort
    }
    accepted.push(e);
  }

  let added = 0;
  let alreadyOn = 0;
  for (const e of accepted) {
    const r = await kvSadd(setKey, e).catch(() => 0);
    await kvSadd(LEGACY_SET, e).catch(() => {});
    if (r === 1 || r === "1") added += 1;
    else alreadyOn += 1;
    await upsertProfile(e, stream, source || "manual_admin_add");
  }

  const summary = {
    ok: true,
    stream,
    received: emails.length,
    accepted: accepted.length,
    added,
    already_on_list: alreadyOn,
    rejected,
    suppressed,
    welcome_sends: 0,
  };

  // Optional: fire Issue #1 (or per-stream welcome) immediately.
  // Default off because the brief's safety stance is "approve in batch".
  if (sendWelcome && added > 0 && stream === "bridge") {
    try {
      const { sendNewsletterFromTemplate } = await import("@/lib/newsletter/resend");
      const { ISSUE_1_SUBJECT, ISSUE_1_PREHEADER, ISSUE_1_BODY_TEXT, ISSUE_1_HERO_IMAGE_URL } =
        await import("@/lib/newsletter/issue-1");
      for (const e of accepted) {
        const result = await sendNewsletterFromTemplate({
          to: e,
          stream: "bridge",
          subject: ISSUE_1_SUBJECT,
          preheader: ISSUE_1_PREHEADER,
          body_text: ISSUE_1_BODY_TEXT,
          hero_image_url: ISSUE_1_HERO_IMAGE_URL,
          tags: [
            { name: "stream", value: "bridge" },
            { name: "kind", value: "welcome" },
          ],
        });
        if (result.ok) summary.welcome_sends += 1;
      }
    } catch (e) {
      summary.welcome_error = String(e?.message ?? e).slice(0, 200);
    }
  }

  await notifyTelegram(
    [
      `📬 <b>Subscribers added — ${stream}</b>`,
      `Added: <b>${added}</b>`,
      alreadyOn ? `Already on list: ${alreadyOn}` : "",
      suppressed.length ? `Suppressed (skipped): ${suppressed.length}` : "",
      rejected.length ? `Rejected: ${rejected.length}` : "",
      "",
      `<b>Sample:</b>`,
      ...accepted.slice(0, 8).map((e) => `· ${maskEmail(e)}`),
      sendWelcome ? `\nWelcome Issue #1 fired: <b>${summary.welcome_sends}</b>` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json(summary);
}

// ── POST: JSON body ── { stream, emails: [...], source?, send_welcome? }
export async function POST(request) {
  const url = new URL(request.url);
  const provided =
    url.searchParams.get("key") ||
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!(await authOk(provided))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const stream = String(body.stream || "bridge").toLowerCase();
  const emails = Array.isArray(body.emails) ? body.emails : [];
  const sendWelcome =
    body.send_welcome === true ||
    body.send_welcome === "1" ||
    body.send_welcome === "true";
  if (emails.length === 0) {
    return NextResponse.json(
      { error: "emails[] required (POST JSON: { stream, emails: [...] })" },
      { status: 400 },
    );
  }
  return handle({
    stream,
    emails,
    source: body.source,
    sendWelcome,
  });
}

// ── GET: comma-separated list (for quick curl tests) ──
//   /api/admin/newsletter-add-subscribers?key=…&stream=bridge&emails=a@b.com,c@d.com
export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  if (!(await authOk(provided))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const stream = (url.searchParams.get("stream") || "bridge").toLowerCase();
  const csv = url.searchParams.get("emails") || "";
  const emails = csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (emails.length === 0) {
    return NextResponse.json(
      {
        error:
          "Pass emails=a@b.com,c@d.com or POST JSON { stream, emails: [...] }",
      },
      { status: 400 },
    );
  }
  const sendWelcome = url.searchParams.get("send_welcome") === "1";
  return handle({
    stream,
    emails,
    source: url.searchParams.get("source"),
    sendWelcome,
  });
}
