// Unified composer endpoint — Phase 3.
//
// One POST handler that backs every triggered command:
//   /announce, /offer, /story, /intel, /blog
//
// Why one endpoint and not five: the dance is identical —
//   1. Validate auth + required slots
//   2. Resolve audience via §6 routing matrix (drop blocked streams)
//   3. Pull Sanity assets if needed (yacht / blog post)
//   4. For each surviving stream, assemble the body via §8 template
//   5. Run §13 validator — if BLOCK violations, refuse
//   6. Allocate per-stream issue counter
//   7. Create draft + KV-store
//   8. Telegram approval card per draft (one card per stream, since
//      each stream has its own subject + voice)
//   9. Return summary so the CRM Composer can show "✓ 2 drafts queued"
//
// Auth: NEWSLETTER_PROXY_SECRET (CRM proxy). Falls back to
// CRON_SECRET / NEWSLETTER_UNSUB_SECRET for direct ops.
//
// Body shape:
//   {
//     content_type: "announcement" | "offer" | "story" | "intel" | "blog",
//     audience: ["bridge", "wake", "compass", "greece"],   // requested
//     // type-specific slots:
//     yacht_slug?: string,         // announcement | offer
//     post_slug?: string,          // blog
//     george_angle?: string,       // announcement | offer | blog
//     headline?: string,           // intel
//     signal_text?: string,        // intel
//     source_note?: string,        // intel
//     subject_line?: string,       // story (override)
//     body_text?: string,          // story (the whole body)
//     hero_image_url?: string,     // story (optional override)
//     posture?: string,            // offer (e.g. "select availability")
//   }

import { NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  kvSet,
  kvSadd,
  kvScard,
  kvIncr,
} from "@/lib/kv";
import {
  getYachtForNewsletter,
  getPostForNewsletter,
  slugFromBlogUrl,
} from "@/lib/newsletter/sanity-yachts";
import { assembleBody } from "@/lib/newsletter/body-assembler";
import { validateNewsletterContent } from "@/lib/newsletter/validator";
import { enforceRouting, STREAMS } from "@/lib/newsletter/router";
import { sendDraftApprovalCard, sendTelegramText } from "@/lib/newsletter/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request) {
  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const url = new URL(request.url);
  const provided = header || url.searchParams.get("key") || "";
  const accepted = [
    process.env.NEWSLETTER_PROXY_SECRET,
    process.env.NEWSLETTER_UNSUB_SECRET,
    process.env.CRON_SECRET,
  ].filter(Boolean);
  return accepted.some((s) => s && provided === s);
}

function wordCount(s) {
  return String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
}
function readingMin(s) {
  return Math.max(1, Math.round(wordCount(s) / 220));
}

