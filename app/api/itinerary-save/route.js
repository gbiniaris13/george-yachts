// L.1 (Roberto brief, May 2026) — Itinerary save flow.
//
// POST endpoint for /itinerary-builder. Validates name + email, fires
// Telegram to Boss with the curated route + user info, sends the user
// a confirmation email via the existing Resend wrapper.
//
// Mapbox upgrade is L.1 phase 2 — flagged for when Boss provides the
// MAPBOX_ACCESS_TOKEN env var. This phase 1 covers the save +
// notification flow on the existing SVG-based builder.

import { sendTelegram } from "@/lib/telegram";
import { sendNewsletterEmail } from "@/lib/newsletter/resend";
import { bumpKpi } from "@/lib/kpis";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req) {
  // 2026-05-12 — rate limit. Without this each call cost: Telegram
  // alert + Resend transactional email + KPI write. Anyone could
  // POST loops to burn Resend's 100/day free quota (blocking real
  // confirmation emails) and spam George's Telegram. Same pattern
  // as /api/proposal-generate fix (Item 61). 3/min/IP — generous
  // for a visitor re-saving a tweaked route.
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
  const message = (body?.message || "").toString().slice(0, 1000).trim();
  const route = Array.isArray(body?.route) ? body.route.slice(0, 30) : [];
  const totalNM = (body?.totalNM || "").toString().slice(0, 20);
  const hours = (body?.hours || "").toString().slice(0, 20);

  if (!name || !email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Missing or invalid name/email" }, { status: 400 });
  }
  if (route.length < 2) {
    return Response.json({ ok: false, error: "Route must include at least 2 stops" }, { status: 400 });
  }

  const routeStr = route.map((s) => (typeof s === "string" ? s : s?.name || "?")).join(" → ");

  // Telegram to Boss
  const tg = `🗺️ *Itinerary Builder — saved route*\n\n👤 ${name}\n📧 ${email}\n\n*Route:* ${routeStr}\n*Total:* ${totalNM || "?"} NM · ~${hours || "?"} sailing hours\n${message ? `\n*Notes:*\n${message}\n` : ""}\n_Source: /itinerary-builder_`;
  try {
    await sendTelegram(tg);
  } catch {}

  // Confirmation email to user (best-effort; failures don't block).
  try {
    const html = `
<div style="font-family:'Lato','Montserrat',sans-serif;font-size:14px;line-height:1.7;color:#0D1B2A">
<p>Dear ${name.split(" ")[0] || "friend"},</p>
<p>Thank you — I've saved the Greek-island route you designed on the website. Here it is for your records:</p>
<p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#0D1B2A;margin:18px 0">
<strong>${routeStr}</strong><br/>
<span style="color:#9CA3AF">${totalNM || ""} NM · ~${hours || ""} sailing hours</span>
</p>
${message ? `<p style="background:#F8F5F0;padding:12px 16px;border-left:3px solid #C9A84C;font-style:italic">${message.replace(/</g, "&lt;")}</p>` : ""}
<p>I'll come back to you within 24 hours with two yachts that fit this route at the time of year you're looking at, plus one alternative I think you haven't considered.</p>
<p>If anything's urgent, the fastest channel is WhatsApp: <a href="https://api.whatsapp.com/send/?phone=17867988798">+1 786 798 8798</a>.</p>
<p style="margin-top:24px">— George<br/>
<span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9CA3AF">George P. Biniaris · Managing Broker</span></p>
</div>`.trim();
    await sendNewsletterEmail({
      to: email,
      subject: `Your Greek itinerary is saved — ${routeStr.length > 60 ? routeStr.slice(0, 57) + "…" : routeStr}`,
      html,
      list: "transactional", // not a newsletter — reuses Resend infra for one-off
      tags: [{ name: "kind", value: "itinerary_save" }],
    }).catch(() => {});
  } catch {}

  bumpKpi("itinerary_saved").catch(() => {});
  return Response.json({ ok: true });
}
