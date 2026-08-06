// The weeks George actually proposed, rendered from The Helm.
//
// 2026-08-06. Deliberately a SERVER component with every day visible: no
// accordion, no "use client", nothing behind a toggle. The three signature
// routes further up the page live inside a collapsed accordion, which is fine
// for a reader who wants to browse, but these are the routes we want Google and
// the AI answer engines to read in full, so they are plain text in the DOM from
// the first byte.
//
// Data: lib/proposedItineraries.js (verbatim from helm_requests.proposal_json).

import Link from "next/link";
import { PROPOSED_ITINERARIES } from "@/lib/proposedItineraries";

const GOLD = "#C9A84C";
const CREAM = "#F8F5F0";

export default function ProposedItineraries() {
  if (!PROPOSED_ITINERARIES.length) return null;

  return (
    <section
      id="proposed-weeks"
      style={{
        padding: "96px 24px",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        background: "rgba(201,168,76,0.02)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
            margin: "0 0 14px",
          }}
        >
          From the desk
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 300,
            color: CREAM,
            margin: "0 0 20px",
            lineHeight: 1.15,
          }}
        >
          Five weeks I proposed this season
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 16,
            lineHeight: 1.75,
            color: "rgba(248,245,240,0.82)",
            fontWeight: 300,
            margin: "0 0 12px",
            maxWidth: 660,
          }}
        >
          These are not sample routes written for a website. Each one below was written for a real
          enquiry this season and sent out as part of a proposal, then copied here word for word.
          The families and the yachts stay private. The weeks do not need to.
        </p>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(248,245,240,0.55)",
            fontWeight: 300,
            margin: "0 0 56px",
            maxWidth: 660,
          }}
        >
          Every one of them is a Saturday to Saturday week out of Athens, and every one was changed
          again after the first conversation. That is the point of them: a starting shape, not a
          fixed product.
        </p>

        {PROPOSED_ITINERARIES.map((it) => (
          <article
            key={it.id}
            id={it.id}
            style={{
              marginBottom: 52,
              paddingBottom: 44,
              borderBottom: "1px solid rgba(248,245,240,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 10px",
              }}
            >
              {it.region} · {it.month} · Seven nights from Athens
            </p>
            <h3
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 10px",
                lineHeight: 1.2,
              }}
            >
              {it.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.72)",
                fontWeight: 300,
                margin: "0 0 6px",
                maxWidth: 640,
              }}
            >
              {it.why}
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 13,
                color: "rgba(248,245,240,0.42)",
                fontWeight: 300,
                margin: "0 0 26px",
              }}
            >
              Written for: {it.partyLine}.
            </p>

            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {it.days.map((d) => (
                <li
                  key={d.day}
                  style={{
                    display: "flex",
                    gap: 22,
                    padding: "16px 0",
                    borderTop: "1px solid rgba(248,245,240,0.05)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--gy-font-editorial)",
                      fontSize: 20,
                      fontWeight: 300,
                      color: GOLD,
                      minWidth: 62,
                      lineHeight: 1.3,
                    }}
                  >
                    Day {d.day}
                  </span>
                  <span style={{ flex: 1 }}>
                    <strong
                      style={{
                        display: "block",
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: CREAM,
                        margin: "0 0 5px",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {d.leg}
                    </strong>
                    <span
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "rgba(248,245,240,0.62)",
                        fontWeight: 300,
                      }}
                    >
                      {d.note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.5)",
                fontWeight: 300,
                margin: "22px 0 0",
              }}
            >
              Ports of call: {it.stops.join(" · ")}. More on{" "}
              <Link
                href={`/destinations/${it.slugRegion}`}
                style={{
                  color: GOLD,
                  textDecoration: "none",
                  borderBottom: `1px solid rgba(201,168,76,0.45)`,
                }}
              >
                {it.region} yacht charter
              </Link>
              .
            </p>
          </article>
        ))}

        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 16,
            lineHeight: 1.75,
            color: "rgba(248,245,240,0.82)",
            fontWeight: 300,
            margin: 0,
            maxWidth: 660,
          }}
        >
          If one of these reads like your week, tell me the month and the group and I will send the
          yachts that fit it. If none of them does, that is more useful still:{" "}
          <Link
            href="/inquiry"
            style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.45)` }}
          >
            write to George
          </Link>{" "}
          and the next one gets written for you.
        </p>
      </div>
    </section>
  );
}
