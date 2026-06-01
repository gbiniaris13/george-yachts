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
import { sendBriefSubmittedEmail, sendBriefMemberConfirmation } from "@/lib/cabin/email";
import { firstNameFromDisplayName } from "@/lib/cabin/format";
import { formatLifeAboardHighlights } from "@/lib/cabin/life-aboard-format";

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

  // 2026-05-27 — Brief 06 (#1+#2): the HARD brief-confirmation gate
  // is REMOVED. It required every non-opted-out member to have set
  // brief_confirmed_at by pressing Confirm on /cabin/brief — but
  // under the single-writer model guests are read-only on the brief
  // and have NO Confirm button (removed in Brief 02). So guests
  // could never satisfy this, the count never hit zero, and the
  // principal's POST here always 409'd with "brief-confirmation-
  // incomplete" — Review & Send was permanently deadlocked.
  // Dropped in lockstep with the client gate in
  // app/(cabin)/cabin/brief/review/ReviewSubmit.jsx.
  //
  // The two remaining gates are legitimate and satisfiable and
  // STILL ENFORCED below: (1) every member's Crew List complete
  // (port-authority requirement, checked just above) and (2) every
  // required brief section marked complete (checked just below).

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

  // 2026-05-25 — Phase 3: life_aboard no longer writes to
  // cabin_brief_sections (it's per-member, see Angeliki batch 3).
  // The completion signal for this section comes from any member
  // having content in personal_details.life_aboard_brief. We
  // injected the synthetic flag into completedKeys BEFORE the
  // missing-sections diff runs, so the existing gate stays
  // valid without a special-case branch below.
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
    life_aboard: "Life Aboard",
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

  // 2026-05-25 — Phase 3: per-member Life Aboard answers. Each
  // cabin_member has their own answers under
  // personal_details.life_aboard_brief (Angeliki batch 3 — see
  // /api/cabin/me/life-aboard). Surface one voice per member
  // who actually filled in something, so the chef + crew see
  // who likes what BEFORE the principal even forwards the
  // brief. Empty members are skipped — no need to clutter
  // George's inbox with "Vasilis didn't fill it".
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
      // Principal first so George reads their tone first.
      if (a.role === "principal_charterer" && b.role !== "principal_charterer") return -1;
      if (b.role === "principal_charterer" && a.role !== "principal_charterer") return 1;
      return (a.display_name || a.email || "").localeCompare(
        b.display_name || b.email || "",
      );
    })
    .map((m) => {
      const highlights = formatLifeAboardHighlights(
        m.personal_details?.life_aboard_brief,
      );
      return {
        name: m.display_name || m.email || "(member)",
        highlights,
      };
    })
    .filter((v) => v.highlights.length > 0);

  if (lifeAboardVoices.length > 0) {
    groupContributions.push({
      sectionTitle: SECTION_TITLES.life_aboard,
      voices: lifeAboardVoices,
    });
  }

  // 2026-05-26 — Brief 02 (Task A6.2): per-member allergy roll-up.
  // Under the new single-responsibility model the principal owns
  // every brief decision, BUT allergies are a safety fact each
  // member files in their own /cabin/me/private (writes to
  // cabin_members.personal_details.allergies_dietary +
  // dietary_preferences). They MUST reach the chef regardless of
  // what the principal typed into the Health section. Reuses the
  // memberRowsForLifeAboard load above — no extra DB round-trip.
  // Members with no allergy/dietary info on file are skipped to
  // keep the broker email signal-dense; their absence is captured
  // in the `clean` count below.
  const allergyRollupRaw = (memberRowsForLifeAboard ?? []).map((m) => {
    const pd = m.personal_details ?? {};
    const allergies = String(pd.allergies_dietary || "").trim();
    const dietary = Array.isArray(pd.dietary_preferences)
      ? pd.dietary_preferences.filter(Boolean)
      : [];
    const hasAny =
      (allergies && allergies.toLowerCase() !== "none") || dietary.length > 0;
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
    // Principal first so George reads their note first.
    .sort((a, b) => {
      if (a.role === "principal_charterer" && b.role !== "principal_charterer") return -1;
      if (b.role === "principal_charterer" && a.role !== "principal_charterer") return 1;
      return (a.name || "").localeCompare(b.name || "");
    })
    .map(({ memberId, name, role, allergies, dietary }) => ({
      memberId,
      name,
      role,
      allergies,
      dietary,
    }));
  const allergyRollup = {
    members: allergyRollupMembers,
    totals: {
      total: allergyRollupRaw.length,
      withData: allergyRollupMembers.length,
      clean: allergyRollupRaw.length - allergyRollupMembers.length,
    },
  };

  // Telegram lines — short summary of group contributions.
  // 2026-05-25 — Phase 3: Life Aboard voices added a separate
  // header so the summary clearly differentiates "items the chef
  // shops" (wishlist) from "how each guest wants the week to
  // feel" (life-aboard).
  const telegramVoiceLines = [];
  const wishlistSections = groupContributions.filter(
    (s) => s.sectionTitle !== SECTION_TITLES.life_aboard,
  );
  const lifeAboardSection = groupContributions.find(
    (s) => s.sectionTitle === SECTION_TITLES.life_aboard,
  );

  if (wishlistSections.length > 0) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Specific items requested:");
    for (const section of wishlistSections) {
      for (const v of section.voices) {
        const tail = (v.highlights || []).slice(0, 2).join(" · ");
        telegramVoiceLines.push(
          `· ${section.sectionTitle}${tail ? " — " + tail : ""}`,
        );
      }
    }
  }

  if (lifeAboardSection) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Life Aboard voices:");
    for (const v of lifeAboardSection.voices) {
      // First highlight is usually the crew-tone preference —
      // the most chef/crew-actionable piece per member.
      const lead = (v.highlights || [])[0] || "";
      telegramVoiceLines.push(
        `· ${v.name}${lead ? " — " + lead : ""}`,
      );
    }
  }

  // 2026-05-26 — Brief 02 (Task A6.2): per-member allergy roll-up
  // for the chef. Telegram bullet lines so George gets the chef-
  // critical facts in his pocket before he even opens the email.
  if (allergyRollup.members.length > 0) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("Allergies & dietary (per member):");
    for (const m of allergyRollup.members) {
      const parts = [];
      if (m.allergies) parts.push(m.allergies);
      if (m.dietary && m.dietary.length > 0) parts.push(m.dietary.join(", "));
      const tail = parts.join(" · ");
      telegramVoiceLines.push(`· ${m.name}${tail ? " — " + tail : ""}`);
    }
  } else if (allergyRollup.totals.total > 0) {
    telegramVoiceLines.push("");
    telegramVoiceLines.push("No allergies reported by the party.");
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
        // 2026-05-26 — Brief 02 (Task A6.2): per-member allergy
        // roll-up. Each member's self-filled allergies + dietary
        // (from personal_details). Reaches the chef regardless
        // of what the principal wrote in the Health section.
        allergyRollup,
      });
    } catch (mailErr) {
      console.warn(
        "[cabin/brief/submit] Resend send failed (non-fatal):",
        mailErr,
      );
    }
  })();

  // 2026-05-24 — Angeliki pass (item 7): broadcast a per-member
  // confirmation email to every cabin_member. Each guest gets a
  // personalised note ("Patricia has sent the final brief; the
  // principal made the final call on the shared choices") so:
  //   • Everyone knows the brief is out the door
  //   • Everyone sees their private answers were honoured
  //   • George + GY are visibly "καλυμμένοι" — the principal's
  //     authority on shared choices is documented in writing
  // Best-effort: a failed email doesn't roll back the submit.
  void (async () => {
    try {
      const members = await dbQuery(
        db
          .from("cabin_members")
          .select("email, display_name")
          .eq("cabin_id", cabinId),
      );
      const principalDisplayName =
        existing.principal_charterer_name || session.email;
      for (const m of members ?? []) {
        if (!m?.email) continue;
        const firstName = firstNameFromDisplayName(m.display_name);
        try {
          await sendBriefMemberConfirmation({
            to: m.email,
            firstName,
            vesselName: existing.vessel_name,
            principalName: principalDisplayName,
            fromDate: existing.charter_period_from,
            toDate: existing.charter_period_to,
          });
        } catch (memberMailErr) {
          console.warn(
            "[cabin/brief/submit] member confirmation failed for",
            m.email,
            memberMailErr,
          );
        }
      }
    } catch (broadcastErr) {
      console.warn(
        "[cabin/brief/submit] member-broadcast failed (non-fatal):",
        broadcastErr,
      );
    }
  })();

  return NextResponse.json({
    ok: true,
    submitted_at: submittedAt,
  });
}
