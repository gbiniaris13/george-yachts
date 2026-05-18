// app/api/cabin/auth/request-link/route.js
// =============================================================
// POST /api/cabin/auth/request-link
//
// Body: { email }
//
// Always returns 200 to avoid leaking which emails are
// registered as cabin members (account-enumeration defence).
// If the email matches a member, we send a magic link.
// =============================================================

import { NextResponse } from "next/server";
import {
  createMagicLinkOtp,
  findMembershipsForEmail,
} from "@/lib/cabin/auth";
import { sendMagicLinkEmail } from "@/lib/cabin/email";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const runtime = "nodejs";

function publicOrigin(req) {
  // Trust the request's own origin so localhost dev and production
  // share the same code path.
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Find any cabin membership for this email
  let memberships = [];
  try {
    memberships = await findMembershipsForEmail(email);
  } catch (err) {
    console.error("[cabin/request-link] DB error:", err);
    // Don't leak — still return 200 to client
    return NextResponse.json({ ok: true });
  }

  if (memberships.length === 0) {
    // No membership — pretend success. Don't email anyone.
    return NextResponse.json({ ok: true });
  }

  // Pick the most-immediate cabin to message about (active first,
  // then upcoming, then most-recent).
  const primary =
    memberships.find((m) => m.cabin?.status === "active") ??
    memberships.find((m) => m.cabin?.status === "invited") ??
    memberships[0];

  try {
    const otp = await createMagicLinkOtp(email);
    const origin = publicOrigin(req);
    const link = `${origin}/api/cabin/auth/verify?token=${encodeURIComponent(
      otp
    )}`;

    // In local dev WITHOUT a Resend key set, print the link to the
    // server console so we can still walk through the flow without
    // depending on email delivery. Production always uses email.
    if (process.env.NODE_ENV !== "production" && !process.env.RESEND_API_KEY) {
      console.log("\n\n==============================================");
      console.log("CABIN MAGIC LINK (dev mode, no email):");
      console.log(link);
      console.log("==============================================\n\n");
    } else {
      await sendMagicLinkEmail({
        to: email,
        displayName: primary?.display_name,
        vesselName: primary?.cabin?.vessel_name ?? "your charter",
        fromDate: primary?.cabin?.charter_period_from ?? "",
        toDate: primary?.cabin?.charter_period_to ?? "",
        link,
      });
    }

    await writeAudit({
      cabinId: primary?.cabin?.id ?? null,
      actorEmail: email,
      actorRole: primary?.role ?? "charterer",
      action: AUDIT_ACTIONS.MAGIC_LINK_REQUESTED,
      metadata: { memberships_count: memberships.length },
    });
  } catch (err) {
    console.error("[cabin/request-link] send error:", err);
    // Still 200 — UI doesn't differentiate; we'll see the error in logs
  }

  return NextResponse.json({ ok: true });
}
