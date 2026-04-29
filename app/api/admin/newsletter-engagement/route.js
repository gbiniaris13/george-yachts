// Phase 5 — read-only engagement endpoint.
//
// Two query modes:
//
//   GET ?email=foo@bar.com
//     Returns the engagement record for one address. Null if never seen.
//
//   GET ?stream=bridge[&inactivity_days=180&min_tenure_days=90]
//     Walks subscribers:<stream> and returns:
//       - total subscribers in stream
//       - tracked count (have an engagement record)
//       - engaged count (opened/clicked in last 90 days)
//       - re-engagement candidates list (with summary)
//     This drives the Phase 5.3 re-engagement campaign UI.
//
// Read-only. No writes. Auth: NEWSLETTER_PROXY_SECRET /
// NEWSLETTER_UNSUB_SECRET / CRON_SECRET.

import { NextResponse } from "next/server";
import { kvSmembers } from "@/lib/kv";
import {
  getEngagement,
  isEngaged,
  findReEngagementCandidates,
} from "@/lib/newsletter/engagement";

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

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const stream = url.searchParams.get("stream");

  if (email) {
    const r = await getEngagement(email);
    if (!r) {
      return NextResponse.json({ ok: true, found: false, email });
    }
    return NextResponse.json({
      ok: true,
      found: true,
      record: r,
      engaged: isEngaged(r),
    });
  }

  if (!stream) {
    return NextResponse.json(
      { error: "provide ?email= or ?stream=" },
      { status: 400 },
    );
  }

  const validStreams = ["bridge", "wake", "compass", "greece"];
  if (!validStreams.includes(stream)) {
    return NextResponse.json(
      { error: `stream must be one of ${validStreams.join(", ")}` },
      { status: 400 },
    );
  }

  const inactivityDays = Number(url.searchParams.get("inactivity_days") ?? 180);
  const minTenureDays = Number(url.searchParams.get("min_tenure_days") ?? 90);

  const subscribers = (await kvSmembers(`subscribers:${stream}`)) ?? [];
  let tracked = 0;
  let engagedCount = 0;
  const records = [];
  for (const e of subscribers) {
    const r = await getEngagement(e);
    if (r) {
      tracked += 1;
      if (isEngaged(r)) engagedCount += 1;
      records.push(r);
    }
  }

  const candidates = await findReEngagementCandidates({
    subscribers,
    inactivityDays,
    minTenureDays,
  });

  return NextResponse.json({
    ok: true,
    stream,
    subscriber_count: subscribers.length,
    tracked_count: tracked,
    engaged_count: engagedCount,
    untracked_count: subscribers.length - tracked,
    inactivity_days: inactivityDays,
    min_tenure_days: minTenureDays,
    re_engagement_candidates: candidates.map((r) => ({
      email: r.email,
      first_seen: r.first_seen,
      last_send: r.last_send,
      last_open: r.last_open,
      last_click: r.last_click,
      sends_total: r.sends_total,
      opens_total: r.opens_total,
      clicks_total: r.clicks_total,
    })),
  });
}
