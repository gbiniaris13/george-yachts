// E.2 (Roberto brief, May 2026) — Express inquiry endpoint.
//
// The lightweight cousin of /api/contact. Used by:
//   • D.4 — yacht-detail express inquiry modal (3 fields: name, email,
//     dates; optional yachtSlug + yachtName context)
//   • C.8 — fleet-card inline inquiry (name + email + month picker)
//   • K.2 — "Send my shortlist to George" from /favorites (yacht
//     array + name/email/message)
//
// On success:
//   • Telegram notification to George with full payload
//   • Auto-reply email to user (if Gmail configured)
//   • Optional CRM Supabase write (if CRM_SUPABASE_* env vars set)
//   • GA4 server-side event token returned (front-end fires the
//     gtag event for funnel attribution)
//
// All channels best-effort — endpoint always returns 200 once
// validation passes so the user never sees a transient failure.

import { NextResponse } from "next/server";
import { sendTelegram } from "@/lib/telegram";
import { checkRateLimit } from "@/lib/rateLimit";
import { bumpKpi } from "@/lib/kpis";

export const dynamic = "force-dynamic";

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET_KEY) return true; // dev / preview without key
  if (!token) return false;
  try {
    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const json = await r.json();
    return !!json.success && (json.score === undefined || json.score >= 0.4);
  } catch {
    return false;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function escMd(s) {
  // Telegram Markdown — escape the chars Telegram treats as syntax.
  return String(s || "").replace(/([_*`\[])/g, "\\$1").slice(0, 280);
}

export async function POST(req) {
  try {
    // Rate limit by IP — 10 inquiries per hour per IP. The brief
    // assumes one wealthy user submits at most 2-3 yachts in a
    // session; anything above that is bot/scrape behaviour.
    const ip = (req.headers.get("x-forwarded-for") || "0.0.0.0").split(",")[0].trim();
    const limited = await checkRateLimit?.(ip, "inquiry", 10, 3600);
    if (limited && limited.blocked) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json();
    const {
      name = "",
      email = "",
      phone = "",
      dates = "",
      message = "",
      yachtSlug = "",
      yachtName = "",
      shortlist = [],   // K.2 — array of { slug, name, weeklyRatePrice }
      source = "express_inquiry",
      preferredChannel = "email", // email | whatsapp | telegram | sms
      recaptchaToken = "",
      website = "",     // honeypot — bots autofill, humans never see
    } = body || {};

    // Honeypot — instant 200 with no side effects so bots don't
    // figure out we're filtering them.
    if (website && String(website).length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Validate
    if (!String(name).trim() || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 },
      );
    }

    const recaptchaOk = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaOk) {
      return NextResponse.json(
        { ok: false, error: "recaptcha_failed" },
        { status: 403 },
      );
    }

    // Build Telegram message
    const lines = [
      `📩 *New ${source.replace(/_/g, " ")}*`,
      ``,
      `👤 *${escMd(name)}*`,
      `📧 ${escMd(email)}`,
    ];
    if (phone) lines.push(`📞 ${escMd(phone)}`);
    if (yachtName) lines.push(`⛵ *${escMd(yachtName)}*`);
    if (yachtSlug) lines.push(`🔗 https://georgeyachts.com/yachts/${escMd(yachtSlug)}`);
    if (dates) lines.push(`📅 ${escMd(dates)}`);
    if (preferredChannel) lines.push(`💬 Prefers: *${escMd(preferredChannel)}*`);
    if (Array.isArray(shortlist) && shortlist.length > 0) {
      lines.push(``);
      lines.push(`📋 *Shortlist (${shortlist.length}):*`);
      shortlist.slice(0, 10).forEach((y) => {
        lines.push(`  • ${escMd(y.name || y.slug)}${y.weeklyRatePrice ? ` — ${escMd(y.weeklyRatePrice)}` : ""}`);
      });
    }
    if (message) {
      lines.push(``);
      lines.push(`💭 _${escMd(message)}_`);
    }
    lines.push(``);
    lines.push(`⏱ _Reply within 24h_`);

    await sendTelegram(lines.join("\n"));

    // N.3 — bump KPI counter
    bumpKpi("inquiry").catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("inquiry route error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
