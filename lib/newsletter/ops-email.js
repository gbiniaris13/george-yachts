// Internal ops notification — emails George after each auto-send.
//
// George asked for an EMAIL confirmation (not Telegram) whenever the
// auto-newsletter fires. We use the existing Gmail transporter (same
// creds as the weekly-newsletter cron), so these confirmations do NOT
// consume the Resend newsletter quota.

import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const TO = process.env.NEWSLETTER_OPS_EMAIL || "george@georgeyachts.com";

/**
 * @param {{subject:string, lines:string[]|string}} args
 */
export async function sendOpsEmail({ subject, lines }) {
  const body = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn("[ops-email] Gmail not configured — skipping:", subject);
    return { ok: false, error: "gmail_not_configured" };
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"George Yachts · Auto-Newsletter" <${GMAIL_USER}>`,
      to: TO,
      subject,
      text: body,
    });
    return { ok: true };
  } catch (err) {
    console.error("[ops-email] send failed:", err?.message || err);
    return { ok: false, error: String(err?.message || err) };
  }
}
