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

  // Get all members of the completed cabin
  const members = await dbQuery(
    db
      .from("cabin_members")
      .select("email")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null)
  );

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
