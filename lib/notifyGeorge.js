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

// Returns true when every part reached Telegram (see lib/telegram.js).
export async function telegramGeorgeFull(text) {
  const s = String(text || "");
  if (s.length <= TG_CHUNK) {
    return sendTelegram(s);
  }
  const chunks = [];
  for (let i = 0; i < s.length; i += TG_CHUNK) chunks.push(s.slice(i, i + TG_CHUNK));
  let all = true;
  for (let i = 0; i < chunks.length; i++) {
    const ok = await sendTelegram(`${chunks[i]}\n\n_(${i + 1}/${chunks.length})_`, i > 0);
    all = all && ok;
  }
  return all;
}

// ── Email — the permanent record ────────────────────────────────
// Returns true once Gmail has accepted the message; throws on a failed send.
export async function emailGeorge({ subject, html, replyTo }) {
  if (!GMAIL_USER || !GMAIL_PASS) return false;
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
  return true;
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
// 2026-11-06: these rows are also what the daily visitor email counts as
// "requests" (lib/dailyReport.js), so every request form now passes `crm`.
// The 5s limit keeps a slow database from holding up the visitor's answer.
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
    signal: AbortSignal.timeout(5000),
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
//
// 2026-11-25 (George, v2 "as beautiful as The Edition"): new design and
// copy, every line approved by George. Navy masthead, gold hairlines,
// ivory page, Georgia; no images, no tracking pixel, no UTM tags (the
// research of 25/11: those push a first-contact email into Promotions).
// A plain-text part travels with the HTML. Facts are George's own:
// proposal 24 to 48 hours once he has what he needs, follow-up without
// pressure, contact after the trip, balance + VAT + APA 45 days before
// embarkation, APA 30-40% motor / 20-30% catamaran, Wyoming address
// first, Kifisia office second, IYBA spelled out. No yacht suggestions:
// George chooses the yachts himself.
const ACK_APA_URL = "https://georgeyachts.com/advance-provisioning-allowance-apa-greek-yacht-charter-explained";
const ACK_WA_DISPLAY = "+1 786 798 8798";
const ACK_WA_LINK = "https://wa.me/17867988798";
const ACK_CALL_DISPLAY = "+30 697 038 0999";
const ACK_CALL_LINK = "tel:+306970380999";

function ackEscape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// "Guests: 6" -> ["Guests", "6"]. The routes send "Label: value" lines;
// anything else is shown whole. "A -> B" reads as "A to B" for a guest.
function ackBriefRows(brief) {
  if (!Array.isArray(brief)) return [];
  return brief
    .filter((l) => typeof l === "string" && l.trim())
    .map((l) => {
      const line = l.slice(0, 500).replace(/\s*->\s*/g, " to ");
      const i = line.indexOf(": ");
      if (i > 0 && i < 40) {
        const label = line.slice(0, i);
        let value = line.slice(i + 2);
        // 2026-11-25 (live test): an empty route reached the guest as
        // "Flexible - Advise Me to Flexible - Advise Me". Say it plainly.
        if (/^route$/i.test(label)) {
          const parts = value.split(" to ").map((x) => (/^flexible/i.test(x.trim()) ? "open" : x.trim()));
          value = parts.every((x) => x === "open") ? "Open, I will advise" : parts.join(" to ");
        }
        return [label, value];
      }
      return ["", line];
    });
}

const ACK_LABEL = "font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.3em;color:#7A5C04;text-transform:uppercase;";
const ACK_RULE = (w) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="width:${w}px;height:1px;background:#B58A0A;line-height:1px;font-size:0;">&nbsp;</td></tr></table>`;

export function ackEmailHtml({ greeting, rows }) {
  const briefBlock = rows.length
    ? `
  <tr><td class="gy-pad" style="padding:26px 56px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border:1px solid #E4DCCB;">
      <tr><td style="padding:24px 28px 22px;border-left:2px solid #B58A0A;">
        <div style="${ACK_LABEL}margin-bottom:14px;">Your brief, as it reached me</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1a2433;">
          ${rows.map(([k, v]) => `<tr><td style="padding:5px 12px 5px 0;width:110px;color:#6b7380;font-size:13px;font-family:Arial,Helvetica,sans-serif;vertical-align:top;">${ackEscape(k)}</td><td style="padding:5px 0;vertical-align:top;">${ackEscape(v)}</td></tr>`).join("\n          ")}
        </table>
        <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#6b7380;margin-top:14px;">If anything has changed, simply reply to this email.</div>
      </td></tr>
    </table>
  </td></tr>`
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light only">
<title>Your charter inquiry has reached me</title>
<style>@media (max-width:620px){.gy-pad{padding-left:24px !important;padding-right:24px !important;}.gy-h1{font-size:26px !important;}}</style>
</head><body style="margin:0;padding:0;background:#E9E4DA;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thank you. I read every brief myself, and your tailor-made proposal follows within 24 to 48 hours.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E9E4DA;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#F8F5F0;">

  <tr><td align="center" style="background:#0D1B2A;padding:40px 24px 34px;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:0.32em;color:#DAA110;text-transform:uppercase;">George Yachts</div>
    <div style="margin:12px 0 10px;">${ACK_RULE(120)}</div>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.38em;color:#C9CED6;text-transform:uppercase;">The Brokerage House</div>
  </td></tr>

  <tr><td class="gy-pad" style="padding:46px 56px 6px;font-family:Georgia,'Times New Roman',serif;color:#0D1B2A;">
    <div style="${ACK_LABEL}margin-bottom:14px;">With thanks</div>
    <div class="gy-h1" style="font-size:30px;line-height:1.25;color:#0D1B2A;margin-bottom:26px;">Your inquiry has reached me.</div>
    <p style="font-size:17px;line-height:1.7;margin:0 0 16px;">${ackEscape(greeting)}</p>
    <p style="font-size:16px;line-height:1.75;margin:0 0 16px;color:#1a2433;">Thank you for writing, and for thinking of a week at sea in Greece. Your inquiry is now on my desk in Athens, and I read every brief myself.</p>
    <p style="font-size:16px;line-height:1.75;margin:0 0 8px;color:#1a2433;">Before I prepare your proposal, I may write or call with a question or two, so that what I send you fits your week exactly. Once I have everything I need, you will have a tailor-made proposal from me within 24 to 48 hours.</p>
  </td></tr>
${briefBlock}
  <tr><td class="gy-pad" style="padding:38px 56px 4px;font-family:Georgia,'Times New Roman',serif;color:#1a2433;">
    <div style="${ACK_LABEL}margin-bottom:18px;">What happens next</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:16px;line-height:1.65;">
      <tr><td style="width:44px;vertical-align:top;color:#B58A0A;font-size:18px;padding:0 0 14px;">I</td><td style="padding:0 0 14px;">I read your brief and check which yachts are truly free for your dates.</td></tr>
      <tr><td style="vertical-align:top;color:#B58A0A;font-size:18px;padding:0 0 14px;">II</td><td style="padding:0 0 14px;">You receive a tailor-made proposal, with the yachts I would choose, their rates and a suggested route.</td></tr>
      <tr><td style="vertical-align:top;color:#B58A0A;font-size:18px;padding:0 0 6px;">III</td><td style="padding:0 0 6px;">You decide in your own time. There is no obligation. I will check in with you to make sure you have everything you need, but I will never rush you.</td></tr>
    </table>
  </td></tr>

  <tr><td align="center" style="padding:30px 56px 0;">${ACK_RULE(64)}</td></tr>

  <tr><td class="gy-pad" style="padding:30px 56px 6px;font-family:Georgia,'Times New Roman',serif;color:#1a2433;">
    <div style="${ACK_LABEL}margin-bottom:8px;">Before your proposal</div>
    <div style="font-size:20px;line-height:1.35;color:#0D1B2A;margin-bottom:22px;">Three things many first-time guests ask me.</div>
    <div style="font-size:17px;color:#0D1B2A;margin-bottom:6px;">The rate, and what a broker adds</div>
    <p style="font-size:15px;line-height:1.75;margin:0 0 22px;">A yacht's weekly rate is set by her owner, and booking through me does not add to it. What differs from one broker to the next is the care around it. I am with you from the first call to the last evening on board, and I stay in touch long after you are home. I speak with the captain before and during your week, I know these boats and these waters, and I am here in Greece if anything needs attention.</p>
    <div style="font-size:17px;color:#0D1B2A;margin-bottom:6px;">The APA</div>
    <p style="font-size:15px;line-height:1.75;margin:0 0 22px;">Fuel, marina and port fees, food and drinks are paid from an advance called the APA, the Advance Provisioning Allowance. As a guide, it is about 30 to 40% of the charter fee on motor yachts and 20 to 30% on catamarans. The captain holds it, spends it at cost with receipts, and accounts for it at the end of the week. Whatever is not spent comes back to you. <a href="${ACK_APA_URL}" style="color:#7A5C04;text-decoration:underline;">A fuller note on the APA</a>.</p>
    <div style="font-size:17px;color:#0D1B2A;margin-bottom:6px;">Payment</div>
    <p style="font-size:15px;line-height:1.75;margin:0 0 6px;">Charters are written on the standard MYBA contract. Half of the charter fee is paid on signing, and the balance, together with VAT and the APA, 45 days before embarkation. A gratuity for the crew is separate and entirely at your discretion.</p>
  </td></tr>

  <tr><td class="gy-pad" style="padding:22px 56px 4px;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D1B2A;">
      <tr><td style="padding:20px 24px;font-size:15px;line-height:1.7;color:#E9E4DA;">If your dates are close, you can reach me directly.<br><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.24em;color:#C9CED6;text-transform:uppercase;">WhatsApp</span>&nbsp;&nbsp;<a href="${ACK_WA_LINK}" style="color:#DAA110;text-decoration:none;white-space:nowrap;">${ACK_WA_DISPLAY}</a><br><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.24em;color:#C9CED6;text-transform:uppercase;">Call, Athens</span>&nbsp;&nbsp;<a href="${ACK_CALL_LINK}" style="color:#DAA110;text-decoration:none;white-space:nowrap;">${ACK_CALL_DISPLAY}</a></td></tr>
    </table>
  </td></tr>

  <tr><td class="gy-pad" style="padding:34px 56px 44px;font-family:Georgia,'Times New Roman',serif;color:#1a2433;">
    <p style="font-size:16px;line-height:1.7;margin:0 0 4px;">Warm regards from Athens,</p>
    <p style="font-size:26px;font-style:italic;color:#0D1B2A;margin:6px 0 18px;">George</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:40px;height:1px;background:#B58A0A;line-height:1px;font-size:0;">&nbsp;</td></tr></table>
    <p style="font-size:15px;line-height:1.6;margin:14px 0 0;color:#0D1B2A;">George P. Biniaris</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;margin:2px 0 0;color:#5a6472;">Founder and Managing Broker<br>George Yachts Brokerage House<br>Charter Active Member, IYBA, the International Yacht Brokers Association<br>WhatsApp ${ACK_WA_DISPLAY} &middot; Call ${ACK_CALL_DISPLAY}</p>
  </td></tr>

  <tr><td class="gy-pad" style="background:#EFEAE0;padding:22px 56px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#6b7380;">
    George Yachts Brokerage House LLC, 30 N Gould St, Ste R, Sheridan, WY 82801, USA.<br>Athens office in Kifisia, close to the yachts and the marinas.<br>
    You are receiving this because you sent a charter inquiry at georgeyachts.com. If you would rather not hear from me, simply reply and say so.
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

export function ackEmailText({ greeting, rows }) {
  const brief = rows.length
    ? `\nYOUR BRIEF, AS IT REACHED ME\n${rows.map(([k, v]) => (k ? `${k}: ${v}` : v)).join("\n")}\nIf anything has changed, simply reply to this email.\n`
    : "";
  return `${greeting}

Thank you for writing, and for thinking of a week at sea in Greece. Your inquiry is now on my desk in Athens, and I read every brief myself.

Before I prepare your proposal, I may write or call with a question or two, so that what I send you fits your week exactly. Once I have everything I need, you will have a tailor-made proposal from me within 24 to 48 hours.
${brief}
WHAT HAPPENS NEXT
I. I read your brief and check which yachts are truly free for your dates.
II. You receive a tailor-made proposal, with the yachts I would choose, their rates and a suggested route.
III. You decide in your own time. There is no obligation. I will check in with you to make sure you have everything you need, but I will never rush you.

BEFORE YOUR PROPOSAL: three things many first-time guests ask me.

The rate, and what a broker adds
A yacht's weekly rate is set by her owner, and booking through me does not add to it. What differs from one broker to the next is the care around it. I am with you from the first call to the last evening on board, and I stay in touch long after you are home. I speak with the captain before and during your week, I know these boats and these waters, and I am here in Greece if anything needs attention.

The APA
Fuel, marina and port fees, food and drinks are paid from an advance called the APA, the Advance Provisioning Allowance. As a guide, it is about 30 to 40% of the charter fee on motor yachts and 20 to 30% on catamarans. The captain holds it, spends it at cost with receipts, and accounts for it at the end of the week. Whatever is not spent comes back to you.
A fuller note on the APA: ${ACK_APA_URL}

Payment
Charters are written on the standard MYBA contract. Half of the charter fee is paid on signing, and the balance, together with VAT and the APA, 45 days before embarkation. A gratuity for the crew is separate and entirely at your discretion.

If your dates are close, you can reach me directly.
WhatsApp ${ACK_WA_DISPLAY}
Call, Athens ${ACK_CALL_DISPLAY}

Warm regards from Athens,
George

George P. Biniaris
Founder and Managing Broker
George Yachts Brokerage House
Charter Active Member, IYBA, the International Yacht Brokers Association

George Yachts Brokerage House LLC, 30 N Gould St, Ste R, Sheridan, WY 82801, USA.
Athens office in Kifisia, close to the yachts and the marinas.
You are receiving this because you sent a charter inquiry at georgeyachts.com. If you would rather not hear from me, simply reply and say so.
`;
}

export function ackGreeting(name) {
  // 2026-10-22 (George): the micro brief and the concierge card carry no
  // name, and the route labels them "Micro brief" / "Concierge card lead"
  // for the Helm. A guest called Enzo was greeted as "Dear Micro". Any
  // label that is not a person's name gets the house's plain greeting.
  const rawName = String(name || "").trim();
  const placeholder = !rawName
    || /\b(micro|brief|concierge|card|lead|express|inquiry|enquiry|form|visitor|guest|test|unknown|website|anonymous)\b/i.test(rawName)
    || !/^[\p{L}][\p{L}'’.-]*$/u.test(rawName.split(/\s+/)[0]);
  const words = rawName.split(/\s+/);
  const isTitle = /^(mr|mrs|ms|miss|mx|dr|prof|sir|madam|lady|lord)\.?$/i.test(words[0] || "");
  // "Mr. Mitchell" is greeted as Mr. Mitchell, never as "Hey Mr.".
  const first = placeholder ? "" : (isTitle ? (words[1] ? `${words[0]} ${words[1]}` : "") : words[0]);
  // 2026-11-25 (George): "Hey", not "Dear".
  return first ? `Hey ${first},` : "Hey there,";
}

export async function emailClient({ to, name, brief }) {
  if (!GMAIL_USER || !GMAIL_PASS || !to) return { ok: false, skipped: true };
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
    const greeting = ackGreeting(name);
    const rows = ackBriefRows(brief);
    await transporter.sendMail({
      from: `"George P. Biniaris | George Yachts" <${GMAIL_USER}>`,
      to,
      replyTo: GMAIL_USER,
      subject: "Your charter inquiry has reached me",
      text: ackEmailText({ greeting, rows }),
      html: ackEmailHtml({ greeting, rows }),
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

// 2026-11-05 (form sweep): several forms told the visitor "Thank you"
// while nothing had reached George. A route now asks this before it
// answers: did the Telegram or the email (the two channels George reads)
// actually arrive? If neither did, the route says so, and the form shows
// the visitor George's WhatsApp and email instead of a false thank-you.
export function reachedGeorge(results) {
  if (!Array.isArray(results)) return false;
  return [results[0], results[1]].some((r) => r?.status === "fulfilled" && r.value === true);
}
