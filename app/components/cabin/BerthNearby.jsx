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
          <div className="berth-nearby__lede">
            <em>The practicalities, taken care of.</em>
          </div>
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
                    <span className="berth-nearby__atm-name">{atm.name}</span>
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
                    {hospital.name}
                  </span>
                  <span className="berth-nearby__place-meta">
                    <em>{formatDriveLine(hospital)}</em>
                  </span>
                </div>
              )}
              {hasPharmacy && (
                <div className="berth-nearby__medical-row">
                  <span className="berth-nearby__place-name">
                    {pharmacy.name}
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
            Distances are point-to-point. Your captain or our concierge
            will know the practicalities of the day.
          </em>
        </p>
      </div>

      <style>{`
        .berth-nearby {
          margin: 28px 0 36px;
        }
        .berth-nearby__inner {
          background: #FAF7F0;
          border: 1px solid rgba(201, 168, 76, 0.28);
          border-radius: 6px;
          box-shadow:
            0 10px 32px rgba(13, 27, 42, 0.07),
            0 2px 6px rgba(13, 27, 42, 0.04);
          overflow: hidden;
        }
        .berth-nearby__head {
          padding: 30px 32px 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.18);
        }
        .berth-nearby__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3px;
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
          padding: 12px 32px 8px;
          display: flex;
          flex-direction: column;
        }
        .berth-nearby__section {
          padding: 22px 0;
          border-bottom: 1px solid rgba(13, 27, 42, 0.07);
        }
        .berth-nearby__section:last-child {
          border-bottom: none;
        }
        .berth-nearby__section-title {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.7);
          font-weight: 600;
          margin-bottom: 10px;
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
          .berth-nearby { margin: 22px 0 28px; }
          .berth-nearby__head { padding: 24px 22px 18px; }
          .berth-nearby__lede { font-size: 15px; }
          .berth-nearby__grid { padding: 8px 22px 4px; }
          .berth-nearby__section { padding: 18px 0; }
          .berth-nearby__place-name { font-size: 16.5px; }
          .berth-nearby__place-meta { font-size: 13px; }
          .berth-nearby__atm-name { font-size: 14.5px; }
          .berth-nearby__note { padding: 14px 22px 20px; font-size: 12px; }
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
        {place.name}
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

// "35 min by car · 28 km" with graceful fallback to crow-flies
// only when OSRM didn't come back ("28 km · point to point").
function formatDriveLine(place) {
  const parts = [];
  if (typeof place.drive_minutes === "number" && place.drive_minutes > 0) {
    parts.push(`${place.drive_minutes} min by car`);
  }
  if (typeof place.drive_km === "number" && place.drive_km > 0) {
    parts.push(`${place.drive_km.toFixed(1)} km`);
  } else if (typeof place.distance_km === "number") {
    parts.push(
      place.drive_minutes != null
        ? `${place.distance_km.toFixed(1)} km`
        : `${place.distance_km.toFixed(1)} km · point to point`,
    );
  }
  return parts.join(" · ");
}

// "220 m" for sub-km distances (ATMs), "1.2 km" otherwise.
function formatDistance(km) {
  if (typeof km !== "number") return "";
  if (km < 1) {
    const m = Math.round(km * 1000);
    return `${m} m`;
  }
  return `${km.toFixed(1)} km`;
}
