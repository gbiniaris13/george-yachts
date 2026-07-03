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
import { notifyGeorge } from "@/lib/notifyGeorge";
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

// Telegram Markdown — escape the chars Telegram treats as syntax.
// 2026-07-03 — the old version also did .slice(0, 280) on EVERY
// field, which cut a real customer's message mid-sentence (the
// budget line of a 2027 crewed-catamaran request was lost, and
// nothing else stored the text). Short fields keep a sanity cap;
// the MESSAGE is never truncated (lib/notifyGeorge chunks it).
function escMd(s, max = 280) {
  const out = String(s || "").replace(/([_*`\[])/g, "\\$1");
  return max ? out.slice(0, max) : out;
}

function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req) {
  try {
    // Rate limit by IP — 10 inquiries per hour per IP. The brief
    // assumes one wealthy user submits at most 2-3 yachts in a
    // session; anything above that is bot/scrape behaviour.
    //
    // 2026-05-11 BUG FIX — previous call passed (ip, "inquiry", 10, 3600)
    // but lib/rateLimit.js checkRateLimit signature is
    // (request, { max, windowMs }). The positional misuse caused
    // request.headers.get(...) inside the lib to throw on a plain
    // string, returning HTTP 500 on every single inquiry submission
    // since the function was first wired up. Fixed to match the
    // canonical signature used by /api/contact, /api/newsletter,
    // /api/partner-request, /api/lead-gate.
    const rl = checkRateLimit(req, { max: 10, windowMs: 3600000 });
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "rate_limited", retryAfter: rl.retryAfter },
        { status: 429 },
      );
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

    // 2026-07-03 SOS — recaptcha failure no longer REJECTS the lead.
    // On mobile with content blockers grecaptcha often never loads;
    // hard-403ing threw away real customers (George: "οι πελάτες μάς
    // μιλάνε και εμείς δεν τους βλέπουμε"). Honeypot + 10/hour/IP
    // rate limit still guard the door; an unverified submission is
    // simply FLAGGED so George reads it with one raised eyebrow.
    const recaptchaOk = await verifyRecaptcha(recaptchaToken);

    // Build Telegram message
    const lines = [
      `📩 *New ${source.replace(/_/g, " ")}*`,
      ...(recaptchaOk ? [] : [`⚠️ _captcha unverified - judge the sender yourself_`]),
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
      // Full message — never truncated (chunked by notifyGeorge if long).
      lines.push(`💭 _${escMd(message, 0)}_`);
    }
    lines.push(``);
    lines.push(`⏱ _Reply within 24h_`);

    // 2026-07-03 (George's SOS directive) — every form reaches George
    // on Telegram AND email AND WhatsApp, full text, plus the CRM
    // notifications feed. The email carries replyTo=customer so one
    // tap answers the lead; it is also the permanent record.
    const sourceLabel = source.replace(/_/g, " ");
    const shortlistHtml =
      Array.isArray(shortlist) && shortlist.length > 0
        ? `<h4>Shortlist (${shortlist.length}):</h4><ul>${shortlist
            .slice(0, 10)
            .map((y) => `<li>${escHtml(y.name || y.slug)}${y.weeklyRatePrice ? ` — ${escHtml(y.weeklyRatePrice)}` : ""}</li>`)
            .join("")}</ul>`
        : "";
    const emailHtml = `
      <h3>New ${escHtml(sourceLabel)}</h3>
      <p><strong>Name:</strong> ${escHtml(name)}</p>
      <p><strong>Email:</strong> ${escHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escHtml(phone)}</p>` : ""}
      ${yachtName ? `<p><strong>Yacht:</strong> ${escHtml(yachtName)}</p>` : ""}
      ${yachtSlug ? `<p><strong>Page:</strong> <a href="https://georgeyachts.com/yachts/${escHtml(yachtSlug)}">georgeyachts.com/yachts/${escHtml(yachtSlug)}</a></p>` : ""}
      ${dates ? `<p><strong>Dates:</strong> ${escHtml(dates)}</p>` : ""}
      ${preferredChannel ? `<p><strong>Prefers:</strong> ${escHtml(preferredChannel)}</p>` : ""}
      ${shortlistHtml}
      ${message ? `<hr><h4>Message (full):</h4><p style="white-space: pre-line;">${escHtml(message)}</p>` : ""}
    `;
    const waText = [
      `New ${sourceLabel}`,
      `${name} · ${email}${phone ? ` · ${phone}` : ""}`,
      yachtName ? `Yacht: ${yachtName}` : "",
      dates ? `Dates: ${dates}` : "",
      message ? `\n${message}` : "",
    ].filter(Boolean).join("\n");

    await notifyGeorge({
      telegramText: lines.join("\n"),
      emailSubject: `[Lead] ${sourceLabel}${yachtName ? ` — ${yachtName}` : ""} — ${name}`,
      emailHtml,
      replyTo: email,
      whatsappText: waText,
      crm: {
        type: "form_submission",
        title: `📩 New ${sourceLabel} from ${name}`,
        description: `${yachtName || "general"} · ${email}${dates ? ` · ${dates}` : ""}`,
        link: "/dashboard/contacts",
      },
    });

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
