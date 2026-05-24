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

// 2026-05-22 — Admin preview mode detection.
//
// When an admin clicks "Preview as customer" in the CRM, the
// landing handler sets a `gy_cabin_preview` cookie alongside
// the session cookie. The edge middleware then 403s every
// /api/cabin/* write so the admin can't accidentally save
// chat / brief / mood-board entries under the customer's
// identity.
//
// Without this guard, the brief autosave would still TRY every
// 600 ms — get 403 — surface the "Couldn't save" toast — make
// George (admin) think something is broken when it's actually
// the safety-by-design. Now: skip the network entirely when the
// preview cookie is present, and report state === "preview" so
// SaveStatus can show a calm "preview — not saved" indicator
// instead of the error toast.
function isPreviewMode() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("gy_cabin_preview="));
}

// 2026-05-23 — Multi-user Brief (Phase 3). endpointBase added so
// the same autosave engine drives BOTH:
//   • Principal brief sections   → /api/cabin/brief/:section
//     (writes to cabin_brief_sections, per-cabin canonical row)
//   • Guest contribution pages   → /api/cabin/me/contribution/:section
//     (writes to cabin_brief_contributions, per-member row)
// The hook itself is endpoint-agnostic; the caller picks which.
export default function useBriefAutosave(
  sectionKey,
  endpointBase = "/api/cabin/brief",
) {
  const [initialData, setInitialData] = useState(null);
  const [state, setState] = useState("loading");
  const seqRef = useRef(0);
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const pendingPayloadRef = useRef(null);
  const previewRef = useRef(false);

  useEffect(() => {
    previewRef.current = isPreviewMode();
  }, []);

  // ---- initial load ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `${endpointBase}/${sectionKey}`,
          { credentials: "same-origin" }
        );
        if (!r.ok) throw new Error("load-failed");
        const json = await r.json();
        if (!cancelled) {
          setInitialData(json.data ?? {});
          // 2026-05-22 — Preview sessions land on "preview"
          // straight away. SaveStatus renders a calm "Admin
          // preview · not saving" indicator instead of running
          // the saving / saved / error states the autosave
          // hook would otherwise produce.
          setState(isPreviewMode() ? "preview" : "idle");
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
      // 2026-05-22 — Preview mode: skip the network entirely.
      // The middleware would 403 every write anyway; making the
      // request just to learn that wastes a round-trip and
      // surfaces a misleading "Couldn't save" toast. Quietly
      // accept the edit, stay in "preview" state.
      if (previewRef.current) {
        setState("preview");
        return;
      }
      pendingPayloadRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flushSave();
      }, DEBOUNCE_MS);
    },
    [sectionKey]   // eslint-disable-line react-hooks/exhaustive-deps
  );

  // 2026-05-20 — friend-test fix. The original implementation said
  // "retrying" in the UI but actually only retried when the user
  // typed something new. With the schema-level fixes most validation
  // failures are gone, but network blips still happen. One inline
  // retry-with-backoff (1.5s then give up) covers transient
  // hiccups; the SaveStatus copy "keep typing to retry" still
  // tells the user the action is on them if the retry fails.
  const flushSave = useCallback(async () => {
    // 2026-05-22 — Belt-and-braces: even if a flush is invoked
    // outside the debounce path (visibility change, unmount,
    // pagehide), skip the network when in preview mode.
    if (previewRef.current) {
      pendingPayloadRef.current = null;
      setState("preview");
      return;
    }
    const payload = pendingPayloadRef.current;
    if (payload == null) return;
    pendingPayloadRef.current = null;

    const seq = ++seqRef.current;
    setState("saving");

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    async function attempt() {
      const r = await fetch(`${endpointBase}/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ data: payload }),
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error(`save-${r.status}`);
      return r;
    }

    try {
      await attempt();
      if (seq === seqRef.current) setState("saved");
    } catch (err1) {
      if (err1?.name === "AbortError") return;
      // One-shot retry after 1.5s for transient errors. We do NOT
      // retry on validation errors (4xx) because the same payload
      // will fail again, but we keep the check cheap by accepting
      // all errors here — the second failure surfaces correctly.
      try {
        await new Promise((res) => setTimeout(res, 1500));
        if (seq !== seqRef.current || ctrl.signal.aborted) return;
        await attempt();
        if (seq === seqRef.current) setState("saved");
      } catch (err2) {
        if (err2?.name === "AbortError") return;
        if (seq === seqRef.current) setState("error");
      }
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
