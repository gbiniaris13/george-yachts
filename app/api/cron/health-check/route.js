import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CRON_SECRET = process.env.CRON_SECRET;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";

async function checkPage(name, url) {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, ok: res.ok, status: res.status, ms: Date.now() - start, message: res.ok ? "OK" : "HTTP " + res.status };
  } catch (err) {
    return { name, ok: false, status: 0, ms: Date.now() - start, message: err.message };
  }
}

// 2026-07-03 SOS UPGRADE — the old check counted ANY status under 500
// as healthy, so the /api/contact 400 that was bouncing real
// customers reported "✅ All OK" every morning. A form API that
// rejects a well-formed submission is BROKEN: expectStatus pins the
// exact success code per probe.
async function checkAPI(name, url, body, expectStatus = 200) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const ok = expectStatus === "lenient" ? res.status > 0 && res.status < 500 : res.status === expectStatus;
    return { name, ok, status: res.status, ms: Date.now() - start, message: ok ? "OK" : `expected ${expectStatus}, got ${res.status}` };
  } catch (err) {
    return { name, ok: false, status: 0, ms: Date.now() - start, message: err.message };
  }
}

async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
    });
  } catch {}
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== "Bearer " + CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const results = [];

  // Pages — the money surfaces a customer actually lands on.
  // 2026-07-03: crewed + catamaran head pages, a yacht page, and the
  // ambient music asset joined the list (all customer-visible).
  const pages = [
    ["Homepage", BASE_URL],
    ["/partners", BASE_URL + "/partners"],
    ["/about-us", BASE_URL + "/about-us"],
    ["/charter-yacht-greece", BASE_URL + "/charter-yacht-greece"],
    ["/crewed-yacht-charter-greece", BASE_URL + "/crewed-yacht-charter-greece"],
    ["/catamaran-charter-greece", BASE_URL + "/catamaran-charter-greece"],
    ["/yachts/genny", BASE_URL + "/yachts/genny"],
    ["/faq", BASE_URL + "/faq"],
    ["Ambient music asset", BASE_URL + "/audio/ambient-lounge.mp3"],
  ];
  const pageResults = await Promise.all(pages.map(([n, u]) => checkPage(n, u)));
  results.push(...pageResults);

  // Form APIs — honeypot probes: `website` filled makes every route
  // return 200 {ok:true} WITHOUT sending Telegram/email/WhatsApp, so
  // the daily check exercises routing + parsing with zero noise.
  // Any 4xx/5xx here means customers are being bounced RIGHT NOW.
  results.push(await checkAPI("Contact API (probe)", BASE_URL + "/api/contact", {
    website: "health-probe", name: "HEALTH_CHECK", email: "health@test.invalid",
    phone: "000", country: "Test", message: "probe", recaptchaToken: "no_recaptcha",
    yacht_type: "test", guests: "2", budget: "test",
    check_in: "2026-01-01", check_out: "2026-01-08",
  }));
  results.push(await checkAPI("Express Inquiry API (probe)", BASE_URL + "/api/inquiry", {
    website: "health-probe", name: "HEALTH_CHECK", email: "health@test.invalid",
    message: "probe", source: "health_check",
  }));
  results.push(await checkAPI("Newsletter API", BASE_URL + "/api/newsletter", { email: "health@test.invalid" }, "lenient"));
  results.push(await checkAPI("Partner PDF API", BASE_URL + "/api/partner-request", { email: "health@test.invalid" }, "lenient"));

  // Mondays: one REAL end-to-end submission through /api/inquiry so
  // the full Telegram+email+WhatsApp delivery chain is proven weekly
  // (clearly marked (TEST); George ignores it in 2 seconds).
  const isMonday = new Date().toLocaleDateString("en-GB", { timeZone: "Europe/Athens", weekday: "short" }) === "Mon";
  if (isMonday) {
    results.push(await checkAPI("Weekly E2E lead delivery", BASE_URL + "/api/inquiry", {
      name: "(TEST) Weekly form check", email: "test+forms@georgeyachts.com",
      message: "(TEST) Automated Monday end-to-end check: if this arrived on Telegram AND email in full, the lead pipeline is healthy. Ignore.",
      source: "weekly_health_e2e",
    }));
  }

  // Gmail SMTP
  let gmailOk = false;
  try {
    if (GMAIL_USER && GMAIL_PASS) {
      const t = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_PASS } });
      await t.verify();
      gmailOk = true;
    }
  } catch {}
  results.push({ name: "Gmail SMTP", ok: gmailOk, status: gmailOk ? 200 : 0, ms: 0, message: gmailOk ? "OK" : "FAILED" });

  // Telegram Bot
  let tgOk = false;
  try {
    if (TELEGRAM_BOT_TOKEN) {
      const r = await fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/getMe");
      tgOk = r.ok;
    }
  } catch {}
  results.push({ name: "Telegram Bot", ok: tgOk, status: tgOk ? 200 : 0, ms: 0, message: tgOk ? "OK" : "FAILED" });

  // Report
  const allOk = results.every((r) => r.ok);
  const failed = results.filter((r) => !r.ok);
  const ts = new Date().toLocaleString("en-GB", { timeZone: "Europe/Athens", hour12: false });

  const lines = allOk
    ? [
        "✅ *Daily Health Check — All OK*",
        "🕐 " + ts + " Athens",
        "",
        ...results.map((r) => "✓ " + r.name + " — " + r.ms + "ms"),
        "",
        "_georgeyachts.com fully operational._",
      ]
    : [
        "🚨 *ALERT — Issues Detected!*",
        "🕐 " + ts + " Athens",
        "",
        ...results.map((r) => (r.ok ? "✅ " : "❌ ") + r.name + (r.ok ? "" : " — " + (r.message || "FAIL"))),
        "",
        "⚠️ *" + failed.length + " issue(s) need attention!*",
      ];

  await sendTelegram(lines.join("\n"));

  return NextResponse.json({ status: allOk ? "healthy" : "degraded", timestamp: ts, results });
}
