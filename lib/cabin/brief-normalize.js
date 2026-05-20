// lib/cabin/brief-normalize.js
// =============================================================
// Defensive normaliser run on the server BEFORE zod validation.
//
// Why this exists (2026-05-20, after friend-test feedback):
//
// React-hook-form sends form values verbatim — which means HTML
// inputs leak their quirks into the JSON payload:
//
//   • <input type="date" /> empty value → ""  (not undefined)
//     → fails optDate regex (/^\d{4}-\d{2}-\d{2}$/)
//
//   • Empty <input type="number" /> → "" → coerce.number(""")=0
//     which passes validation but writes a junk 0 to the DB.
//
//   • A CheckboxGroup where ONE checkbox is checked → RHF returns
//     the single string value, not [value]. Schema expects array
//     of enum → rejected.
//
//   • A CheckboxGroup where NONE are checked → RHF returns `false`
//     (per its checkbox-array implementation). Schema rejects.
//
//   • Radios that the user hasn't touched → null or "".  Schema's
//     `z.enum([...]).optional()` accepts undefined but NOT null/"".
//
//   • Stray `{}` empty objects littered through the tree from the
//     form's defaultValues spread — harmless to keep, but cleaning
//     them shrinks the JSON we write to Supabase.
//
// All five failure modes hit production during friend-test
// (3/3 testers saw "Couldn't save — retrying" in different
// sections). Fix is server-side because:
//
//   1. The client can be sloppy; the server must be the gate.
//   2. One central change replaces N per-field band-aids.
//   3. We preserve the schemas' strictness — they keep rejecting
//      garbage; we just stop calling missing-or-blank values
//      "garbage."
//
// Walks the payload depth-first. Strips:
//   - "" (empty string)
//   - null / undefined
//   - false  (treated as "checkbox group not touched")
//   - {} (empty object after recursive clean)
//   - []  (empty array after recursive clean)
//
// Returns the cleaned value or `undefined` if everything was
// stripped. The caller falls back to `{}` so zod always sees an
// object (validators that require nothing pass on `{}`).
// =============================================================

export function normalizeBriefPayload(value) {
  if (value === null || value === undefined) return undefined;
  if (value === "") return undefined;
  if (value === false) return undefined;
  if (typeof value === "string") {
    // Trim trailing whitespace-only strings to undefined.
    return value.trim() === "" ? undefined : value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    const cleaned = value
      .map(normalizeBriefPayload)
      .filter((v) => v !== undefined);
    return cleaned.length === 0 ? undefined : cleaned;
  }
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = normalizeBriefPayload(v);
      if (c !== undefined) out[k] = c;
    }
    return Object.keys(out).length === 0 ? undefined : out;
  }
  return value;
}
