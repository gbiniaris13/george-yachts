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

async function checkAPI(name, url, body) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { name, ok: res.status > 0 && res.status < 500, status: res.status, ms: Date.now() - start };
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

  // Pages
  const pages = [
    ["Homepage", BASE_URL],
    ["/partners", BASE_URL + "/partners"],
    ["/about-us", BASE_URL + "/about-us"],
    ["/charter-yacht-greece", BASE_URL + "/charter-yacht-greece"],
    ["/faq", BASE_URL + "/faq"],
  ];
  const pageResults = await Promise.all(pages.map(([n, u]) => checkPage(n, u)));
  results.push(...pageResults);

  // APIs — use test data, expect non-500
  results.push(await checkAPI("Contact API", BASE_URL + "/api/contact", {
    name: "HEALTH_CHECK", email: "health@test.invalid", phone: "000",
    country: "Test", message: "Health check", recaptchaToken: "no_recaptcha",
    yacht_type: "test", guests: "2", budget: "test",
    check_in: "2026-01-01", check_out: "2026-01-08",
    embarkation: "test", disembarkation: "test",
  }));
  results.push(await checkAPI("Newsletter API", BASE_URL + "/api/newsletter", { email: "health@test.invalid" }));
  results.push(await checkAPI("Partner PDF API", BASE_URL + "/api/partner-request", { email: "health@test.invalid" }));

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
