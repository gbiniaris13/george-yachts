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

  // 2) Referral conversion (Brief 06 / STEP 3 KOMMATI 3).
  // The cabin principal "brought" every guest aboard. Each guest who
  // sailed converts ONE referral for that principal. Counted exactly
  // once per (referrer, referred) pair via the filotimo_referrals
  // unique constraint, so a re-run (or a multi-day flush) never
  // double-counts. 2 converted referrals => Crewmate (per computeTier).
  await convertReferralsForCabin(db, cabinId, members ?? []);
}

async function convertReferralsForCabin(db, cabinId, members) {
  const principal = members.find((m) => m.role === "principal_charterer");
  if (!principal?.email) return;
  const referrerEmail = principal.email.toLowerCase();

  const guests = members.filter(
    (m) => m.role !== "principal_charterer" && m.email,
  );

  for (const g of guests) {
    const referredEmail = g.email.toLowerCase();
    if (referredEmail === referrerEmail) continue;

    // Idempotency: skip if this pair was already converted.
    const already = await dbQuery(
      db
        .from("filotimo_referrals")
        .select("id")
        .eq("referrer_email", referrerEmail)
        .eq("referred_email", referredEmail)
        .maybeSingle()
    );
    if (already) continue;

    // Record the conversion. The unique (referrer, referred) constraint
    // backstops any race; a duplicate insert throws and we skip.
    try {
      await dbQuery(
        db.from("filotimo_referrals").insert({
          referrer_email: referrerEmail,
          referred_email: referredEmail,
          cabin_id: cabinId,
        })
      );
    } catch {
      continue; // already recorded by a concurrent run
    }

    // Increment the referrer's referrals_converted + recompute tier.
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
        referred: referredEmail,
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
