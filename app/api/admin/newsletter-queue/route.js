// Update 3 §2 — Wake / Compass intel queue admin endpoint.
//
// One handler, GET for list, POST for mutations. The CRM dashboard
// calls this through its server-side proxy (NEWSLETTER_PROXY_SECRET);
// crons call it directly with CRON_SECRET when popping the oldest
// pending entry.
//
// Routes:
//
//   GET  /api/admin/newsletter-queue?stream=wake[&status=pending]
//                                                   list entries
//
//   POST /api/admin/newsletter-queue
//        body: { action: "add",     stream, text, notes? }
//        body: { action: "edit",    stream, id, text?, notes? }
//        body: { action: "discard", stream, id }
//        body: { action: "delete",  stream, id }   (hard delete)
//
// Validation:
//   - stream ∈ { "wake", "compass" } enforced in lib/intel-queue.js
//   - text minimum 10 chars
//   - banned phrases / em-dash overuse are NOT validated here — the
//     full §13 + Update 2 §5.1 check runs at compose time, when the
//     cron picks the entry and assembles the body. Letting partial
//     drafts live in the queue lets George iterate.

import { NextResponse } from "next/server";
import {
  addQueueEntry,
  listQueueEntries,
  discardEntry,
  editEntry,
  deleteEntry,
  pendingCount,
} from "@/lib/newsletter/intel-queue";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const stream = url.searchParams.get("stream");
  const status = url.searchParams.get("status");
  if (!stream) {
    return NextResponse.json(
      { error: "stream query param required" },
      { status: 400 },
    );
  }
  try {
    const [entries, pending] = await Promise.all([
      listQueueEntries({ stream, status }),
      pendingCount(stream),
    ]);
    return NextResponse.json({
      ok: true,
      stream,
      filter_status: status ?? null,
      pending_count: pending,
      entries,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "list failed" },
      { status: 400 },
    );
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
  const action = String(body?.action ?? "");
  const stream = String(body?.stream ?? "");

  try {
    if (action === "add") {
      const e = await addQueueEntry({
        stream,
        text: body.text,
        notes: body.notes ?? null,
      });
      return NextResponse.json({ ok: true, action, entry: e });
    }
    if (action === "discard") {
      const e = await discardEntry({ stream, id: body.id });
      if (!e) return NextResponse.json({ error: "not_found" }, { status: 404 });
      return NextResponse.json({ ok: true, action, entry: e });
    }
    if (action === "edit") {
      const e = await editEntry({
        stream,
        id: body.id,
        text: body.text,
        notes: body.notes,
      });
      if (!e) return NextResponse.json({ error: "not_found" }, { status: 404 });
      return NextResponse.json({ ok: true, action, entry: e });
    }
    if (action === "delete") {
      await deleteEntry({ stream, id: body.id });
      return NextResponse.json({ ok: true, action });
    }
    return NextResponse.json(
      { error: `unknown action: ${action}` },
      { status: 400 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "queue op failed" },
      { status: 400 },
    );
  }
}
