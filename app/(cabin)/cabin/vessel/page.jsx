// /cabin/vessel — Read-only. Combines the basic columns on
// `cabins` with the rich vessel_brochure JSONB that Claude
// extracts from the operator's brochure PDF.
//
// NEVER displays vessel_owner_internal or central_agent_internal.

import { redirect } from "next/navigation";
import { readSessionFromCookies, pickActiveCabinId } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

export const metadata = { title: "Your vessel" };

function fmtNum(n, suffix = "") {
  if (n == null || n === "") return null;
  const num = typeof n === "number" ? n : Number(String(n).replace(",", "."));
  if (!Number.isFinite(num)) return null;
  // Locale-friendly decimal
  return `${num.toLocaleString("en-GB", { maximumFractionDigits: 2 })}${suffix}`;
}

export default async function VesselPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) redirect("/cabin/login");
  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, vessel_make_model, vessel_length, vessel_capacity, homeport, cruising_area, vessel_brochure, vessel_photos")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) return null;

  const brochure = (cabin.vessel_brochure && typeof cabin.vessel_brochure === "object")
    ? cabin.vessel_brochure
    : {};

  // 2026-05-20 — Friend-test pass 4 (Tyler, David, Helen):
  //   "Vessel page has NO photos. The most evocative page in the
  //    Cabin has been left empty."
  // Pull from the new cabins.vessel_photos column (array of {url,
  // caption?, credit?}). George pastes URLs in GY Command.
  const photos = Array.isArray(cabin.vessel_photos)
    ? cabin.vessel_photos.filter((p) => p && typeof p.url === "string" && p.url.trim().length > 0)
    : [];

  const name = brochure.vessel_name || cabin.vessel_name;
  const typeLine = brochure.type_line;
  const builderModel = brochure.builder_model || cabin.vessel_make_model;
  const year = brochure.year_built;
  const summary = brochure.summary;
  const features = Array.isArray(brochure.key_features) ? brochure.key_features : [];
  const specs = brochure.specifications || {};
  const accommodation = brochure.accommodation || {};
  const amenities = Array.isArray(brochure.amenities) ? brochure.amenities : [];
  const tender = brochure.tender || {};
  const toys = Array.isArray(brochure.water_toys) ? brochure.water_toys : [];
  const areas = Array.isArray(brochure.areas) ? brochure.areas : [];

  // Length: prefer brochure spec, fall back to free-form cabin field
  const lengthLine =
    specs.length_m && specs.length_ft
      ? `${fmtNum(specs.length_m, " m")} · ${fmtNum(specs.length_ft, " ft")}`
      : cabin.vessel_length || null;

  return (
    <article>
      <SectionTitle
        kicker="Your vessel"
        title="A quiet introduction to"
        italic="your week at sea."
      />

      {/* 2026-05-20 — Pass 4: photo gallery above the hero text.
          If George hasn't pasted any URLs yet, we show a calm
          placeholder rather than leaving the page bare. */}
      {photos.length > 0 ? (
        <section className="vs-gallery" aria-label="Vessel photos">
          {photos.slice(0, 1).map((p, i) => (
            <figure key={i} className="vs-gallery__hero">
              {/* Plain <img> — these are URLs to external hosts and
                  not in next.config remotePatterns. Avoid the image
                  rewrite pipeline. */}
              <img src={p.url} alt={p.caption || name} />
              {(p.caption || p.credit) && (
                <figcaption>
                  {p.caption}
                  {p.credit && <em> · {p.credit}</em>}
                </figcaption>
              )}
            </figure>
          ))}
          {photos.length > 1 && (
            <div className="vs-gallery__rail">
              {photos.slice(1, 9).map((p, i) => (
                <figure key={i} className="vs-gallery__tile">
                  <img src={p.url} alt={p.caption || `${name} ${i + 2}`} />
                </figure>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="vs-placeholder">
          <div className="vs-placeholder__inner">
            <span className="vs-placeholder__glyph" aria-hidden>⛵</span>
            <p>
              Photographs of {name || "your vessel"} are uploaded to the
              Cabin a week before embarkation. If you would like to see them
              sooner,{" "}
              <a href="mailto:george@georgeyachts.com">write to George</a>{" "}
              and we will share the gallery directly.
            </p>
          </div>
        </section>
      )}

      {/* HERO */}
      <section className="vs-hero">
        {typeLine && <div className="vs-hero__kicker">{typeLine}</div>}
        <h2 className="vs-hero__name">{name}</h2>
        {(builderModel || year) && (
          <div className="vs-hero__sub">
            {builderModel}
            {year ? ` · built ${year}` : ""}
          </div>
        )}
        {summary && <p className="vs-hero__summary">{summary}</p>}
      </section>

      {features.length > 0 && (
        <section className="vs-block">
          <h3 className="vs-block__label">At a glance</h3>
          <ul className="vs-features">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {(specs && Object.keys(specs).length > 0) && (
        <section className="vs-block">
          <h3 className="vs-block__label">Specifications</h3>
          <dl className="vs-specs">
            {lengthLine && <Row term="Length overall" def={lengthLine} />}
            {specs.beam_m && (
              <Row
                term="Beam"
                def={`${fmtNum(specs.beam_m, " m")}${specs.beam_ft ? " · " + fmtNum(specs.beam_ft, " ft") : ""}`}
              />
            )}
            {specs.draft_m && (
              <Row
                term="Draft"
                def={`${fmtNum(specs.draft_m, " m")}${specs.draft_ft ? " · " + fmtNum(specs.draft_ft, " ft") : ""}`}
              />
            )}
            {specs.main_engines && <Row term="Main engines" def={specs.main_engines} />}
            {specs.generator && <Row term="Generator" def={specs.generator} />}
            {specs.cruising_speed_knots != null && (
              <Row term="Cruising speed" def={`${specs.cruising_speed_knots} knots`} />
            )}
            {specs.fuel_consumption_lt_hr != null && (
              <Row term="Fuel consumption" def={`${specs.fuel_consumption_lt_hr} lt / hr`} />
            )}
            {cabin.homeport && <Row term="Homeport" def={cabin.homeport} />}
            {cabin.cruising_area && <Row term="Cruising area" def={cabin.cruising_area} />}
          </dl>
        </section>
      )}

      {(accommodation && (accommodation.guests || accommodation.cabins_summary || accommodation.crew_summary)) && (
        <section className="vs-block">
          <h3 className="vs-block__label">Accommodation</h3>
          <dl className="vs-specs">
            {accommodation.guests != null && (
              <Row term="Guests" def={`Up to ${accommodation.guests}`} />
            )}
            {accommodation.cabins_summary && (
              <Row term="Cabins" def={accommodation.cabins_summary} />
            )}
            {accommodation.crew_count != null && (
              <Row term="Crew" def={`${accommodation.crew_count}${accommodation.crew_summary ? " · " + accommodation.crew_summary : ""}`} />
            )}
          </dl>
        </section>
      )}

      {amenities.length > 0 && (
        <section className="vs-block">
          <h3 className="vs-block__label">On board</h3>
          <ul className="vs-tags">
            {amenities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      {(tender?.make_model || toys.length > 0) && (
        <section className="vs-block">
          <h3 className="vs-block__label">Tender & water toys</h3>
          {tender?.make_model && (
            <div className="vs-tender">
              <strong>{tender.make_model}</strong>
              {tender.engine ? <> · {tender.engine}</> : null}
              {tender.length_m ? <> · {fmtNum(tender.length_m, " m")}</> : null}
              {tender.notes && (
                <p className="vs-tender__notes">
                  <em>{tender.notes}</em>
                </p>
              )}
            </div>
          )}
          {toys.length > 0 && (
            <ul className="vs-tags vs-tags--toys">
              {toys.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {areas.length > 0 && (
        <section className="vs-block">
          <h3 className="vs-block__label">Spaces aboard</h3>
          <ul className="vs-tags">
            {areas.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <style>{`
        /* Vessel photo gallery (pass-4 addition) */
        .vs-gallery {
          margin: 8px 0 28px 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .vs-gallery__hero {
          margin: 0;
          background: rgba(13,27,42,0.06);
          position: relative;
        }
        .vs-gallery__hero img {
          width: 100%;
          height: auto;
          max-height: 460px;
          object-fit: cover;
          display: block;
        }
        .vs-gallery__hero figcaption {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13,27,42,0.55);
          padding: 8px 2px 0 2px;
        }
        .vs-gallery__hero figcaption em {
          font-style: normal;
          color: rgba(13,27,42,0.4);
        }
        .vs-gallery__rail {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        @media (min-width: 640px) {
          .vs-gallery__rail { grid-template-columns: repeat(4, 1fr); }
        }
        .vs-gallery__tile {
          margin: 0;
          aspect-ratio: 4 / 3;
          background: rgba(13,27,42,0.06);
          overflow: hidden;
        }
        .vs-gallery__tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Calm placeholder when no photos uploaded yet */
        .vs-placeholder {
          background: linear-gradient(135deg, rgba(13,27,42,0.04), rgba(201,168,76,0.06));
          border: 1px solid rgba(13,27,42,0.08);
          padding: 36px 24px;
          text-align: center;
          margin: 8px 0 28px 0;
        }
        .vs-placeholder__inner {
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .vs-placeholder__glyph {
          font-size: 36px;
          color: var(--gy-gold);
        }
        .vs-placeholder p {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          color: rgba(13,27,42,0.65);
          margin: 0;
          line-height: 1.65;
        }
        .vs-placeholder a {
          color: var(--gy-gold);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
        }

        .vs-hero {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 36px 32px 32px;
          margin-top: 28px;
        }
        .vs-hero__kicker {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .vs-hero__name {
          font-family: var(--gy-font-editorial);
          font-size: 38px;
          font-weight: 300;
          margin: 10px 0 4px 0;
          letter-spacing: 1px;
          color: var(--gy-ivory);
          line-height: 1.05;
        }
        @media (min-width: 560px) {
          .vs-hero__name { font-size: 52px; }
        }
        .vs-hero__sub {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14.5px;
          color: rgba(248,245,240,0.8);
        }
        .vs-hero__summary {
          margin: 22px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-size: 15.5px;
          line-height: 1.85;
          color: rgba(248,245,240,0.92);
        }

        .vs-block {
          margin-top: 22px;
          background: #ffffff;
          border: 1px solid rgba(13,27,42,0.08);
          padding: 24px 24px 22px;
        }
        .vs-block__label {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .vs-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .vs-features li {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          line-height: 1.55;
          color: var(--gy-navy);
          padding-left: 22px;
          position: relative;
        }
        .vs-features li::before {
          content: "·";
          position: absolute;
          left: 0; top: 0;
          color: var(--gy-gold);
          font-size: 28px;
          line-height: 1;
        }

        .vs-specs {
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 560px) {
          .vs-specs { grid-template-columns: 200px 1fr; column-gap: 24px; }
        }
        .vs-specs dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13,27,42,0.55);
          padding: 12px 0 4px;
        }
        .vs-specs dd {
          margin: 0;
          padding: 0 0 12px;
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          color: var(--gy-navy);
          border-bottom: 1px solid rgba(13,27,42,0.06);
        }
        @media (min-width: 560px) {
          .vs-specs dt {
            padding-top: 10px;
            border-bottom: 1px solid rgba(13,27,42,0.06);
          }
          .vs-specs dd { padding-top: 10px; }
        }

        .vs-tags {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .vs-tags li {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.35);
          color: var(--gy-navy);
          padding: 7px 12px 8px;
        }
        .vs-tags--toys li {
          background: rgba(13,27,42,0.04);
          border-color: rgba(13,27,42,0.18);
        }
        .vs-tender {
          font-family: var(--gy-font-editorial);
          font-size: 15.5px;
          color: var(--gy-navy);
          margin-bottom: 14px;
        }
        .vs-tender strong {
          font-weight: 400;
          color: var(--gy-navy);
        }
        .vs-tender__notes {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: rgba(13,27,42,0.6);
        }
      `}</style>
    </article>
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
