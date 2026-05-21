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
  if (!cabinId) {
    return NextResponse.json(
      { ok: false, error: "cabin_id-required" },
      { status: 400 },
    );
  }

  // Look up the principal charterer. The preview session "is"
  // that person — same memberships, same role resolution, same
  // viewer-display-name. That guarantees the admin sees exactly
  // what the principal will see (e.g. their own first name in
  // the header chip, the correct guest list, the same banner
  // toggles).
  const db = getCabinDb();
  const principal = await dbQuery(
    db
      .from("cabin_members")
      .select("id, email, role, display_name, assists_member_id, cabin_id")
      .eq("cabin_id", cabinId)
      .eq("role", "principal_charterer")
      .is("deleted_at", null)
      .maybeSingle(),
  );

  if (!principal) {
    return NextResponse.json(
      { ok: false, error: "no-principal-found" },
      { status: 404 },
    );
  }

  // The session blob expects "memberships" — one entry, pinned
  // to this cabin so pickActiveCabinId resolves correctly.
  const { token, ttl_seconds } = await createPreviewSession({
    email: principal.email,
    memberships: [
      {
        cabin_id: principal.cabin_id,
        role: principal.role,
        id: principal.id,
        assists_member_id: principal.assists_member_id,
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
        preview_target_email: principal.email,
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
