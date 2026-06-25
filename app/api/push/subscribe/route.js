// POST /api/push/subscribe
// Stores a browser PushSubscription captured by PushOptIn.jsx.
// Public endpoint (anyone can subscribe themselves); the body is a
// standard PushSubscription JSON. Idempotent — same endpoint upserts.

import { NextResponse } from "next/server";
import { saveSubscription } from "@/lib/push/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const sub = body?.subscription || body;
    await saveSubscription(sub, {
      userAgent: request.headers.get("user-agent") || null,
      page: body?.page || null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[push/subscribe] failed:", err?.message || err);
    // 400 for malformed, 500 otherwise — but never leak internals.
    const malformed = String(err?.message || "").includes("malformed");
    return NextResponse.json(
      { ok: false, error: malformed ? "invalid subscription" : "server error" },
      { status: malformed ? 400 : 500 }
    );
  }
}
