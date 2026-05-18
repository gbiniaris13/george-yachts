// lib/cabin/email.js
// =============================================================
// THE CABIN — transactional emails (Resend).
//
// Uses the same REST-fetch pattern as lib/newsletter/resend.js to
// avoid adding a Resend SDK dep. Two templates in Phase 1:
//   1. Cabin invite (after admin creates the cabin)
//   2. Concierge handoff (when George finishes filling on behalf)
// =============================================================

const RESEND_API = "https://api.resend.com/emails";
const FROM_DEFAULT =
  process.env.CABIN_FROM_ADDRESS ||
  "George Yachts <cabin@georgeyachts.com>";
const REPLY_TO_DEFAULT =
  process.env.CABIN_REPLY_TO || "george@georgeyachts.com";

function apiKey() {
  const k = process.env.RESEND_API_KEY;
  if (!k) throw new Error("[cabin/email] RESEND_API_KEY is not set");
  return k;
}

// HTML-escape every user/DB-controlled string interpolated into the
// templates. Vessel names, charterer names, and even fromDate/toDate
// land here so a stray "<" or quote can't break layout or open an
// injection vector in any future browser-rendered surface.
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function baseUrl() {
  const raw = process.env.CABIN_PUBLIC_URL || "https://georgeyachts.com";
  return raw.replace(/\/+$/, "");
}

async function send(payload) {
  const r = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`[cabin/email] Resend ${r.status}: ${text}`);
  }
  return r.json();
}

