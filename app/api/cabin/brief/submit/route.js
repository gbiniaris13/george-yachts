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

  // 2026-05-22 — Submission gate: principal charterer OR a
  // cabin_member the principal has explicitly elevated to
  // is_brief_admin = true via /api/cabin/delegate-brief-admin.
  // Guests and assistants without that flag cannot ship the
  // brief — they can edit any section, but the final send-to-
  // George moment belongs to the principal or their nominated
  // delegate.
  const db = getCabinDb();
  let isAuthorized = member.role === "principal_charterer";
  if (!isAuthorized) {
    const memberRow = await dbQuery(
      db
        .from("cabin_members")
        .select("is_brief_admin")
        .eq("id", member.member_id)
        .maybeSingle(),
    );
    isAuthorized = Boolean(memberRow?.is_brief_admin);
  }
  if (!isAuthorized) {
    return NextResponse.json(
      {
        ok: false,
        error: "not-authorised",
        message:
          "Only the principal charterer or a delegated brief admin can send the brief to George.",
      },
      { status: 403 },
    );
  }

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

  // 2026-05-22 — HARD crew-list gate. Per George: the brief cannot
  // be locked until every non-opted-out cabin member has finished
  // their port-authority essentials (date of birth, gender,
  // nationality, ID/passport, mobile). The UI hard-disables the
  // Send button on /cabin/brief/review, but defence in depth: also
  // reject server-side so a curl can't bypass it.
  const allActiveMembers = await dbQuery(
    db
      .from("cabin_members")
      .select(
        "id, display_name, email, role, personal_details_completed_at, brief_participation_opt_out_at, brief_confirmed_at",
      )
      .eq("cabin_id", cabinId)
      .is("deleted_at", null),
  );
  const stillOweCrewList = (allActiveMembers ?? []).filter(
    (m) =>
      !m.brief_participation_opt_out_at &&
      !m.personal_details_completed_at,
  );
  if (stillOweCrewList.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "crew-list-incomplete",
        message:
          "The brief cannot be sent until every member of the group has finished their Crew List essentials.",
        pending_count: stillOweCrewList.length,
        pending: stillOweCrewList.map((m) => ({
          name: m.display_name || m.email,
          role: m.role,
        })),
      },
      { status: 409 },
    );
  }

  // 2026-05-24 — HARD brief-confirmation gate. Every non-opted-
  // out member must have pressed Confirm on /cabin/brief.
  const stillOweBriefConfirm = (allActiveMembers ?? []).filter(
    (m) =>
      !m.brief_participation_opt_out_at &&
      !m.brief_confirmed_at,
  );
  if (stillOweBriefConfirm.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "brief-confirmation-incomplete",
        message:
          "The brief cannot be sent until every member has pressed Confirm on their brief picks.",
        pending_count: stillOweBriefConfirm.length,
        pending: stillOweBriefConfirm.map((m) => ({
          name: m.display_name || m.email,
          role: m.role,
        })),
      },
      { status: 409 },
    );
  }

  // 2026-05-24 — HARD brief-sections gate. Per George friend test
  // 4 final: "και στα ποτά και στα crew list και στα φαγητά."
  // Every visible brief section must be marked completed before
  // the brief locks. UI hard-disables the Send button too; this
  // is the defence-in-depth so a curl can't bypass.
  const REQUIRED_SECTION_KEYS = [
    "arrival",
    "guests",
    "health",
    "itinerary",
    "life_aboard",
    "dining",
    "beverages",
  ];
  const sectionsRows = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("section_key, completed")
      .eq("cabin_id", cabinId)
      .in("section_key", REQUIRED_SECTION_KEYS),
  );
  const completedKeys = new Set(
    (sectionsRows ?? [])
      .filter((s) => s.completed)
      .map((s) => s.section_key),
  );
  const missingSections = REQUIRED_SECTION_KEYS.filter(
    (k) => !completedKeys.has(k),
  );
  if (missingSections.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "brief-sections-incomplete",
        message:
          "The brief cannot be sent until every section (dining, beverages, health, itinerary, etc.) is marked complete.",
        missing_sections: missingSections,
      },
      { status: 409 },
    );
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

  // 2026-05-23 — SHARED BRIEF MODEL: the canonical brief now
  // contains everyone's edits (last-edit wins, attributed). We
  // only need to pull the wishlist items here — they're the one
  // truly per-member additive surface, and George wants them
  // surfaced explicitly so the hostess can shop them.
  const wishlistRows = await dbQuery(
    db
      .from("cabin_brief_wishlist_items")
      .select("section_key, label, quantity, notes, added_by_member_id, added_at")
      .eq("cabin_id", cabinId)
      .order("added_at", { ascending: false }),
  );

  const contributorIds = new Set();
  for (const w of wishlistRows ?? []) {
    if (w.added_by_member_id) contributorIds.add(w.added_by_member_id);
  }
  let contributorNameById = {};
  if (contributorIds.size > 0) {
    const nameRows = await dbQuery(
      db
        .from("cabin_members")
        .select("id, display_name, email")
        .in("id", Array.from(contributorIds)),
    );
    contributorNameById = Object.fromEntries(
      (nameRows ?? []).map((m) => [
        m.id,
        m.display_name || m.email || "(member)",
      ]),
    );
  }

  // Bundle wishlist items per section as a single pseudo-voice
  // each so the existing sendBriefSubmittedEmail "voices" UI
  // renders them as bullet lists. The shape stays the same as
  // before — the absence of per-member contributions just means
  // fewer voices.
  const SECTION_TITLES = {
    dining: "At the Table",
    beverages: "In the Cellar",
  };
  const groupContributions = [];
  for (const sectionKey of ["dining", "beverages"]) {
    const voices = [];
    const wishlistForSection = (wishlistRows ?? []).filter(
      (w) => w.section_key === sectionKey,
    );
    if (wishlistForSection.length > 0) {
      const wishlistHighlights = wishlistForSection.map((w) => {
        const qty = w.quantity ? ` (${w.quantity})` : "";
        const who = w.added_by_member_id
          ? ` — added by ${contributorNameById[w.added_by_member_id] || "(member)"}`
          : "";
        const note = w.notes ? ` · note: ${w.notes}` : "";
        return `${w.label}${qty}${who}${note}`;
      });
      voices.push({
        name: "Specific items requested",
        highlights: wishlistHighlights,
      });
    }
    if (voices.length > 0) {
      groupContributions.push({
        sectionTitle: SECTION_TITLES[sectionKey],
        voices,
      });
    }
  }

  // Telegram lines — short summary of any wishlist requests.
  const telegramVoiceLines = [];
  for (const section of groupContributions) {
    if (telegramVoiceLines.length === 0) {
      telegramVoiceLines.push("");
      telegramVoiceLines.push("Specific items requested:");
    }
    for (const v of section.voices) {
      const tail = (v.highlights || []).slice(0, 2).join(" · ");
      telegramVoiceLines.push(
        `· ${section.sectionTitle}${tail ? " — " + tail : ""}`,
      );
    }
  }

  void notifyGeorge({
    icon: "✅",
    title: "Charter Brief submitted",
    lines: [
      `From: ${existing.principal_charterer_name ?? session.email}`,
      `Re: ${existing.vessel_name ?? "—"}`,
      existing.charter_period_from && existing.charter_period_to
        ? `Dates: ${existing.charter_period_from} → ${existing.charter_period_to}`
        : null,
      ...telegramVoiceLines,
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
        groupContributions,
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
