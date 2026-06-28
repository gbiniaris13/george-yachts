"use client";

// app/components/cabin/VesselBrochureBlock.jsx
// =============================================================
// 2026-05-23 — Converted to a client component. The previous
// server-rendered version broke /cabin entirely after we added
// the PhotoGallery render-prop ({ open } => ...) — server
// components cannot pass functions as children to client
// components, and the runtime threw "Something went wrong" on
// every load. This component is pure props-to-JSX with no
// server-only deps (no fs, no DB, no headers), so promoting it
// to a client component is safe and unblocks the gallery
// lightbox interaction.
//
// 2026-05-22 — George's response to the cabin-home preview:
//   "Λέμε αυτό το κείμενο στον πελάτη και δεν του δείχνουμε
//    τίποτα. Έχει απλά 2-3 στοιχεία. 'See the full vessel' τι
//    σημαίνει? Η μπροσούρα που σου έχω ανεβάσει σαν PDF…
//    Πρέπει να είναι εκεί μέσα αυτή η μπροσούρα. Όλη."
//
// He's right. The previous VesselTeaser was a thin reveal —
// 3 facts + 3 photos + "See the full vessel ›" link sending
// the customer to a separate page. That answers no question
// and breaks the editorial flow of the home page.
//
// This component renders the FULL vessel brochure inline:
// hero photo + the editorial intro paragraph + key features +
// every photo grouped by section (Aft Deck / Saloon / Cabins
// / Flybridge / Bow Area / Tender & Toys) + specifications +
// accommodation + amenities + tender & toys list.
//
// It accepts either the rich `vessel_brochure` JSONB (full
// Gemini extraction, all 14 fields) or a minimal cabin row
// (only flat columns populated). Every section is rendered
// independently so a half-extracted brochure still shows
// useful content.
//
// Used on /cabin home (replacing VesselTeaser) and also on
// the standalone /cabin/vessel page so the two surfaces stay
// in sync.
//
// White-label: NEVER shows owner / central agent / commercial
// figures. Reads only the customer-safe vessel_brochure JSONB.
// =============================================================

import PhotoGallery from "./PhotoGallery";

