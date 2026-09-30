// George's note for the next letter (2026-09-29). See lib/newsletter/desk-note.js.
//
//   GET    ?stream=bridge            read the stored note
//   POST   { stream, text }          store the approved text (validated first)
//   DELETE ?stream=bridge            clear it
//
// Auth: NEWSLETTER_PROXY_SECRET / NEWSLETTER_UNSUB_SECRET / CRON_SECRET.

import { NextResponse } from "next/server";
import { readDeskNote, writeDeskNote, clearDeskNote } from "@/lib/newsletter/desk-note";
import { validateNewsletterContent } from "@/lib/newsletter/validator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STREAMS = ["bridge", "wake"];

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

function streamOf(value) {
  const s = String(value ?? "").trim().toLowerCase();
  return STREAMS.includes(s) ? s : null;
}

export async function GET(request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const stream = streamOf(new URL(request.url).searchParams.get("stream"));
  if (!stream) return NextResponse.json({ error: "stream must be bridge or wake" }, { status: 400 });
  return NextResponse.json({ ok: true, stream, note: await readDeskNote(stream) });
}

export async function POST(request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const stream = streamOf(body?.stream);
  if (!stream) return NextResponse.json({ error: "stream must be bridge or wake" }, { status: 400 });
  const text = String(body?.text ?? "").trim();
  if (text.length < 40 || text.length > 1200) {
    return NextResponse.json({ error: "text must be 40 to 1200 characters" }, { status: 400 });
  }
  if (/[—–]/.test(text)) {
    return NextResponse.json({ error: "no long dashes in a letter" }, { status: 422 });
  }
  // The same gate the letter passes at send time, so a note that would
  // hold the issue back is refused now, while George is still here.
  const v = validateNewsletterContent({ body_text: text, subject: "", stream, content_type: "letter" });
  if (!v.ok) {
    return NextResponse.json({ error: "validator refused the note", violations: v.violations }, { status: 422 });
  }
  const note = await writeDeskNote(stream, text);
  return NextResponse.json({ ok: true, stream, note, warnings: v.warnings });
}

export async function DELETE(request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const stream = streamOf(new URL(request.url).searchParams.get("stream"));
  if (!stream) return NextResponse.json({ error: "stream must be bridge or wake" }, { status: 400 });
  await clearDeskNote(stream);
  return NextResponse.json({ ok: true, stream, cleared: true });
}
