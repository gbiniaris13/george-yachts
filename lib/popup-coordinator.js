// Popup coordinator (Roberto 2026-05-02)
//
// Centralised gate for every modal/popup on the site so we never
// stack two on top of each other and we always respect a sensible
// cooldown after one closes. Each popup component (HotLeadIGPopup,
// LeadCapturePopup, ExitIntentModal, WhatsApp greeting, LiveTicker
// toasts) calls `canShow()` BEFORE setting itself open, then
// `markActive()` while open, `markInactive()` on close, and
// `markCaptured()` if the visitor actually submitted something.
//
// Storage:
//   sessionStorage.gy_popup_active     → "1" while a modal is mounted
//   sessionStorage.gy_popup_last_at    → ISO time of the last shown popup
//   sessionStorage.gy_popup_captured   → "1" once any capture form is submitted
//
// Rules:
//   1. Only ONE popup visible at any time. canShow() returns false
//      while another is active.
//   2. 3-minute cooldown between popups so the visitor isn't strafed.
//   3. Once a capture form is submitted (HotLead, LeadCapture,
//      ExitIntent), NO more popups for the rest of the session.
//   4. Passive elements (always-on FABs like the WhatsApp button or
//      the StickyFleetCTA pill) do NOT call this — they don't compete
//      for the modal slot.

const ACTIVE_KEY = "gy_popup_active";
const LAST_AT_KEY = "gy_popup_last_at";
const CAPTURED_KEY = "gy_popup_captured";
const COOLDOWN_MS = 180_000; // 3 minutes between popups

function safeGet(k) {
  try {
    return typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(k)
      : null;
  } catch {
    return null;
  }
}

function safeSet(k, v) {
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(k, v);
  } catch {
    /* private mode etc */
  }
}

function safeRemove(k) {
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(k);
  } catch {
    /* nop */
  }
}

/** Can the caller show a popup right now? */
export function canShow() {
  if (typeof window === "undefined") return false;
  if (safeGet(CAPTURED_KEY)) return false;
  if (safeGet(ACTIVE_KEY)) return false;
  const last = safeGet(LAST_AT_KEY);
  if (last) {
    const elapsed = Date.now() - Number(last);
    if (Number.isFinite(elapsed) && elapsed < COOLDOWN_MS) return false;
  }
  return true;
}

/** Caller is opening their popup right now. */
export function markActive() {
  safeSet(ACTIVE_KEY, "1");
  safeSet(LAST_AT_KEY, String(Date.now()));
}

/** Caller's popup just closed (any reason — submit, dismiss, esc). */
export function markInactive() {
  safeRemove(ACTIVE_KEY);
}

/** Visitor actually submitted a capture form — silence the rest of the session. */
export function markCaptured() {
  safeSet(CAPTURED_KEY, "1");
  safeRemove(ACTIVE_KEY);
}

/** Has any popup already been shown this session? */
export function hasShownAny() {
  return !!safeGet(LAST_AT_KEY) || !!safeGet(CAPTURED_KEY);
}

/** Has any capture form been submitted this session? */
export function hasCaptured() {
  return !!safeGet(CAPTURED_KEY);
}
