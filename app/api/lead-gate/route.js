// Lead-gate endpoint.
//
// Shared backend for the gated lead capture flows (Instant Proposal,
// Partners page, Smart Inquiry). Both the Telegram ping and the Gmail
// notification happen server-side; one dead channel never blocks the
// other.
//
// 2026-11-05 (form sweep): this route used to answer 200 even when
// both channels had failed, and the /inquiry wizard and /favorites
// then thanked a visitor whose brief had reached no one. It now
// answers 502 { ok: false } when neither the Telegram nor the email
// arrived, so the form can show George's WhatsApp and email instead.
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
import { sendTelegram } from "@/lib/telegram";
import { crmNotifyGeorge } from "@/lib/notifyGeorge";

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

// 2026-11-05 (form sweep): /favorites sent its yachts as an array of
// objects, which reached George as "[object Object],[object Object]".
// Lists and objects are spelled out (pages cached before the fix still
// send the old shape).
function metaText(v) {
  if (Array.isArray(v)) return v.map(metaText).join("; ");
  if (v && typeof v === "object") {
    if (v.name || v.slug) {
      return `${v.name || v.slug}${v.price ? ` (${v.price})` : ""}${v.slug ? ` georgeyachts.com/yachts/${v.slug}` : ""}`;
    }
    return JSON.stringify(v);
  }
  return String(v);
}

function fmtMeta(meta = {}) {
  return Object.entries(meta)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `  • *${k}:* ${metaText(v)}`)
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
  const v = metaText(raw).replace(/</g, "&lt;");
  if (key === "source_page" && v.startsWith("/")) {
    return `<a href="https://georgeyachts.com${v}" style="color:#DAA110;text-decoration:none;border-bottom:1px solid #DAA110;">${v}</a>`;
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
  if (/georgeyachts\.com\//.test(v)) return v; // yacht links keep their hyphens
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
    "proposal-generator": "📄 Proposal Generator, lead captured",
    partners: "🤝 Partners, unlock request",
    inquiry: "✉️ Inquiry, new message",
  }[source] || `📬 Lead, ${source}`;

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
  const [telegramOk, emailOk] = await Promise.all([
    sendTelegram(lines),
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
                  <p style="margin:0;color:#DAA110;font-size:9px;letter-spacing:0.42em;text-transform:uppercase;font-weight:700;">George Yachts</p>
                  <p style="margin:8px 0 0;color:#F8F5F0;font-size:20px;font-weight:300;line-height:1.25;">${headline.replace(/[*]/g, "").replace(/[📬📄🤝✉️]/g, "").trim()}</p>
                </div>
                <div style="padding:26px 28px;">
                  <p style="margin:0 0 4px;color:#0D1B2A;opacity:0.65;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;font-weight:600;">From</p>
                  <p style="margin:0 0 6px;color:#0D1B2A;font-size:22px;font-weight:400;line-height:1.25;">${name || "(no name provided)"}</p>
                  <p style="margin:0 0 6px;font-size:14px;">
                    <a href="mailto:${email}" style="color:#DAA110;text-decoration:none;border-bottom:1px solid #DAA110;padding-bottom:1px;">${email}</a>
                  </p>
                  ${phone ? `<p style="margin:0 0 4px;color:#0D1B2A;font-size:14px;"><span style="opacity:0.6;">Phone:</span> <a href="tel:${phone}" style="color:#DAA110;text-decoration:none;">${phone}</a></p>` : ""}
                  ${company ? `<p style="margin:0 0 4px;color:#0D1B2A;font-size:14px;"><span style="opacity:0.6;">Company:</span> ${company}</p>` : ""}
                  ${renderMetaTable(meta)}
                  <hr style="border:none;border-top:1px solid rgba(13,27,42,0.1);margin:24px 0 14px;" />
                  <p style="margin:0;color:#0D1B2A;opacity:0.55;font-size:11px;letter-spacing:0.04em;">
                    <strong style="font-weight:600;">Source:</strong> ${source}  &nbsp;·&nbsp;
                    <strong style="font-weight:600;">When:</strong> ${new Date(when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div style="background:rgba(218, 161, 16,0.06);padding:16px 28px;border-top:1px solid rgba(218, 161, 16,0.2);">
                  <p style="margin:0;color:#0D1B2A;font-size:12px;line-height:1.55;">
                    Reply to this email to reach <strong>${name || "the lead"}</strong> directly. Their address is set as Reply-To.
                  </p>
                </div>
              </div>
            `,
          })
          .then(() => true)
          .catch((e) => {
            console.error("lead-gate: email to George failed:", e?.message);
            return false;
          })
      : Promise.resolve(false),
  ]);

  if (!telegramOk && !emailOk) {
    console.error(`lead-gate: lead from ${email} (${source}) reached no channel`);
    return NextResponse.json({ ok: false, error: "not_delivered" }, { status: 502 });
  }

  // 2026-11-06: the daily visitor email counts requests from the CRM
  // notification rows, and this route wrote none. Only the two charter
  // request sources are recorded (the planner and the favorites list).
  // Best effort: a failure here never changes the visitor's answer.
  const requestKind = { inquiry: "charter brief", favorites: "favorites list" }[source];
  if (requestKind) {
    await crmNotifyGeorge({
      type: "form_submission",
      title: `📩 New ${requestKind} from ${String(name || email).slice(0, 80)}`,
      description: `${source} · ${email}`,
      link: "/dashboard/contacts",
    }).catch(() => {});
  }
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
