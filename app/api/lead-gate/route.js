// Lead-gate endpoint.
//
// Shared backend for the gated lead capture flows (Instant Proposal,
// Partners page, Smart Inquiry). Non-blocking: both the Telegram ping
// and the Gmail notification happen server-side, but if either fails
// we still return 200 so the UI flow (e.g. the proposal preview) never
// stalls on a missing integration.
//
// Expected payload:
// {
//   source: "proposal-generator" | "partners" | "inquiry" | ...
//   name: "First Last",
//   email: "them@example.com",
//   phone: "+30 ...",        // optional
//   company: "Travel Agency", // optional
//   meta: { ... arbitrary context (yacht, region, season, etc.) ... }
// }

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rateLimit";
import { kvSadd } from "@/lib/kv";

export const dynamic = "force-dynamic";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

function buildTransporter() {
  if (!GMAIL_USER || !GMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch {}
}

function fmtMeta(meta = {}) {
  return Object.entries(meta)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `  • *${k}:* ${v}`)
    .join("\n");
}

export async function POST(request) {
  // Rate-limit — same bar as the newsletter signup (light abuse shield)
  const rl = checkRateLimit(request, { max: 6, windowMs: 60000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — silent success
  if (body.website && String(body.website).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const {
    source = "unknown",
    name = "",
    email = "",
    phone = "",
    company = "",
    meta = {},
  } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required." },
      { status: 400 }
    );
  }

  // Every captured lead also seeds the newsletter set (best-effort).
  // This is explicit opt-in flow — George asked for these details
  // specifically so he can follow up, and all the gated forms say the
  // email will be used to send back the proposal / respond.
  try {
    await kvSadd(
      "newsletter:subscribers",
      String(email).trim().toLowerCase()
    );
  } catch {}

  const when = new Date().toISOString();
  const headline = {
    "proposal-generator": "📄 Proposal Generator — lead captured",
    partners: "🤝 Partners — unlock request",
    inquiry: "✉️ Inquiry — new message",
  }[source] || `📬 Lead — ${source}`;

  const lines = [
    `*${headline}*`,
    ``,
    `👤 *${name || "(no name)"}*`,
    email ? `📧 ${email}` : null,
    phone ? `📱 ${phone}` : null,
    company ? `🏢 ${company}` : null,
    ``,
    fmtMeta(meta),
    ``,
    `🕐 ${when}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Fire both channels in parallel
  const transporter = buildTransporter();
  await Promise.all([
    notifyTelegram(lines),
    transporter
      ? transporter
          .sendMail({
            from: `"George Yachts — Lead" <${GMAIL_USER}>`,
            to: "george@georgeyachts.com",
            replyTo: email,
            subject: `${headline}: ${name || email}`,
            html: `
              <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;color:#111;">
                <h2 style="margin:0 0 8px;">${headline.replace(/\*/g, "")}</h2>
                <p style="margin:0 0 4px;"><strong>Name:</strong> ${name || "—"}</p>
                <p style="margin:0 0 4px;"><strong>Email:</strong> ${email}</p>
                ${phone ? `<p style="margin:0 0 4px;"><strong>Phone:</strong> ${phone}</p>` : ""}
                ${company ? `<p style="margin:0 0 4px;"><strong>Company:</strong> ${company}</p>` : ""}
                <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
                <p style="margin:0 0 4px;"><strong>Source:</strong> ${source}</p>
                <p style="margin:0 0 12px;"><strong>When:</strong> ${when}</p>
                ${
                  Object.keys(meta || {}).length
                    ? `<p style="margin:0 0 6px;"><strong>Context:</strong></p>
                <pre style="background:#f6f6f6;padding:12px;border-radius:4px;font-size:12px;white-space:pre-wrap;">${JSON.stringify(
                  meta,
                  null,
                  2
                )}</pre>`
                    : ""
                }
                <p style="font-size:11px;color:#888;margin-top:24px;">You can reply directly to this email to reach the lead.</p>
              </div>
            `,
          })
          .catch(() => {})
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}
