// app/api/cabin/auth/verify/route.js
// =============================================================
// GET /api/cabin/auth/verify?token=…
//
// Magic-link callback. Consumes the OTP from KV, looks up the
// email's cabin memberships, creates a session, sets the cookie,
// redirects to /cabin.
// =============================================================

import { NextResponse } from "next/server";
import {
  consumeMagicLinkOtp,
  findMembershipsForEmail,
  createSession,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/cabin/auth";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { getCabinDb } from "@/lib/cabin/supabase";

export const runtime = "nodejs";

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/cabin/login?e=missing", req.url)
    );
  }

  const otp = await consumeMagicLinkOtp(token);
  if (!otp) {
    return NextResponse.redirect(
      new URL("/cabin/login?e=expired", req.url)
    );
  }

  const memberships = await findMembershipsForEmail(otp.email);
  if (!memberships.length) {
    return NextResponse.redirect(
      new URL("/cabin/login?e=unknown", req.url)
    );
  }

  const { token: sessionToken } = await createSession({
    email: otp.email,
    memberships,
  });

  // Stamp last_login_at on each membership
  try {
    const db = getCabinDb();
    await db
      .from("cabin_members")
      .update({ last_login_at: new Date().toISOString() })
      .in(
        "id",
        memberships.map((m) => m.id)
      );
  } catch (err) {
    console.error("[cabin/verify] stamp login error:", err);
  }

  await writeAudit({
    cabinId: memberships[0].cabin_id,
    actorEmail: otp.email,
    actorRole: memberships[0].role,
    action: AUDIT_ACTIONS.MAGIC_LINK_VERIFIED,
    metadata: { memberships_count: memberships.length },
  });

  const res = NextResponse.redirect(new URL("/cabin", req.url));
  res.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
  return res;
}
