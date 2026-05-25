// lib/cabin/life-aboard-format.js
// =============================================================
// 2026-05-25 — Phase 3.
//
// Life Aboard is per-member (writes go to
// cabin_members.personal_details.life_aboard_brief — see
// Angeliki batch 3). For the principal's review page and the
// Send-to-George email, we need to flatten each member's
// answers into human-readable bullet lines so the chef + crew
// can see at a glance who likes what.
//
// Used by:
//   • app/(cabin)/cabin/brief/review/page.jsx — per-member
//     accordion under the Life Aboard section row.
//   • app/api/cabin/brief/submit/route.js — assembles per-member
//     voices for the broker email + Telegram summary.
//
// Keep the format friendly (full words, not enum slugs) and
// stable — the broker email's "Voices from the group" UI
// renders these as <li> bullets verbatim.
// =============================================================

const CREW_INTERACTION_LABELS = {
  always_around: "Warm and chatty crew (first-name basis, attentive throughout)",
  balanced: "Warm but discreet (present when needed, polite address)",
  discreet: "Quiet & formal (service-first, minimal small-talk, Sir / Ma'am)",
};

const ACTIVITY_LABELS = {
  swimming_snorkel: "Swimming & snorkeling",
  sunbathing: "Sunbathing",
  sunset_cocktails: "Sunset cocktails",
  stargazing: "Stargazing",
  shopping_ashore: "Shopping ashore",
  island_hikes: "Island walks",
  cultural_tours: "Cultural moments ashore",
  sailing_under_sail: "Time under sail",
};

// Legacy fields kept for back-compat with already-saved data —
// rendered if present, but never collected by the new UI.
const WELLNESS_LABELS = {
  yoga_morning: "Morning yoga",
  massage_onboard: "Massage onboard",
  stargazing_nights: "Stargazing nights",
  sunrise_meditation: "Sunrise meditation",
  personal_trainer: "Personal trainer",
};

/**
 * Convert a member's life_aboard_brief blob into a list of
 * human-readable highlight strings (one per filled-in answer).
 *
 * @param {object|null} brief — a life_aboard_brief JSONB blob
 * @returns {string[]} ordered list of highlight lines
 */
export function formatLifeAboardHighlights(brief) {
  const out = [];
  if (!brief || typeof brief !== "object") return out;

  if (brief.crew_interaction && CREW_INTERACTION_LABELS[brief.crew_interaction]) {
    out.push(`Crew tone: ${CREW_INTERACTION_LABELS[brief.crew_interaction]}`);
  }

  const acts = Array.isArray(brief.activities) ? brief.activities : [];
  if (acts.length > 0) {
    const labels = acts
      .map((a) => ACTIVITY_LABELS[a] || a)
      .join(", ");
    out.push(`Loves: ${labels}`);
  }

  if (typeof brief.activities_other === "string" && brief.activities_other.trim()) {
    out.push(`Also: ${brief.activities_other.trim()}`);
  }

  // Legacy music_taste field (pre-Christos pass it was collected;
  // kept readable in case a saved blob still has it).
  if (typeof brief.music_taste === "string" && brief.music_taste.trim()) {
    out.push(`Music taste: ${brief.music_taste.trim()}`);
  }

  if (typeof brief.extras_freeform === "string" && brief.extras_freeform.trim()) {
    out.push(`Small touches: ${brief.extras_freeform.trim()}`);
  }

  const wellness = Array.isArray(brief.wellness_onboard) ? brief.wellness_onboard : [];
  if (wellness.length > 0) {
    const labels = wellness
      .map((w) => WELLNESS_LABELS[w] || w)
      .join(", ");
    out.push(`Wellness interest: ${labels}`);
  }

  return out;
}

/**
 * True if a brief has any meaningful content.
 */
export function lifeAboardHasContent(brief) {
  return formatLifeAboardHighlights(brief).length > 0;
}
