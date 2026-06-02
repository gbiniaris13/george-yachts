// lib/cabin/filotimo.js
// =============================================================
// THE CABIN — Filotimo Circle (loyalty) logic.
//
// Person-scoped (one row per email regardless of cabin count).
// A DB trigger auto-enrolls anyone added as a cabin_member —
// see the schema migration. This module only handles tier
// upgrades and the "what the client sees" data shape.
// =============================================================

import { getCabinDb, dbQuery } from "./supabase";
import { writeAudit, AUDIT_ACTIONS } from "./audit";

// -----------------------------------------------------------
// Tier thresholds — easy knobs for the boardroom to tune.
// -----------------------------------------------------------
export const TIERS = {
  friend: { voyages: 1, referrals: 0, label: "Friend" },
  companion: { voyages: 2, referrals: 1, label: "Companion" },
  crewmate: { voyages: 3, referrals: 2, label: "Crewmate" },
};

export function computeTier({ voyages_count = 0, referrals_converted = 0 }) {
  if (
    voyages_count >= TIERS.crewmate.voyages ||
    referrals_converted >= TIERS.crewmate.referrals
  ) {
    return "crewmate";
  }
  if (
    voyages_count >= TIERS.companion.voyages ||
    referrals_converted >= TIERS.companion.referrals
  ) {
    return "companion";
  }
  return "friend";
}

// -----------------------------------------------------------
// Get the Circle record for a person.
// -----------------------------------------------------------
export async function getCircleMember(email) {
  const db = getCabinDb();
  const data = await dbQuery(
    db
      .from("filotimo_circle_members")
      .select("*")
      .ilike("email", email.trim())
      .is("deleted_at", null)
      .maybeSingle()
  );
  return data;
}

// -----------------------------------------------------------
// Run when a cabin completes (status → completed). Bumps
// voyages_count + recomputes tier + writes audit on upgrade.
// -----------------------------------------------------------
export async function recordVoyageCompletion(cabinId) {
  const db = getCabinDb();

  // Get all members of the completed cabin (email + role; role drives
  // the referral attribution in step 2).
  const members = await dbQuery(
    db
      .from("cabin_members")
      .select("email, role")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null)
  );

  // 1) Bump each member's own voyages_count + recompute tier.
  for (const m of members ?? []) {
    const email = m.email.toLowerCase();
    const before = await getCircleMember(email);
    if (!before) continue;

    const newCount = (before.voyages_count || 0) + 1;
    const newTier = computeTier({
      voyages_count: newCount,
      referrals_converted: before.referrals_converted,
    });

    await dbQuery(
      db
        .from("filotimo_circle_members")
        .update({
          voyages_count: newCount,
          tier: newTier,
          last_voyage_cabin_id: cabinId,
          last_voyage_completed_at: new Date().toISOString(),
        })
        .ilike("email", email)
    );

    if (newTier !== before.tier) {
      await writeAudit({
        cabinId,
        actorEmail: "system",
        actorRole: "system",
        action: AUDIT_ACTIONS.FILOTIMO_TIER_UPGRADED,
        metadata: {
          email,
          from: before.tier,
          to: newTier,
          voyages_count: newCount,
        },
      });
    }
  }

  // 2) Referrals (Brief 06 / STEP 3 KOMMATI 3, corrected rule).
  // A guest you brought aboard is only a PENDING referral. It does NOT
  // count toward your tier yet. It CONVERTS (and bumps the referrer's
  // referrals_converted + tier) only when that person later sails their
  // OWN charter, as principal of a DIFFERENT cabin that completes. So:
  // brought-as-guest = pending; sailed-their-own = converted.
  await processReferralsForCabin(db, cabinId, members ?? []);
}

