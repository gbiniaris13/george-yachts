// One-shot bootstrap: build Issue #1 draft, store in KV, ping Telegram.
//
// George taps the resulting Telegram card to preview / approve / abort.
// Nothing actually sends from this endpoint — Telegram approval gate.

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { kvSet, kvScard, kvIncr, kvSadd, kvDel, kvSmembers, kvSrem, kvGet } from "@/lib/kv";

async function kvGetSafe(key) {
  const raw = await kvGet(key);
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}
import {
  ISSUE_1_SUBJECT,
  ISSUE_1_PREHEADER,
  ISSUE_1_BODY_TEXT,
  ISSUE_1_HERO_IMAGE_URL,
  ISSUE_1_WORD_COUNT,
  ISSUE_1_READING_TIME_MIN,
} from "@/lib/newsletter/issue-1";
import { validateNewsletterContent } from "@/lib/newsletter/validator";
import { sendDraftApprovalCard } from "@/lib/newsletter/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const provided = url.searchParams.get("key");
  const okCron =
    process.env.CRON_SECRET && provided === process.env.CRON_SECRET;
  const okUnsub =
    process.env.NEWSLETTER_UNSUB_SECRET &&
    provided === process.env.NEWSLETTER_UNSUB_SECRET;
  if (!okCron && !okUnsub) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Brief §13 hard rules — fail closed if the body violates anything.
  const validation = validateNewsletterContent({
    body_text: ISSUE_1_BODY_TEXT,
    subject: ISSUE_1_SUBJECT,
    stream: "bridge",
    content_type: "story",
  });
  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "validation_failed",
        violations: validation.violations,
        warnings: validation.warnings,
      },
      { status: 422 },
    );
  }

  // Optional fresh-start: if `?reset=1` is passed, drop any in-flight
  // bridge drafts (status=pending) and reset the issue counter so this
  // run produces Issue #1. Only safe to use BEFORE the first real send.
  if (url.searchParams.get("reset") === "1") {
    const active = (await kvSmembers("draft:active")) ?? [];
    for (const id of active) {
      try {
        const raw = await kvGetSafe(`draft:${id}`);
        if (raw && raw.status === "pending" && raw.stream === "bridge") {
          await kvDel(`draft:${id}`);
          await kvSrem("draft:active", id);
        }
      } catch {
        // best-effort
      }
    }
    await kvSet("counter:bridge:issue_num", "0");
  }

  const audienceSize = (await kvScard("subscribers:bridge")) ?? 0;

  // Allocate the next issue number for the bridge stream.
  let issueNumber;
  try {
    issueNumber = await kvIncr("counter:bridge:issue_num");
  } catch {
    issueNumber = 1;
  }

  const draftId = `bridge-issue-${issueNumber}-${crypto.randomBytes(4).toString("hex")}`;
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  const draft = {
    id: draftId,
    stream: "bridge",
    issue_number: issueNumber,
    content_type: "story",
    subject: ISSUE_1_SUBJECT,
    preheader: ISSUE_1_PREHEADER,
    body_text: ISSUE_1_BODY_TEXT,
    hero_image_url: ISSUE_1_HERO_IMAGE_URL,
    audience_lists: ["bridge"],
    estimated_recipients: audienceSize,
    word_count: ISSUE_1_WORD_COUNT,
    reading_time_min: ISSUE_1_READING_TIME_MIN,
    voice_violations: validation.violations,
    voice_warnings: validation.warnings,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
    status: "pending",
    telegram_message_id: null,
  };

  await kvSet(`draft:${draftId}`, JSON.stringify(draft));
  await kvSadd("draft:active", draftId).catch(() => {});

  const tg = await sendDraftApprovalCard({
    draft_id: draftId,
    stream: "bridge",
    issue_number: issueNumber,
    subject: ISSUE_1_SUBJECT,
    audience_size: audienceSize,
    content_type: "story",
    hero_image_url: ISSUE_1_HERO_IMAGE_URL,
    word_count: ISSUE_1_WORD_COUNT,
    reading_time_min: ISSUE_1_READING_TIME_MIN,
    voice_violations: validation.violations,
    voice_warnings: validation.warnings,
  });

  if (tg.message_id) {
    draft.telegram_message_id = tg.message_id;
    await kvSet(`draft:${draftId}`, JSON.stringify(draft));
  }

  return NextResponse.json({
    ok: true,
    draft_id: draftId,
    issue_number: issueNumber,
    audience_size: audienceSize,
    word_count: ISSUE_1_WORD_COUNT,
    reading_time_min: ISSUE_1_READING_TIME_MIN,
    telegram: tg,
    next_steps: [
      "Open Telegram, look at the approval card with the hero photo + caption.",
      "Tap 👀 Preview HTML to see the rendered email.",
      "Tap ✅ Approve & Send when you are happy. The body cannot be edited from this endpoint.",
      "Tap ❌ Abort to throw it away.",
    ],
  });
}
