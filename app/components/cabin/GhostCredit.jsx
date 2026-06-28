// app/components/cabin/GhostCredit.jsx
// =============================================================
// 2026-05-21 — George directive (EFFIE STAR preview):
//   "This website was designed and built by GHOST_ — premium
//    digital agency for the discerning few ↗. Όπως έχουμε
//    και στο site μας. Θέλω και εδώ. Πες το για πλούσιους
//    ανθρώπους, πολύ κυριλαίο."
//
// The marketing site's Footer.jsx renders an identical credit
// strip; this is the cabin's quieter, ivory-on-cream version
// so the same hand signs the platform without overshouting the
// principal's own page. Both link to ghostwebdesign.dev (same
// owner — agency channel into the brokerage's own asset).
// =============================================================

export default function GhostCredit() {
  return (
    <aside className="cabin-ghost-credit" aria-label="Site credit">
      <a
        href="https://ghostwebdesign.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="cabin-ghost-credit__link"
      >
        This private cabin platform was designed and built by{" "}
        <strong className="cabin-ghost-credit__mark">GHOST_</strong>
        {" "}-{" "}
        <em className="cabin-ghost-credit__tagline">
          premium digital agency for the discerning few
        </em>
        {" "}↗
      </a>

      <style>{`
        .cabin-ghost-credit {
          margin-top: 28px;
          padding: 22px 0 0 0;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          text-align: center;
        }
        .cabin-ghost-credit__link {
          display: inline-block;
          font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
          font-size: 11.5px;
          letter-spacing: 0.12em;
          color: var(--gy-gold, #C9A84C);
          text-decoration: none;
          padding: 6px 10px;
          line-height: 1.65;
          transition: color 220ms ease, text-shadow 220ms ease;
        }
        .cabin-ghost-credit__link:hover {
          color: #E6C77A;
          text-shadow: 0 0 12px rgba(201, 168, 76, 0.45);
        }
        .cabin-ghost-credit__mark {
          font-weight: 700;
          color: #E6C77A;
          letter-spacing: 0.22em;
        }
        .cabin-ghost-credit__tagline {
          font-style: italic;
          opacity: 0.92;
        }
        @media (max-width: 480px) {
          .cabin-ghost-credit__link {
            font-size: 10.5px;
            padding: 4px 6px;
          }
        }
      `}</style>
    </aside>
  );
}
