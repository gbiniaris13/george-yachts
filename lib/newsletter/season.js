// Brief Update 1 — getCurrentSeason() helper.
//
// Maps today's date (Athens time) to a seasonal phase + the operating
// posture that goes with it. Used by:
//   - the daily digest (1-line context line in the Telegram summary)
//   - future /season Telegram command to ask George what to highlight
//   - auto-mode prompts so the AI body generator stays grounded in
//     "we're in spring lift, push booking urgency" vs "we're in deep
//     winter, plant testimonials and 2027 seeds".
//
// Pure function. No KV, no DB. Stable across reloads.

/**
 * Returns: {
 *   phase:    "deep_winter" | "spring_lift" | "season_open" |
 *             "high_season" | "shoulder" | "year_end"
 *   label:    short human-readable label
 *   posture:  one-line operating posture for newsletter copy
 *   athens_month: int 1..12
 * }
 */
export function getCurrentSeason(now = new Date()) {
  const athens = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Athens" }),
  );
  const m = athens.getMonth() + 1; // 1..12

  if (m === 1 || m === 2) {
    return {
      phase: "deep_winter",
      label: "Deep winter",
      posture:
        "Early-planning window. Lead with references, comparisons, and quiet stories — booking decisions are still 4-5 months away.",
      athens_month: m,
    };
  }
  if (m === 3 || m === 4) {
    return {
      phase: "spring_lift",
      label: "Spring lift",
      posture:
        "Bookings surging for summer. Surface availability windows + season setup notes. Inquiries respond fast right now.",
      athens_month: m,
    };
  }
  if (m === 5 || m === 6) {
    return {
      phase: "season_open",
      label: "Season open",
      posture:
        "Last call for prime weeks. Lead with select-availability framing — direct, never panicky. June and July are filling 3 weeks earlier than 2025.",
      athens_month: m,
    };
  }
  if (m === 7 || m === 8) {
    return {
      phase: "high_season",
      label: "High season",
      posture:
        "Operational mode. Light-touch storytelling, no fresh pitches. Wake intel and Compass signals carry this stretch.",
      athens_month: m,
    };
  }
  if (m === 9 || m === 10) {
    return {
      phase: "shoulder",
      label: "Shoulder season",
      posture:
        "Second-wave bookings (couples, photographers, calmer islands). Highlight October weather window and Cyclades quiet.",
      athens_month: m,
    };
  }
  // 11, 12
  return {
    phase: "year_end",
    label: "Year-end",
    posture:
      "Plant testimonials, surface 2027 early-bird thinking, and write the introspective stories that won't fit during high season.",
    athens_month: m,
  };
}

/**
 * Telegram-ready one-liner for the daily digest:
 *   "🌊 Spring lift — Bookings surging for summer."
 */
export function seasonOneliner(now = new Date()) {
  const s = getCurrentSeason(now);
  const icon =
    s.phase === "deep_winter"
      ? "❄️"
      : s.phase === "spring_lift"
        ? "🌱"
        : s.phase === "season_open"
          ? "🌊"
          : s.phase === "high_season"
            ? "☀️"
            : s.phase === "shoulder"
              ? "🍂"
              : "🕯️";
  return `${icon} ${s.label} — ${s.posture}`;
}
