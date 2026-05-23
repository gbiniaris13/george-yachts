// Pre-filled summary card. Renders the static "Charter At-a-Glance"
// data the client should NEVER have to re-type.
//
// 2026-05-21 — Pass 7 batch 9: group-headers and row-keys use the
// ForceDarkLabel client subcomponent which writes color + font-weight
// directly to element.style via DOM API with 'important' priority.
// Background: Domingo's third pass on the same contrast item still
// measured ivory on the group-headers despite three layers of fix
// in the CSS cascade. ForceDarkLabel is the cascade-bypass we owe
// him after three round trips.
import ForceDarkLabel from "./ForceDarkLabel";

function dateLine(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function CharterAtAGlance({ summary }) {
  if (!summary) return null;
  // Deep-default so a partial summary (missing one of vessel /
  // charter / charterer / broker) renders empty rows rather than
  // crashing with "Cannot read properties of undefined".
  const vessel    = summary.vessel    || {};
  const charter   = summary.charter   || {};
  const charterer = summary.charterer || {};
  const broker    = summary.broker    || {};
  const rows = [
    {
      // 2026-05-21 — Pass 7 follow-up (George):
      //   "Vessel / Vessel / EFFIE STAR · Lagoon 51 — λέει δύο
      //    φορές vessel." The group header read VESSEL and the
      //    first row label also read Vessel. Two labels for one
      //    thing read as a copy bug. Renamed the row to "Name" —
      //    it's the vessel's name + make/model, no longer a
      //    semantic clash with the section header.
      group: "Vessel",
      items: [
        ["Name", `${vessel.name || "—"}${vessel.make_model ? " · " + vessel.make_model : ""}`],
        ["Length", vessel.length],
        ["Homeport", vessel.homeport],
      ],
    },
    {
      group: "Charter Period",
      items: [
        ["From", dateLine(charter.from)],
        ["To", dateLine(charter.to)],
        ["Embarkation", charter.embarkation],
        ["Disembarkation", charter.disembarkation],
        ["Cruising area", charter.area],
      ],
    },
    {
      // 2026-05-21 — Pass 7 (Domingo, Tyler, David, Margaret):
      //   the principal charterer's email and mobile were rendered
      //   on the home page, visible to every guest of the cabin —
      //   not just the principal themselves. That's PII of another
      //   person leaking to ten other people. Even the principal
      //   doesn't need to see their own email here (they typed it).
      //   Removed both fields. Only the principal's NAME remains so
      //   guests still know whose voyage they're aboard.
      //   The cabin record still stores principal_charterer_email
      //   and _mobile for broker operations — they just don't
      //   surface in customer-facing UI any more.
      group: "Principal Charterer",
      items: [
        ["Name", charterer.name],
      ],
    },
    {
      group: "Your Broker",
      items: [
        ["Broker", broker.name],
        ["Email", broker.email],
        ["Calls (Athens)", broker.mobile],
        ["WhatsApp (US)", broker.whatsapp],
      ],
    },
  ];

  return (
    <section className="cabin-at-a-glance" aria-label="Charter at a glance">
      <div className="cabin-at-a-glance__label">Charter at a Glance</div>
      <div className="cabin-at-a-glance__card">
        {rows.map((g) => (
          <div className="cabin-at-a-glance__group" key={g.group}>
            <ForceDarkLabel className="cabin-at-a-glance__group-label">
              {g.group}
            </ForceDarkLabel>
            <dl>
              {g.items.map(([k, v]) => (
                <div key={k} className="cabin-at-a-glance__row">
                  <ForceDarkLabel as="dt">{k}</ForceDarkLabel>
                  <dd>{v || <span className="muted">—</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        <p className="cabin-at-a-glance__correction">
          See something we got wrong?{" "}
          <a href="mailto:george@georgeyachts.com?subject=Cabin%20correction">
            Tell George
          </a>{" "}
          — we will fix it before you do anything else.
        </p>
        {/* 2026-05-20 — Pass 4 (Tyler): "A real .ics download
            anywhere." Single quiet link beneath the glance card. */}
        <p className="cabin-at-a-glance__ics">
          <a href="/api/cabin/calendar.ics" download>
            ✦ Add these dates to your calendar
          </a>
        </p>
      </div>

      <style>{`
        /* 2026-05-23 — Graphic-designer pass after George flagged the
           previous layout as "πρόχειρο, δεν μ' αρέσει εκεί που κάθονται
           τα γράμματα". Reworked into a boutique catalogue page:
             • Cream/ivory inner with hairline gold border
             • Vessel name as large Fraunces italic display headline
             • Section groups separated by quiet gold hairlines
             • Right-aligned labels in narrow column, left-aligned
               values in wider column (the museum-plate convention)
             • Tighter typographic rhythm, real OpenType numerals */
        .cabin-at-a-glance {
          margin: 28px 0 36px;
        }
        .cabin-at-a-glance__label {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.78);
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          justify-content: center;
        }
        .cabin-at-a-glance__label::before,
        .cabin-at-a-glance__label::after {
          content: "";
          display: inline-block;
          width: 36px;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(201, 168, 76, 0.6) 50%,
            transparent
          );
        }
        .cabin-at-a-glance__card {
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-radius: 6px;
          padding: 40px 44px 32px 44px;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow:
            0 1px 2px rgba(13, 27, 42, 0.04),
            0 4px 12px rgba(13, 27, 42, 0.05),
            0 12px 36px rgba(13, 27, 42, 0.07);
          position: relative;
        }
        /* Foil-gold ornament at the top centre of the card. */
        .cabin-at-a-glance__card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(201, 168, 76, 0.75) 50%,
            transparent
          );
        }
        .cabin-at-a-glance__group {
          padding: 18px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.18);
        }
        .cabin-at-a-glance__group:first-of-type {
          border-top: none;
          padding-top: 4px;
        }
        .cabin-at-a-glance__group-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3.4px;
          text-transform: uppercase;
          color: #1f2937 !important;
          font-weight: 600 !important;
          margin-bottom: 14px;
        }
        .cabin-at-a-glance__group dl {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cabin-at-a-glance__row {
          display: grid;
          grid-template-columns: 150px 1fr;
          column-gap: 28px;
          row-gap: 4px;
          align-items: baseline;
          font-family: var(--gy-font-body);
          line-height: 1.5;
        }
        .cabin-at-a-glance__row dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.7) !important;
          font-weight: 600 !important;
          text-align: right;
          padding-top: 4px;
        }
        .cabin-at-a-glance__row dd {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 17px;
          line-height: 1.4;
          color: var(--gy-navy);
          letter-spacing: 0.1px;
          font-feature-settings: "kern" 1, "liga" 1, "lnum" 1, "onum" 0;
        }
        .cabin-at-a-glance__row .muted {
          color: rgba(13, 27, 42, 0.32);
          font-style: italic;
        }
        /* Vessel name (first row of VESSEL group) — display headline. */
        .cabin-at-a-glance__group:first-of-type .cabin-at-a-glance__row:first-of-type dd {
          font-family: var(--gy-font-display), "Fraunces", Georgia, serif;
          font-size: 22px;
          font-style: italic;
          font-weight: 350;
          letter-spacing: -0.005em;
          line-height: 1.2;
        }
        .cabin-at-a-glance__correction {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.6);
          border-top: 1px solid rgba(201, 168, 76, 0.18);
          padding-top: 16px;
          margin: 18px 0 0 0;
          text-align: center;
        }
        .cabin-at-a-glance__correction a {
          color: var(--gy-navy);
          text-decoration: none;
          background-image: linear-gradient(
            to right,
            var(--gy-gold), var(--gy-gold)
          );
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
          transition: background-size 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cabin-at-a-glance__correction a:hover {
          background-size: 100% 2px;
        }
        .cabin-at-a-glance__ics {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          margin: 12px 0 0 0;
          text-align: center;
        }
        .cabin-at-a-glance__ics a {
          color: var(--gy-navy);
          text-decoration: none;
          background-image: linear-gradient(
            to right,
            var(--gy-gold), var(--gy-gold)
          );
          background-size: 100% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          padding-bottom: 1px;
          transition: background-size 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cabin-at-a-glance__ics a:hover {
          background-size: 100% 2px;
        }
        @media (max-width: 560px) {
          .cabin-at-a-glance__card {
            padding: 28px 22px 24px;
          }
          .cabin-at-a-glance__row {
            grid-template-columns: 110px 1fr;
            column-gap: 16px;
          }
          .cabin-at-a-glance__row dt {
            font-size: 9.5px;
            letter-spacing: 1.8px;
          }
          .cabin-at-a-glance__row dd {
            font-size: 15px;
          }
          .cabin-at-a-glance__group:first-of-type .cabin-at-a-glance__row:first-of-type dd {
            font-size: 19px;
          }
        }
        @media (max-width: 380px) {
          .cabin-at-a-glance__row {
            grid-template-columns: 1fr;
            row-gap: 2px;
          }
          .cabin-at-a-glance__row dt {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
}
