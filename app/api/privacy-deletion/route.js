// O.2 (Roberto brief, May 2026) — GDPR data deletion request handler.
// Receives the form post from /privacy/delete, fires Telegram +
// confirmation email so George can action manually within the
// GDPR 30-day window. We deliberately don't auto-delete anything —
// signed charter agreements + financial records carry legal-hold
// obligations that need human review.

import { sendTelegram } from "@/lib/telegram";
import { bumpKpi } from "@/lib/kpis";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req) {
  // 2026-05-12 — rate limit. GDPR deletion is a low-volume real
  // workflow; same /min cap as partner-portal/login (3/min/IP).
  // Stops Telegram + Resend amplifier abuse without blocking a
  // legitimate user who hits submit twice.
  const rl = checkRateLimit(req, { max: 3, windowMs: 60000 });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body?.name || "").toString().slice(0, 100).trim();
  const email = (body?.email || "").toString().slice(0, 200).trim();
  const reason = (body?.reason || "").toString().slice(0, 1500).trim();

  if (!name || !email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Missing or invalid name/email" }, { status: 400 });
  }

  // Telegram to Boss — high priority signal so deadline tracking starts
  try {
    const tg = `🔒 *GDPR data deletion request*\n\n👤 ${name}\n📧 ${email}\n${reason ? `\n*Notes:*\n${reason}\n` : ""}\n_Source: /privacy/delete · GDPR 30-day window starts now._`;
    await sendTelegram(tg);
  } catch {}

  // Confirmation email to user (best-effort).
  if (process.env.RESEND_API_KEY) {
    try {
      const html = `
<div style="font-family:'Lato','Montserrat',sans-serif;font-size:14px;line-height:1.7;color:#0D1B2A">
<p>Dear ${name.split(" ")[0] || "friend"},</p>
<p>We&rsquo;ve received your request to delete the personal data we hold about you (email: <strong>${email}</strong>).</p>
<p>George will personally review the request and respond within 30 days, in line with GDPR Article 17. If your request is straightforward, expect a reply within 48 hours.</p>
<p>Some records carry a legal-hold obligation — signed charter agreements and financial transactions, primarily — which we&rsquo;ll explain in our reply if applicable.</p>
<p>If you didn&rsquo;t make this request, reply to this email and we&rsquo;ll cancel it immediately.</p>
<p style="margin-top:20px">— George<br/>
<span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9CA3AF">George P. Biniaris · Managing Broker</span></p>
</div>`.trim();

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_ADDRESS || "George Yachts <newsletter@georgeyachts.com>",
          to: [email],
          bcc: ["george@georgeyachts.com"],
          reply_to: process.env.RESEND_REPLY_TO || "george@georgeyachts.com",
          subject: "We received your data deletion request — George Yachts",
          html,
          tags: [{ name: "kind", value: "gdpr_deletion_request" }],
        }),
      });
    } catch {}
  }

  bumpKpi("privacy_deletion").catch(() => {});
  return Response.json({ ok: true });
}
