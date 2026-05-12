// AI Citation Monitor cron - Phase 7 Round 29 (2026-05-12).
// Technical brief Priority 3A.
//
// Vercel Cron entry point: runs the daily AI citation check across
// the monitored query set. Rotates through 4 queries per day so we
// hit all 12 in a 3-day cycle (stays within free-tier engine limits).
//
// Configure schedule in vercel.json:
//   { "path": "/api/cron/ai-citation-check", "schedule": "0 7 * * *" }
//   (07:00 UTC = 10:00 Athens daily)
//
// Authentication: bearer token via CRON_SECRET env var. Vercel Cron
// signs requests with this header; unauthorised calls are rejected.

import { NextResponse } from "next/server";
import {
  runDailyCheck,
  alertDrops,
  MONITORED_QUERIES,
} from "@/lib/aiMonitoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Rotation: 4 queries per day on a 3-day cycle.
function pickQueriesForToday() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const cycleDay = dayOfYear % 3; // 0, 1, 2
  return MONITORED_QUERIES.slice(cycleDay * 4, cycleDay * 4 + 4);
}

export async function GET(req) {
  // Authorise via CRON_SECRET (Vercel Cron sets Authorization: Bearer <secret>).
  // Allow direct admin calls with ?token= for manual triggers.
  const auth = req.headers.get("authorization") || "";
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const secret = process.env.CRON_SECRET;

  const okHeader = secret && auth === `Bearer ${secret}`;
  const okQuery = secret && token === secret;
  if (secret && !okHeader && !okQuery) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const queries = pickQueriesForToday();

  try {
    const summary = await runDailyCheck({ queries });
    if (summary.droppedFromCitations.length > 0) {
      await alertDrops(summary.droppedFromCitations);
    }
    return NextResponse.json({
      ok: true,
      checked: summary.queries,
      droppedFromCitations: summary.droppedFromCitations.length,
      runAt: summary.runAt,
      details: summary.results.map((r) => ({
        query: r.query,
        anyMention: r.anyMention,
        byEngine: r.checks.map((c) => ({
          engine: c.engine,
          mentioned: c.mentioned,
          skipped: c.skipped,
          error: c.error,
          position: c.position,
        })),
      })),
    });
  } catch (err) {
    console.error("[cron/ai-citation-check]", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}

// Also accept POST for manual runs from the admin dashboard.
export async function POST(req) {
  return GET(req);
}
