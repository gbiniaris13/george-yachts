// Admin HARO process API - Phase 7 Round 30 (2026-05-12).
// Backend for /admin/haro-process client form. Same parser logic
// as the webhook, but returns full draft bodies for in-page display
// rather than firing Telegram.

import { NextResponse } from "next/server";
import { processHaroDigest } from "@/lib/haroMonitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  // Same gate as the admin page - require CRON_SECRET via cookie or
  // header. The client-side admin page is gated by ?token=, so the
  // POST inherits the session if the page renders. For belt-and-braces,
  // also accept x-admin-token header.
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
  const headerToken = req.headers.get("x-admin-token") || "";
  const referrer = req.headers.get("referer") || "";
  const okHeader = secret && headerToken === secret;
  // Allow same-site admin page traffic (referrer check)
  const okReferrer =
    referrer.includes("/admin/haro-process") &&
    referrer.includes(`token=${secret}`);

  if (secret && !okHeader && !okReferrer) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const emailBody = body?.body || body?.email || body?.text || "";
  if (!emailBody || emailBody.length < 200) {
    return NextResponse.json(
      { error: "Paste at least 200 characters of a digest body" },
      { status: 400 }
    );
  }

  const processed = processHaroDigest(emailBody);
  return NextResponse.json(processed);
}
