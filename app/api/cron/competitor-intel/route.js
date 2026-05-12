// Competitor intel cron - Phase 7 Round 31 (2026-05-12).
// Technical brief Priority 3C. Schedule: Mon 09:00 UTC.

import { NextResponse } from "next/server";
import { runCompetitorCheck, notifyCompetitorDigest } from "@/lib/competitorIntel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const secret = process.env.CRON_SECRET;

  const okHeader = secret && auth === `Bearer ${secret}`;
  const okQuery = secret && token === secret;
  if (secret && !okHeader && !okQuery) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const summary = await runCompetitorCheck();
    await notifyCompetitorDigest(summary);
    return NextResponse.json({
      ok: true,
      runAt: summary.runAt,
      totalNewPages: summary.totalNewPages,
      competitors: summary.competitors.map((c) => ({
        domain: c.domain,
        label: c.label,
        new: c.newUrls?.length || 0,
        total: c.totalCurr,
        netChange: c.netChange,
        error: c.error,
      })),
    });
  } catch (err) {
    console.error("[cron/competitor-intel]", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  return GET(req);
}
