// app/components/cabin/GroupReadiness.jsx
// =============================================================
// 2026-05-24 — George friend test 4 final.
//
// Principal-only progress card at the TOP of /cabin home.
// Shows a 0-100% bar of group readiness, broken down by:
//   • Crew lists complete (X of Y)
//   • Brief sections complete (X of Y)
//
// When both reach 100, the card flips to a green "Brief ready to
// send" state with a CTA that jumps to /cabin/brief/review where
// the principal hits Send to George.
//
// While anything's missing, the card lists who's pending + which
// sections are pending, so the principal knows where to nudge.
//
// Hidden for non-principal members + when brief is already
// submitted (it's locked, no need to nudge anyone any more).
// =============================================================

import Link from "next/link";

function pretty(sectionKey) {
  switch (sectionKey) {
    case "arrival":     return "Arrival & Departure";
    case "guests":      return "Your Group";
    case "health":      return "Health & Safety";
    case "itinerary":   return "Your Itinerary";
    case "life_aboard": return "Life Aboard";
    case "dining":      return "At the Table";
    case "beverages":   return "In the Cellar";
    default:            return sectionKey;
  }
}

export default function GroupReadiness({
  isPrincipal,
  briefSubmittedAt,
  groupReadinessPercent,
  groupFullyReady,
  crewListTotal,
  crewListReady,
  pendingCrewListMembers,
  briefSectionsTotal,
  briefSectionsReady,
  missingBriefSections,
}) {
  // Only the principal sees this — guests don't need a progress
  // bar; their /me page tells them their own status.
  if (!isPrincipal) return null;
  // Once locked, no need to show readiness — show in the bottom
  // of the page (existing locked banners handle that).
  if (briefSubmittedAt) return null;

  const pct = Math.max(0, Math.min(100, groupReadinessPercent));

  return (
    <section
      className={
        "gr" + (groupFullyReady ? " gr--ready" : "")
      }
      aria-label="Group readiness"
    >
      <header className="gr__head">
        <span className="gr__eyebrow">
          {groupFullyReady ? "Brief ready" : "Group readiness"}
        </span>
        <span className="gr__pct">{pct}%</span>
      </header>

      <div className="gr__bar" role="progressbar"
           aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="gr__bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {groupFullyReady ? (
        <>
          <p className="gr__copy">
            Every crew list is in. Every brief section is filled.
            Your group is ready to send the brief to George — one
            final read, then off it goes.
          </p>
          <Link href="/cabin/brief/review" className="gr__cta">
            Review &amp; send to George →
          </Link>
        </>
      ) : (
        <>
          <p className="gr__copy">
            Send-to-George unlocks at 100%. Two halves combine:
            crew-list essentials from every guest, and every
            brief section marked complete (food, drinks, health,
            itinerary, the lot). Patricia, Bill and Eleanna
            edit the same shared brief together — anyone&apos;s
            edits move this bar.
          </p>

          <div className="gr__lanes">
            {/* Lane 1 — Crew lists */}
            <div className="gr__lane">
              <div className="gr__lane-head">
                <strong>Crew lists</strong>
                <span>
                  {crewListReady} of {crewListTotal}
                </span>
              </div>
              {pendingCrewListMembers.length > 0 && (
                <ul className="gr__lane-list">
                  {pendingCrewListMembers.slice(0, 6).map((m, i) => (
                    <li key={`${m.name}-${i}`}>
                      {m.name}
                      {m.role === "principal_charterer" && (
                        <em> · you</em>
                      )}
                    </li>
                  ))}
                  {pendingCrewListMembers.length > 6 && (
                    <li>
                      <em>
                        + {pendingCrewListMembers.length - 6} more
                      </em>
                    </li>
                  )}
                </ul>
              )}
              {pendingCrewListMembers.length === 0 && (
                <p className="gr__lane-done">All in. ✓</p>
              )}
            </div>

            {/* Lane 2 — Brief sections */}
            <div className="gr__lane">
              <div className="gr__lane-head">
                <strong>Brief sections</strong>
                <span>
                  {briefSectionsReady} of {briefSectionsTotal}
                </span>
              </div>
              {missingBriefSections.length > 0 && (
                <ul className="gr__lane-list">
                  {missingBriefSections.slice(0, 6).map((k) => (
                    <li key={k}>{pretty(k)}</li>
                  ))}
                  {missingBriefSections.length > 6 && (
                    <li>
                      <em>
                        + {missingBriefSections.length - 6} more
                      </em>
                    </li>
                  )}
                </ul>
              )}
              {missingBriefSections.length === 0 && (
                <p className="gr__lane-done">All filled. ✓</p>
              )}
            </div>
          </div>

          <p className="gr__nudge">
            Need to nudge someone? Open{" "}
            <Link href="/cabin/guests">Your Group</Link>{" "}
            to resend their invite, or open{" "}
            <Link href="/cabin/brief">The Brief</Link>{" "}
            to fill the missing sections together.
          </p>
        </>
      )}

      <style>{`
        .gr {
          margin: 0 0 28px 0;
          padding: 22px 24px 20px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 4px;
        }
        .gr--ready {
          border-color: rgba(76, 138, 88, 0.55);
          border-left-color: #4C8A58;
          background: #F5FAF5;
        }
        .gr__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .gr__eyebrow {
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: #0D1B2A;
          font-weight: 700;
        }
        .gr--ready .gr__eyebrow { color: #2D5C36; }
        .gr__pct {
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 22px;
          font-weight: 700;
          color: #0D1B2A;
          letter-spacing: -0.2px;
        }
        .gr--ready .gr__pct { color: #2D5C36; }
        .gr__bar {
          height: 6px;
          background: rgba(13, 27, 42, 0.08);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .gr__bar-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--gy-gold) 0%,
            #d8b756 100%
          );
          transition: width 320ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gr--ready .gr__bar-fill {
          background: linear-gradient(90deg, #4C8A58 0%, #6BB078 100%);
        }
        .gr__copy {
          margin: 0 0 16px 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 14px;
          color: #0D1B2A;
          line-height: 1.6;
        }
        .gr__lanes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 14px;
        }
        @media (max-width: 599.98px) {
          .gr__lanes { grid-template-columns: 1fr; }
        }
        .gr__lane {
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid rgba(201, 168, 76, 0.22);
          border-radius: 3px;
        }
        .gr__lane-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .gr__lane-head strong {
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 10px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: #0D1B2A;
          font-weight: 700;
        }
        .gr__lane-head span {
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 13px;
          color: #0D1B2A;
          font-weight: 600;
        }
        .gr__lane-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .gr__lane-list li {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 13px;
          color: #0D1B2A;
          line-height: 1.45;
          padding-left: 12px;
          position: relative;
        }
        .gr__lane-list li::before {
          content: "·";
          position: absolute;
          left: 0;
          color: var(--gy-gold, #C9A84C);
          font-weight: 700;
        }
        .gr__lane-list em {
          font-style: italic;
          color: rgba(13, 27, 42, 0.65);
        }
        .gr__lane-done {
          margin: 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 13px;
          color: #2D5C36;
          font-style: italic;
        }
        .gr__nudge {
          margin: 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-style: italic;
          font-size: 13px;
          color: rgba(13, 27, 42, 0.65);
          line-height: 1.55;
        }
        .gr__nudge a {
          color: #0D1B2A;
          text-decoration: none;
          border-bottom: 1px solid var(--gy-gold, #C9A84C);
          padding-bottom: 1px;
        }
        .gr__nudge a:hover {
          color: var(--gy-gold, #C9A84C);
        }
        .gr__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 14px 26px;
          background: #2D5C36;
          color: #ffffff;
          border: 1px solid #4C8A58;
          border-radius: 3px;
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
          margin-top: 6px;
        }
        .gr__cta:hover { background: #1F4426; }
      `}</style>
    </section>
  );
}
