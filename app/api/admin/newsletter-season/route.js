// /season admin endpoint — Update 1 §7 + Update 3 §6.
//
// Read-only diagnostic. Returns the current seasonal phase, the
// Bridge cadence implied by it, the next auto-fire dates per stream,
// and the auto-mode toggle status (master + per-stream).
//
// Auth: NEWSLETTER_PROXY_SECRET / NEWSLETTER_UNSUB_SECRET / CRON_SECRET.
// No mutations. Safe to hit from CRM dashboard or curl.

import { NextResponse } from "next/server";
import { getCurrentSeason } from "@/lib/newsletter/season";
import { autoModeStatus } from "@/lib/newsletter/auto-mode";
import { kvGet } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request) {
  const url = new URL(request.url);
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("key") ||
    "";
  const accepted = [
    process.env.NEWSLETTER_PROXY_SECRET,
    process.env.NEWSLETTER_UNSUB_SECRET,
    process.env.CRON_SECRET,
  ].filter(Boolean);
  return accepted.some((s) => s && provided === s);
}

// Bridge auto-cron schedule: every Thursday 06:00 UTC.
// Logic INSIDE the cron decides whether to fire based on cadence +
// last_send_at. The cron itself runs every Thursday regardless.
function nextThursdayUTC(now = new Date()) {
  const d = new Date(now);
  d.setUTCHours(6, 0, 0, 0);
  // 4 = Thursday in UTC weekday system
  while (d.getUTCDay() !== 4 || d.getTime() <= now.getTime()) {
    d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(6, 0, 0, 0);
  }
  return d;
}

// Wake: 15th of every month, 06:00 UTC.
function next15thUTC(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const candidate = new Date(Date.UTC(y, m, 15, 6, 0, 0, 0));
  if (candidate.getTime() > now.getTime()) return candidate;
  return new Date(Date.UTC(y, m + 1, 15, 6, 0, 0, 0));
}

// Compass: 1st of every even month (Feb, Apr, Jun, Aug, Oct, Dec),
// 06:00 UTC. "Even" = month index 1, 3, 5, 7, 9, 11 in JS (0-indexed).
function nextBimonthlyFirstUTC(now = new Date()) {
  const y = now.getUTCFullYear();
  let m = now.getUTCMonth();
  // Walk forward up to 12 months; first 1st-of-even-month after now wins.
  for (let i = 0; i < 13; i++) {
    const candidate = new Date(Date.UTC(y, m + i, 1, 6, 0, 0, 0));
    const monthIdx = candidate.getUTCMonth();
    const isEvenCalendarMonth =
      monthIdx === 1 ||
      monthIdx === 3 ||
      monthIdx === 5 ||
      monthIdx === 7 ||
      monthIdx === 9 ||
      monthIdx === 11;
    if (isEvenCalendarMonth && candidate.getTime() > now.getTime()) {
      return candidate;
    }
  }
  return null;
}

function fmtDate(d) {
  if (!d) return null;
  const dayName = d.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const monthName = d.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  return `${dayName} ${d.getUTCDate()} ${monthName} ${d.getUTCFullYear()} 06:00 UTC`;
}

async function lastSendAt(stream) {
  try {
    const v = await kvGet(`last_send_at:${stream}`);
    if (!v) return null;
    const parsed = typeof v === "string" ? v : v?.toString?.() ?? null;
    return parsed;
  } catch {
    return null;
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const season = getCurrentSeason(now);
  const auto = autoModeStatus();

  const [bridgeLast, wakeLast, compassLast] = await Promise.all([
    lastSendAt("bridge"),
    lastSendAt("wake"),
    lastSendAt("compass"),
  ]);

  const nextBridge = nextThursdayUTC(now);
  const nextWake = next15thUTC(now);
  const nextCompass = nextBimonthlyFirstUTC(now);

  // Update 1 §4.2 — editorial mode varies by season for Wake and the
  // Bridge focus shifts too. Surface the human-readable framing so
  // George reads it at a glance.
  const editorialFocus = (() => {
    switch (season.phase) {
      case "deep_winter":
        return {
          bridge: "References, comparisons, quiet stories. Booking decisions are 4-5 months away.",
          wake: "Education — what your clients should be asking about Greek waters",
          compass: "Peer market signals year-round",
        };
      case "spring_lift":
        return {
          bridge: "Surface availability windows + season setup. Inquiries respond fast right now.",
          wake: "Booking signals — what's tightening, urgency without specifics",
          compass: "Peer market signals year-round",
        };
      case "season_open":
        return {
          bridge: "Last call for prime weeks. Select-availability framing — direct, never panicky.",
          wake: "Booking signals + last-window framing",
          compass: "Peer market signals year-round",
        };
      case "high_season":
        return {
          bridge: "Operational mode. Light-touch storytelling, no fresh pitches.",
          wake: "Last-minute opportunities — white-label-ready short offers",
          compass: "Peer market signals year-round",
        };
      case "shoulder":
        return {
          bridge: "Second-wave bookings. Highlight October weather window + Cyclades quiet.",
          wake: "2027 preview — what's coming online",
          compass: "Peer market signals year-round",
        };
      case "year_end":
        return {
          bridge: "Plant testimonials, surface 2027 early-bird, write introspective stories.",
          wake: "2027 preview — what's coming online",
          compass: "Peer market signals year-round",
        };
      default:
        return null;
    }
  })();

  const formatted = [
    `📅 <b>CURRENT SEASON</b>`,
    ``,
    `Phase: <b>${season.label}</b> (month ${season.athens_month}, Athens TZ)`,
    `Posture: ${season.posture}`,
    ``,
    `📨 <b>NEXT AUTO-FIRE WINDOWS</b>`,
    `· Bridge:  ${fmtDate(nextBridge)}` +
      (bridgeLast ? `\n   └ last sent: ${bridgeLast}` : `\n   └ last sent: never`),
    `· Wake:    ${fmtDate(nextWake)}` +
      (wakeLast ? `\n   └ last sent: ${wakeLast}` : `\n   └ last sent: never`),
    `· Compass: ${fmtDate(nextCompass)}` +
      (compassLast ? `\n   └ last sent: ${compassLast}` : `\n   └ last sent: never`),
    ``,
    `🤖 <b>AUTO-MODE</b>`,
    `Master:   ${auto.master ? "✅ ENABLED" : "⛔ DISABLED"}`,
    `Bridge:   ${auto.bridge ? "✅" : "⛔"}    Wake: ${auto.wake ? "✅" : "⛔"}    Compass: ${auto.compass ? "✅" : "⛔"}`,
    ``,
    editorialFocus ? `⚡ <b>EDITORIAL FOCUS THIS PERIOD</b>\n· Bridge: ${editorialFocus.bridge}\n· Wake: ${editorialFocus.wake}\n· Compass: ${editorialFocus.compass}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({
    ok: true,
    season: {
      phase: season.phase,
      label: season.label,
      posture: season.posture,
      athens_month: season.athens_month,
    },
    next_auto_fire: {
      bridge: nextBridge.toISOString(),
      wake: nextWake.toISOString(),
      compass: nextCompass ? nextCompass.toISOString() : null,
    },
    last_send_at: {
      bridge: bridgeLast,
      wake: wakeLast,
      compass: compassLast,
    },
    auto_mode: auto,
    editorial_focus: editorialFocus,
    formatted_html: formatted,
  });
}