async function processReferralsForCabin(db, cabinId, members) {
  const principal = members.find((m) => m.role === "principal_charterer");
  if (!principal?.email) return;
  const principalEmail = principal.email.toLowerCase();

  // ── STEP A — record PENDING referrals ──────────────────────────────
  // The principal "brought" every guest aboard. Record each as a PENDING
  // referral (converted_at NULL). Pending does NOT bump anyone's tier.
  // Idempotent via the unique (referrer_email, referred_email) pair.
  const guests = members.filter(
    (m) => m.role !== "principal_charterer" && m.email,
  );
  for (const g of guests) {
    const guestEmail = g.email.toLowerCase();
    if (guestEmail === principalEmail) continue;

    const existing = await dbQuery(
      db
        .from("filotimo_referrals")
        .select("id")
        .eq("referrer_email", principalEmail)
        .eq("referred_email", guestEmail)
        .maybeSingle()
    );
    if (existing) continue;

    try {
      await dbQuery(
        db.from("filotimo_referrals").insert({
          referrer_email: principalEmail,
          referred_email: guestEmail,
          cabin_id: cabinId, // the cabin where they sailed as a guest
          converted_at: null, // pending until they sail their own
        })
      );
    } catch {
      // unique violation from a concurrent run; the pending row exists.
    }
  }

  // ── STEP B — CONVERT pending referrals ─────────────────────────────
  // The principal of THIS completing cabin has now sailed their own
  // charter. If anyone previously brought THEM aboard as a guest, those
  // pending referrals convert now: +1 to each original referrer, and a
  // tier recompute. Must be a DIFFERENT cabin than where they were a
  // guest (guaranteed: you cannot be both principal and guest of one
  // cabin). Each pending converts exactly once (conditional update on
  // converted_at IS NULL), so re-runs never double-count.
  const pendings = await dbQuery(
    db
      .from("filotimo_referrals")
      .select("id, referrer_email, cabin_id")
      .eq("referred_email", principalEmail)
      .is("converted_at", null)
  );

  for (const p of pendings ?? []) {
    if (p.cabin_id === cabinId) continue; // same cabin: not an own-charter

    const updated = await dbQuery(
      db
        .from("filotimo_referrals")
        .update({ converted_at: new Date().toISOString() })
        .eq("id", p.id)
        .is("converted_at", null)
        .select("id")
    );
    if (!updated || updated.length === 0) continue; // converted concurrently

    const referrerEmail = p.referrer_email;
    const refMember = await getCircleMember(referrerEmail);
    if (!refMember) continue;
    const newReferrals = (refMember.referrals_converted || 0) + 1;
    const newTier = computeTier({
      voyages_count: refMember.voyages_count,
      referrals_converted: newReferrals,
    });

    await dbQuery(
      db
        .from("filotimo_circle_members")
        .update({ referrals_converted: newReferrals, tier: newTier })
        .ilike("email", referrerEmail)
    );

    await writeAudit({
      cabinId,
      actorEmail: "system",
      actorRole: "system",
      action: AUDIT_ACTIONS.FILOTIMO_REFERRAL_CONVERTED,
      metadata: {
        referrer: referrerEmail,
        referred: principalEmail,
        via_cabin: cabinId,
        referrals_converted: newReferrals,
      },
    });

    if (newTier !== refMember.tier) {
      await writeAudit({
        cabinId,
        actorEmail: "system",
        actorRole: "system",
        action: AUDIT_ACTIONS.FILOTIMO_TIER_UPGRADED,
        metadata: {
          email: referrerEmail,
          from: refMember.tier,
          to: newTier,
          via: "referral",
          referrals_converted: newReferrals,
        },
      });
    }
  }
}

// -----------------------------------------------------------
// Helpers for the client UI
// -----------------------------------------------------------
export function nextTierGoal(circle) {
  if (!circle) return null;
  if (circle.tier === "crewmate") {
    return { kind: "max", message: "You are at the highest tier of the Circle." };
  }
  const target = circle.tier === "friend" ? TIERS.companion : TIERS.crewmate;
  return {
    kind: "voyages",
    voyages_to_go: Math.max(0, target.voyages - (circle.voyages_count ?? 0)),
    or_referrals_to_go: Math.max(
      0,
      target.referrals - (circle.referrals_converted ?? 0)
    ),
    next_tier: circle.tier === "friend" ? "companion" : "crewmate",
  };
}
