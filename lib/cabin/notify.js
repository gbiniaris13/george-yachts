// lib/cabin/notify.js
// =============================================================
// Notify George helper. Sends BOTH Telegram + email to his
// inbox (george@georgeyachts.com) so guest data lands where he
// actually files it — phone, DOB, email for future outreach
// (birthday wishes etc).
//
// Always fire-and-forget; never blocks the charterer's response.
// Both channels independent — if one fails the other still goes.
//
// 2026-05-23 — George: "Αυτά πρέπει να τα παίρνω εγώ με mail
// πίσω στο back office, στο mail μου, όλα τα στοιχεία τους."
// =============================================================

const GEORGE_EMAIL =
  process.env.CABIN_NOTIFY_EMAIL || "george@georgeyachts.com";
// 2026-06-01 — Brief 06 / G1-B: FROM on the VERIFIED Resend domain
// (send.georgeyachts.com), not the unverified apex. The old apex
// default caused a silent Resend 403. Kept consistent with
// lib/cabin/email.js FROM_DEFAULT.
const FROM_ADDRESS =
  process.env.CABIN_FROM_ADDRESS ||
  process.env.RESEND_FROM_ADDRESS ||
  "George Yachts · Cabin <cabin@send.georgeyachts.com>";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendTelegram({ text }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { ok: false, channel: "telegram", skipped: true };
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
    if (!r.ok) {
      console.error("[notify] telegram", r.status, await r.text().catch(() => ""));
      return { ok: false, channel: "telegram", status: r.status };
    }
    return { ok: true, channel: "telegram" };
  } catch (e) {
    console.error("[notify] telegram error:", e.message);
    return { ok: false, channel: "telegram", error: e.message };
  }
}

async function sendEmail({ icon, title, lines, link, cmdUrl }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, channel: "email", skipped: true };

  const subject = `${icon ? icon + " " : ""}${title}`;
  const linesHtml = lines
    .filter(Boolean)
    .map((l) => `<tr><td style="padding:6px 0;color:#0D1B2A;font-size:14px;line-height:1.5;">${esc(l)}</td></tr>`)
    .join("");
  const linkHtml = link
    ? `<p style="margin:24px 0 0 0;"><a href="${esc(cmdUrl + link)}" style="color:#C9A84C;text-decoration:none;border-bottom:1px solid #C9A84C;font-family:Georgia,serif;font-style:italic;">Open in GY Command →</a></p>`
    : "";

  const html = `<!doctype html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px;margin:24px auto;background:#FCFAF4;border:1px solid rgba(201,168,76,0.32);border-radius:6px;padding:32px;">
    <tr><td>
      <div style="font-size:10.5px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-weight:600;margin-bottom:12px;">The Cabin · Filotimo</div>
      <h1 style="margin:0 0 18px 0;color:#0D1B2A;font-family:Georgia,serif;font-style:italic;font-size:24px;font-weight:400;">${esc(title)}</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${linesHtml}</table>
      ${linkHtml}
      <p style="margin:28px 0 0 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(13,27,42,0.5);">George Yachts · cabin alert</p>
    </td></tr>
  </table>
</body></html>`;

  const text =
    `${subject}\n\n` +
    lines.filter(Boolean).join("\n") +
    (link ? `\n\nOpen in GY Command: ${cmdUrl}${link}` : "");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [GEORGE_EMAIL],
        subject,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error("[notify] email", r.status, await r.text().catch(() => ""));
      return { ok: false, channel: "email", status: r.status };
    }
    return { ok: true, channel: "email" };
  } catch (e) {
    console.error("[notify] email error:", e.message);
    return { ok: false, channel: "email", error: e.message };
  }
}

export async function notifyGeorge({ icon, title, lines = [], link } = {}) {
  const cmd = process.env.GY_COMMAND_URL || "https://command.georgeyachts.com";
  const text =
    `${icon ? icon + " " : ""}${title}\n` +
    lines.filter(Boolean).join("\n") +
    (link ? `\nOpen: ${cmd}${link}` : "");

  // Console fallback if nothing is configured (local dev).
  const hasTelegram = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  const hasEmail = !!process.env.RESEND_API_KEY;
  if (!hasTelegram && !hasEmail) {
    console.log("\n" + "═".repeat(60));
    console.log(`📣 CABIN — ${title} (no notify channels configured):`);
    console.log(text);
    console.log("═".repeat(60) + "\n");
    return { ok: true, channel: "console" };
  }

  // Fire both channels in parallel — neither blocks the other.
  const [telegramRes, emailRes] = await Promise.allSettled([
    sendTelegram({ text }),
    sendEmail({ icon, title, lines, link, cmdUrl: cmd }),
  ]);

  return {
    ok:
      (telegramRes.status === "fulfilled" && telegramRes.value.ok) ||
      (emailRes.status === "fulfilled" && emailRes.value.ok),
    telegram: telegramRes.status === "fulfilled" ? telegramRes.value : { ok: false, error: String(telegramRes.reason) },
    email: emailRes.status === "fulfilled" ? emailRes.value : { ok: false, error: String(emailRes.reason) },
  };
}
