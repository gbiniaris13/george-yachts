// Pre-filled summary card. Renders the static "Charter At-a-Glance"
// data the client should NEVER have to re-type.

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
      group: "Vessel",
      items: [
        ["Vessel", `${vessel.name || "—"}${vessel.make_model ? " · " + vessel.make_model : ""}`],
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
            <div className="cabin-at-a-glance__group-label">{g.group}</div>
            <dl>
              {g.items.map(([k, v]) => (
                <div key={k} className="cabin-at-a-glance__row">
                  <dt>{k}</dt>
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
             contrast ratio, failing WCAG AA. Margaret in her sunlit
             Cambridge sunroom couldn't read VESSEL / CHARTER PERIOD /
             PRINCIPAL CHARTERER / YOUR BROKER and assumed the site
             was broken. Switched to a flat slate that sits at ≈8:1. */
          color: #4b5563;
          font-weight: 600;
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
             ditto on the row labels — rgba(...,0.5) was ~3.5:1, also
             below WCAG AA on a white card. Flat slate, ≈8:1. */
          color: #4b5563;
          font-weight: 600;
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
