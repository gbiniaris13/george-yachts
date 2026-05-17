"use client";

// useBriefAutosave — fetches initial section data and persists
// changes back to /api/cabin/brief/:section with a debounce.
//
// Returns:
//   { initialData, state, save }
//
//   initialData       — what the form should reset to once loaded
//   state             — 'loading' | 'idle' | 'saving' | 'saved' | 'error'
//   save(data)        — triggers a debounced PUT
//   saveImmediate()   — flush any pending debounced save
//
// Bug-protection:
//   • Latest-write-wins via a per-call seq id; out-of-order PUTs
//     don't move the state from saved back to saving.
//   • AbortController on in-flight requests when a newer save fires.
//   • Network errors surface as 'error' but never throw; retried
//     on next change.

import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 600;

export default function useBriefAutosave(sectionKey) {
  const [initialData, setInitialData] = useState(null);
  const [state, setState] = useState("loading");
  const seqRef = useRef(0);
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const pendingPayloadRef = useRef(null);

  // ---- initial load ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/cabin/brief/${sectionKey}`,
          { credentials: "same-origin" }
        );
        if (!r.ok) throw new Error("load-failed");
        const json = await r.json();
        if (!cancelled) {
          setInitialData(json.data ?? {});
          setState("idle");
        }
      } catch {
        if (!cancelled) {
          setInitialData({});
          setState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  // ---- save fn (debounced) ----
  const save = useCallback(
    (data) => {
      pendingPayloadRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flushSave();
      }, DEBOUNCE_MS);
    },
    [sectionKey]   // eslint-disable-line react-hooks/exhaustive-deps
  );

  const flushSave = useCallback(async () => {
    const payload = pendingPayloadRef.current;
    if (payload == null) return;
    pendingPayloadRef.current = null;

    const seq = ++seqRef.current;
    setState("saving");

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const r = await fetch(`/api/cabin/brief/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ data: payload }),
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error(`save-${r.status}`);
      if (seq === seqRef.current) setState("saved");
    } catch (err) {
      if (err?.name === "AbortError") return;
      if (seq === seqRef.current) setState("error");
    }
  }, [sectionKey]);

  // ---- cleanup ----
  // On unmount (typically the user clicked Next/Back), flush any
  // pending debounced save first. Without this, a 600ms-old edit
  // is silently dropped because the timer is cleared without
  // firing. We must NOT abort the in-flight request here either
  // — let it complete so the data lands server-side.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        // Fire-and-forget; the request will complete even after the
        // component is gone because fetch is not tied to React.
        void flushSave();
      }
      // Intentionally do NOT call abortRef.current.abort() — the
      // request that's already in-flight should be allowed to land.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flush on visibility change (user backgrounds the tab)
  useEffect(() => {
    function onHide() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        flushSave();
      }
    }
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [flushSave]);

  return { initialData, state, save, saveImmediate: flushSave };
}
