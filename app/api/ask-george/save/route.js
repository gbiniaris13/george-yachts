// Ask George, follow-up delivery (2026-11-05, form sweep).
//
// The chat endpoint (../route.js) runs on the edge, where Gmail cannot
// be reached, so its follow-ups went to Telegram only, and a visitor
// text with an odd _ or * could make Telegram drop the alert while the
// widget still said "Saved". This Node route takes the follow-up and
// delivers it like every other form: Telegram AND email to George, the
// full conversation in both, replyTo set to the visitor. It answers
// 502 { ok: false } when neither arrived, so the widget can show
// George's WhatsApp and email instead of a false "Saved".
//
// Two callers, both through ../route.js:
//   trigger "form": the visitor filled the "Send to George" form;
//   trigger "chat": the visitor typed an email or phone number into
//                   the chat itself (the assistant invites follow-up).

import { notifyGeorge, reachedGeorge } from "@/lib/notifyGeorge";
import { telegramSafe, htmlSafe, isValidEmail, phoneDigits } from "@/lib/requiredContact";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  // Calls from ../route.js all come from the edge function's address;
  // with the shared secret they carry the visitor's, and are limited
  // per visitor rather than all together.
  const secret = process.env.CRON_SECRET || "";
  const internal = secret && req.headers.get("x-gy-internal") === secret;
  const limitBy = internal
    ? { headers: new Headers({ "x-forwarded-for": req.headers.get("x-gy-visitor-ip") || "unknown" }) }
    : req;
  const rl = checkRateLimit(limitBy, { max: 6, windowMs: 60000 });
  if (!rl.ok) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const trigger = body?.trigger === "chat" ? "chat" : "form";
  const name = String(body?.name || "").slice(0, 100).trim();
  const email = String(body?.email || "").slice(0, 200).trim();
  const phone = String(body?.phone || "").slice(0, 40).trim();
  const path = String(body?.path || "").slice(0, 200);
  const transcript = (Array.isArray(body?.messages) ? body.messages : [])
    .slice(-30)
    .map((m) => ({
      who: m?.role === "user" ? "Visitor" : "Ask George",
      text: String(m?.content || "").slice(0, 4000),
    }));

  const hasEmail = isValidEmail(email);
  const hasPhone = phoneDigits(phone).length >= 7;
  if (trigger === "form" ? !(name && hasEmail) : !(hasEmail || hasPhone)) {
    return Response.json({ ok: false, error: "missing_contact" }, { status: 400 });
  }

  const heading =
    trigger === "chat"
      ? "Ask George, contact details typed in the chat"
      : "Ask George, follow-up requested";
  const telegramText = [
    `🤖 *${heading}*`,
    ``,
    name ? `👤 ${telegramSafe(name, 100)}` : null,
    hasEmail ? `📧 ${telegramSafe(email, 200)}` : null,
    phone ? `📞 ${telegramSafe(phone, 40)}` : null,
    ``,
    ...transcript.map((m) => `${m.who}: ${telegramSafe(m.text, 4000)}`),
    ``,
    `Source: ${telegramSafe(path || "unknown", 200)}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const emailHtml = `
    <h3>${htmlSafe(heading)}</h3>
    ${name ? `<p><strong>Name:</strong> ${htmlSafe(name, 100)}</p>` : ""}
    ${hasEmail ? `<p><strong>Email:</strong> ${htmlSafe(email, 200)}</p>` : ""}
    ${phone ? `<p><strong>Phone / WhatsApp:</strong> ${htmlSafe(phone, 40)}</p>` : ""}
    <p><strong>Page:</strong> ${htmlSafe(path || "unknown")}</p>
    <hr>
    <h4>The conversation (full)</h4>
    ${transcript
      .map((m) => `<p style="white-space: pre-line;"><strong>${m.who}:</strong> ${htmlSafe(m.text, 4000)}</p>`)
      .join("")}
  `;

  const notified = await notifyGeorge({
    telegramText,
    emailSubject: `[Lead] ${heading}, ${name || email || phone}`,
    emailHtml,
    replyTo: hasEmail ? email : undefined,
  });

  if (!reachedGeorge(notified)) {
    console.error(`ask-george/save: ${trigger} follow-up from ${email || phone} reached no channel`);
    return Response.json({ ok: false, error: "not_delivered" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
