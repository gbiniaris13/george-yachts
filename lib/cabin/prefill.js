// lib/cabin/prefill.js
// =============================================================
// THE CABIN — pre-fill helpers.
//
// Maps the structured "Charter At-a-Glance" data on the cabin
// record into the per-section seed values the form pages render.
// Whenever George creates a new cabin from a MYBA contract, he
// pastes the pre-fill JSON in the gy-command admin; this module
// is what turns that JSON into a "client never re-types"
// experience across the brief.
// =============================================================

import { getCabinDb, dbQuery } from "./supabase";
import { ALL_SECTION_KEYS } from "./schemas";

// -----------------------------------------------------------
// Build the "Charter At-a-Glance" view payload — used by the
// /cabin home page AND by the PDF export.
// -----------------------------------------------------------
export function buildAtAGlance(cabin) {
  if (!cabin) return null;
  return {
    vessel: {
      name: cabin.vessel_name,
      make_model: cabin.vessel_make_model,
      length: cabin.vessel_length,
      capacity: cabin.vessel_capacity,
      homeport: cabin.homeport,
    },
    charter: {
      from: cabin.charter_period_from,
      to: cabin.charter_period_to,
      embarkation: cabin.port_embarkation,
      disembarkation: cabin.port_disembarkation,
      area: cabin.cruising_area,
    },
    charterer: {
      name: cabin.principal_charterer_name,
      email: cabin.principal_charterer_email,
      mobile: cabin.principal_charterer_mobile,
    },
    crew_display: cabin.crew_display ?? [],
    broker: {
      name: "George P. Biniaris",
      email: "george@georgeyachts.com",
      // Greek line for calls; US line for WhatsApp/iMessage so
      // US clients can text without international charges.
      mobile: "+30 6970 380 999",
      whatsapp: "+1 786 798 8798",
    },
  };
}

// -----------------------------------------------------------
// Suggest seed data for the Arrival section based on what we
// already know — currently nothing (Phase 1 keeps it simple).
// Kept as a function so we can layer in flight-tracking integrations
// later without changing the call sites.
// -----------------------------------------------------------
export function seedArrival(/* cabin */) {
  return {};
}

// -----------------------------------------------------------
// Fetch a brief section by key. Creates an empty row if it does
// not exist yet (idempotent).
// -----------------------------------------------------------
export async function getOrCreateSection(cabinId, sectionKey) {
  const db = getCabinDb();

  const existing = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("*")
      .eq("cabin_id", cabinId)
      .eq("section_key", sectionKey)
      .maybeSingle()
  );
  if (existing) return existing;

  // Supabase query builders are lazy — must be wrapped in dbQuery
  // so the request actually fires. The original code never awaited
  // the insert, so the follow-up select would PGRST116 every time.
  await dbQuery(
    db.from("cabin_brief_sections").insert({
      cabin_id: cabinId,
      section_key: sectionKey,
      data: {},
    })
  );

  return dbQuery(
    db
      .from("cabin_brief_sections")
      .select("*")
      .eq("cabin_id", cabinId)
      .eq("section_key", sectionKey)
      .single()
  );
}

// -----------------------------------------------------------
// Compute aggregate completion % across all sections. Mirrors
// the per-section heuristic in schemas.js.
// -----------------------------------------------------------
export async function recomputeCabinCompletion(cabinId) {
  const db = getCabinDb();
  const rows = await dbQuery(
    db
      .from("cabin_brief_sections")
      .select("completed, data")
      .eq("cabin_id", cabinId)
  );

  const total = ALL_SECTION_KEYS.length || 1;
  const filled = (rows ?? []).filter((r) => r.completed).length;
  const percent = Math.round((filled / total) * 100);

  await dbQuery(
    db
      .from("cabins")
      .update({ brief_completion_percent: percent })
      .eq("id", cabinId)
  );
  return percent;
}
