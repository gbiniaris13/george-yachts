// What the visitor looked at before writing (first-party only, 2026-10-03).
// The tracker keeps a short trail of the last pages in the browser; every
// form reads it and sends it along, so George opens the request already
// knowing which yachts and which pages the person lingered on. Nothing
// leaves the browser until the person presses Send on a form.

export const PAGE_TRAIL_KEY = "gy-page-trail";
const TRAIL_MAX = 12;

/** Called by the tracker on every route change. */
export function recordPageInTrail(pathname) {
  try {
    if (!pathname || pathname.startsWith("/cabin") || pathname.startsWith("/api")) return;
    const trail = JSON.parse(localStorage.getItem(PAGE_TRAIL_KEY) || "[]");
    const title = (typeof document !== "undefined" ? document.title : "")
      .replace(/\s*\|\s*George Yachts.*$/i, "")
      .trim()
      .slice(0, 120);
    const last = trail[trail.length - 1];
    if (last && last.p === pathname) {
      last.t = title || last.t;
      last.at = new Date().toISOString();
    } else {
      trail.push({ p: pathname, t: title, at: new Date().toISOString() });
    }
    localStorage.setItem(PAGE_TRAIL_KEY, JSON.stringify(trail.slice(-TRAIL_MAX)));
  } catch {}
}

/** Read by every inquiry form at submit time. */
export function collectVisitorContext() {
  try {
    const ctx = {};
    const session = JSON.parse(sessionStorage.getItem("gy-tracker-session") || "null");
    if (session) {
      if (session.startTime) {
        ctx.session_minutes = Math.max(0, Math.round((Date.now() - session.startTime) / 60000));
      }
      if (Array.isArray(session.yachtsViewed) && session.yachtsViewed.length) {
        ctx.yachts_this_visit = session.yachtsViewed.slice(0, 8);
      }
      if (session.referrer) ctx.arrived_from = String(session.referrer).slice(0, 200);
    }
    const history = JSON.parse(localStorage.getItem("gy-view-history") || "[]");
    if (Array.isArray(history) && history.length) {
      ctx.yachts_history = history.slice(0, 5).map((h) => h && h.name).filter(Boolean);
    }
    const trail = JSON.parse(localStorage.getItem(PAGE_TRAIL_KEY) || "[]");
    if (Array.isArray(trail) && trail.length) {
      ctx.pages = trail.slice(-10).map((x) => ({ path: x.p, title: x.t, at: x.at }));
    }
    return ctx;
  } catch {
    return {};
  }
}
