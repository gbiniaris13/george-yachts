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

// Human-readable label map for the Context section in lead emails.
// Replaces raw JSON-key display ("source_page") with friendly labels
// ("Source page"). Falls back to a sentence-case version of any key
// that doesn't have an explicit mapping.
const META_LABELS = {
  timing: "Charter timing",
  download: "Resource downloaded",
  source_page: "Page",
  yacht: "Yacht of interest",
  yachtName: "Yacht of interest",
  region: "Region",
  season: "Season",
  budget: "Budget",
  guests: "Guests",
  duration: "Duration",
  dates: "Preferred dates",
  language: "Language",
  referrer: "Referrer",
};

// Format a value for human display. Slug paths get prefixed with
// the site domain so George can click them. Dates left as-is.
function fmtMetaValue(key, raw) {
  if (raw == null) return "";
  const v = String(raw);
  if (key === "source_page" && v.startsWith("/")) {
    return `<a href="https://georgeyachts.com${v}" style="color:#C9A84C;text-decoration:none;border-bottom:1px solid #C9A84C;">${v}</a>`;
  }
  if (key === "timing") {
    // Map dropdown values to friendly labels
    const labels = {
      "summer-2026": "Summer 2026",
      "autumn-2026": "Autumn 2026",
      "2027": "2027",
      "researching": "Just researching",
    };
    return labels[v] || v;
  }
  return v.replace(/-/g, " ").replace(/^[a-z]/, (c) => c.toUpperCase());
}

function metaLabel(key) {
  if (META_LABELS[key]) return META_LABELS[key];
  return key
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderMetaTable(meta = {}) {
  const entries = Object.entries(meta).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  const rows = entries
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:8px 14px 8px 0;color:#0D1B2A;opacity:0.65;font-size:13px;letter-spacing:0.04em;width:160px;vertical-align:top;">${metaLabel(k)}</td>
          <td style="padding:8px 0;color:#0D1B2A;font-size:14px;line-height:1.5;">${fmtMetaValue(k, v)}</td>
        </tr>`
    )
    .join("");
  return `
    <p style="margin:18px 0 6px;color:#0D1B2A;font-size:9px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;">Details</p>
    <table style="border-collapse:collapse;width:100%;border-top:1px solid rgba(13,27,42,0.1);">
      ${rows}
    </table>`;
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
            from: `"George Yachts - Lead" <${GMAIL_USER}>`,
            to: "george@georgeyachts.com",
            replyTo: email,
            subject: `${headline.replace(/[*]/g, "").replace(/[📬📄🤝✉️]/g, "").trim()}: ${name || email}`,
            // 2026-05-12 hotfix: replaced the raw JSON Context block
            // (which displayed as code) with a clean human-readable
            // key/value table. Brand-aligned typography + navy/gold,
            // mailbox-safe inline styles only.
            html: `
              <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;color:#0D1B2A;background:#FFFFFF;border:1px solid rgba(13,27,42,0.08);">
                <div style="background:#0D1B2A;padding:22px 28px;">
                  <p style="margin:0;color:#C9A84C;font-size:9px;letter-spacing:0.42em;text-transform:uppercase;font-weight:700;">George Yachts</p>
                  <p style="margin:8px 0 0;color:#F8F5F0;font-size:20px;font-weight:300;line-height:1.25;">${headline.replace(/[*]/g, "").replace(/[📬📄🤝✉️]/g, "").trim()}</p>
                </div>
                <div style="padding:26px 28px;">
                  <p style="margin:0 0 4px;color:#0D1B2A;opacity:0.65;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;">From</p>
                  <p style="margin:0 0 6px;color:#0D1B2A;font-size:22px;font-weight:400;line-height:1.25;">${name || "(no name provided)"}</p>
                  <p style="margin:0 0 6px;font-size:14px;">
                    <a href="mailto:${email}" style="color:#C9A84C;text-decoration:none;border-bottom:1px solid #C9A84C;padding-bottom:1px;">${email}</a>
                  </p>
                  ${phone ? `<p style="margin:0 0 4px;color:#0D1B2A;font-size:14px;"><span style="opacity:0.6;">Phone:</span> <a href="tel:${phone}" style="color:#C9A84C;text-decoration:none;">${phone}</a></p>` : ""}
                  ${company ? `<p style="margin:0 0 4px;color:#0D1B2A;font-size:14px;"><span style="opacity:0.6;">Company:</span> ${company}</p>` : ""}
                  ${renderMetaTable(meta)}
                  <hr style="border:none;border-top:1px solid rgba(13,27,42,0.1);margin:24px 0 14px;" />
                  <p style="margin:0;color:#0D1B2A;opacity:0.55;font-size:11px;letter-spacing:0.04em;">
                    <strong style="font-weight:600;">Source:</strong> ${source}  &nbsp;·&nbsp;
                    <strong style="font-weight:600;">When:</strong> ${new Date(when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div style="background:rgba(201,168,76,0.06);padding:16px 28px;border-top:1px solid rgba(201,168,76,0.2);">
                  <p style="margin:0;color:#0D1B2A;font-size:12px;line-height:1.55;">
                    Reply to this email to reach <strong>${name || "the lead"}</strong> directly. Their address is set as Reply-To.
                  </p>
                </div>
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
