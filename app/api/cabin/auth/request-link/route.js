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
  // 2026-05-22 — Admin-aware response.
  // The public surface always returns 200 + ok:true regardless of
  // whether the address is a real cabin member (account-enumeration
  // defence). But when the CRM calls this endpoint with the shared
  // CABIN_ADMIN_SECRET, the operator needs the TRUTH back —
  // otherwise the "Send invite" button lies when Resend rejects.
  // adminMode flips the response shape: { ok, mailed, error? }.
  const adminSecret = process.env.CABIN_ADMIN_SECRET;
  const authz = req.headers.get("authorization") || "";
  const adminMode =
    adminSecret && authz === `Bearer ${adminSecret}`;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase();
  // Optional: the CRM passes this when sending an invite from a
  // specific cabin's detail page, so the magic link pins that
  // cabin as active. Validated below against actual memberships.
  const targetCabinId = body?.cabin_id ? String(body.cabin_id).trim() : null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Find any cabin membership for this email
  let memberships = [];
  try {
    memberships = await findMembershipsForEmail(email);
  } catch (err) {
    console.error("[cabin/request-link] DB error:", err);
    if (adminMode) {
      return NextResponse.json(
        { ok: false, mailed: false, error: `db-error: ${err?.message || err}` },
        { status: 500 },
      );
    }
    // Don't leak — still return 200 to client
    return NextResponse.json({ ok: true });
  }

  if (memberships.length === 0) {
    if (adminMode) {
      return NextResponse.json({
        ok: true,
        mailed: false,
        error: "no-membership-for-email",
      });
    }
    // No membership — pretend success. Don't email anyone.
    return NextResponse.json({ ok: true });
  }

  // Pick the cabin to message about. If the CRM specified a
  // targetCabinId AND the email is actually a member of that
  // cabin, use it. Otherwise fall back to the heuristic
  // (active → invited → first sorted = most upcoming).
  const targeted =
    targetCabinId
      ? memberships.find((m) => m.cabin_id === targetCabinId)
      : null;
  const primary =
    targeted ??
    memberships.find((m) => m.cabin?.status === "active") ??
    memberships.find((m) => m.cabin?.status === "invited") ??
    memberships[0];

  // Only carry the pin through the OTP if it actually resolved to
  // a real membership. Otherwise the verify route will silently
  // drop it anyway, but we'd rather not write garbage to KV.
  const pinnedCabinId = targeted ? targetCabinId : null;

  let mailed = false;
  let sendError = null;
  try {
    const otp = await createMagicLinkOtp(email, pinnedCabinId);
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
      mailed = true; // dev mode counts as delivered for adminMode response
    } else {
      await sendMagicLinkEmail({
        to: email,
        displayName: primary?.display_name,
        vesselName: primary?.cabin?.vessel_name ?? "your charter",
        fromDate: primary?.cabin?.charter_period_from ?? "",
        toDate: primary?.cabin?.charter_period_to ?? "",
        link,
      });
      mailed = true;
    }

    await writeAudit({
      cabinId: primary?.cabin?.id ?? null,
      actorEmail: email,
      actorRole: primary?.role ?? "charterer",
      action: AUDIT_ACTIONS.MAGIC_LINK_REQUESTED,
      metadata: { memberships_count: memberships.length },
    });
  } catch (err) {
    // 2026-05-22 — Verbose error logging so the actual Resend
    // failure surfaces in Vercel logs. Without this, the previous
    // silent-catch swallowed every send error and the CRM's
    // "✓ sent" UI lied to George.
    sendError = err?.message || String(err);
    console.error(
      "[cabin/request-link] send error:",
      sendError,
      err?.stack ? `\n${err.stack}` : "",
    );
  }

  if (adminMode) {
    return NextResponse.json({
      ok: true,
      mailed,
      ...(sendError ? { error: sendError } : {}),
    });
  }
  // Public callers always get the enumeration-safe 200/ok response.
  return NextResponse.json({ ok: true });
}
