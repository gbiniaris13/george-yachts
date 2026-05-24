// lib/cabin/brief-merge.js
// =============================================================
// 2026-05-24 — Angeliki pass (item 6).
//
// The shared-brief model (Phase 3 / 4) lets every cabin member
// edit the same /cabin/brief/dining + /cabin/brief/beverages
// (and other shared sections) form. RHF + autosave means each
// member's save WRITES THE FULL FORM STATE — so if Vasilis added
// "fruits" to snacks_details and Christos then opens the page,
// deletes "fruits" and writes "lamb", Vasilis's "fruits" is
// gone forever and the chef gets only lamb. Angeliki spotted
// this on her test pass: "δεν παίρνουμε κανένα στοιχείο."
//
// Fix: when a NON-principal saves a shared section, merge their
// incoming payload into the existing server-side data ADDITIVELY:
//   • Array fields → UNION with existing (never remove)
//   • Object fields → deep additive merge (don't overwrite a
//     truthy existing leaf)
//   • Other fields (string / number / boolean / enum) → keep
//     existing if it has a truthy value; only accept the new
//     value if the existing slot is empty
//
// Plus: a configurable list of PRINCIPAL-ONLY KEYS is stripped
// from non-principal payloads entirely (meal times, service-
// style choices — fields the principal owns even within a
// shared section).
//
// The principal still REPLACES outright (no merge — they have
// full edit authority and review-page semantics).
//
// Validation note: every merger branch preserves the original
// validity of each field. UNION of enum arrays still yields an
// array of enum values; keep-existing keeps the validated
// existing value; object deep-merge merges leaves of compatible
// types. So the merged result remains schema-valid without
// needing a second safeParse.
// =============================================================

function isPlainObject(v) {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    // Don't treat Date / Set / Map etc. as plain objects.
    (Object.getPrototypeOf(v) === Object.prototype ||
      Object.getPrototypeOf(v) === null)
  );
}

function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (isPlainObject(v)) return Object.keys(v).length === 0;
  if (typeof v === "boolean") return v === false;
  return false;
}

function mergeArrayUnion(existing, incoming) {
  const e = Array.isArray(existing) ? existing : [];
  const i = Array.isArray(incoming) ? incoming : [];
  // Preserve order: existing first, then new-and-unique from incoming.
  // For primitive arrays this is straightforward; for arrays of
  // objects (e.g. labelQtySchema rows), we de-dupe by JSON identity.
  const seen = new Set();
  const out = [];
  for (const v of e) {
    const key = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  for (const v of i) {
    const key = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function mergeObjectAdditive(existing, incoming) {
  const e = isPlainObject(existing) ? existing : {};
  const i = isPlainObject(incoming) ? incoming : {};
  const out = { ...e };
  for (const [k, v] of Object.entries(i)) {
    out[k] = mergeFieldAdditive(out[k], v);
  }
  return out;
}

function mergeFieldAdditive(existing, incoming) {
  // Skip null / undefined incoming entirely — never blank out existing.
  if (incoming == null) return existing;
  if (Array.isArray(incoming)) {
    return mergeArrayUnion(existing, incoming);
  }
  if (isPlainObject(incoming)) {
    return mergeObjectAdditive(existing, incoming);
  }
  // Primitives (string, number, boolean):
  //   • If existing is empty / falsy / blank, accept the new value.
  //   • Otherwise keep existing — guests can't overwrite.
  if (isEmpty(existing)) return incoming;
  return existing;
}

/**
 * Compute the data row to persist when a NON-principal member
 * saves a shared brief section. Strips any principal-only keys
 * and merges the incoming payload additively into the existing
 * server data.
 *
 * @param {object} existing       — the cabin_brief_sections.data row
 * @param {object} incoming       — the validated payload from the PUT
 * @param {Iterable<string>} principalOnlyKeys — keys to strip from
 *                                    a non-principal payload entirely
 * @returns {object} merged data ready to upsert
 */
export function mergeForGuest(existing, incoming, principalOnlyKeys = []) {
  const e = isPlainObject(existing) ? existing : {};
  const i = isPlainObject(incoming) ? incoming : {};
  const stripped = { ...i };
  for (const k of principalOnlyKeys) {
    if (k in stripped) delete stripped[k];
  }
  return mergeObjectAdditive(e, stripped);
}

/**
 * Per-section list of fields that ONLY the principal charterer
 * may set within an otherwise-shared section. Non-principal
 * payloads have these keys stripped before merge so guests
 * can never edit them even if they bypass the UI gate.
 */
export const SECTION_PRINCIPAL_ONLY_FIELDS = {
  // 2026-05-24 — Angeliki: "δεν μπορεί ο καθένας να λέει ότι θα
  // τρώει διαφορετικές ώρες, ο σεφ δεν θα μπορεί να το υπολογίσει."
  // Meal times = one rhythm per table, principal-only.
  // 2026-05-24 — Christos: service style (light / cold / hot /
  // family) is also one-voice-only ("αν πούνε πέντε διαφορετικά
  // τι θα κάνει το crew"). Already gated in DiningFields UI; the
  // server strip is belt-and-braces.
  dining: ["breakfast_time", "lunch_time", "dinner_time", "lunch_service", "dinner_service"],
  // beverages: no per-field principal-only carve-outs yet — every
  // beverage choice is collaborative. Added here for future use.
  beverages: [],
  // life_aboard: subjective per-person; the page itself will move
  // to per-member storage (Angeliki pass batch 3). The shared
  // section endpoint stays open in case a legacy submit lands here.
  life_aboard: [],
  // children: shared.
  children: [],
};