// -----------------------------------------------------------
// Shared HTML wrapper — navy header bar, ivory body, gold rule.
// Inlined CSS for email-client compatibility.
// -----------------------------------------------------------
function wrap({ preheader, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>The Cabin · George Yachts</title>
  </head>
  <body style="margin:0;padding:0;background:#F8F5F0;font-family:Georgia,serif;color:#0D1B2A;">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F5F0;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(13,27,42,0.08);">
            <tr>
              <td style="background:#0D1B2A;padding:24px 32px;">
                <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#C9A84C;letter-spacing:3.5px;font-size:11px;text-transform:uppercase;font-weight:500;">George Yachts</div>
                <div style="font-family:Georgia,serif;color:#F8F5F0;font-size:26px;line-height:1.1;margin-top:8px;font-weight:300;">The Cabin <span style="color:#C9A84C;font-style:italic;">·</span> <em style="color:#C9A84C;font-style:italic;">Filotimo</em></div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 16px 32px;border-bottom:1px solid rgba(201,168,76,0.5);"></td>
            </tr>
            <tr>
              <td style="padding:8px 32px 36px 32px;font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#0D1B2A;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px 32px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:2px;color:rgba(13,27,42,0.4);text-transform:uppercase;text-align:center;border-top:1px solid rgba(13,27,42,0.08);">
                Ionian · Cyclades · Saronic · Athens · USA
              </td>
            </tr>
          </table>
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:rgba(13,27,42,0.35);margin-top:16px;letter-spacing:1.5px;">
            georgeyachts.com
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// -----------------------------------------------------------
// Magic-link email
// -----------------------------------------------------------
export async function sendMagicLinkEmail({
  to,
  displayName,
  vesselName,
  fromDate,
  toDate,
  link,
}) {
  const niceName = displayName ? `Dear ${esc(displayName)},` : "Dear guest,";
  const dates = `${esc(fromDate)} – ${esc(toDate)}`;
  const body = `
    <p style="margin:0 0 16px 0;">${niceName}</p>
    <p style="margin:0 0 16px 0;">Welcome aboard, in spirit. Your charter aboard <strong>${esc(vesselName)}</strong> (${dates}) is confirmed, and your private Cabin at George Yachts is ready.</p>
    <p style="margin:0 0 16px 0;">Inside you will find your charter details and the Charter Brief — eight gentle sections that let us prepare every meal, every anchorage and every small touch around your group. Take it at your pace, an unhurried half hour across as many sittings as you like. Only your name and email are truly required; leave the rest blank wherever it does not apply.</p>
    <p style="margin:0 0 16px 0;">Think of me as your person in Greece for the whole arc of this voyage — before, during, and afterwards. Anything you need, you write inside the Cabin and it reaches me.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(link)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;font-weight:500;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Open my Cabin</a>
    </p>
    <p style="margin:0 0 8px 0;font-size:13px;color:rgba(13,27,42,0.55);">This link is valid for 24 hours, and you will stay signed in on this device for a year — no need to ask for another link each visit. If you do need a fresh one, simply reply to this email.</p>

    <!-- Add to Home Screen — turns the Cabin into a one-tap app -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 0;">
      <tr>
        <td style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.45);padding:18px 20px;">
          <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10.5px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-weight:500;">Put the Cabin on your home screen</p>
          <p style="margin:0 0 10px 0;font-family:Georgia,serif;font-style:italic;font-size:13.5px;line-height:1.6;color:rgba(13,27,42,0.75);">Open the Cabin once — then add it to your home screen so it lives there like any other app. No password to remember, no link to chase. Just tap and you are inside.</p>
          <p style="margin:0 0 4px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#0D1B2A;"><strong style="color:#0D1B2A;">iPhone &amp; iPad:</strong> in Safari, tap the share icon <span style="font-family:Georgia,serif;">⬆</span> at the bottom, then <em>Add to Home Screen</em>.</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#0D1B2A;"><strong style="color:#0D1B2A;">Android:</strong> in Chrome, tap the three-dot menu, then <em>Install app</em> (or <em>Add to Home screen</em>).</p>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 4px 0;font-style:italic;color:#0D1B2A;">With anticipation for your voyage,</p>
    <p style="margin:0 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:20px;color:#0D1B2A;">George P. Biniaris</p>
    <p style="margin:2px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:2px;color:rgba(13,27,42,0.55);text-transform:uppercase;">Managing Broker · George Yachts</p>
  `;

  return send({
    from: FROM_DEFAULT,
    reply_to: REPLY_TO_DEFAULT,
    to: [to],
    subject: "Your Cabin at George Yachts",
    html: wrap({ preheader: `Your Cabin for ${esc(vesselName)} is ready.`, body }),
    tags: [
      { name: "stream", value: "cabin" },
      { name: "purpose", value: "magic_link" },
    ],
  });
}

// -----------------------------------------------------------
// Chat notification email — charterer notified about an admin
// message. Body is intentionally short and content-free; we link
// back to the Cabin instead of revealing the message body in the
// email (privacy by design).
// -----------------------------------------------------------
export async function sendChatNotificationEmail({ to, displayName, vesselName }) {
  const niceName = displayName ? `Dear ${esc(displayName)},` : "Dear guest,";
  const link = `${baseUrl()}/cabin/chat`;
  const body = `
    <p style="margin:0 0 16px 0;">${niceName}</p>
    <p style="margin:0 0 16px 0;">George has sent you a note in your Cabin chat about your ${esc(vesselName)} charter.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(link)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Read in my Cabin</a>
    </p>
    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(13,27,42,0.55);font-style:italic;">You'll only receive this kind of email at most every 30 minutes.</p>
  `;
  return send({
    from: FROM_DEFAULT,
    reply_to: REPLY_TO_DEFAULT,
    to: [to],
    subject: "George sent you a note in your Cabin",
    html: wrap({ preheader: "George has sent you a message about your charter.", body }),
    tags: [
      { name: "stream", value: "cabin" },
      { name: "purpose", value: "chat_notification" },
    ],
  });
}

// -----------------------------------------------------------
// Concierge handoff email
// -----------------------------------------------------------
export async function sendConciergeHandoffEmail({
  to,
  displayName,
  link,
}) {
  const niceName = displayName ? `Dear ${esc(displayName)},` : "Dear guest,";
  const body = `
    <p style="margin:0 0 16px 0;">${niceName}</p>
    <p style="margin:0 0 16px 0;">I have prepared your Cabin based on our conversations. Please take a moment to review the details — if everything looks correct, a single click confirms it. If anything needs adjustment, you may edit any field directly.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(link)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;font-weight:500;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Review my Cabin</a>
    </p>
    <p style="margin:24px 0 4px 0;font-style:italic;">With warm regards,</p>
    <p style="margin:0 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:20px;">George P. Biniaris</p>
  `;
  return send({
    from: FROM_DEFAULT,
    reply_to: REPLY_TO_DEFAULT,
    to: [to],
    subject: "Your Cabin is prepared for your review",
    html: wrap({
      preheader: "I have prepared your Cabin for your review.",
      body,
    }),
    tags: [
      { name: "stream", value: "cabin" },
      { name: "purpose", value: "concierge_handoff" },
    ],
  });
}