export default function VesselBrochureBlock({ cabin, photos, asPage = false }) {
  if (!cabin) return null;

  const brochure =
    cabin.vessel_brochure && typeof cabin.vessel_brochure === "object"
      ? cabin.vessel_brochure
      : {};

  // Prefer brochure-extracted values; fall back to flat cabin
  // columns (populated by the MYBA contract extraction) so a
  // cabin with NO brochure uploaded still renders the essentials.
  const name = brochure.vessel_name || cabin.vessel_name || "Your yacht";
  const typeLine = brochure.type_line;
  const builderModel = brochure.builder_model || cabin.vessel_make_model;
  const year = brochure.year_built;
  const summary = brochure.summary;
  const features = Array.isArray(brochure.key_features)
    ? brochure.key_features
    : [];
  const specs = brochure.specifications || {};
  const accommodation = brochure.accommodation || {};
  const amenities = Array.isArray(brochure.amenities) ? brochure.amenities : [];
  const tender = brochure.tender || {};
  const toys = Array.isArray(brochure.water_toys) ? brochure.water_toys : [];
  const areas = Array.isArray(brochure.areas) ? brochure.areas : [];

  // 2026-05-22 — The new Roberto P1 prompt returns specs as
  // verbatim strings ({length: "51 ft / 15.6 m"}). Older saved
  // brochures kept ft / m split fields. Support both shapes so
  // we don't regress legacy cabins.
  function specValue(verbatimKey, mKey, ftKey, unitFallback) {
    if (typeof specs[verbatimKey] === "string" && specs[verbatimKey].trim()) {
      return specs[verbatimKey].trim();
    }
    if (specs[mKey] != null || specs[ftKey] != null) {
      const parts = [];
      if (specs[mKey] != null) parts.push(`${specs[mKey]} m`);
      if (specs[ftKey] != null) parts.push(`${specs[ftKey]} ft`);
      return parts.join(" · ");
    }
    return unitFallback || null;
  }

  const lengthLine =
    specValue("length", "length_m", "length_ft") || cabin.vessel_length || null;
  const beamLine = specValue("beam", "beam_m", "beam_ft");
  const draftLine = specValue("draft", "draft_m", "draft_ft");
  const cruisingSpeedLine =
    (typeof specs.cruising_speed === "string" && specs.cruising_speed) ||
    (specs.cruising_speed_knots != null
      ? `${specs.cruising_speed_knots} knots`
      : null);
  const fuelLine =
    (typeof specs.fuel_consumption === "string" && specs.fuel_consumption) ||
    (specs.fuel_consumption_lt_hr != null
      ? `${specs.fuel_consumption_lt_hr} lt/hr`
      : null);

  // Photos arrive resolved (signed URLs) from the upstream
  // caller; we just split into hero + the rest of the gallery.
  const allPhotos = Array.isArray(photos) ? photos : [];
  const hero = allPhotos[0] || null;
  const galleryPhotos = allPhotos.slice(1);

  return (
    <section
      className={
        "cabin-vessel-block" + (asPage ? " cabin-vessel-block--page" : "")
      }
      aria-labelledby="cabin-vessel-block-title"
    >
      <div className="cabin-vessel-block__eyebrow">
        {typeLine || "Your yacht"}
      </div>
      <h2 className="cabin-vessel-block__title" id="cabin-vessel-block-title">
        <span className="cabin-vessel-block__title-name notranslate">{name}</span>
        {builderModel && (
          <span className="cabin-vessel-block__title-model">
            {" "}· <em>{builderModel}</em>
          </span>
        )}
      </h2>
      {year && (
        <div className="cabin-vessel-block__year">Built {year}</div>
      )}

      {/* 2026-05-23 — George after Olga friend-test: "θα ήταν
          ωραίο να μπορούν να τις αλλάζουν και να τις βλέπουν
          μεγάλες." Hero + thumbnails are now click-to-lightbox
          (arrows, keyboard ← →, swipe on touch, X to close). The
          PhotoGallery client component owns the modal; we hand it
          the full photo list (hero is index 0) and a render-prop
          to draw the triggers. */}
      {allPhotos.length > 0 && (
        <PhotoGallery photos={allPhotos} vesselName={name}>
          {({ open }) => (
            <>
              {hero && (
                <figure className="cabin-vessel-block__hero">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.url}
                    alt={hero.caption || `${name} at anchor`}
                    loading="eager"
                    onClick={() => open(0)}
                    style={{ cursor: "zoom-in" }}
                  />
                  {(hero.caption || hero.credit) && (
                    <figcaption>
                      {hero.caption}
                      {hero.credit && <em> · {hero.credit}</em>}
                    </figcaption>
                  )}
                </figure>
              )}

              {summary && (
                <p className="cabin-vessel-block__summary">{summary}</p>
              )}

              {features.length > 0 && (
                <div className="cabin-vessel-block__chapter">
                  <h3 className="cabin-vessel-block__chapter-label">
                    Key features
                  </h3>
                  <ul className="cabin-vessel-block__features">
                    {features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {galleryPhotos.length > 0 && (
                <div className="cabin-vessel-block__gallery">
                  {galleryPhotos.slice(0, 12).map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={p.url}
                      alt={p.caption || `${name} - ${i + 2}`}
                      className="cabin-vessel-block__gallery-tile"
                      loading="lazy"
                      onClick={() => open(i + 1)}
                      style={{ cursor: "zoom-in" }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </PhotoGallery>
      )}

      {/* Fallback: same hero + summary + features + gallery
          rendering used to live HERE without PhotoGallery wrapping.
          Kept commented as a reminder that allPhotos.length === 0
          falls through to summary/features only. */}
      {allPhotos.length === 0 && summary && (
        <p className="cabin-vessel-block__summary">{summary}</p>
      )}
      {allPhotos.length === 0 && features.length > 0 && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">Key features</h3>
          <ul className="cabin-vessel-block__features">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {(lengthLine ||
        beamLine ||
        draftLine ||
        specs.main_engines ||
        specs.generator ||
        cruisingSpeedLine ||
        fuelLine ||
        cabin.homeport ||
        cabin.cruising_area) && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">Specifications</h3>
          <dl className="cabin-vessel-block__specs">
            <Row term="Length overall" def={lengthLine} />
            <Row term="Beam" def={beamLine} />
            <Row term="Draft" def={draftLine} />
            <Row term="Main engines" def={specs.main_engines} />
            <Row term="Generator" def={specs.generator} />
            <Row term="Cruising speed" def={cruisingSpeedLine} />
            <Row term="Fuel consumption" def={fuelLine} />
            <Row term="Homeport" def={cabin.homeport} />
            <Row term="Cruising area" def={cabin.cruising_area} />
          </dl>
        </div>
      )}

      {(accommodation.guests ||
        accommodation.cabins_summary ||
        accommodation.crew_count ||
        accommodation.crew_summary) && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">Accommodation</h3>
          {/* 2026-05-22 — George's read on the EFFIE STAR preview:
              "Πώς γίνεται σε τέσσερις καμπίνες να κοιμούνται δέκα
               άνθρωποι?" The previous render put the brochure's
              verbatim sentence ("10 guests in 4 double cabins, all
              with en-suite facilities & 1 French double that
              shares bathroom") into a Row labelled "Cabins" — the
              label collided with the sentence's own subject and
              the customer read "4 cabins · 10 guests" without
              parsing the " & 1 French double" tail.
              Now: prose paragraphs in the brochure's own voice.
              The main sentence carries the layout AND the guest
              count; crew gets its own line so the count never
              competes with the cabin-layout count. */}
          <div className="cabin-vessel-block__accommodation">
            {accommodation.cabins_summary ? (
              <p>{accommodation.cabins_summary}</p>
            ) : accommodation.guests ? (
              <p>{accommodation.guests}</p>
            ) : null}
            {(accommodation.crew_count || accommodation.crew_summary) && (
              <p>
                <strong>Crew of {accommodation.crew_count || "-"}</strong>
                {accommodation.crew_summary
                  ? ` - ${accommodation.crew_summary}`
                  : null}
              </p>
            )}
          </div>
        </div>
      )}

      {amenities.length > 0 && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">On board</h3>
          <ul className="cabin-vessel-block__tags">
            {amenities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {(tender.make_model || toys.length > 0) && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">Tender &amp; water toys</h3>
          {tender.make_model && (
            <p className="cabin-vessel-block__tender">
              <strong>{tender.make_model}</strong>
              {tender.engine ? <> · {tender.engine}</> : null}
              {tender.length ? <> · {tender.length}</> : null}
              {tender.notes && (
                <em className="cabin-vessel-block__tender-notes">
                  {" "}· {tender.notes}
                </em>
              )}
            </p>
          )}
          {toys.length > 0 && (
            <ul className="cabin-vessel-block__tags cabin-vessel-block__tags--toys">
              {toys.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {areas.length > 0 && (
        <div className="cabin-vessel-block__chapter">
          <h3 className="cabin-vessel-block__chapter-label">Spaces aboard</h3>
          <ul className="cabin-vessel-block__tags">
            {areas.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .cabin-vessel-block {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 32px 28px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @media (max-width: 480px) {
          .cabin-vessel-block { padding: 24px 20px 22px 20px; gap: 14px; }
        }
        .cabin-vessel-block--page {
          /* When rendered as the dedicated /cabin/vessel page,
             drop the wrapping card chrome so it reads as the page
             itself rather than a card-on-card duplication. */
          background: transparent;
          border: 0;
          padding: 0;
        }
        .cabin-vessel-block__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-vessel-block__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 32px;
          line-height: 1.05;
          margin: 0;
          letter-spacing: -0.4px;
          color: var(--gy-navy);
        }
        @media (min-width: 768px) {
          .cabin-vessel-block__title { font-size: 44px; }
        }
        .cabin-vessel-block__title-model em {
          color: rgba(13, 27, 42, 0.7);
          font-style: italic;
          font-size: 0.7em;
          font-weight: 300;
          letter-spacing: 0;
        }
        .cabin-vessel-block__year {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
        }
        .cabin-vessel-block__hero {
          margin: 6px 0 4px 0;
          background: rgba(13, 27, 42, 0.06);
        }
        .cabin-vessel-block__hero img {
          width: 100%;
          height: auto;
          max-height: 460px;
          object-fit: cover;
          display: block;
        }
        .cabin-vessel-block__hero figcaption {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          padding: 8px 2px 0 2px;
        }
        .cabin-vessel-block__summary {
          font-family: var(--gy-font-editorial);
          font-size: 15.5px;
          line-height: 1.85;
          color: rgba(13, 27, 42, 0.78);
          margin: 0;
        }
        .cabin-vessel-block__chapter {
          padding: 18px 0 0 0;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cabin-vessel-block__chapter-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 0;
          font-weight: 500;
        }
        .cabin-vessel-block__features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cabin-vessel-block__features li {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.55;
          color: var(--gy-navy);
          padding-left: 18px;
          position: relative;
        }
        .cabin-vessel-block__features li::before {
          content: "·";
          position: absolute;
          left: 0;
          top: 0;
          color: var(--gy-gold);
          font-size: 24px;
          line-height: 1;
        }
        .cabin-vessel-block__gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        @media (min-width: 640px) {
          .cabin-vessel-block__gallery { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .cabin-vessel-block__gallery { grid-template-columns: repeat(4, 1fr); }
        }
        .cabin-vessel-block__gallery-tile {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          object-position: center;
          background: rgba(13, 27, 42, 0.06);
          display: block;
        }
        .cabin-vessel-block__specs {
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 560px) {
          .cabin-vessel-block__specs {
            grid-template-columns: 180px 1fr;
            column-gap: 22px;
          }
        }
        .cabin-vessel-block__specs dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          padding: 10px 0 4px;
        }
        .cabin-vessel-block__specs dd {
          margin: 0;
          padding: 0 0 10px;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          border-bottom: 1px solid rgba(13, 27, 42, 0.06);
        }
        @media (min-width: 560px) {
          .cabin-vessel-block__specs dt {
            padding-top: 10px;
            border-bottom: 1px solid rgba(13, 27, 42, 0.06);
          }
        }
        .cabin-vessel-block__accommodation {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cabin-vessel-block__accommodation p {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          line-height: 1.65;
          color: var(--gy-navy);
        }
        .cabin-vessel-block__accommodation p strong {
          font-weight: 600;
          color: var(--gy-navy);
        }
        .cabin-vessel-block__tags {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cabin-vessel-block__tags li {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: rgba(201, 168, 76, 0.08);
          border: 1px solid rgba(201, 168, 76, 0.35);
          color: var(--gy-navy);
          padding: 6px 11px 7px;
        }
        .cabin-vessel-block__tags--toys li {
          background: rgba(13, 27, 42, 0.04);
          border-color: rgba(13, 27, 42, 0.18);
        }
        .cabin-vessel-block__tender {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          margin: 0;
        }
        .cabin-vessel-block__tender strong {
          font-weight: 400;
        }
        .cabin-vessel-block__tender-notes {
          color: rgba(13, 27, 42, 0.6);
          font-style: italic;
        }
      `}</style>
    </section>
  );
}

function Row({ term, def }) {
  if (def == null || def === "" || def === false) return null;
  return (
    <>
      <dt>{term}</dt>
      <dd>{def}</dd>
    </>
  );
}
