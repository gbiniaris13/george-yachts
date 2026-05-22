// app/components/cabin/VesselTeaser.jsx
// =============================================================
// 2026-05-21 — George's directive (EFFIE STAR preview):
//   "Μετά από το Your First Step να είναι μία μίνι μπροσούρα
//    του σκάφους. Δυο-τρία πραγματάκια για το σκάφος, τρεις
//    φωτογραφίες σε μικρά τετραγωνάκια. Να τους καψουρέψουμε
//    λίγα με το που μπαίνει ο άλλος, να γουστάρει."
//
// Sits beneath the "Your First Step" CTA on /cabin home. NOT
// the same as the full /cabin/vessel page — this is a small,
// editorial pull: a calm intro line, three vessel facts (year /
// builder · model / length OR capacity), and three landscape
// photo tiles. A discreet "See the full vessel" link delivers
// the customer to the rich /cabin/vessel page.
//
// Renders nothing if there are no usable photos AND no facts.
// Always reads from the cabin row that's already been queried
// upstream — no extra DB round trip.
// =============================================================

import Link from "next/link";

function joinFacts(items) {
  // Pure helper — filter nullish, take first 3, render as
  // "value · value · value" pairs of label/value.
  return items.filter((it) => it && it.value).slice(0, 3);
}

export default function VesselTeaser({ cabin, photos: resolvedPhotos }) {
  if (!cabin) return null;

  const brochure =
    cabin.vessel_brochure && typeof cabin.vessel_brochure === "object"
      ? cabin.vessel_brochure
      : {};
  // 2026-05-22 — Photos come from the resolver upstream (which
  // signs storage paths to URLs and filters bad entries). If
  // they aren't supplied we fall back to the raw column for
  // backwards compatibility, but the customer-facing renderers
  // should always be passing resolved photos.
  const photos = Array.isArray(resolvedPhotos) && resolvedPhotos.length > 0
    ? resolvedPhotos
    : Array.isArray(cabin.vessel_photos)
      ? cabin.vessel_photos.filter(
          (p) => p && typeof p?.url === "string" && p.url.trim().length > 0,
        )
      : [];

  // Three tile photos. We deliberately SKIP photos[0] because
  // that's already the VesselHero band at the top of the page —
  // showing the same photo twice in the same scroll is the kind
  // of small repetition that breaks the feeling of being walked
  // through a yacht thoughtfully.
  const tilePhotos = photos.slice(1, 4);

  // 2-3 facts. The brochure schema (Roberto P1 verbatim mandate)
  // gives us length / beam / draft as strings WITH units, plus
  // year_built and builder_model. We pick the 3 most evocative
  // for a teaser: year + builder/model + length (or capacity if
  // length is missing).
  const facts = joinFacts([
    {
      label: "Year",
      value: brochure.year_built || null,
    },
    {
      label: "Builder",
      // Prefer the verbose verbatim builder_model when present;
      // fall back to the flat vessel_make_model column.
      value: brochure.builder_model || cabin.vessel_make_model || null,
    },
    {
      label: "Length",
      value:
        brochure.specifications?.length ||
        cabin.vessel_length ||
        null,
    },
  ]);

  // Drop in capacity if length wasn't available and we have
  // capacity instead — never show fewer than the natural number
  // of facts available.
  if (facts.length < 3 && cabin.vessel_capacity) {
    facts.push({ label: "Guests", value: `${cabin.vessel_capacity}` });
  }

  // If we have neither facts nor tile photos, bail. The
  // VesselHero band above already does the "you have a yacht"
  // statement; rendering an empty teaser would be visual noise.
  if (facts.length === 0 && tilePhotos.length === 0) {
    return null;
  }

  return (
    <section className="cabin-vessel-teaser" aria-labelledby="cabin-vessel-teaser-title">
      <div className="cabin-vessel-teaser__eyebrow">Aboard {cabin.vessel_name || "your yacht"}</div>
      <h3 className="cabin-vessel-teaser__title" id="cabin-vessel-teaser-title">
        A first look at the boat carrying you.
      </h3>
      <p className="cabin-vessel-teaser__lede">
        The full tour — every cabin, every deck, every quiet detail — lives a
        click away. For now, a few quick lines.
      </p>

      {facts.length > 0 && (
        <dl className="cabin-vessel-teaser__facts">
          {facts.map((f) => (
            <div key={f.label} className="cabin-vessel-teaser__fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {tilePhotos.length > 0 && (
        <div
          className="cabin-vessel-teaser__photos"
          data-count={tilePhotos.length}
        >
          {tilePhotos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.url + i}
              src={p.url}
              alt={p.caption || `${cabin.vessel_name || "Your yacht"} — photo ${i + 2}`}
              className="cabin-vessel-teaser__photo"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      )}

      <Link href="/cabin/vessel" className="cabin-vessel-teaser__more">
        See the full vessel ›
      </Link>

      <style>{`
        .cabin-vessel-teaser {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 28px 26px 26px 26px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (max-width: 480px) {
          .cabin-vessel-teaser { padding: 22px 20px 22px 20px; gap: 14px; }
        }
        .cabin-vessel-teaser__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-vessel-teaser__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 24px;
          line-height: 1.2;
          margin: 0;
          color: var(--gy-navy);
        }
        @media (min-width: 768px) {
          .cabin-vessel-teaser__title { font-size: 28px; }
        }
        .cabin-vessel-teaser__lede {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          font-style: italic;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.65);
          margin: 0;
        }
        .cabin-vessel-teaser__facts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 8px 0 0 0;
          padding: 18px 0;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          border-bottom: 1px solid rgba(13, 27, 42, 0.08);
        }
        @media (max-width: 480px) {
          .cabin-vessel-teaser__facts {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 14px 0;
          }
        }
        .cabin-vessel-teaser__fact {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cabin-vessel-teaser__fact dt {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-vessel-teaser__fact dd {
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          color: var(--gy-navy);
          margin: 0;
        }
        .cabin-vessel-teaser__photos {
          display: grid;
          /* Three square-ish tiles, side by side on desktop, stacked
             pair-and-tall on mobile. We use aspect-ratio so the
             images never stretch — object-fit: cover crops to fill. */
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .cabin-vessel-teaser__photos[data-count="1"] {
          grid-template-columns: 1fr;
        }
        .cabin-vessel-teaser__photos[data-count="2"] {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 480px) {
          .cabin-vessel-teaser__photos {
            grid-template-columns: repeat(2, 1fr);
          }
          .cabin-vessel-teaser__photos[data-count="3"] .cabin-vessel-teaser__photo:first-child {
            grid-column: 1 / -1;
          }
        }
        .cabin-vessel-teaser__photo {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
          display: block;
          background: #050505;
        }
        .cabin-vessel-teaser__more {
          align-self: flex-start;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px solid currentColor;
          margin-top: 4px;
        }
        .cabin-vessel-teaser__more:hover {
          color: var(--gy-navy);
        }
      `}</style>
    </section>
  );
}
