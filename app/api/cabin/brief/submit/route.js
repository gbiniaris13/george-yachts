// app/api/cabin/brief/submit/route.js
// =============================================================
// POST /api/cabin/brief/submit
//
// Charterer-initiated "I'm done with the brief" action. Stamps
// cabins.brief_submitted_at, flips status from invited/active to
// active (no-op if already), and writes an audit row.
//
// Idempotent — repeat calls are safe and return ok.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { notifyGeorge } from "@/lib/cabin/notify";
import { sendBriefSubmittedEmail } from "@/lib/cabin/email";

export const runtime = "nodejs";

export async function POST() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });

  // 2026-05-22 — Only the principal charterer can ship the brief.
  // Assistants and guests can collaboratively edit any section
  // (asynchronous group brief), but the moment-of-submission gate
  // belongs to the person paying for the trip. They take final
  // responsibility for what the captain receives.
  if (member.role !== "principal_charterer") {
    return NextResponse.json(
      {
        ok: false,
        error: "only-principal",
        message:
          "Only the principal charterer can send the brief to George.",
      },
      { status: 403 },
    );
  }

  const db = getCabinDb();

  // Idempotent — if the brief is already with George, return the
  // existing submission rather than firing another notification.
  const existing = await dbQuery(
    db
      .from("cabins")
      .select(
        "id, vessel_name, principal_charterer_name, charter_period_from, charter_period_to, brief_submitted_at, brief_completion_percent",
      )
      .eq("id", cabinId)
      .maybeSingle(),
  );
  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "no-cabin" },
      { status: 404 },
    );
  }
  if (existing.brief_submitted_at) {
    return NextResponse.json({
      ok: true,
      already_submitted: true,
      submitted_at: existing.brief_submitted_at,
    });
  }

  const submittedAt = new Date().toISOString();

  await dbQuery(
    db.from("cabins")
      .update({
        brief_submitted_at: submittedAt,
        // 2026-05-22 — Track the member id who pressed Submit so
        // the CRM can show "Submitted by Patricia · 22 May 14:18"
        // instead of inferring from the email alone.
        brief_submitted_by_member_id: member.member_id,
        status: "active",
        // Charterer self-confirm also clears any leftover concierge
        // banner — they've taken ownership.
        concierge_mode_active: false,
        concierge_mode_activated_at: null,
        concierge_mode_activated_by_email: null,
      })
      .eq("id", cabinId)
  );

  try {
    await writeAudit({
      cabinId,
      actorEmail: session.email,
      actorRole: member.role,
      action: AUDIT_ACTIONS.BRIEF_SUBMITTED,
      metadata: {
        via: "self-submit",
        completion_percent: existing.brief_completion_percent ?? null,
      },
    });
  } catch (auditErr) {
    console.warn("[cabin/brief/submit] audit write failed:", auditErr);
  }

  // ----- Notifications to George — Telegram + email -----
  // Both best-effort. The submission has ALREADY been recorded —
  // a failed nudge must not block the client's response.

  void notifyGeorge({
    icon: "✅",
    title: "Charter Brief submitted",
    lines: [
      `From: ${existing.principal_charterer_name ?? session.email}`,
      `Re: ${existing.vessel_name ?? "—"}`,
      existing.charter_period_from && existing.charter_period_to
        ? `Dates: ${existing.charter_period_from} → ${existing.charter_period_to}`
        : null,
    ],
    link: `/dashboard/cabins/${cabinId}`,
  });

  const brokerEmail = process.env.BROKER_EMAIL || "george@georgeyachts.com";
  const crmBase =
    process.env.GY_COMMAND_URL || "https://command.georgeyachts.com";
  void (async () => {
    try {
      await sendBriefSubmittedEmail({
        to: brokerEmail,
        vesselName: existing.vessel_name,
        charterer: existing.principal_charterer_name || session.email,
        from: existing.charter_period_from,
        to_date: existing.charter_period_to,
        submittedAt,
        cabinUrl: `${crmBase}/dashboard/cabins/${cabinId}`,
      });
    } catch (mailErr) {
      console.warn(
        "[cabin/brief/submit] Resend send failed (non-fatal):",
        mailErr,
      );
    }
  })();

  return NextResponse.json({
    ok: true,
    submitted_at: submittedAt,
  });
}
