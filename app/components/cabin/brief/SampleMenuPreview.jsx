// app/components/cabin/brief/SampleMenuPreview.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 3.
//
// George's note (paraphrased):
//   "I upload the vessel's sample menu in GY Command. When the
//    charterer gets to At The Table, they should see the chef's
//    proposal first — then start ticking what they like. That
//    way they're not filling preferences in a vacuum."
//
// So this is a collapsed-by-default summary of cabins.sample_menu
// that the client can expand inline. Fetches from
// /api/cabin/sample-menu (read-only). If the cabin doesn't have a
// menu yet (some don't), we render nothing — no empty state.
// =============================================================
"use client";

import { useEffect, useState } from "react";
import { presentDish } from "@/lib/cabin/menu-format";

// 2026-05-20 — Friend-test pass 4: dish transforms (Nutella rename,
// sentence-case, Greek gloss) lifted to lib/cabin/menu-format so
// /cabin/menu (server) and this component (client) stay consistent.

export default function SampleMenuPreview() {
  const [menu, setMenu] = useState(null);
  const [loaded, setLoaded] = useState(false);
  // 2026-05-20 — Friend-test pass 4 (George): "Καλό θα ήταν αυτό
  // να ήταν πάντα ανοιχτό για να το διαβάσουν σίγουρα και μετά
  // να πάνε από κάτω." Default open; collapse stays available
  // via the toggle for guests who want to skip it.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/sample-menu")
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        setMenu(j?.menu ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;
  // No menu uploaded yet — quietly render nothing.
  if (!menu || !menu.sections?.length) return null;

  return (
    <section className="smp">
      <button
        type="button"
        className="smp__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="smp__eyebrow">From the galley</span>
        <span className="smp__title">
          {menu.title || "What the chef proposes"}
        </span>
        <span className="smp__chev" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <p className="smp__intro">
        <em>
          This is the chef’s working menu for vessels like yours — a starting
          point. Read it through, then mark below what your group enjoys and
          what to leave aside. The menu adapts to you.
        </em>
      </p>

      {open && (
        <div className="smp__body">
          {menu.tagline && <p className="smp__tagline">{menu.tagline}</p>}
          <div className="smp__sections">
            {menu.sections.map((s, i) => (
              <div key={i} className="smp__section">
                <h4 className="smp__section-name">{s.name}</h4>
                {s.dishes.length > 0 && (
                  <ul className="smp__dishes">
                    {s.dishes.map((d, di) => {
                      const { label, gloss } = presentDish(d);
                      return (
                        <li key={di}>
                          {label}
                          {gloss && (
                            <em className="smp__dish-gloss">
                              {" "}— {gloss}
                            </em>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .smp {
          margin: 8px 0 28px 0;
          padding: 0;
          background: rgba(201, 168, 76, 0.06);
          border-left: 2px solid var(--gy-gold);
        }
        .smp__toggle {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 16px 18px 12px 18px;
          text-align: left;
          cursor: pointer;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: baseline;
          gap: 4px;
          font-family: inherit;
        }
        .smp__eyebrow {
          grid-column: 1;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .smp__title {
          grid-column: 1;
          font-family: var(--gy-font-editorial);
          font-size: 18px;
          font-weight: 400;
          color: var(--gy-navy);
          margin-top: 4px;
        }
        .smp__chev {
          grid-column: 2;
          grid-row: 1 / span 2;
          align-self: center;
          font-family: var(--gy-font-ui);
          font-size: 22px;
          color: var(--gy-gold);
          font-weight: 300;
          padding-left: 16px;
        }
        .smp__intro {
          padding: 0 18px 14px 18px;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.7);
          line-height: 1.65;
          margin: 0;
        }
        .smp__body {
          padding: 0 18px 18px 18px;
          border-top: 1px dashed rgba(13, 27, 42, 0.1);
        }
        .smp__tagline {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          color: rgba(13, 27, 42, 0.65);
          margin: 12px 0 14px 0;
        }
        .smp__sections {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 600px) {
          .smp__sections { grid-template-columns: 1fr 1fr; gap: 14px 24px; }
        }
        .smp__section-name {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-gold);
          margin: 6px 0 4px 0;
          font-weight: 500;
        }
        .smp__dishes {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .smp__dishes li {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.55;
          color: var(--gy-navy);
          padding: 3px 0;
        }
        .smp__dish-gloss {
          font-style: italic;
          color: rgba(13, 27, 42, 0.55);
          font-size: 12.5px;
        }
      `}</style>
    </section>
  );
}
