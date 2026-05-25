"use client";

// app/components/cabin/brief/GroupVoicesPanel.jsx
// =============================================================
// 2026-05-23 — Multi-user Brief (Phase 3, MUB-A).
//
// "What your group has added so far" — collapsible card mounted
// at the top of every collaborative section page so a member
// arriving second/third/fourth can see what the earlier members
// have already voiced. George's spec:
//
//   "Όταν μπαίνει ο καινούριος χρήστης να βλέπει τι έχει
//    βάλει ο προηγούμενος ... ο Βασίλης θα προσθέσει αν θέλει
//    βότκα ... η Ιωάννα θα δει ότι ήδη υπάρχουν 3 άτομα και
//    έχουν συμπληρώσει αυτά."
//
// Renders nothing if no other voices exist yet — keeps the form
// quiet for the very first member to land on the section.
//
// Vote-style display (per George's chosen conflict model):
// every voice keeps its own picks. The panel just exposes them.
// No merging, no overwriting, no editing other people's data
// from this surface — each member edits ONLY their own form.
// =============================================================

import { useEffect, useState } from "react";

export default function GroupVoicesPanel({ sectionKey }) {
  const [voices, setVoices] = useState(null); // null = loading, [] = none
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    setError(false);
    try {
      // 2026-05-23 — Cache-busting query param + no-store. Friend
      // test 4: Vasilis's browser was serving a stale empty
      // response from his earlier visit (before Patricia had
      // saved her brief). The query param + headers force a
      // fresh trip to our origin every mount + every Refresh
      // click — costs nothing (the API is also force-dynamic).
      const r = await fetch(
        `/api/cabin/brief/${sectionKey}/group-voices?_=${Date.now()}`,
        {
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        },
      );
      if (!r.ok) throw new Error("load-failed");
      const j = await r.json();
      setVoices(Array.isArray(j?.voices) ? j.voices : []);
    } catch {
      setVoices([]);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) {
        // no-op; setVoices already ran but the user navigated away
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  // 2026-05-23 — Friend test 4: render a small loading skeleton
  // instead of null so the panel ALWAYS occupies space. Previous
  // null-return meant a member would see nothing while loading and
  // assume the feature wasn't there. Plus a cream chip flashes
  // "LIVE — your group" so it's obviously the live area.
  if (voices === null) {
    return (
      <aside className="gvp gvp--loading" aria-label="Your group, loading">
        <span className="gvp__eyebrow">Your group so far · loading</span>
        <div className="gvp__skel" />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </aside>
    );
  }

  // No voices yet: render a single line of quiet copy so the
  // member knows the feature exists, then the form below takes
  // their input.
  if (voices.length === 0) {
    return (
      <aside className="gvp gvp--empty" aria-label="Your group">
        <header className="gvp__head">
          <span className="gvp__eyebrow">Your group so far</span>
          <button
            type="button"
            className="gvp__refresh"
            onClick={load}
            disabled={refreshing}
            aria-label="Refresh group voices"
          >
            {refreshing ? "Refreshing…" : "Refresh ↻"}
          </button>
        </header>
        <p className="gvp__empty-copy">
          {error
            ? "Couldn't load what others have shared just now. Your own answers below still save normally."
            : "No-one else has shared their picks for this section yet. As they do, their voices will appear here so you can see what's been added before you."}
        </p>

        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </aside>
    );
  }

  return (
    <aside className="gvp" aria-label="What your group has added">
      <header className="gvp__head">
        <span className="gvp__eyebrow">Your group so far</span>
        <span className="gvp__count">
          {voices.length} voice{voices.length === 1 ? "" : "s"} added
          <button
            type="button"
            className="gvp__refresh"
            onClick={load}
            disabled={refreshing}
            aria-label="Refresh group voices"
          >
            {refreshing ? "↻ refreshing…" : "↻ refresh"}
          </button>
        </span>
      </header>
      <p className="gvp__intro">
        Every voice keeps its own picks — yours go below. The hostess
        sees them all together when the brief is sent. You don&apos;t
        need to match anyone; just share what feels right for you.
      </p>

      <div className="gvp__list">
        {voices.map((v, idx) => (
          <details
            key={`${v.kind}-${v.memberId || "shared"}-${idx}`}
            className="gvp__voice"
          >
            <summary>
              <strong>{v.name}</strong>
              {v.sublabel && (
                <span className="gvp__sublabel"> · {v.sublabel}</span>
              )}
              {v.highlights?.length > 0 && (
                <span className="gvp__glance">
                  {" — "}
                  {v.highlights.slice(0, 2).join(" · ")}
                </span>
              )}
              {(!v.highlights || v.highlights.length === 0) && (
                <span className="gvp__glance gvp__glance--empty">
                  {" — opened but hasn't picked anything yet"}
                </span>
              )}
            </summary>
            {v.highlights?.length > 0 && (
              <ul className="gvp__bullets">
                {v.highlights.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </details>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </aside>
  );
}

// Single styles block reused by both render paths (empty + full).
const styles = `
  .gvp {
    margin: 0 0 24px 0;
    padding: 16px 18px 14px;
    background: #FCFAF4;
    border: 1px solid rgba(201, 168, 76, 0.32);
    border-left: 3px solid var(--gy-gold);
    border-radius: 3px;
  }
  .gvp--empty {
    background: rgba(201, 168, 76, 0.05);
  }
  .gvp__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .gvp__eyebrow {
    font-family: var(--gy-font-ui);
    font-size: 11px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--gy-gold);
    font-weight: 600;
  }
  .gvp__count {
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: rgba(13, 27, 42, 0.6);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  /* Refresh button — same family as the count, but the icon
     gives it a tap-able feel without competing visually. */
  .gvp__refresh {
    background: transparent;
    border: 1px solid rgba(13, 27, 42, 0.18);
    color: rgba(13, 27, 42, 0.65);
    font-family: var(--gy-font-ui);
    font-size: 9.5px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 2px;
    min-height: 28px;
  }
  .gvp__refresh:hover:not(:disabled) {
    color: var(--gy-navy);
    border-color: var(--gy-gold);
  }
  .gvp__refresh:disabled { opacity: 0.55; cursor: default; }
  /* Loading skeleton — keeps the panel's footprint stable while
     the first fetch completes. */
  .gvp__skel {
    height: 60px;
    background: linear-gradient(
      90deg,
      rgba(13,27,42,0.04) 25%,
      rgba(13,27,42,0.10) 37%,
      rgba(13,27,42,0.04) 63%
    );
    background-size: 400% 100%;
    animation: gvp-shimmer 1.4s infinite;
    margin-top: 8px;
    border-radius: 3px;
  }
  @keyframes gvp-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }
  .gvp__intro {
    margin: 4px 0 12px 0;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 13.5px;
    color: rgba(13, 27, 42, 0.7);
    line-height: 1.55;
  }
  .gvp__empty-copy {
    margin: 4px 0 0 0;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 13.5px;
    color: rgba(13, 27, 42, 0.6);
    line-height: 1.55;
  }
  .gvp__list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gvp__voice {
    background: #ffffff;
    border: 1px solid rgba(201, 168, 76, 0.22);
    border-radius: 3px;
  }
  .gvp__voice > summary {
    cursor: pointer;
    list-style: none;
    padding: 10px 14px;
    font-family: var(--gy-font-editorial);
    font-size: 13.5px;
    color: var(--gy-navy);
    line-height: 1.5;
  }
  .gvp__voice > summary::before {
    content: "+ ";
    color: var(--gy-gold);
    font-weight: 600;
  }
  .gvp__voice[open] > summary::before { content: "− "; }
  .gvp__voice > summary strong {
    font-family: var(--gy-font-ui);
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gy-navy);
    font-weight: 600;
  }
  .gvp__sublabel {
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 12px;
    color: rgba(13, 27, 42, 0.55);
  }
  .gvp__glance {
    color: rgba(13, 27, 42, 0.65);
  }
  .gvp__glance--empty {
    color: rgba(13, 27, 42, 0.42);
    font-style: italic;
  }
  .gvp__bullets {
    list-style: none;
    margin: 0;
    padding: 0 14px 12px 28px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--gy-font-editorial);
    font-size: 13px;
    color: rgba(13, 27, 42, 0.78);
    line-height: 1.55;
  }
  .gvp__bullets li {
    position: relative;
  }
  .gvp__bullets li::before {
    content: "·";
    position: absolute;
    left: -12px;
    color: var(--gy-gold);
  }
`;