async function buildOneDraft({
  stream,
  content_type,
  payload,
  yacht,
  post,
}) {
  // Assemble body per stream voice
  const built = assembleBody({
    content_type,
    stream,
    yacht,
    post,
    george_angle: payload.george_angle,
    headline: payload.headline,
    signal_text: payload.signal_text,
    source_note: payload.source_note,
    subject_line: payload.subject_line,
    body_text: payload.body_text,
    hero_image_url: payload.hero_image_url,
    posture: payload.posture,
    link_label: payload.link_label,
    // Update 2 caveat #1 — captain credentials only when George
    // ticks the box in the Composer UI.
    include_captain_credentials: payload.include_captain_credentials === true,
  });

  // §13 validator gate
  const validation = validateNewsletterContent({
    body_text: built.body_text,
    subject: built.subject,
    stream,
    content_type,
  });

  // Allocate per-stream issue counter
  let issueNumber;
  try {
    issueNumber = await kvIncr(`counter:${stream}:issue_num`);
  } catch {
    issueNumber = 1;
  }

  const audienceSize = (await kvScard(`subscribers:${stream}`)) ?? 0;

  const draftId = `${stream}-${content_type}-${issueNumber}-${crypto
    .randomBytes(4)
    .toString("hex")}`;
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  const wc = wordCount(built.body_text);
  const rt = readingMin(built.body_text);

  const draft = {
    id: draftId,
    stream,
    issue_number: issueNumber,
    content_type,
    subject: built.subject,
    preheader: built.preheader,
    body_text: built.body_text,
    hero_image_url: built.hero_image_url ?? null,
    audience_lists: [stream],
    estimated_recipients: audienceSize,
    word_count: wc,
    reading_time_min: rt,
    voice_violations: validation.violations,
    voice_warnings: validation.warnings,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
    // If the validator blocked us, mark draft as `blocked` so the
    // approve handler refuses to send (defence in depth — the card
    // also won't show ✅ in that case).
    status: validation.ok ? "pending" : "blocked",
    telegram_message_id: null,
    composer_meta: {
      yacht_slug: yacht?.slug ?? null,
      post_slug: post?.title ? payload.post_slug : null,
      // Update 3 §2 — when this draft was created from a Wake/Compass
      // intel queue entry, the cron passes the entry coordinates so
      // the audit trail (and any future state-tracking) survives.
      queue_entry: payload.queue_entry ?? null,
    },
  };

  await kvSet(`draft:${draftId}`, JSON.stringify(draft));
  await kvSadd("draft:active", draftId).catch(() => {});

  // Telegram approval card. If validator blocked, fire a different
  // card explaining WHY (with evidence) without action buttons.
  let tg;
  if (!validation.ok) {
    // Build per-violation lines with evidence so George knows EXACTLY
    // which sentence/phrase tripped the rule. Without this he has to
    // guess, which is the diagnostic gap that surfaced 2026-04-29.
    const escapeTg = (s) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const evidenceFor = (v) => {
      if (!v.evidence) return null;
      if (typeof v.evidence === "string") return v.evidence.slice(0, 200);
      if (Array.isArray(v.evidence)) {
        return v.evidence.map(String).join(", ").slice(0, 200);
      }
      try {
        return JSON.stringify(v.evidence).slice(0, 200);
      } catch {
        return null;
      }
    };
    const violationLines = validation.violations.flatMap((v) => {
      const ev = evidenceFor(v);
      const lines = [`• ${v.rule}`];
      if (ev) lines.push(`  ↳ <i>${escapeTg(ev)}</i>`);
      return lines;
    });
    // Help text varies by content type so the operator knows what to
    // edit. Stories are wholly hand-written; announces lean on Sanity
    // record + angle; offers/intel use the angle field.
    const helpText =
      content_type === "story"
        ? "Edit your story body and try again. Common fix: split a sentence with two em-dashes into two sentences with commas."
        : content_type === "announcement"
          ? "Either fix the offending Sanity field on this yacht, or rewrite your angle, and try again."
          : "Adjust the angle / signal text and try again.";

    tg = await sendTelegramText(
      [
        `🛑 <b>DRAFT BLOCKED — ${stream} · ${content_type}</b>`,
        ``,
        `<b>Subject:</b> ${escapeTg(built.subject)}`,
        `<b>Audience:</b> ${audienceSize} subscribers (${stream})`,
        ``,
        `<b>Violations:</b>`,
        ...violationLines,
        ``,
        helpText,
      ].join("\n"),
    );
  } else {
    tg = await sendDraftApprovalCard({
      draft_id: draftId,
      stream,
      issue_number: issueNumber,
      subject: built.subject,
      audience_size: audienceSize,
      content_type,
      hero_image_url: built.hero_image_url ?? null,
      word_count: wc,
      reading_time_min: rt,
      voice_violations: validation.violations,
      voice_warnings: validation.warnings,
      // Update 2 — per-yacht "what NOT to say" guidance shows up in
      // the approval card so George sees it at review time.
      voice_notes: yacht?.voice_notes ?? null,
    });
  }

  if (tg?.message_id) {
    draft.telegram_message_id = tg.message_id;
    await kvSet(`draft:${draftId}`, JSON.stringify(draft));
  }

  return {
    stream,
    draft_id: draftId,
    issue_number: issueNumber,
    audience_size: audienceSize,
    word_count: wc,
    reading_time_min: rt,
    status: draft.status,
    violations: validation.violations,
    warnings: validation.warnings,
    telegram: tg,
  };
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const content_type = String(payload.content_type ?? "").trim();
  if (!content_type) {
    return NextResponse.json(
      { error: "content_type required" },
      { status: 400 },
    );
  }

  // Resolve audience via routing matrix.
  const requested = Array.isArray(payload.audience)
    ? payload.audience.filter((s) => STREAMS.includes(s))
    : [];
  if (requested.length === 0) {
    return NextResponse.json(
      { error: "audience required (at least one stream)" },
      { status: 400 },
    );
  }
  const routed = enforceRouting(content_type, requested);
  if (!routed.ok) {
    return NextResponse.json(
      { error: `unknown content_type: ${content_type}` },
      { status: 400 },
    );
  }
  if (routed.final_audience.length === 0) {
    return NextResponse.json(
      {
        error: "all requested streams blocked by routing matrix",
        refused: routed.refused,
        refusal_reasons: routed.refusal_reasons,
      },
      { status: 422 },
    );
  }

  // Type-specific slot validation.
  let yacht = null;
  let post = null;
  if (content_type === "announcement" || content_type === "offer") {
    if (payload.yacht_slug) {
      const r = await getYachtForNewsletter(payload.yacht_slug);
      if (!r.ok) {
        return NextResponse.json(
          { error: r.error },
          { status: content_type === "announcement" ? 404 : 400 },
        );
      }
      yacht = r.yacht;
    } else if (content_type === "announcement") {
      return NextResponse.json(
        { error: "yacht_slug required for announcement" },
        { status: 400 },
      );
    }
  } else if (content_type === "blog") {
    // Accept either:
    //   payload.post_url  — full or relative blog URL (preferred path)
    //   payload.post_slug — bare slug from the dropdown
    let resolvedSlug = null;
    if (payload.post_url) {
      resolvedSlug = slugFromBlogUrl(payload.post_url);
      if (!resolvedSlug) {
        return NextResponse.json(
          {
            error:
              "post_url not recognized. Use a full URL like " +
              "https://georgeyachts.com/blog/<slug> or just the slug.",
          },
          { status: 400 },
        );
      }
    } else if (payload.post_slug) {
      resolvedSlug = payload.post_slug;
    } else {
      return NextResponse.json(
        { error: "post_url or post_slug required for blog" },
        { status: 400 },
      );
    }
    const r = await getPostForNewsletter(resolvedSlug);
    if (!r.ok) {
      return NextResponse.json(
        { error: `${r.error} (resolved slug: ${resolvedSlug})` },
        { status: 404 },
      );
    }
    post = r.post;
  } else if (content_type === "story") {
    if (!payload.body_text || String(payload.body_text).trim().length < 40) {
      return NextResponse.json(
        { error: "body_text required for story (min 40 chars)" },
        { status: 400 },
      );
    }
  } else if (content_type === "intel") {
    if (!payload.signal_text || String(payload.signal_text).trim().length < 40) {
      return NextResponse.json(
        { error: "signal_text required for intel (min 40 chars)" },
        { status: 400 },
      );
    }
  }

  // Build one draft per surviving stream.
  const results = [];
  for (const stream of routed.final_audience) {
    try {
      const r = await buildOneDraft({
        stream,
        content_type,
        payload,
        yacht,
        post,
      });
      results.push(r);
    } catch (err) {
      results.push({
        stream,
        error: err?.message ?? String(err),
      });
    }
  }

  const okCount = results.filter((r) => r.status === "pending").length;
  const blockedCount = results.filter((r) => r.status === "blocked").length;
  const errorCount = results.filter((r) => r.error).length;

  return NextResponse.json({
    ok: errorCount === 0,
    content_type,
    requested_audience: requested,
    final_audience: routed.final_audience,
    refused: routed.refused,
    refusal_reasons: routed.refusal_reasons,
    drafts_created: okCount,
    drafts_blocked: blockedCount,
    errors: errorCount,
    results,
  });
}
