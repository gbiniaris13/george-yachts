// app/api/cron/cabin-memory-anchors/route.js
// =============================================================
// Daily cron — processes due Memory Anchors.
//
// Vercel calls this at 06:00 UTC (see vercel.json crons). Picks
// up rows from cabin_memory_anchors where scheduled_for <= now()
// and status='scheduled', sends each email via Resend, marks
// sent. Hard-caps at 100 rows per run to stay well inside the
// Resend free tier (3000/month) and to avoid runaway invocations.
//
// Auth: header `Authorization: Bearer ${CRON_SECRET}` OR Vercel
// adds the `Vercel-Signature` itself; the existing cron-check
// pattern is `x-vercel-cron`.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { renderAnchorEmail } from "@/lib/cabin/anchors";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com/emails";
const FROM = process.env.CABIN_FROM_ADDRESS || "George Yachts <cabin@georgeyachts.com>";
const REPLY_TO = process.env.CABIN_REPLY_TO || "george@georgeyachts.com";
const PUBLIC_BASE = process.env.CABIN_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";

// 2026-06-01 — Brief 06 after-sales STEP 1 (empty-album guard).
// Anchors whose copy promises "your photos / the album are waiting".
// These must NEVER be sent to a cabin with an empty voyage album —
// "here are your photos" to an empty album is the one unforgivable
// after-sales email. day1_album is the headline case; the other three
// reference photos in the same way, so the same guard covers them.
const PHOTO_DEPENDENT = new Set([
  "day1_album",
  "day30_reminder",
  "month3_random_photo",
  "month6_random_photo",
]);

function authorized(req) {
  // Vercel marks cron requests with x-vercel-cron in production.
  if (req.headers.get("x-vercel-cron")) return true;
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // In production, refuse open access. A missing secret on the
    // public site is a misconfiguration, not an invitation for the
    // internet to trigger our email sender.
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${expected}`;
}

async function sendOne(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  const r = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Resend ${r.status}: ${text}`);
  }
  return r.json();
}

export async function GET(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getCabinDb();
  const due = await dbQuery(
    db.from("cabin_memory_anchors")
      .select("*, cabin:cabins!inner(id, vessel_name, principal_charterer_email)")
      .eq("status", "scheduled")
      .lte("scheduled_for", new Date().toISOString())
      .limit(100)
  );

  if (!due?.length) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  const results = [];
  for (const anchor of due) {
    const cabin = anchor.cabin;

    // Empty-album guard: never send a photo-promising anchor to a
    // cabin with no (non-redacted) voyage photos. Defer (leave it
    // scheduled so a later run sends it once photos exist); after a
    // 30-day grace the album moment has passed, so cancel rather than
    // retry forever.
    if (PHOTO_DEPENDENT.has(anchor.anchor_kind)) {
      const photos = await dbQuery(
        db.from("cabin_voyage_photos")
          .select("id")
          .eq("cabin_id", cabin.id)
          .is("redacted_at", null)
          .limit(1)
      );
      const hasPhotos = (photos?.length ?? 0) > 0;
      if (!hasPhotos) {
        const ageDays =
          (Date.now() - new Date(anchor.scheduled_for).getTime()) / 86400000;
        if (ageDays > 30) {
          await dbQuery(
            db.from("cabin_memory_anchors")
              .update({ status: "cancelled" })
              .eq("id", anchor.id)
          );
          results.push({ id: anchor.id, ok: false, reason: "empty-album-cancelled", kind: anchor.anchor_kind });
        } else {
          results.push({ id: anchor.id, ok: false, reason: "deferred-empty-album", kind: anchor.anchor_kind });
        }
        continue;
      }
    }

    const link = `${PUBLIC_BASE}/cabin`;
    const email = renderAnchorEmail(anchor, cabin, link);

    if (!email) {
      // Unknown kind — mark cancelled so we don't loop on it
      await dbQuery(
        db.from("cabin_memory_anchors")
          .update({ status: "cancelled" })
          .eq("id", anchor.id)
      );
      results.push({ id: anchor.id, ok: false, reason: "unknown-kind" });
      continue;
    }

    try {
      await sendOne({
        from: FROM,
        reply_to: REPLY_TO,
        to: [anchor.recipient_email],
        subject: email.subject,
        html: email.html,
        tags: [
          { name: "stream", value: "cabin" },
          { name: "purpose", value: "memory_anchor" },
          { name: "kind", value: anchor.anchor_kind },
        ],
      });

      await dbQuery(
        db.from("cabin_memory_anchors")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", anchor.id)
      );

      await writeAudit({
        cabinId: cabin.id,
        actorEmail: "system",
        actorRole: "system",
        action: AUDIT_ACTIONS.MEMORY_ANCHOR_SENT,
        metadata: { anchor_id: anchor.id, kind: anchor.anchor_kind, to: anchor.recipient_email },
      });

      results.push({ id: anchor.id, ok: true });
    } catch (err) {
      console.error("[memory-anchor] send error:", err);
      results.push({ id: anchor.id, ok: false, reason: err.message });
      // Leave row scheduled — next cron run will retry
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    details: results.slice(0, 10),
  });
}
