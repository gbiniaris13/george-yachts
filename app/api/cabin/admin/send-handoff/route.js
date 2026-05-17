// app/api/cabin/admin/send-handoff/route.js
// =============================================================
// Admin endpoint — sends the "your Cabin is prepared for review"
// email to the principal charterer (concierge handoff).
//
// Body:  { cabin_id }
// Auth:  x-cabin-admin-secret
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { sendConciergeHandoffEmail } from "@/lib/cabin/email";
import { createMagicLinkOtp } from "@/lib/cabin/auth";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 400 });

  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("principal_charterer_email, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });

  const origin = process.env.CABIN_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;

  try {
    const otp = await createMagicLinkOtp(cabin.principal_charterer_email);
    const link = `${origin}/api/cabin/auth/verify?token=${encodeURIComponent(otp)}`;
    await sendConciergeHandoffEmail({
      to: cabin.principal_charterer_email,
      displayName: cabin.principal_charterer_name,
      link,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  await writeAudit({
    cabinId,
    actorEmail: "admin",
    actorRole: "admin",
    action: AUDIT_ACTIONS.CONCIERGE_SENT_FOR_REVIEW,
    metadata: { to: cabin.principal_charterer_email },
  });

  return NextResponse.json({ ok: true });
}
