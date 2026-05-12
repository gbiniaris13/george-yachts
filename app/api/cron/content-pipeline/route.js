// Content pipeline cron - Phase 7 Round 32 (2026-05-12).
// Technical brief Priority 3D. Schedule: Mon 08:00 UTC.

import { NextResponse } from "next/server";
import { runContentOpportunityScan, notifyContentOpportunities } from "@/lib/contentPipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}` && token !== secret) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const summary = await runContentOpportunityScan();
    await notifyContentOpportunities(summary);
    return NextResponse.json({
      ok: true,
      runAt: summary.runAt,
      backlogSize: summary.backlogSize,
      coveredCount: summary.covered.length,
      gapsCount: summary.gaps.length,
      topGaps: summary.gaps
        .filter((g) => g.priority === "high")
        .map((g) => g.keyword),
    });
  } catch (err) {
    console.error("[cron/content-pipeline]", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  return GET(req);
}
