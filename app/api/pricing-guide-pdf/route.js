// PDF Lead Magnet endpoint - Phase 7 Round 25 (2026-05-12).
// Technical brief Priority 1D.
//
// POST /api/pricing-guide-pdf with body { firstName, email, timing }.
// 1. Validates input + rate-limits.
// 2. Forwards lead to /api/lead-gate (existing flow: Telegram +
//    Gmail notification, CRM sync).
// 3. Renders the @react-pdf/renderer document.
// 4. Streams the PDF back with Content-Disposition: attachment.
//
// Note 2026-05-12: dynamic imports for @react-pdf/renderer + the
// PDF document component are deferred to the handler. Importing at
// module load was causing a TypeError on Vercel's Node.js serverless
// runtime because react-pdf pulls in dom-helpers at static analysis
// time. Dynamic import resolves it.

import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // PDF generation can take 5-15s cold

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function forwardLeadCapture(payload, req) {
  const origin =
    req.headers.get("origin") ||
    `https://${req.headers.get("host") || "georgeyachts.com"}`;
  try {
    await fetch(`${origin}/api/lead-gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "pricing-guide-pdf",
        name: payload.firstName,
        email: payload.email,
        meta: {
          timing: payload.timing || "not specified",
          download: "2026 Greek Charter Pricing Guide",
          source_page: payload.sourcePage || "/greek-yacht-charter-2026-complete-pricing-guide",
        },
      }),
    });
  } catch {
    // Non-blocking
  }
}

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  const limit = checkRateLimit(`pdf-${ip}`, { max: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { firstName, email, timing } = payload || {};
  if (!firstName || typeof firstName !== "string" || firstName.length > 100) {
    return NextResponse.json({ error: "First name is required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Fire-and-forget lead capture so the PDF response stays fast.
  forwardLeadCapture({ firstName, email, timing, sourcePage: payload.sourcePage }, req).catch(() => {});

  // Generate the PDF. Dynamic imports + explicit React resolution.
  let pdfBuffer;
  let debugErr = null;
  try {
    const reactMod = await import("react");
    const React = reactMod.default || reactMod;
    const createElement = React.createElement || reactMod.createElement;
    const pdfMod = await import("@react-pdf/renderer");
    const renderToBuffer = pdfMod.renderToBuffer || pdfMod.default?.renderToBuffer;
    const { PricingGuidePdfDocument } = await import("@/lib/pricingGuidePdf");

    if (typeof renderToBuffer !== "function") {
      throw new Error(`renderToBuffer not a function. Got: ${typeof renderToBuffer}. Keys: ${Object.keys(pdfMod).join(",")}`);
    }
    if (typeof createElement !== "function") {
      throw new Error(`React.createElement not a function. React keys: ${Object.keys(React).join(",")}`);
    }
    const element = createElement(PricingGuidePdfDocument, { firstName });
    pdfBuffer = await renderToBuffer(element);
  } catch (err) {
    console.error("[pricing-guide-pdf] PDF gen failed:", err);
    debugErr = err;
    return NextResponse.json(
      {
        error: "PDF generation temporarily unavailable",
        leadCaptured: true,
        fallbackUrl: "/greek-yacht-charter-2026-complete-pricing-guide",
        contactEmail: "george@georgeyachts.com",
        // Diagnostic info (safe to expose - it's only the error
        // message, not env values or stack frames pointing to secrets).
        diagnostic: err?.message || String(err),
      },
      { status: 503 }
    );
  }

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="George-Yachts-2026-Greek-Charter-Pricing-Guide.pdf"',
      "Content-Length": String(pdfBuffer.length),
      "Cache-Control": "no-store",
    },
  });
}
