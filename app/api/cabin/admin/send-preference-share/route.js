// app/api/cabin/admin/send-preference-share/route.js
// =============================================================
// POST /api/cabin/admin/send-preference-share
//
// Called server-to-server from gy-command when George clicks
// "Share with the operating team" on a cabin's detail page.
// Mints one tokenised share URL per cabin (re-used for all
// recipients), then sends each recipient an email with that URL.
//
// Auth: x-cabin-admin-secret header.
//
// Body: {
//   cabin_id,
//   recipients: [{ email, name? }],
//   custom_message?,
//   from_broker?       // defaults to "George P. Biniaris"
// }
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { createShareToken } from "@/lib/cabin/share-tokens";
import { sendPreferenceShareEmail } from "@/lib/cabin/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cabin-admin-secret") === expected;
}

function publicOrigin(req) {
  // Honour the deployment's own origin so preview deploys email
  // links pointing at themselves rather than production.
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const cabinId = String(body?.cabin_id ?? "").trim();
  const recipients = Array.isArray(body?.recipients) ? body.recipients : [];
  const customMessage = String(body?.custom_message ?? "").slice(0, 2000);
  const fromBroker = String(body?.from_broker ?? "").trim() || "George P. Biniaris";

  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });
  }

  // Normalise recipients: drop empties, lowercase email, cap length.
  const clean = recipients
    .map((r) => ({
      email: String(r?.email ?? "").trim().toLowerCase(),
      name: String(r?.name ?? "").trim(),
    }))
    .filter((r) => r.email.includes("@"));

  if (clean.length === 0) {
    return NextResponse.json({ ok: false, error: "no-recipients" }, { status: 400 });
  }

  // Verify the cabin exists and pull enough fields for the email
  // subject + body. We don't disclose anything PII-sensitive in the
  // email — just vessel name and dates.
  const db = getCabinDb();
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select("id, vessel_name, charter_period_from, charter_period_to")
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!cabin) {
    return NextResponse.json({ ok: false, error: "cabin-not-found" }, { status: 404 });
  }

  // One token per share-action; all recipients get the same URL so
  // a reply-all chain stays coherent. The token records who it was
  // sent to so we have an audit trail later if needed.
  const sentTo = clean.map((r) => r.email);
  const { token } = await createShareToken({
    cabinId,
    createdByEmail: body?.created_by_email ?? null,
    sentTo,
  });
  const shareUrl = `${publicOrigin(req)}/cabin/share/${token}`;
  const charterDates =
    cabin.charter_period_from && cabin.charter_period_to
      ? `${fmtDate(cabin.charter_period_from)} – ${fmtDate(cabin.charter_period_to)}`
      : "";

  // Fan out to each recipient. We don't fail the request if a single
  // email fails — surface per-recipient status to the caller.
  const results = await Promise.all(
    clean.map(async (r) => {
      try {
        const res = await sendPreferenceShareEmail({
          to: r.email,
          recipientName: r.name || null,
          vesselName: cabin.vessel_name,
          charterDates,
          shareUrl,
          customMessage,
          fromBroker,
        });
        // sendPreferenceShareEmail returns the Resend response.
        // Surface success even if Resend rejected, so the caller
        // can show partial-success state cleanly.
        return { email: r.email, ok: Boolean(res?.id || res?.ok), error: null };
      } catch (err) {
        console.error("[send-preference-share] send failed:", r.email, err);
        return { email: r.email, ok: false, error: String(err?.message || err).slice(0, 200) };
      }
    }),
  );

  // Audit log row on the cabin for traceability.
  try {
    await dbQuery(
      db.from("cabin_audit_log").insert({
        cabin_id: cabinId,
        actor_email: body?.created_by_email ?? null,
        actor_role: "admin",
        action: "preference_share_sent",
        metadata: {
          token,
          recipients: results.map((r) => ({ email: r.email, ok: r.ok })),
          share_url: shareUrl,
        },
      }),
    );
  } catch (e) {
    console.warn("[send-preference-share] audit insert non-fatal:", e?.message);
  }

  return NextResponse.json({
    ok: true,
    share_url: shareUrl,
    token,
    results,
    sent_count: results.filter((r) => r.ok).length,
    failed_count: results.filter((r) => !r.ok).length,
  });
}
