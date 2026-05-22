// lib/cabin/email.js
// =============================================================
// THE CABIN — transactional emails (Resend).
//
// Uses the same REST-fetch pattern as lib/newsletter/resend.js to
// avoid adding a Resend SDK dep. Two templates in Phase 1:
//   1. Cabin invite (after admin creates the cabin)
//   2. Concierge handoff (when George finishes filling on behalf)
// =============================================================

import { titleCaseName, prettyDate, firstNameFromDisplayName } from "./format";

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

// titleCaseName + prettyDate moved to lib/cabin/format.js so the
// same helpers can be used by server pages (greeting copy on
// /cabin home, /cabin/welcome etc.) without dragging in the
// Resend email module.

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
              <td style="padding:18px 32px 8px 32px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:2px;color:rgba(13,27,42,0.45);text-transform:uppercase;text-align:center;border-top:1px solid rgba(13,27,42,0.08);">
                Cyclades · Ionian · Saronic
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 22px 32px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:1.6px;color:rgba(13,27,42,0.4);text-transform:uppercase;text-align:center;">
                George Yachts Brokerage House LLC<br/>
                <span style="color:rgba(13,27,42,0.32);">Registered in the United States · Operating from Athens</span>
              </td>
            </tr>
          </table>
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:rgba(13,27,42,0.4);margin-top:16px;letter-spacing:1.5px;">
            <a href="https://georgeyachts.com" style="color:rgba(13,27,42,0.55);text-decoration:none;">georgeyachts.com</a>
          </div>
          <!-- 2026-05-22 — GHOST_ build credit, matching the in-cabin
               credit so the same hand signs every surface. JetBrains
               Mono in the live cabin → web-safe monospace stack in
               email since the cabin font isn't reliably available in
               every mail client. -->
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(13,27,42,0.06);font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10.5px;letter-spacing:0.12em;line-height:1.6;color:rgba(13,27,42,0.55);">
            <a href="https://ghostwebdesign.dev" style="color:rgba(13,27,42,0.55);text-decoration:none;">
              This private cabin platform was designed and built by
              <strong style="font-weight:700;color:#C9A84C;letter-spacing:0.22em;">GHOST_</strong>
              — <em style="font-style:italic;">premium digital agency for the discerning few</em> ↗
            </a>
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
  // 2026-05-22 — Optional inviter context. When the principal
  // charterer invites a guest from /cabin/guests, we pass their
  // display name here so the opening line frames the email as
  // "{Inviter} has asked you to join the week aboard X" rather
  // than the principal-voice "your voyage draws closer". The
  // CRM-initiated invite (sent FROM the broker TO the principal)
  // leaves this null and uses the voyage-anticipation copy.
  inviterName = null,
}) {
  // 2026-05-22 — George directive:
  //   • Para 2 must reflect the real brief reality, not the
  //     soft "only name and email required" line. Personal facts
  //     (allergies, dietary, swimming, passport) come from each
  //     guest themselves; the rest is collaborative.
  //   • Link validity is now 3 months (90 days), matching how
  //     long ahead clients are typically invited.
  //   • The "save to phone" panel is presented as an option ("if
  //     you'd like…"), never as an instruction.
  //   • CTA is no longer "Open my Cabin" — too utilitarian for a
  //     boutique broker. "Step aboard ↗" picks up the "welcome
  //     aboard" thread from paragraph 1 and matches the brand
  //     mark.
  //   • Footer line orders Cyclades first (the brand's heartland),
  //     then Ionian, then Saronic. The company-structure line
  //     ("Registered in the United States · Operating from Athens")
  //     is separated from the cruising-region line so the two
  //     pieces of information aren't conflated.
  //   • Bottom of the email carries the same GHOST_ build credit
  //     as the cabin platform itself.
  const properName = displayName ? titleCaseName(displayName) : "";
  const niceName = properName ? `Dear ${esc(properName)},` : "Dear guest,";
  const dates = `${esc(prettyDate(fromDate))} – ${esc(prettyDate(toDate))}`;
  const installLink = `${baseUrl()}/cabin/install`;

  // 2026-05-22 — Anticipation, not transactional confirmation.
  // The opening line carries the luxury-anticipation tone George
  // asked for (the time approaches, summer is coming, the boat
  // is being made ready). If an inviter (the principal) sent
  // this invite to a guest, the opening names them so the
  // recipient knows who brought them in.
  const inviterFirst = inviterName
    ? firstNameFromDisplayName(inviterName)
    : null;
  const opening = inviterFirst
    ? `Welcome aboard, in spirit. <strong>${esc(inviterFirst)}</strong> has asked you to join the week aboard <strong>${esc(vesselName)}</strong> (${dates}) — and your private Cabin at George Yachts is open for you.`
    : `Welcome aboard, in spirit. Slowly, then all at once, your week aboard <strong>${esc(vesselName)}</strong> (${dates}) draws closer — Greek waters turning warm, the yacht being made ready — and your private Cabin at George Yachts is open for you.`;

  const body = `
    <p style="margin:0 0 16px 0;">${niceName}</p>
    <p style="margin:0 0 16px 0;">${opening}</p>
    <p style="margin:0 0 16px 0;">Inside you will find your charter details and the Charter Brief — short, considered sections the group shapes together at its own pace. Each person also shares their own brief personal note (allergies, dietary preferences, swimming, passport) so the chef cooks safely and the captain has everything for the harbours. The rest is yours to take across as many sittings as you like.</p>
    <p style="margin:0 0 16px 0;">Think of me as your person in Greece for the whole arc of this voyage — before, during, and afterwards. Anything you need, you write inside the Cabin and it reaches me.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(link)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;font-weight:500;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Step aboard ↗</a>
    </p>
    <p style="margin:0 0 8px 0;font-size:13px;color:rgba(13,27,42,0.55);">This link is valid for three months, and the same link works from your laptop, phone or iPad — each device stays signed in for a year after one tap. If you ever need a fresh one, simply reply to this email.</p>

    <!-- 2026-05-22 — Boutique deadline footnote. Same line appears
         on /cabin home so the message arrives twice in two
         different voices — first as an invitation, then as a
         quiet reminder once they're inside. -->
    <p style="margin:18px 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:13.5px;line-height:1.65;color:rgba(13,27,42,0.7);border-left:2px solid rgba(201,168,76,0.55);padding:4px 0 4px 14px;">
      So that the chef can stock, the cellar can be set, and every harbour quietly noted — the brief is best complete by the week before you sail.
    </p>

    <!-- Optional: Add to Home Screen — invitation, never an instruction -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 0;">
      <tr>
        <td style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.45);padding:18px 20px;">
          <p style="margin:0 0 8px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10.5px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-weight:500;">If you'd like it on your phone</p>
          <p style="margin:0 0 12px 0;font-family:Georgia,serif;font-style:italic;font-size:13.5px;line-height:1.6;color:rgba(13,27,42,0.75);">Should you prefer to open the Cabin from your phone while you're travelling, you can save it to your home screen — after that it opens like any other app, with no sign-in needed.</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#0D1B2A;">
            <a href="${esc(installLink)}" style="color:#C9A84C;text-decoration:none;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;">How to save it →</a>
            <span style="color:rgba(13,27,42,0.4);"> · works on iPhone and Android</span>
          </p>
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
  const properName = displayName ? titleCaseName(displayName) : "";
  const niceName = properName ? `Dear ${esc(properName)},` : "Dear guest,";
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
  const properName = displayName ? titleCaseName(displayName) : "";
  const niceName = properName ? `Dear ${esc(properName)},` : "Dear guest,";
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

// -----------------------------------------------------------
// Preference-sheet share email — to the operating team
// (captain / chef / hostess / management company / yacht owner).
// The shareUrl is the tokenised /cabin/share/[token] route which
// the recipient can open without an account. customMessage is
// George's optional one-paragraph note that appears above the CTA.
// -----------------------------------------------------------
export async function sendPreferenceShareEmail({
  to,
  recipientName,
  vesselName,
  charterDates,
  shareUrl,
  customMessage,
  fromBroker,
}) {
  const properName = recipientName ? titleCaseName(recipientName) : "";
  const niceName = properName ? `Dear ${esc(properName)},` : "Hello,";
  const broker = fromBroker || "George P. Biniaris";
  const message = customMessage?.trim()
    ? `<p style="margin:0 0 16px 0;">${esc(customMessage.trim()).replace(/\n/g, "<br/>")}</p>`
    : "";
  const body = `
    <p style="margin:0 0 16px 0;">${niceName}</p>
    <p style="margin:0 0 16px 0;">Please find the charter preferences for <strong>${esc(vesselName)}</strong>${charterDates ? ` (${esc(charterDates)})` : ""}.</p>
    ${message}
    <p style="margin:0 0 16px 0;">The full preference sheet — guest manifest, allergies, dining preferences, bar &amp; cellar provisioning, itinerary notes — is at the link below. It opens in your browser; no account or login is needed.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(shareUrl)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;font-weight:500;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Open charter preferences</a>
    </p>
    <p style="margin:0 0 8px 0;font-size:13px;color:rgba(13,27,42,0.55);">For printing or PDF, the page has a Print button at the top — or use ⌘P / Ctrl+P. The link stays live for a year.</p>
    <p style="margin:24px 0 4px 0;font-style:italic;color:#0D1B2A;">With warm regards,</p>
    <p style="margin:0 0 0 0;font-family:Georgia,serif;font-style:italic;font-size:20px;color:#0D1B2A;">${esc(broker)}</p>
    <p style="margin:2px 0 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:2px;color:rgba(13,27,42,0.55);text-transform:uppercase;">George Yachts Brokerage House LLC</p>
  `;

  return send({
    from: FROM_DEFAULT,
    reply_to: REPLY_TO_DEFAULT,
    to: [to],
    subject: `Charter preferences · ${vesselName}`,
    html: wrap({
      preheader: `Charter preferences for ${esc(vesselName)} are ready to view.`,
      body,
    }),
    tags: [
      { name: "stream", value: "cabin" },
      { name: "purpose", value: "preference_share" },
    ],
  });
}

// -----------------------------------------------------------
// Brief-submitted email — to the broker (George) when the
// principal charterer hits "Send to George" on the brief review
// screen. Pairs with the Telegram alert in notify.js so George
// gets the notification in both channels.
// -----------------------------------------------------------
export async function sendBriefSubmittedEmail({
  to,
  vesselName,
  charterer,
  from,
  to_date,
  submittedAt,
  cabinUrl,
}) {
  const dateLine =
    from && to_date ? `${esc(from)} → ${esc(to_date)}` : "";
  const whenSubmitted = submittedAt
    ? new Date(submittedAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "just now";
  const body = `
    <p style="margin:0 0 16px 0;">Dear George,</p>
    <p style="margin:0 0 16px 0;">
      <strong>${esc(charterer || "The principal charterer")}</strong> has just sent the charter brief for
      <strong>${esc(vesselName || "their cabin")}</strong>${dateLine ? ` (${dateLine})` : ""}.
    </p>
    <p style="margin:0 0 16px 0;">Submitted ${esc(whenSubmitted)}.</p>
    <p style="margin:0 0 16px 0;">
      The brief is now locked — guests can no longer edit. Open the cabin in GY Command to read the full preference sheet and forward it to the captain, chef and the management company.
    </p>
    <p style="margin:0 0 24px 0;">
      <a href="${esc(cabinUrl)}" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:2.5px;font-size:12px;font-weight:500;padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;">Open in GY Command</a>
    </p>
    <p style="margin:0 0 4px 0;font-size:13px;color:rgba(13,27,42,0.55);">If they need to make a change, use the "Reopen brief" button in the cabin detail page — that unlocks editing for everyone again.</p>
  `;
  return send({
    from: FROM_DEFAULT,
    reply_to: REPLY_TO_DEFAULT,
    to: [to],
    subject: `Brief submitted · ${vesselName || charterer || "cabin"}`,
    html: wrap({
      preheader: `${charterer || "A charterer"} has submitted the brief for ${vesselName || "their cabin"}.`,
      body,
    }),
    tags: [
      { name: "stream", value: "cabin" },
      { name: "purpose", value: "brief_submitted" },
    ],
  });
}
