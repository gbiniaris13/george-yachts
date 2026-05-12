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
// Why this design: keeps a single source of truth for lead capture
// (lead-gate route already handles Telegram + Gmail + CRM). This
// endpoint adds only the PDF generation on top.

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { PricingGuidePdfDocument } from "@/lib/pricingGuidePdf";
import { checkRateLimit } from "@/lib/rateLimit";

// Force Node.js runtime - @react-pdf/renderer needs Node APIs,
// won't run on edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function forwardLeadCapture(payload, req) {
  // Build absolute URL to our own lead-gate endpoint so we can
  // reuse its Telegram + Gmail flow without duplicating logic.
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
    // Non-blocking - still deliver the PDF even if notifications fail.
  }
}

export async function POST(req) {
  // Rate-limit by IP. 5 PDF downloads per 10 minutes is plenty for
  // a real user (lead-gate already protects against amplifier abuse).
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
  forwardLeadCapture({ firstName, email, timing }, req).catch(() => {});

  // Generate the PDF as a Buffer.
  let pdfBuffer;
  try {
    pdfBuffer = await renderToBuffer(
      React.createElement(PricingGuidePdfDocument, { firstName })
    );
  } catch (err) {
    console.error("[pricing-guide-pdf] PDF generation failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed. Please contact george@georgeyachts.com." },
      { status: 500 }
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
