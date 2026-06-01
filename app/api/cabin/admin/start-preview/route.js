// app/api/cabin/admin/start-preview/route.js
// =============================================================
// 2026-05-21 — George's "Preview as customer" request.
//
// Mints a SHORT-LIVED preview session (15 min) for the given
// cabin's principal charterer, returning a one-shot landing URL
// the CRM can open in a new tab. The recipient is the admin,
// not the customer — the principal's email is NEVER notified.
//
// The session blob is the same shape as a real cabin session, so
// every layout/page reads it transparently. Two safety flags:
//   • preview_mode: true        — read by CabinShell to render
//                                 a permanent banner.
//   • preview_admin_email       — recorded in audit + visible in
//                                 the banner copy.
//
// A second cookie `gy_cabin_preview = <token>` is set so edge
// middleware can reject writes without a KV lookup.
//
// Body:    { cabin_id }
// Headers: x-cabin-admin-secret
// Returns: { ok, token, expires, ttl_seconds, url }
//          where url is /cabin/admin/enter-preview?token=…
//          (the landing page that sets the cookie and redirects).
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { createPreviewSession } from "@/lib/cabin/auth";
import { writeAudit } from "@/lib/cabin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  const adminEmail = body?.admin_email || null;
  // 2026-05-27 — Brief 06 (#3): optional "preview as guest". When
  // as_member_id is supplied the preview session "is" THAT member
  // (any role) instead of the principal, so the operator can see
  // exactly what a given guest sees — the read-only brief, their
  // own Crew List, the guest done-state. Omitted → unchanged
  // behaviour: preview as the principal charterer (back-compat).
  const asMemberId = body?.as_member_id || null;
  if (!cabinId) {
    return NextResponse.json(
      { ok: false, error: "cabin_id-required" },
      { status: 400 },
    );
  }

  // Resolve the member the preview session "is". The session
  // mirrors that person — same memberships, role resolution, and
  // viewer-display-name — so the admin sees exactly what they see.
  const db = getCabinDb();
  const memberSelect =
    "id, email, role, display_name, assists_member_id, cabin_id";
  let target;
  if (asMemberId) {
    // Preview-as-guest: look the member up by id, SCOPED to this
    // cabin so a stray id from another cabin can't be targeted.
    target = await dbQuery(
      db
        .from("cabin_members")
        .select(memberSelect)
        .eq("cabin_id", cabinId)
        .eq("id", asMemberId)
        .is("deleted_at", null)
        .maybeSingle(),
    );
    if (!target) {
      return NextResponse.json(
        { ok: false, error: "member-not-found" },
        { status: 404 },
      );
    }
  } else {
    // Default (original behaviour): the principal charterer.
    target = await dbQuery(
      db
        .from("cabin_members")
        .select(memberSelect)
        .eq("cabin_id", cabinId)
        .eq("role", "principal_charterer")
        .is("deleted_at", null)
        .maybeSingle(),
    );
    if (!target) {
      return NextResponse.json(
        { ok: false, error: "no-principal-found" },
        { status: 404 },
      );
    }
  }

  // The session blob expects "memberships" — one entry, pinned
  // to this cabin so pickActiveCabinId resolves correctly.
  const { token, ttl_seconds } = await createPreviewSession({
    email: target.email,
    memberships: [
      {
        cabin_id: target.cabin_id,
        role: target.role,
        id: target.id,
        assists_member_id: target.assists_member_id,
      },
    ],
    activeCabinId: cabinId,
    adminEmail,
  });

  // Audit — admins viewing customer-private data should leave
  // a trail. Re-use CONSENT_CHANGED's actor format (admin role).
  try {
    await writeAudit({
      cabinId,
      actorEmail: adminEmail || "admin",
      actorRole: "admin",
      action: "admin_preview_session_created",
      metadata: {
        preview_target_email: target.email,
        preview_target_role: target.role,
        preview_target_member_id: target.id,
        ttl_seconds,
      },
    });
  } catch {
    // Audit failure must not block preview — the trail is nice
    // to have, the preview itself is the actual request.
  }

  const origin =
    process.env.CABIN_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;
  const url = `${origin}/api/cabin/admin/enter-preview?token=${encodeURIComponent(token)}`;
  const expires = Date.now() + ttl_seconds * 1000;

  return NextResponse.json({
    ok: true,
    token,
    expires,
    ttl_seconds,
    url,
  });
}
