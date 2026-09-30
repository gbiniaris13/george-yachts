// What the next letter would be (2026-09-29).
//
// Runs the same selection, loaders, assembler and validator as the
// scheduled send, but creates no draft, burns no issue number and marks
// nothing shown. Used to show George the issue before it goes, and to
// verify a build locally before the push.
//
//   GET ?stream=bridge            JSON: plan, subject, preheader, body, validation
//   GET ?stream=bridge&html=1     the rendered email itself
//   &variant=single               skip the fleet list, show the one-yacht shape
//   &note=<text>                  preview with this desk note (not stored)
//
// Auth: NEWSLETTER_PROXY_SECRET / NEWSLETTER_UNSUB_SECRET / CRON_SECRET.

import { NextResponse } from "next/server";
import { selectLetterForStream } from "@/lib/newsletter/content-selector";
import {
  getYachtForLetter,
  getYachtsForFleetUpdate,
  getPostForNewsletter,
} from "@/lib/newsletter/sanity-yachts";
import { assembleBody } from "@/lib/newsletter/body-assembler";
import { validateNewsletterContent } from "@/lib/newsletter/validator";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";
import { readDeskNote } from "@/lib/newsletter/desk-note";
import { unsubscribeUrlFor } from "@/lib/newsletter/resend";
import { shouldFireToday } from "@/lib/newsletter/auto-cadence";
import { kvGet } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

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

export async function GET(request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const stream = String(url.searchParams.get("stream") ?? "bridge").toLowerCase();
  if (!["bridge", "wake"].includes(stream)) {
    return NextResponse.json({ error: "stream must be bridge or wake" }, { status: 400 });
  }
  const wantHtml = url.searchParams.get("html") === "1";
  const singleOnly = url.searchParams.get("variant") === "single";
  const noteParam = String(url.searchParams.get("note") ?? "").trim();

  const sel = await selectLetterForStream(stream, new Date(), { singleOnly });
  if (!sel.ok) return NextResponse.json({ ok: false, stream, reason: sel.reason }, { status: 200 });
  const { plan } = sel;

  let yacht = null;
  let yachts = null;
  let post = null;
  if (plan.yacht_slugs?.length) {
    const r = await getYachtsForFleetUpdate(plan.yacht_slugs);
    if (!r.ok || r.yachts.length !== plan.yacht_slugs.length) {
      return NextResponse.json({ ok: false, stream, plan, error: r.error || "a yacht in the plan is not cleared" }, { status: 200 });
    }
    yachts = r.yachts;
  } else if (plan.yacht_slug) {
    const r = await getYachtForLetter(plan.yacht_slug);
    if (!r.ok) return NextResponse.json({ ok: false, stream, plan, error: r.error }, { status: 200 });
    yacht = r.yacht;
  }
  if (plan.post_slug) {
    const r = await getPostForNewsletter(plan.post_slug);
    if (r.ok) post = r.post;
  }
  const deskNote = noteParam
    ? { text: noteParam, approved_at: null, preview_only: true }
    : await readDeskNote(stream);

  const built = assembleBody({
    content_type: "letter",
    stream,
    yacht,
    yachts,
    post,
    desk_note: deskNote?.text ?? null,
    yacht_is_new: plan.yacht_is_new === true,
  });
  const validation = validateNewsletterContent({
    body_text: built.body_text,
    subject: built.subject,
    stream,
    content_type: "letter",
  });
  const email = buildNewsletterEmail({
    stream,
    subject: built.subject,
    preheader: built.preheader,
    body_text: built.body_text,
    hero_image_url: built.hero_image_url,
    unsubscribe_url: unsubscribeUrlFor("george@georgeyachts.com", { list: stream }),
  });

  if (wantHtml) {
    return new Response(email.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  let lastSent = null;
  try {
    lastSent = await kvGet(`last_send_at:${stream}`);
  } catch {
    /* preview only */
  }
  return NextResponse.json({
    ok: validation.ok,
    stream,
    gate: shouldFireToday(new Date(), lastSent ? String(lastSent) : null),
    plan,
    desk_note: deskNote,
    subject: built.subject,
    preheader: built.preheader,
    hero_image_url: built.hero_image_url,
    hero_withheld: post?.hero_withheld === true,
    body_text: built.body_text,
    text: email.text,
    validation,
  });
}
