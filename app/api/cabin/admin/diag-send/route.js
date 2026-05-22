// app/api/cabin/admin/diag-send/route.js
// =============================================================
// TEMPORARY diagnostic endpoint — 2026-05-22
//
// Purpose: surface the actual Resend exception so we can identify
// why CRM "Send invite" silently fails to deliver. Returns the
// verbatim error message + memberships count + send-attempt
// result. To be removed once root cause is fixed.
//
// Restricted to a single hard-coded test email
// (george@georgeyachts.com) so the endpoint cannot be abused to
// spam arbitrary recipients. No input required — POST with empty
// body to fire.
// =============================================================

import { NextResponse } from "next/server";
import { findMembershipsForEmail } from "@/lib/cabin/auth";
import { sendMagicLinkEmail } from "@/lib/cabin/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIAG_EMAIL = "george@georgeyachts.com";

export async function POST() {
  const result = {
    email: DIAG_EMAIL,
    env: {
      has_resend_key: Boolean(process.env.RESEND_API_KEY),
      resend_key_length: process.env.RESEND_API_KEY?.length || 0,
      cabin_from_address: process.env.CABIN_FROM_ADDRESS || "<default>",
      cabin_reply_to: process.env.CABIN_REPLY_TO || "<default>",
      cabin_public_url: process.env.CABIN_PUBLIC_URL || "<default>",
      node_env: process.env.NODE_ENV,
    },
    memberships_count: null,
    membership_email_found: null,
    resend_attempt: {
      ok: false,
      error: null,
      stack: null,
    },
  };

  try {
    const memberships = await findMembershipsForEmail(DIAG_EMAIL);
    result.memberships_count = memberships.length;
    result.membership_email_found = memberships[0]?.email || null;
  } catch (err) {
    result.memberships_error = String(err?.message || err);
  }

  try {
    await sendMagicLinkEmail({
      to: DIAG_EMAIL,
      displayName: "Diagnostic",
      vesselName: "DIAG-SEND",
      fromDate: "2026-01-01",
      toDate: "2026-01-08",
      link: `https://georgeyachts.com/cabin/login?diag=1`,
    });
    result.resend_attempt.ok = true;
  } catch (err) {
    result.resend_attempt.error = String(err?.message || err);
    result.resend_attempt.stack = err?.stack ? String(err.stack).slice(0, 800) : null;
  }

  return NextResponse.json(result);
}
