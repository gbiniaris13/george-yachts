// app/components/cabin/BerthNearby.jsx
// =============================================================
// 2026-05-23 — Berth Map Phase 2.
// Renders the "Around your berth" museum-plate block: airport,
// helipad, ATMs, hospital, pharmacy. Data is pre-fetched by the
// CRM at save-time (lib/berth-nearby.ts in gy-command) and stored
// in cabins.berth_nearby JSONB. Zero runtime third-party calls.
//
// George's brief (2026-05-23): captain-tier info, not tourist-tier.
// Crew-facing fields (provisioning / fuel / port authority) are
// deliberately excluded — those are the crew's job, not the
// client's.
//
// Contrast safety:
//   • Eyebrow uses `__eyebrow` suffix → caught by the systemic
//     [class*="eyebrow"] wildcard in cabin-tones.css, navy by default.
//   • All body text uses explicit navy colors, never var(--gy-gold).
//   • Italic sub-lines at 65% opacity stay above WCAG AA.
//   • Gold reserved for: hairline frame border, badge accents,
//     section dividers. NEVER for text.
//
// Back-compat: renders nothing if no nearby data, or if all
// fields are empty. Cabins without coords / pre-Phase-2 cabins
// see no change.
// =============================================================

export default function BerthNearby({ nearby }) {
  if (!nearby || typeof nearby !== "object") return null;

  const { airport, helipad, atms, hospital, pharmacy } = nearby;
  const hasAirport = airport && airport.name;
  const hasHelipad = helipad && helipad.name;
  const hasAtms = Array.isArray(atms) && atms.length > 0;
  const hasHospital = hospital && hospital.name;
  const hasPharmacy = pharmacy && pharmacy.name;

  // If literally nothing came back, render nothing — no empty
  // boutique panel.
  if (!hasAirport && !hasHelipad && !hasAtms && !hasHospital && !hasPharmacy) {
    return null;
  }

  return (
    <section className="berth-nearby">
      <div className="berth-nearby__inner">
        <div className="berth-nearby__head">
          <div className="berth-nearby__eyebrow">Around your berth</div>
        </div>

        <div className="berth-nearby__grid">
          {hasAirport && (
            <Section
              title="By air"
              place={airport}
              extra={airport.iata ? airport.iata.toUpperCase() : null}
            />
          )}
          {hasHelipad && (
            <Section title="By helicopter" place={helipad} />
          )}
          {hasAtms && (
            <div className="berth-nearby__section">
              <div className="berth-nearby__section-title">Cash &amp; banking</div>
              <ul className="berth-nearby__atms">
                {atms.map((atm, i) => (
                  <li key={i} className="berth-nearby__atm">
                    <span className="berth-nearby__atm-name">
                      {englishName(atm.name, "ATM")}
                    </span>
                    <span className="berth-nearby__atm-dist">
                      {formatDistance(atm.distance_km)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(hasHospital || hasPharmacy) && (
            <div className="berth-nearby__section">
              <div className="berth-nearby__section-title">Medical</div>
              {hasHospital && (
                <div className="berth-nearby__medical-row">
                  <span className="berth-nearby__place-name">
                    {englishName(hospital.name, "Hospital")}
                  </span>
                  <span className="berth-nearby__place-meta">
                    <em>{formatDriveLine(hospital)}</em>
                  </span>
                </div>
              )}
              {hasPharmacy && (
                <div className="berth-nearby__medical-row">
                  <span className="berth-nearby__place-name">
                    {englishName(pharmacy.name, "Pharmacy")}
                    {pharmacy.twentyfour_hour ? (
                      <span className="berth-nearby__badge">24/7</span>
                    ) : null}
                  </span>
                  <span className="berth-nearby__place-meta">
                    <em>{formatDistance(pharmacy.distance_km)}</em>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="berth-nearby__note">
          <em>
            Indicative distances only. For anything beyond - we&apos;re
            a message away.
          </em>
        </p>
      </div>

      <style>{`
        /* 2026-05-23 - tight gap above (8px) so this block reads as
           a continuation of the BerthMap above it, not a separate
           panel floating in whitespace. The BerthMap's bottom
           margin (36px) is the dominant gap; we pull up here with
           a negative margin so the visual gap is ~12px. */
        .berth-nearby {
          margin: -24px 0 44px;
        }
        .berth-nearby__inner {
          background: #FAF7F0;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-radius: 6px;
          box-shadow:
            0 12px 36px rgba(13, 27, 42, 0.08),
            0 2px 8px rgba(13, 27, 42, 0.04);
          overflow: hidden;
        }
        .berth-nearby__head {
          padding: 32px 36px 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.22);
        }
        .berth-nearby__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11.5px;
          letter-spacing: 3.2px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .berth-nearby__lede {
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          color: rgba(13, 27, 42, 0.78);
          letter-spacing: 0.2px;
        }
        .berth-nearby__grid {
          padding: 8px 36px 6px;
          display: flex;
          flex-direction: column;
        }
        .berth-nearby__section {
          padding: 26px 0;
          border-bottom: 1px solid rgba(201, 168, 76, 0.16);
        }
        .berth-nearby__section:last-child {
          border-bottom: none;
        }
        .berth-nearby__section-title {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .berth-nearby__place-name {
          font-family: var(--gy-font-editorial);
          font-size: 18px;
          color: #0D1B2A;
          letter-spacing: 0.2px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .berth-nearby__place-meta {
          display: block;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.7);
          margin-top: 3px;
          letter-spacing: 0.1px;
        }
        .berth-nearby__iata {
          display: inline-block;
          margin-left: 10px;
          padding: 2px 8px;
          border: 1px solid rgba(201, 168, 76, 0.5);
          border-radius: 2px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(13, 27, 42, 0.85);
          font-weight: 600;
          vertical-align: 2px;
        }
        .berth-nearby__atms {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .berth-nearby__atm {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding: 4px 0;
        }
        .berth-nearby__atm-name {
          font-family: var(--gy-font-editorial);
          font-size: 15.5px;
          color: #0D1B2A;
          letter-spacing: 0.15px;
        }
        .berth-nearby__atm-dist {
          font-family: var(--gy-font-ui);
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(13, 27, 42, 0.7);
          white-space: nowrap;
        }
        .berth-nearby__medical-row {
          display: flex;
          flex-direction: column;
          padding: 6px 0 10px;
        }
        .berth-nearby__medical-row + .berth-nearby__medical-row {
          border-top: 1px solid rgba(13, 27, 42, 0.05);
          padding-top: 12px;
        }
        .berth-nearby__badge {
          padding: 2px 8px;
          background: rgba(201, 168, 76, 0.16);
          border: 1px solid rgba(201, 168, 76, 0.45);
          border-radius: 2px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.6px;
          color: rgba(13, 27, 42, 0.85);
          font-weight: 600;
        }
        .berth-nearby__note {
          margin: 0;
          padding: 16px 32px 24px;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.62);
          text-align: center;
          border-top: 1px solid rgba(13, 27, 42, 0.04);
        }
        @media (max-width: 560px) {
          .berth-nearby { margin: -18px 0 32px; }
          .berth-nearby__head { padding: 26px 22px 18px; }
          .berth-nearby__lede { font-size: 15px; }
          .berth-nearby__grid { padding: 6px 22px 4px; }
          .berth-nearby__section { padding: 22px 0; }
          .berth-nearby__place-name { font-size: 16.5px; }
          .berth-nearby__place-meta { font-size: 13px; }
          .berth-nearby__atm-name { font-size: 14.5px; }
          .berth-nearby__note { padding: 14px 22px 22px; font-size: 12px; }
        }
      `}</style>
    </section>
  );
}

function Section({ title, place, extra }) {
  return (
    <div className="berth-nearby__section">
      <div className="berth-nearby__section-title">{title}</div>
      <div className="berth-nearby__place-name">
        {englishName(place.name, title === "By helicopter" ? "Helipad" : "Airport")}
        {extra ? (
          <span className="berth-nearby__iata">{extra}</span>
        ) : null}
      </div>
      <span className="berth-nearby__place-meta">
        <em>{formatDriveLine(place)}</em>
      </span>
    </div>
  );
}

// 2026-05-23 — George's directive: "έχουμε και Ευρωπαίους και
// Αμερικάνους πελάτες θέλω να δίνεις όπου δίνεις distance θέλω
// να είναι και σε μέτρα και στο Αμερικάνικο σύστημα."
//
// Distance presentation rules:
//   < 1 km  → "400 m · 1,310 ft"   (walkable; feet for US intuition)
//   ≥ 1 km  → "28 km · 17 mi"      (drive-scale; miles for US intuition)
//
// Distance + drive line for airport / helicopter / hospital:
//   "28 km · 17 mi · 35 min by car"
// Always shows both units. Drive time appended when known.
function formatDistanceDual(km) {
  if (typeof km !== "number") return "";
  if (km < 1) {
    const m = Math.round(km * 1000);
    const ft = Math.round(m * 3.28084);
    return `${m} m · ${ft.toLocaleString("en-US")} ft`;
  }
  const mi = km * 0.621371;
  return `${km.toFixed(1)} km · ${mi.toFixed(1)} mi`;
}

function formatDriveLine(place) {
  const parts = [];
  // Prefer driving distance if OSRM gave one (more honest than
  // crow-flies for "how far is it really"). Fall back to Haversine.
  const distKm =
    typeof place.drive_km === "number" && place.drive_km > 0
      ? place.drive_km
      : typeof place.distance_km === "number"
      ? place.distance_km
      : null;
  if (distKm !== null) {
    parts.push(formatDistanceDual(distKm));
  }
  if (typeof place.drive_minutes === "number" && place.drive_minutes > 0) {
    parts.push(`${place.drive_minutes} min by car`);
  }
  return parts.join(" · ");
}

// Same dual-unit format used for walking-distance categories (ATMs,
// pharmacy) where only the crow-flies number matters.
function formatDistance(km) {
  return formatDistanceDual(km);
}

// 2026-05-23 — George's directive: "οι πελάτες μας δεν είναι Έλληνες,
// στα Αγγλικά τα θέλω". OSM POIs in Greece often have a Greek `name`
// but no `name:en`. Our berth-nearby lib already prefers name:en, but
// when it's missing we fall back to the local name (Greek). This
// helper transliterates Greek → Latin per the ELOT 743 standard so
// the customer-facing cabin never shows Greek script.
//
// Also runs a small lookup table for big brand names we KNOW have an
// established English form (Τράπεζα Πειραιώς → Piraeus Bank, etc.).
const GREEK_BRAND_MAP = {
  "Τράπεζα Πειραιώς": "Piraeus Bank",
  "Πειραιώς": "Piraeus Bank",
  "Εθνική Τράπεζα": "National Bank of Greece",
  "Εθνική": "National Bank of Greece",
  "Eurobank": "Eurobank",
  "Alpha Bank": "Alpha Bank",
  "Άλφα": "Alpha Bank",
  "ΑΛΦΑ ΒΑΝΚ": "Alpha Bank",
  "Attica Bank": "Attica Bank",
  "Optima Bank": "Optima Bank",
  "ΕΛΤΑ": "Hellenic Post",
};

const GREEK_LATIN_MAP = {
  "Α": "A", "Β": "V", "Γ": "G", "Δ": "D", "Ε": "E", "Ζ": "Z",
  "Η": "I", "Θ": "Th", "Ι": "I", "Κ": "K", "Λ": "L", "Μ": "M",
  "Ν": "N", "Ξ": "X", "Ο": "O", "Π": "P", "Ρ": "R", "Σ": "S",
  "Τ": "T", "Υ": "Y", "Φ": "F", "Χ": "Ch", "Ψ": "Ps", "Ω": "O",
  "α": "a", "β": "v", "γ": "g", "δ": "d", "ε": "e", "ζ": "z",
  "η": "i", "θ": "th", "ι": "i", "κ": "k", "λ": "l", "μ": "m",
  "ν": "n", "ξ": "x", "ο": "o", "π": "p", "ρ": "r", "σ": "s",
  "ς": "s", "τ": "t", "υ": "y", "φ": "f", "χ": "ch", "ψ": "ps",
  "ω": "o",
  // accented vowels — strip the accent
  "Ά": "A", "Έ": "E", "Ή": "I", "Ί": "I", "Ό": "O", "Ύ": "Y", "Ώ": "O",
  "ά": "a", "έ": "e", "ή": "i", "ί": "i", "ό": "o", "ύ": "y", "ώ": "o",
  "ϊ": "i", "ϋ": "y", "ΐ": "i", "ΰ": "y", "Ϊ": "I", "Ϋ": "Y",
};

function looksGreek(s) {
  // Match any Greek block character — basic Greek + accents.
  return /[Ͱ-Ͽἀ-῿]/.test(s);
}

function transliterate(s) {
  if (!s || typeof s !== "string") return s;
  // Exact-match brand override first.
  for (const [gr, en] of Object.entries(GREEK_BRAND_MAP)) {
    if (s === gr || s.includes(gr)) return en;
  }
  if (!looksGreek(s)) return s;
  // Char-by-char transliteration.
  let out = "";
  for (const ch of s) {
    out += GREEK_LATIN_MAP[ch] ?? ch;
  }
  return out;
}

// Wrap whatever name the lib gave us in a customer-safe English form.
// Exposed so all sections (airports, ATMs, hospital, pharmacy) call
// this in one place — fix once, applies everywhere.
function englishName(rawName, fallback = "Unnamed") {
  const transliterated = transliterate(rawName);
  if (!transliterated || transliterated.trim() === "") return fallback;
  return transliterated;
}
