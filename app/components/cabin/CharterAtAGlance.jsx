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
        .cabin-at-a-glance__label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          margin-bottom: 14px;
        }
        .cabin-at-a-glance__card {
          background: #ffffff;
          border: 1px solid rgba(201, 168, 76, 0.4);
          padding: 28px 24px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .cabin-at-a-glance__group-label {
          font-family: var(--gy-font-ui);
          font-size: 9.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          /* 2026-05-21 — Pass 7 (Margaret, BLOCKER #3):
             the previous rgba(13,27,42,0.4) over the card's white
             background blended to roughly RGB(158,164,170) — a 2.7:1
             contrast ratio, failing WCAG AA. Switched to flat slate
             at ≈8:1.
             2026-05-21 — Pass 7 re-check (Domingo):
             reported computed style still showing cream-on-white
             after Batch 5 deploy. The cabin-tones.css rule already
             carries !important, and the production CSS bundle does
             include it — but a defensive !important here too means
             the inline style block alone is enough to guarantee
             readability regardless of any future stylesheet
             reordering or scope drift. Cheap insurance. */
          color: #1f2937 !important;
          font-weight: 600 !important;
          margin-bottom: 10px;
        }
        .cabin-at-a-glance__group dl {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cabin-at-a-glance__row {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 16px;
          font-family: var(--gy-font-body);
          font-size: 14px;
          line-height: 1.55;
        }
        @media (max-width: 480px) {
          .cabin-at-a-glance__row {
            grid-template-columns: 100px 1fr;
            gap: 10px;
          }
        }
        .cabin-at-a-glance__row dt {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          /* 2026-05-21 — Pass 7 contrast pass (Margaret):
             rgba(...,0.5) was ~3.5:1, below WCAG AA on a white card.
             Belt-and-braces with !important after Domingo Pass 7
             re-check flagged the group-label as still cream — same
             insurance applied here so both label tiers are
             unambiguously dark. */
          color: #1f2937 !important;
          font-weight: 600 !important;
          padding-top: 3px;
        }
        .cabin-at-a-glance__row dd {
          margin: 0;
          font-family: var(--gy-font-editorial);
          font-size: 16px;
          color: var(--gy-navy);
        }
        .cabin-at-a-glance__row .muted {
          color: rgba(13, 27, 42, 0.3);
        }
        .cabin-at-a-glance__correction {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          color: rgba(13, 27, 42, 0.55);
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          padding-top: 14px;
          margin: 6px 0 0 0;
        }
        .cabin-at-a-glance__correction a {
          color: var(--gy-gold);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
        }
        .cabin-at-a-glance__ics {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12.5px;
          margin: 10px 0 0 0;
        }
        .cabin-at-a-glance__ics a {
          color: var(--gy-gold);
          text-decoration: none;
        }
        .cabin-at-a-glance__ics a:hover {
          border-bottom: 1px solid currentColor;
        }
      `}</style>
    </section>
  );
}
