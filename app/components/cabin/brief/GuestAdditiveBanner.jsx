"use client";

// app/components/cabin/brief/GuestAdditiveBanner.jsx
// =============================================================
// 2026-05-24 — Angeliki pass (item 6).
//
// On the shared brief sections (dining + beverages), guests see
// the group's accumulated choices in the form. Without an
// explanation they assume they can REMOVE other members' picks
// the same way they can add their own. The server now refuses
// to accept removals from non-principals (mergeForGuest), but
// the UI needs to tell the user that BEFORE they try and feel
// like nothing's happening.
//
// This is a quiet single-line note that only renders for guests
// (not the principal). Server-fetched role check via the same
// /api/cabin/me endpoint the page already calls for other
// reasons; cheap and consistent.
// =============================================================

import { useEffect, useState } from "react";

export default function GuestAdditiveBanner() {
  const [isGuest, setIsGuest] = useState(null); // null = unknown
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cabin/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j?.ok) {
          setIsGuest(j?.member?.role !== "principal_charterer");
        } else {
          setIsGuest(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsGuest(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isGuest) return null;

  return (
    <aside className="gab" role="note">
      <span className="gab__chip">Shared with your group</span>
      <p className="gab__copy">
        <em>
          The choices below are the whole group&apos;s — what you see
          already-ticked was added by others. Anything you tick
          here{" "}<strong>adds</strong> to the group&apos;s choices.
          You can&apos;t un-tick someone else&apos;s pick; only the
          principal charterer can edit and remove on the review
          page before sending the brief to George.
        </em>
      </p>
      <style jsx>{`
        .gab {
          margin: 0 0 22px 0;
          padding: 14px 18px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold);
          border-radius: 3px;
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }
        .gab__chip {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 600;
          flex-shrink: 0;
        }
        .gab__copy {
          margin: 0;
          flex: 1;
          min-width: 0;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: var(--gy-navy);
          line-height: 1.6;
        }
        .gab__copy strong { font-weight: 600; color: var(--gy-navy); }
      `}</style>
    </aside>
  );
}
