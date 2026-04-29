// Phase 5.3 — fire re-engagement campaign to a candidate list.
//
// Auth: NEWSLETTER_PROXY_SECRET / NEWSLETTER_UNSUB_SECRET / CRON_SECRET.
// Body: { stream, candidates: [email, …] } or { stream, all: true }
//   "all: true" auto-pulls candidates via findReEngagementCandidates
//   with default thresholds (180d inactivity, 90d tenure, ≥2 sends).
//
// Skips any address that:
//   - already has a re-engagement record (one-shot per address forever)
//   - is on the suppression list
//
// Records `reengagement:<email>` for every address sent to. The
// follow-up cron (Phase 5.4) reads these records.
//
// Approval gate: this endpoint is the gate. George POSTs from the CRM
// admin tab — the manual trigger IS the approval. Same as the bulk
// add-subscribers endpoint pattern.

import { NextResponse } from "next/server";
import { kvSmembers } from "@/lib/kv";
import {
  buildReengagementBody,
  recordReengagementSent,
  getReengagementRecord,
} from "@/lib/newsletter/reengagement";
import { findReEngagementCandidates } from "@/lib/newsletter/engagement";
import {
  sendNewsletterEmail,
  isSuppressed,
  unsubscribeUrlFor,
} from "@/lib/newsletter/resend";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

function isAuthorized(request) {
  const url = new URL(request.url);
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("key") ||
    "";
  const accepted = [
    process.env.NEWSLETTER_PROXY_SECRET,
    process.env.NEWSLETTER_UNSUB_SECRET,
    process.env.CRON_SECRET,
  ].filter(Boolean);
  return accepted.some((s) => s && provided === s);
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

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const stream = String(body?.stream ?? "");
  const validStreams = ["bridge", "wake", "compass", "greece"];
  if (!validStreams.includes(stream)) {
    return NextResponse.json(
      { error: `stream must be one of ${validStreams.join(", ")}` },
      { status: 400 },
    );
  }

  // Resolve candidate list.
  let candidates = [];
  if (Array.isArray(body?.candidates)) {
    candidates = body.candidates
      .map((s) => String(s).trim().toLowerCase())
      .filter((s) => s && s.includes("@"));
  } else if (body?.all === true) {
    const subscribers = (await kvSmembers(`subscribers:${stream}`)) ?? [];
    const records = await findReEngagementCandidates({
      subscribers,
      inactivityDays: Number(body?.inactivity_days ?? 180),
      minTenureDays: Number(body?.min_tenure_days ?? 90),
      minSends: Number(body?.min_sends ?? 2),
    });
    candidates = records.map((r) => r.email);
  } else {
    return NextResponse.json(
      { error: "provide candidates: [emails] or all: true" },
      { status: 400 },
    );
  }
  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, fired: 0, skipped: 0, note: "empty list" });
  }

  let fired = 0;
  let skippedAlreadyContacted = 0;
  let skippedSuppressed = 0;
  let failed = 0;
  const failures = [];

  for (const email of candidates) {
    if (await isSuppressed(email)) {
      skippedSuppressed += 1;
      continue;
    }
    const existing = await getReengagementRecord(email);
    if (existing) {
      // One-shot per address forever — never re-send re-engagement.
      skippedAlreadyContacted += 1;
      continue;
    }

    // Record the send BEFORE firing so the click URL has the canonical
    // sent_at to verify against. The HMAC is bound to (email, sent_at).
    const rec = await recordReengagementSent(email);

    const built = buildReengagementBody({ email, sentAt: rec.sent_at });
    const tpl = buildNewsletterEmail({
      stream,
      subject: built.subject,
      preheader: built.preheader,
      body_text: built.body_text,
      hero_image_url: null,
      unsubscribe_url: unsubscribeUrlFor(email, { list: stream }),
    });

    const result = await sendNewsletterEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      list: stream,
      tags: [
        { name: "stream", value: stream },
        { name: "kind", value: "reengagement" },
      ],
    });

    if (result.ok) {
      fired += 1;
    } else if (result.suppressed) {
      skippedSuppressed += 1;
    } else if (result.rate_limited) {
      // Don't burn through the daily cap for re-engagement. Stop and
      // surface the partial state — George can resume tomorrow.
      failed += 1;
      failures.push({ email, error: "rate_limited; stopping batch" });
      break;
    } else {
      failed += 1;
      failures.push({ email, error: result.error });
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  await notifyTelegram(
    [
      `🔁 <b>Re-engagement campaign fired</b>`,
      `Stream: <b>${stream}</b>`,
      `Candidates: ${candidates.length}`,
      `Sent: ${fired}`,
      `Already-contacted (skipped): ${skippedAlreadyContacted}`,
      `Suppressed (skipped): ${skippedSuppressed}`,
      failed ? `Failed: ${failed}` : "",
      ``,
      `Auto-unsubscribe of non-clickers fires daily; recipients who don't tap "Yes, keep sending" within 30 days will be quietly removed.`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return NextResponse.json({
    ok: failed === 0,
    stream,
    candidates_count: candidates.length,
    fired,
    skipped_already_contacted: skippedAlreadyContacted,
    skipped_suppressed: skippedSuppressed,
    failed,
    failures: failures.slice(0, 20),
  });
}
