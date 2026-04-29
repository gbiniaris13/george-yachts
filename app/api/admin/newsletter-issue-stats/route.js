// Phase 6.6 — read-only analytics endpoint.
//
// Two query modes:
//
//   GET ?stream=bridge&issue=2
//     Returns aggregate stats for one issue: counters, unique opens,
//     unique clicks, computed open/click/bounce/complaint rates.
//
//   GET ?stream=bridge[&limit=10]
//     Returns the most recent N issues for a stream (walks
//     counter:<stream>:issue_num down). Default limit 10.
//
// Auth: NEWSLETTER_PROXY_SECRET / NEWSLETTER_UNSUB_SECRET / CRON_SECRET.
// Read-only.

import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import { getIssueStats } from "@/lib/newsletter/issue-stats";

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

const VALID_STREAMS = ["bridge", "wake", "compass", "greece"];

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const stream = url.searchParams.get("stream");
  if (!VALID_STREAMS.includes(stream)) {
    return NextResponse.json(
      { error: `stream must be one of ${VALID_STREAMS.join(", ")}` },
      { status: 400 },
    );
  }

  const issueParam = url.searchParams.get("issue");
  if (issueParam) {
    const stats = await getIssueStats(stream, issueParam);
    if (!stats) {
      return NextResponse.json({ ok: true, found: false, stream, issue: issueParam });
    }
    return NextResponse.json({ ok: true, found: true, ...stats });
  }

  // List mode — last N issues for this stream.
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 10)));
  let currentIssue = 0;
  try {
    const v = await kvGet(`counter:${stream}:issue_num`);
    currentIssue = Number(v) || 0;
  } catch {
    // ignore
  }

  const issues = [];
  let walked = 0;
  for (let n = currentIssue; n >= 1 && issues.length < limit; n -= 1) {
    walked += 1;
    const stats = await getIssueStats(stream, n);
    if (stats) issues.push(stats);
    if (walked > 200) break; // sanity bound
  }

  return NextResponse.json({
    ok: true,
    stream,
    current_issue: currentIssue,
    count: issues.length,
    issues,
  });
}
