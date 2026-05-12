// HARO webhook - Phase 7 Round 30 (2026-05-12).
// Technical brief Priority 3B.
//
// Receives forwarded HARO/Connectively/Qwoted digest emails via
// Cloudflare Email Routing webhook (or any forwarding service that
// POSTs the raw body). Parses, filters yacht-relevant queries,
// generates drafts, pings George via Telegram.
//
// Setup (Boss-led, one-time):
//   1. Subscribe to HARO at connectively.us (free)
//   2. Set Gmail filter: from:HARO/Connectively/etc. -> Cloudflare Worker
//   3. Cloudflare Email Routing worker (free) POSTs raw email body
//      to https://georgeyachts.com/api/webhooks/haro
//   4. Webhook token via HARO_WEBHOOK_SECRET env var
//
// Until that wiring is in place, /admin/haro-process supports
// manually pasting digest bodies to extract relevant queries.

import { NextResponse } from "next/server";
import { processHaroDigest, notifyHaroRelevant } from "@/lib/haroMonitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const secret = process.env.HARO_WEBHOOK_SECRET;
  const tokenHeader = req.headers.get("x-haro-token") || "";
  const url = new URL(req.url);
  const tokenQuery = url.searchParams.get("token") || "";
  if (secret && tokenHeader !== secret && tokenQuery !== secret) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Accept either JSON {body: "..."} or raw text/plain.
  let emailBody = "";
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const data = await req.json();
      emailBody = data?.body || data?.email || data?.text || "";
    } else {
      emailBody = await req.text();
    }
  } catch {
    return NextResponse.json({ error: "Could not parse request body" }, { status: 400 });
  }

  if (!emailBody || emailBody.length < 200) {
    return NextResponse.json(
      { error: "Email body too short to be a digest" },
      { status: 400 }
    );
  }

  const processed = processHaroDigest(emailBody);

  // Fire-and-forget Telegram notification.
  if (processed.relevantQueries > 0) {
    notifyHaroRelevant(processed).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    totalQueries: processed.totalQueries,
    relevantQueries: processed.relevantQueries,
    queries: processed.queries.map((q) => ({
      summary: q.summary,
      outlet: q.outlet,
      deadline: q.deadline,
      email: q.email,
      score: q.relevance.score,
      hits: q.relevance.hits,
    })),
  });
}
