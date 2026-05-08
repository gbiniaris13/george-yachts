// J.2 — Partner-portal magic-link login.
// POST { email } → if email is allow-listed, email a magic-link
// (links to /api/partner-portal/verify?otp=...). Always returns
// 200 OK so we don't leak which addresses are on the allow list.

import { isPartnerAllowed, createMagicLink } from "@/lib/partner-portal";
import { sendTelegram } from "@/lib/telegram";

export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com";
const RESEND_FROM =
  process.env.RESEND_FROM_ADDRESS ||
  "George Yachts <newsletter@georgeyachts.com>";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const email = (body?.email || "").toString().trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  // Always 200 OK to prevent enumeration. Only actually send if allow-listed.
  if (isPartnerAllowed(email)) {
    try {
      const otp = await createMagicLink(email);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
      const url = `${baseUrl}/api/partner-portal/verify?otp=${encodeURIComponent(otp)}`;

      // Send the magic link via Resend (or fall back to Telegram for diagnostics).
      if (process.env.RESEND_API_KEY) {
        const html = `
<div style="font-family:'Lato','Montserrat',sans-serif;font-size:14px;line-height:1.7;color:#0D1B2A">
<p>Hello,</p>
<p>You can sign in to the George Yachts partner portal using the link below. It expires in 15 minutes.</p>
<p style="margin:24px 0">
  <a href="${url}" style="display:inline-block;padding:12px 22px;font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;color:#0D1B2A;background:#C9A84C;text-decoration:none">
    Open partner portal →
  </a>
</p>
<p style="font-size:12px;color:#9CA3AF">If you didn't request this, ignore this email.</p>
<p style="margin-top:20px">— George Yachts Brokerage House</p>
</div>`.trim();

        await fetch(`${RESEND_API}/emails`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to: [email],
            subject: "Your George Yachts partner-portal sign-in link",
            html,
            tags: [{ name: "kind", value: "partner_portal_magic" }],
          }),
        }).catch(() => {});
      }

      // Telegram diagnostic (so George sees who's logging in).
      await sendTelegram(`🔐 *Partner portal sign-in link sent*\n\n📧 ${email}`).catch(() => {});
    } catch {}
  }

  return Response.json({ ok: true });
}
