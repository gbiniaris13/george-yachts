"use client";

// app/components/cabin/brief/SharedBriefIndicator.jsx
// =============================================================
// 2026-05-23 — SHARED BRIEF MODEL (George friend test 4 final).
//
// Quiet single line above each shared brief section. Tells the
// member who opened the page WHO edited the section last and
// WHEN, so they know what they're picking up — and that any
// changes they make will land on top of the previous author's
// work (last edit wins in the shared-document model).
//
// Example renders:
//   "This is your group's shared brief. Patricia opened it
//    3 minutes ago — your edits land on the same page."
//   "Nobody has touched this section yet. You're the first."
//
// Lightweight: one GET per mount, no polling. Refresh button
// for when a member knows someone else is editing in parallel.
// =============================================================

import { useEffect, useState } from "react";

function formatAgo(iso) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  // For older edits, show a clean date rather than an ageing
  // "47 days ago" that reads as stale.
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function SharedBriefIndicator({ sectionKey }) {
  const [state, setState] = useState({
    loaded: false,
    editorName: null,
    editedAt: null,
    refreshing: false,
  });

  async function load() {
    setState((s) => ({ ...s, refreshing: true }));
    try {
      // Reuse the group-voices endpoint — it already returns the
      // canonical brief's last_edited info via the "shared-brief"
      // voice. The endpoint is force-dynamic + no-store so we
      // always see the freshest state.
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
      const sharedVoice = (j?.voices || []).find(
        (v) => v.kind === "shared-brief",
      );
      if (sharedVoice) {
        // sublabel format: "last edited by Patricia". Strip the
        // prefix so we can re-compose with our own sentence.
        const m = (sharedVoice.sublabel || "").match(
          /^last edited by (.+)$/i,
        );
        setState({
          loaded: true,
          editorName: m ? m[1] : null,
          editedAt: sharedVoice.updatedAt || null,
          refreshing: false,
        });
      } else {
        setState({
          loaded: true,
          editorName: null,
          editedAt: null,
          refreshing: false,
        });
      }
    } catch {
      setState({
        loaded: true,
        editorName: null,
        editedAt: null,
        refreshing: false,
      });
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  if (!state.loaded) {
    return (
      <aside className="sbi sbi--loading" aria-label="Shared brief, loading">
        <span className="sbi__chip">Shared brief</span>
        <span className="sbi__copy sbi__copy--muted">loading…</span>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </aside>
    );
  }

  const hasEditor = Boolean(state.editorName);
  const ago = formatAgo(state.editedAt);

  return (
    <aside className="sbi" aria-label="Shared brief — last activity">
      <span className="sbi__chip">Shared brief</span>
      <span className="sbi__copy">
        {hasEditor ? (
          <>
            <strong>{state.editorName}</strong> edited this section
            {ago ? <> {ago}</> : null}. Your edits land on the same
            page — last to write wins, so check the form below
            before changing anything you didn&apos;t add.
          </>
        ) : (
          <>
            Nobody has touched this section yet. You&apos;re the
            first — anything you fill in becomes the starting point
            for everyone in your group.
          </>
        )}
      </span>
      <button
        type="button"
        className="sbi__refresh"
        onClick={load}
        disabled={state.refreshing}
        aria-label="Refresh last-edited info"
      >
        {state.refreshing ? "↻" : "↻"}
      </button>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </aside>
  );
}

const styles = `
  .sbi {
    margin: 0 0 22px 0;
    padding: 12px 14px;
    background: #FCFAF4;
    border: 1px solid rgba(201, 168, 76, 0.32);
    border-left: 3px solid var(--gy-gold);
    border-radius: 3px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .sbi--loading { opacity: 0.7; }
  .sbi__chip {
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 2.4px;
    text-transform: uppercase;
    color: var(--gy-gold);
    font-weight: 600;
    flex-shrink: 0;
  }
  .sbi__copy {
    flex: 1;
    min-width: 0;
    font-family: var(--gy-font-editorial);
    font-size: 13.5px;
    color: var(--gy-navy);
    line-height: 1.55;
  }
  .sbi__copy strong {
    font-weight: 600;
    color: var(--gy-navy);
  }
  .sbi__copy--muted {
    font-style: italic;
    color: rgba(13, 27, 42, 0.55);
  }
  .sbi__refresh {
    background: transparent;
    border: 1px solid rgba(13, 27, 42, 0.18);
    color: rgba(13, 27, 42, 0.65);
    font-family: var(--gy-font-ui);
    font-size: 14px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1;
  }
  .sbi__refresh:hover:not(:disabled) {
    color: var(--gy-navy);
    border-color: var(--gy-gold);
  }
  .sbi__refresh:disabled {
    opacity: 0.55;
    cursor: default;
    animation: sbi-spin 0.9s linear infinite;
  }
  @keyframes sbi-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
