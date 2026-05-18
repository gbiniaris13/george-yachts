// app/api/admin/cost-cap/route.js
// =============================================================
// GET /api/admin/cost-cap?secret=...  — read current month usage
// GET /api/admin/cost-cap?secret=...&provider=anthropic
//
// Auth: header x-cabin-admin-secret OR ?secret= query param (both
// accepted so George can hit this from a browser bookmark).
// =============================================================

import { NextResponse } from "next/server";
import { getUsage } from "@/lib/cost-cap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Every pay-per-use AI provider we meter. Each gets its own
// €10/month cap (independent), tracked separately in KV.
const KNOWN_PROVIDERS = ["anthropic", "gemini"];

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  const fromHeader = req.headers.get("x-cabin-admin-secret") || "";
  const fromQuery = new URL(req.url).searchParams.get("secret") || "";
  return fromHeader === expected || fromQuery === expected;
}

export async function GET(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const provider = new URL(req.url).searchParams.get("provider");
  if (provider) {
    return NextResponse.json({ ok: true, usage: await getUsage(provider) });
  }
  const all = await Promise.all(KNOWN_PROVIDERS.map((p) => getUsage(p)));
  return NextResponse.json({ ok: true, usage: all });
}
