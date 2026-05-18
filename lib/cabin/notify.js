// lib/cabin/notify.js
// =============================================================
// Notify George helper. Telegram when configured, otherwise
// surfaces the alert in the server console so we can see it
// during local dev. Always fire-and-forget — never blocks the
// charterer's response on a failed nudge.
// =============================================================

export async function notifyGeorge({ icon, title, lines = [], link } = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  const cmd = process.env.GY_COMMAND_URL || "https://command.georgeyachts.com";

  const text =
    `${icon ? icon + " " : ""}${title}\n` +
    lines.filter(Boolean).join("\n") +
    (link ? `\nOpen: ${cmd}${link}` : "");

  if (!token || !chat) {
    console.log("\n" + "═".repeat(60));
    console.log(`📣 CABIN — ${title} (Telegram not configured):`);
    console.log(text);
    console.log("═".repeat(60) + "\n");
    return { ok: true, channel: "console" };
  }
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
