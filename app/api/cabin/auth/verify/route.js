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
  // The whole handler is wrapped so a transient Supabase/KV error at
  // the exact moment the client clicks their invite renders the
  // friendly login page with a retry path — not a raw Next.js 500.
  // That click is often the client's very first contact with the
  // product; request-link already degrades gracefully, verify didn't.
  try {
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
      // The CRM may have pinned a specific cabin when it sent the
      // invite (e.g. George opened cabin X's detail page → "Send
      // invite"). Honour the pin so the recipient lands on that
      // cabin, not whatever sorts first.
      activeCabinId: otp.target_cabin_id || null,
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

    try {
      await writeAudit({
        cabinId: memberships[0].cabin_id,
        actorEmail: otp.email,
        actorRole: memberships[0].role,
        action: AUDIT_ACTIONS.MAGIC_LINK_VERIFIED,
        metadata: { memberships_count: memberships.length },
      });
    } catch (err) {
      // The audit trail must never cost the client their sign-in.
      console.error("[cabin/verify] audit error:", err);
    }

    const res = NextResponse.redirect(new URL("/cabin", req.url));
    res.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[cabin/verify] error:", err);
    return NextResponse.redirect(new URL("/cabin/login?e=retry", req.url));
  }
}
