// app/api/cabin/admin/send-brief/route.js
// =============================================================
// 2026-06-02 — Admin "send brief on the principal's behalf".
//
// Why this exists: a production bug left the "Send to George"
// confirm modal buried under the page's z-index stack, so the
// click opened a modal nobody could see and the POST never
// fired. Real clients (incl. EFFIE STAR / Patricia R. Stevens)
// believed they had sent the brief; George never received it.
//
// This endpoint lets George complete the submission server-side
// for a SINGLE, explicitly-named cabin — stamping
// brief_submitted_at + locking + firing the SAME George email +
// Telegram a normal submit would, with the SAME helpers, so the
// inbox result is identical. The per-member confirmation
// broadcast is DELIBERATELY skipped (notify_members defaults
// false) so the guests / principal get nothing — invisible to
// the client.
//
// It reuses the exact gates + notification builders from
// app/api/cabin/brief/submit/route.js (kept byte-faithful).
//
// Auth: x-cabin-admin-secret (same shared secret as every other
// cabin-admin operation). Body: { cabin_id, actor_email?,
// notify_members? }.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { notifyGeorge } from "@/lib/cabin/notify";
import { sendBriefSubmittedEmail, sendBriefMemberConfirmation } from "@/lib/cabin/email";
import { firstNameFromDisplayName } from "@/lib/cabin/format";
import { formatLifeAboardHighlights } from "@/lib/cabin/life-aboard-format";

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
  const actorEmail = body?.actor_email || "george@georgeyachts.com";
  const notifyMembers = body?.notify_members === true; // default: George only
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });
  }

  const db = getCabinDb();

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
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 404 });
  }

  // Principal member (for brief_submitted_by_member_id — so the CRM
  // shows "Submitted by <principal>" exactly like a self-submit).
  const principalRow = await dbQuery(
    db
      .from("cabin_members")
      .select("id, display_name, email")
      .eq("cabin_id", cabinId)
      .eq("role", "principal_charterer")
      .is("deleted_at", null)
      .maybeSingle(),
  );
  const submittedByMemberId = principalRow?.id ?? null;

  // ---- Gates (identical to /api/cabin/brief/submit) — never send
  //      an incomplete brief, even via admin. ----
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
    (m) => !m.brief_participation_opt_out_at && !m.personal_details_completed_at,
  );
  if (stillOweCrewList.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "crew-list-incomplete",
        pending_count: stillOweCrewList.length,
        pending: stillOweCrewList.map((m) => ({ name: m.display_name || m.email, role: m.role })),
      },
      { status: 409 },
    );
  }

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
    (sectionsRows ?? []).filter((s) => s.completed).map((s) => s.section_key),
  );
  if (!completedKeys.has("life_aboard")) {
    const memberLifeAboard = await dbQuery(
      db
        .from("cabin_members")
        .select("personal_details")
        .eq("cabin_id", cabinId)
        .is("deleted_at", null),
    );
    const anyMemberFilledLifeAboard = (memberLifeAboard ?? []).some((m) => {
      const lab = m?.personal_details?.life_aboard_brief;
      if (!lab || typeof lab !== "object") return false;
      return Object.values(lab).some((v) => {
        if (v == null) return false;
        if (typeof v === "string") return v.trim().length > 0;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") return Object.keys(v).length > 0;
        return true;
      });
    });
    if (anyMemberFilledLifeAboard) completedKeys.add("life_aboard");
  }
  const missingSections = REQUIRED_SECTION_KEYS.filter((k) => !completedKeys.has(k));
  if (missingSections.length > 0) {
    return NextResponse.json(
      { ok: false, error: "brief-sections-incomplete", missing_sections: missingSections },
      { status: 409 },
    );
  }

  // ---- Stamp submission (idempotent — keep existing timestamp if
  //      already submitted, so a re-run just re-notifies George). ----
  const alreadySubmitted = Boolean(existing.brief_submitted_at);
  const submittedAt = existing.brief_submitted_at || new Date().toISOString();
  if (!alreadySubmitted) {
    await dbQuery(
      db
        .from("cabins")
        .update({
          brief_submitted_at: submittedAt,
          brief_submitted_by_member_id: submittedByMemberId,
          status: "active",
          concierge_mode_active: false,
          concierge_mode_activated_at: null,
          concierge_mode_activated_by_email: null,
        })
        .eq("id", cabinId),
    );
    try {
      await writeAudit({
        cabinId,
        actorEmail,
        actorRole: "principal_charterer",
        action: AUDIT_ACTIONS.BRIEF_SUBMITTED,
        metadata: {
          via: "admin-send-on-behalf",
          completion_percent: existing.brief_completion_percent ?? null,
        },
      });
    } catch (auditErr) {
      console.warn("[admin/send-brief] audit write failed:", auditErr);
    }
  }

  // ---- Build the SAME notification inputs as the real submit ----
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
      db.from("cabin_members").select("id, display_name, email").in("id", Array.from(contributorIds)),
    );
    contributorNameById = Object.fromEntries(
      (nameRows ?? []).map((m) => [m.id, m.display_name || m.email || "(member)"]),
    );
  }
  const SECTION_TITLES = { dining: "At the Table", beverages: "In the Cellar", life_aboard: "Life Aboard" };
  const groupContributions = [];
  for (const sectionKey of ["dining", "beverages"]) {
    const voices = [];
    const wishlistForSection = (wishlistRows ?? []).filter((w) => w.section_key === sectionKey);
    if (wishlistForSection.length > 0) {
      const wishlistHighlights = wishlistForSection.map((w) => {
        const qty = w.quantity ? ` (${w.quantity})` : "";
        const who = w.added_by_member_id
          ? ` — added by ${contributorNameById[w.added_by_member_id] || "(member)"}`
          : "";
        const note = w.notes ? ` · note: ${w.notes}` : "";
        return `${w.label}${qty}${who}${note}`;
      });
      voices.push({ name: "Specific items requested", highlights: wishlistHighlights });
    }
    if (voices.length > 0) groupContributions.push({ sectionTitle: SECTION_TITLES[sectionKey], voices });
  }

  const memberRowsForLifeAboard = await dbQuery(
    db
      .from("cabin_members")
      .select("id, display_name, email, role, personal_details")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null),
  );
  const lifeAboardVoices = (memberRowsForLifeAboard ?? [])
    .slice()
    .sort((a, b) => {
      if (a.role === "principal_charterer" && b.role !== "principal_charterer") return -1;
      if (b.role === "principal_charterer" && a.role !== "principal_charterer") return 1;
      return (a.display_name || a.email || "").localeCompare(b.display_name || b.email || "");
    })
    .map((m) => ({
      name: m.display_name || m.email || "(member)",
      highlights: formatLifeAboardHighlights(m.personal_details?.life_aboard_brief),
    }))
    .filter((v) => v.highlights.length > 0);
  if (lifeAboardVoices.length > 0) {
    groupContributions.push({ sectionTitle: SECTION_TITLES.life_aboard, voices: lifeAboardVoices });
  }

  const allergyRollupRaw = (memberRowsForLifeAboard ?? []).map((m) => {
    const pd = m.personal_details ?? {};
    const allergies = String(pd.allergies_dietary || "").trim();
    const dietary = Array.isArray(pd.dietary_preferences) ? pd.dietary_preferences.filter(Boolean) : [];
    const hasAny = (allergies && allergies.toLowerCase() !== "none") || dietary.length > 0;
    return {
      memberId: m.id,
      name: m.display_name || m.email || "(member)",
      role: m.role,
      allergies: allergies && allergies.toLowerCase() !== "none" ? allergies : null,
      dietary,
      hasAny,
    };
  });
  const allergyRollupMembers = allergyRollupRaw
    .filter((r) => r.hasAny)
    .sort((a, b) => {
      if (a.role === "principal_charterer" && b.role !== "principal_charterer") return -1;
      if (b.role === "principal_charterer" && a.role !== "principal_charterer") return 1;
      return (a.name || "").localeCompare(b.name || "");
    })
    .map(({ memberId, name, role, allergies, dietary }) => ({ memberId, name, role, allergies, dietary }));
  const allergyRollup = {
    members: allergyRollupMembers,
    totals: {
      total: allergyRollupRaw.length,
      withData: allergyRollupMembers.length,
      clean: allergyRollupRaw.length - allergyRollupMembers.length,
    },
  };

  const telegramVoiceLines = [];
  const wishlistSections = groupContributions.filter((s) => s.sectionTitle !== SECTION_TITLES.life_aboard);
  const lifeAboardSection = groupContributions.find((s) => s.sectionTitle === SECTION_TITLES.life_aboard);
  if (wishlistSections.length > 0) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Specific items requested:");
    for (const section of wishlistSections) {
      for (const v of section.voices) {
        const tail = (v.highlights || []).slice(0, 2).join(" · ");
        telegramVoiceLines.push(`· ${section.sectionTitle}${tail ? " — " + tail : ""}`);
      }
    }
  }
  if (lifeAboardSection) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Life Aboard voices:");
    for (const v of lifeAboardSection.voices) {
      const lead = (v.highlights || [])[0] || "";
      telegramVoiceLines.push(`· ${v.name}${lead ? " — " + lead : ""}`);
    }
  }
  if (allergyRollup.members.length > 0) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Allergies & dietary (per member):");
    for (const m of allergyRollup.members) {
      const parts = [];
      if (m.allergies) parts.push(m.allergies);
      if (m.dietary && m.dietary.length > 0) parts.push(m.dietary.join(", "));
      telegramVoiceLines.push(`· ${m.name}: ${parts.join(" · ") || "—"}`);
    }
  }

  const brokerEmail = process.env.BROKER_EMAIL || "george@georgeyachts.com";
  const crmBase = process.env.GY_COMMAND_URL || "https://command.georgeyachts.com";

  // 1) Telegram + lightweight notify email (to George).
  let notifyResult = null;
  try {
    notifyResult = await notifyGeorge({
      icon: "✅",
      title: "Charter Brief submitted",
      lines: [
        `From: ${existing.principal_charterer_name ?? actorEmail}`,
        `Re: ${existing.vessel_name ?? "—"}`,
        existing.charter_period_from && existing.charter_period_to
          ? `Dates: ${existing.charter_period_from} → ${existing.charter_period_to}`
          : null,
        ...telegramVoiceLines,
      ],
      link: `/dashboard/cabins/${cabinId}`,
    });
  } catch (notifyErr) {
    console.error("[admin/send-brief] notifyGeorge threw:", notifyErr);
    notifyResult = { ok: false, error: String(notifyErr?.message || notifyErr) };
  }

  // 2) The rich broker email (to George).
  let brokerEmailResult = { ok: false };
  try {
    await sendBriefSubmittedEmail({
      to: brokerEmail,
      vesselName: existing.vessel_name,
      charterer: existing.principal_charterer_name || actorEmail,
      from: existing.charter_period_from,
      to_date: existing.charter_period_to,
      submittedAt,
      cabinUrl: `${crmBase}/dashboard/cabins/${cabinId}`,
      groupContributions,
      allergyRollup,
    });
    brokerEmailResult = { ok: true };
  } catch (mailErr) {
    console.error("[admin/send-brief] broker email failed:", mailErr?.message || mailErr);
    brokerEmailResult = { ok: false, error: String(mailErr?.message || mailErr) };
  }

  // 3) Per-member confirmation emails — ONLY if explicitly requested
  //    (default OFF so the rescue is invisible to the client + guests).
  let memberConfirmResult = { sent: 0, failed: 0, skipped: !notifyMembers };
  if (notifyMembers) {
    try {
      const principalDisplayName = existing.principal_charterer_name || actorEmail;
      const recipients = (allActiveMembers ?? []).filter((m) => m?.email);
      const settled = await Promise.allSettled(
        recipients.map((m) =>
          sendBriefMemberConfirmation({
            to: m.email,
            firstName: firstNameFromDisplayName(m.display_name),
            vesselName: existing.vessel_name,
            principalName: principalDisplayName,
            fromDate: existing.charter_period_from,
            toDate: existing.charter_period_to,
          }),
        ),
      );
      memberConfirmResult = {
        sent: settled.filter((s) => s.status === "fulfilled").length,
        failed: settled.filter((s) => s.status === "rejected").length,
        skipped: false,
      };
    } catch (broadcastErr) {
      memberConfirmResult = { sent: 0, failed: -1, error: String(broadcastErr?.message || broadcastErr), skipped: false };
    }
  }

  const telegramOk = Boolean(notifyResult?.telegram?.ok || notifyResult?.channel === "console");
  const notifyEmailOk = Boolean(notifyResult?.email?.ok || notifyResult?.channel === "console");
  const allOk = telegramOk && notifyEmailOk && brokerEmailResult.ok;
  try {
    await writeAudit({
      cabinId,
      actorEmail,
      actorRole: "principal_charterer",
      action: AUDIT_ACTIONS.BRIEF_NOTIFICATIONS,
      metadata: {
        via: "admin-send-on-behalf",
        all_ok: allOk,
        telegram_ok: telegramOk,
        telegram_detail: notifyResult?.telegram ?? notifyResult ?? null,
        notify_email_ok: notifyEmailOk,
        notify_email_detail: notifyResult?.email ?? null,
        broker_email_ok: brokerEmailResult.ok,
        broker_email_error: brokerEmailResult.error ?? null,
        member_confirmations: memberConfirmResult,
        broker_recipient: brokerEmail,
        already_submitted: alreadySubmitted,
      },
    });
  } catch (auditErr) {
    console.error("[admin/send-brief] notification audit write failed:", auditErr);
  }

  return NextResponse.json({
    ok: true,
    cabin_id: cabinId,
    was_already_submitted: alreadySubmitted,
    submitted_at: submittedAt,
    notifications_ok: allOk,
    telegram_ok: telegramOk,
    notify_email_ok: notifyEmailOk,
    broker_email_ok: brokerEmailResult.ok,
    member_confirmations: memberConfirmResult,
  });
}
