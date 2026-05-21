// lib/cabin/format.js
// =============================================================
// Small display helpers shared across The Cabin surfaces (email
// templates + server-rendered pages). Pure functions, no I/O.
// =============================================================

// 2026-05-20 — Friend-test pass 3 (George):
//   Invite email opened "Dear george," (lowercase) and the /cabin
//   landing greeted "Welcome, george." because the data field was
//   typed lowercase at cabin creation. We don't titleCase on SAVE
//   (so unusual surnames like "de la Cruz" or "van der Berg" keep
//   their lowercased particles intact), but we do titleCase on
//   DISPLAY so the user-facing surfaces read as expected.
export function titleCaseName(s) {
  if (!s) return "";
  return String(s)
    .trim()
    .split(/\s+/)
    .map((w) =>
      w.length === 0
        ? w
        : w[0].toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(" ");
}

// Format an ISO date (YYYY-MM-DD) as "24 May 2026". Falls back to
// the raw string if parsing fails.
export function prettyDate(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  if (!m) return String(iso);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// 2026-05-21 — Pass 7 prep. Single shared formatter for full ISO
// timestamps ("2026-05-20T15:41:23.000Z" → "20 May 2026, 15:41").
// /cabin/your-data, /cabin/guests and the Filotimo Circle surfaces
// all need this — previously each page implemented its own
// fmtDateTime variant and they drifted (your-data showed "20 May
// 2026, 15:41" while guests showed "5/20/2026" in en-US default).
// Now they share one canonical helper that matches prettyDate's
// en-GB "day month year" rhythm.
export function prettyDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Compact variant: "20 May 2026" from a full ISO timestamp (i.e.
// drops the time-of-day). Used when the time adds noise but the
// caller has an ISO timestamp rather than a YYYY-MM-DD slug.
export function prettyDateShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
