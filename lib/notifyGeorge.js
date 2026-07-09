// lib/notifyGeorge.js — one lead, every channel, zero truncation.
//
// Born 2026-07-03 from a real loss: a genuine charter request (6
// adults, crewed catamaran, 2027) arrived via /api/inquiry, was sent
// ONLY to Telegram, and the message body was cut at 280 chars by the
// escMd slice — the budget line was lost forever because nothing
// stored the full text. George's directive: every site form must
// reach him by Telegram AND email AND WhatsApp (company US number),
// with the COMPLETE text, always.
//
// Channels (all best-effort, Promise.allSettled — a dead channel
// never blocks the others or the user's 200):
//   1. Telegram  — full text, auto-chunked under the 4096 limit.
//   2. Email     — Gmail transporter (GMAIL_USER → GMAIL_USER, the
//                  same proven path /api/contact uses), replyTo set
//                  to the CUSTOMER so George answers with one tap.
//                  The email is the permanent record of the lead.
//   3. WhatsApp  — CallMeBot (free personal gateway). Requires a
//                  one-time opt-in from George's WhatsApp; until
//                  CALLMEBOT_WHATSAPP_PHONE + CALLMEBOT_WHATSAPP_APIKEY
//                  exist in env, this channel skips silently.
//   4. CRM       — the GY Command notifications table (same pattern
//                  /api/contact already uses).

import nodemailer from "nodemailer";
import { sendTelegram } from "@/lib/telegram";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

// ── Telegram, full length ────────────────────────────────────────
// Telegram hard-caps messages at 4096 chars. Long inquiries are sent
// as numbered continuation messages instead of being cut.
const TG_CHUNK = 3500;

export async function telegramGeorgeFull(text) {
  const s = String(text || "");
  if (s.length <= TG_CHUNK) {
    await sendTelegram(s);
    return;
  }
  const chunks = [];
  for (let i = 0; i < s.length; i += TG_CHUNK) chunks.push(s.slice(i, i + TG_CHUNK));
  for (let i = 0; i < chunks.length; i++) {
    await sendTelegram(`${chunks[i]}\n\n_(${i + 1}/${chunks.length})_`, i > 0);
  }
}

// ── Email — the permanent record ────────────────────────────────
export async function emailGeorge({ subject, html, replyTo }) {
  if (!GMAIL_USER || !GMAIL_PASS) return;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
  await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: GMAIL_USER,
        to: GMAIL_USER,
        subject,
        ...(replyTo ? { replyTo } : {}),
        html,
      },
      (err) => (err ? reject(err) : resolve()),
    );
  });
}

// ── WhatsApp — CallMeBot personal gateway ────────────────────────
// Free service that delivers messages to YOUR OWN WhatsApp after a
// one-time opt-in (send "I allow callmebot to send me messages" to
// their gateway number from the company WhatsApp, receive an apikey,
// set both env vars). Messages are URL-encoded GETs; keep them under
// ~1500 chars and point to the email for the full text.
const WA_LIMIT = 1500;

export async function whatsappGeorge(text) {
  const phone = process.env.CALLMEBOT_WHATSAPP_PHONE; // e.g. +17867988798
  const apikey = process.env.CALLMEBOT_WHATSAPP_APIKEY;
  if (!phone || !apikey) return;
  let s = String(text || "");
  if (s.length > WA_LIMIT) s = s.slice(0, WA_LIMIT) + "\n… (full text in your email)";
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(s)}`;
  await fetch(url, { method: "GET" });
}

// ── CRM notification (GY Command) ────────────────────────────────
export async function crmNotifyGeorge(data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return;
  await fetch(`${CRM_SUPABASE_URL}/rest/v1/notifications`, {
    method: "POST",
    headers: {
      apikey: CRM_SUPABASE_KEY,
      Authorization: `Bearer ${CRM_SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ── The one call every form route makes ──────────────────────────
// Fire-and-forget across channels; report per-channel outcome for
// server logs without ever throwing at the caller.

// 2026-07-08 (George approved #1, "the first five minutes") — instant
// acknowledgment EMAIL to the client the moment their enquiry lands.
// EMAIL ONLY by explicit instruction: WhatsApp automations are banned
// after the 2026-07-03 account lock. Fail-silent: an ack failure must
// never block or delay the lead reaching George.
export async function emailClient({ to, name }) {
  if (!GMAIL_USER || !GMAIL_PASS || !to) return { ok: false, skipped: true };
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
    const first = String(name || "").trim().split(/\s+/)[0] || "there";
    const html = `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #1a2433; line-height: 1.7;">
        <p style="letter-spacing: 0.24em; font-size: 11px; color: #9a7d2e; text-transform: uppercase; font-family: Arial, sans-serif;">George Yachts Brokerage House</p>
        <p style="font-size: 17px;">Dear ${first},</p>
        <p style="font-size: 16px;">Your enquiry has reached my desk. I read every brief personally, and you will have my reply shortly, usually within hours, not days.</p>
        <p style="font-size: 16px;">If your dates are close or anything is urgent, message me directly on WhatsApp: <a href="https://wa.me/17867988798" style="color: #9a7d2e;">+1 786 798 8798</a>.</p>
        <p style="font-size: 16px;">Until then, the water is on its way.</p>
        <p style="font-size: 16px; margin-top: 28px;">George P. Biniaris<br>
        <span style="font-size: 13px; color: #5a6472; font-family: Arial, sans-serif;">Founder and Managing Broker<br>
        IYBA Member &middot; Featured in Forbes 2026<br>
        <a href="https://georgeyachts.com" style="color: #9a7d2e;">georgeyachts.com</a></span></p>
      </div>`;
    await transporter.sendMail({
      from: `"George P. Biniaris | George Yachts" <${GMAIL_USER}>`,
      to,
      replyTo: GMAIL_USER,
      subject: "Your enquiry is with George",
      html,
    });
    return { ok: true };
  } catch (e) {
    console.error("[emailClient] failed:", e?.message);
    return { ok: false };
  }
}

export async function notifyGeorge({
  telegramText,
  emailSubject,
  emailHtml,
  replyTo,
  whatsappText,
  crm,
}) {
  const results = await Promise.allSettled([
    telegramText ? telegramGeorgeFull(telegramText) : Promise.resolve(),
    emailSubject && emailHtml
      ? emailGeorge({ subject: emailSubject, html: emailHtml, replyTo })
      : Promise.resolve(),
    whatsappText ? whatsappGeorge(whatsappText) : Promise.resolve(),
    crm ? crmNotifyGeorge(crm) : Promise.resolve(),
  ]);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const ch = ["telegram", "email", "whatsapp", "crm"][i];
      console.error(`notifyGeorge: ${ch} channel failed:`, r.reason);
    }
  });
  return results;
}
