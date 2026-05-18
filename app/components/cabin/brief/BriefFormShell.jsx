"use client";

// Wraps every section form. Owns the autosave subscription so the
// section components only render fields and call onChange.

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useBriefAutosave from "./useBriefAutosave";
import SaveStatus from "./SaveStatus";
import Link from "next/link";

export default function BriefFormShell({
  sectionKey,
  defaultValues,
  children,
  prevSection,
  nextSection,
  // When true, the last-section "Submit Brief" CTA appears in
  // place of "Next →". Used on /cabin/brief/little-things.
  isLastSection = false,
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmitBrief() {
    setSubmitting(true);
    setSubmitErr(null);
    try {
      const r = await fetch("/api/cabin/brief/submit", { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error("submit-failed");
      setSubmitted(true);
      // Small celebratory pause, then return to overview.
      setTimeout(() => router.push("/cabin/brief?submitted=1"), 1200);
    } catch {
      setSubmitErr("Could not finalise just now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }
  const { initialData, state, save } = useBriefAutosave(sectionKey);

  const form = useForm({
    mode: "onBlur",
    defaultValues: defaultValues ?? {},
  });

  // Reset when data loads
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.reset({ ...defaultValues, ...initialData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Subscribe to changes → debounced save.
  // We track `state` via a ref so the effect doesn't re-subscribe
  // on every state transition (loading → idle → saving → saved). We
  // also gate on `type === "change"` so `form.reset()` after load
  // doesn't kick off a save with the just-loaded server data.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => {
    const sub = form.watch((value, info) => {
      if (stateRef.current === "loading") return;
      if (info?.type && info.type !== "change") return;
      save(value);
    });
    return () => sub.unsubscribe();
  }, [form, save]);

  if (state === "loading") {
    return (
      <div className="brief-shell-loading">
        <div className="brief-shell-loading__skel" />
        <div className="brief-shell-loading__skel" />
        <div className="brief-shell-loading__skel" />
        <style>{`
          .brief-shell-loading { display: flex; flex-direction: column; gap: 16px; }
          .brief-shell-loading__skel {
            height: 36px;
            background: linear-gradient(90deg,
              rgba(13,27,42,0.06) 25%,
              rgba(13,27,42,0.12) 37%,
              rgba(13,27,42,0.06) 63%);
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
        `}</style>
      </div>
    );
  }

  return (
    <form
      className="brief-shell"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      {children({ register: form.register, watch: form.watch, control: form.control })}
      <nav className="brief-shell__nav">
        {prevSection ? (
          <Link href={`/cabin/brief/${prevSection.key.replace(/_/g, "-")}`}>
            ← {prevSection.title}
          </Link>
        ) : (
          <Link href="/cabin/brief">← Back to overview</Link>
        )}
        {nextSection && (
          <Link href={`/cabin/brief/${nextSection.key.replace(/_/g, "-")}`}>
            Next · {nextSection.title} →
          </Link>
        )}
        {!nextSection && isLastSection && (
          <button
            type="button"
            className="brief-shell__submit"
            onClick={onSubmitBrief}
            disabled={submitting || submitted}
          >
            {submitted
              ? "✓ Sent to George"
              : submitting
              ? "Sending…"
              : "I'm done — send to George"}
          </button>
        )}
      </nav>
      {submitErr && (
        <p className="brief-shell__err" role="alert">{submitErr}</p>
      )}
      <SaveStatus state={state} />

      <style>{`
        .brief-shell {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .brief-shell__nav {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          flex-wrap: wrap;
        }
        .brief-shell__nav a {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--gy-navy);
          text-decoration: none;
          padding: 10px 0;
        }
        .brief-shell__submit {
          background: var(--gy-navy);
          color: var(--gy-ivory);
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 12px 22px;
          border: 1px solid var(--gy-gold);
          cursor: pointer;
          transition: background 160ms ease;
        }
        .brief-shell__submit:hover:not(:disabled) { background: #142233; }
        .brief-shell__submit:disabled { opacity: 0.7; cursor: default; }
        .brief-shell__err {
          color: #b14a3a;
          font-family: var(--gy-font-editorial);
          font-style: italic;
          margin: 12px 0 0 0;
        }
        .brief-shell__nav a:hover { color: var(--gy-gold); }
      `}</style>
    </form>
  );
}
