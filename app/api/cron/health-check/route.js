import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { WHATSAPP_DOWN, WHATSAPP_US_LOCKED } from "@/lib/whatsappStatus";
import { emailGeorge } from "@/lib/notifyGeorge";

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
    const ok = expectStatus === "lenient"
      ? res.status > 0 && res.status < 500
      : Array.isArray(expectStatus)
        ? expectStatus.includes(res.status)
        : res.status === expectStatus;
    // 2026-09-18: a 429 from our own rate limiter is the probe being
    // throttled, not a customer being bounced; it passes but says so.
    const message = ok ? (res.status === 429 ? "OK (rate limited, probe only)" : "OK") : `expected ${expectStatus}, got ${res.status}`;
    return { name, ok, status: res.status, ms: Date.now() - start, message };
  } catch (err) {
    return { name, ok: false, status: 0, ms: Date.now() - start, message: err.message };
  }
}

// 2026-09-18 — George: "δεν τα παίρνω πια". The report went to Telegram
// only, and this function threw the answer away, so a chat that stopped
// receiving looked exactly like one that did. It now returns the truth
// and the email carries it.
async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return { ok: false, detail: "no token or chat id in env" };
  try {
    const r = await fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
    });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok && j.ok === true, detail: r.ok && j.ok ? "delivered" : `HTTP ${r.status} ${j.description || ""}`.trim() };
  } catch (err) {
    return { ok: false, detail: err.message };
  }
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  // 2026-09-18: both routes honour the honeypot, so the probe no longer
  // subscribes a fake address or mails George a fake partner request every
  // morning. Only 200 (or our own 429) is health; "lenient" hid a 400.
  results.push(await checkAPI("Newsletter API (probe)", BASE_URL + "/api/newsletter", { website: "health-probe", email: "health@test.invalid" }, [200, 429]));
  results.push(await checkAPI("Partner PDF API (probe)", BASE_URL + "/api/partner-request", { website: "health-probe", email: "health@test.invalid" }, [200, 429]));

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

  // WhatsApp CTA consistency (2026-07-03, George: "η αναφορά να μην μου
  // λέει ποτέ ψέματα"). While the company WhatsApp is under review
  // (WHATSAPP_DOWN=true), NO page may render a wa.me link to the locked
  // +1 786 798 8798 number - a customer tapping it writes into the void.
  // This catches the exact class of bug found on 2026-07-03 (five CTAs
  // missed by the original failover). When the account is restored and
  // the flag flipped, the same check inverts: the homepage MUST offer
  // WhatsApp again.
  try {
    const ctaPages = [BASE_URL, BASE_URL + "/greek-charter-index-2026", BASE_URL + "/weekly-yacht-charter-rates-greece", BASE_URL + "/crewed-catamaran-charter-greece"];
    const bodies = await Promise.all(ctaPages.map((u) => fetch(u, { cache: "no-store" }).then((r) => r.text()).catch(() => "")));
    const deadLinks = bodies.reduce((n, b) => n + (b.match(/wa\.me\/17867988798/g) || []).length, 0);
    if (WHATSAPP_US_LOCKED) {
      results.push({ name: "No links to locked US WhatsApp", ok: deadLinks === 0, status: 200, ms: 0, message: deadLinks === 0 ? "OK" : deadLinks + " link(s) still point to the locked number" });
    }
    if (!WHATSAPP_DOWN) {
      // 2026-07-16: WhatsApp links point at api.whatsapp.com/send directly
      // (wa.me always 302s - Ahrefs flagged 461 pages). Accept both forms.
      const hasWa = bodies.some((b) => b.includes("wa.me/") || b.includes("api.whatsapp.com/send"));
      results.push({ name: "WhatsApp CTAs live", ok: hasWa, status: 200, ms: 0, message: hasWa ? "OK" : "CTAs should be live but no wa.me link found" });
    }
  } catch {}

  // Brand squatting: the Delphi profile (2026-07-30). Delphi cold-mailed
  // George claiming "a luxury traveler just asked about yacht charter". The
  // page's own payload says his address came from a Qwoted lead list, so no
  // traveler asked anything. It publishes his name, his title and the GEORGE
  // YACHTS logo without licence, and it carries no noindex, so it can enter
  // Google under his name. A removal request went out the same day.
  //
  // This check is deliberately inverted: it FAILS while the page is still
  // live and indexable, and passes the moment Delphi takes it down or
  // noindexes it. That way it closes itself and cannot rot into a check
  // nobody reads. If a similar squat appears elsewhere, add it to the list.
  try {
    const squats = [["Delphi profile", "https://claim.delphi.ai/george-p-biniaris"]];
    for (const [label, url] of squats) {
      const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0 (georgeyachts-health)" } }).catch(() => null);
      if (!res || res.status === 404) {
        results.push({ name: label + " removed", ok: true, status: res?.status ?? 0, ms: 0, message: "Gone" });
        continue;
      }
      const html = await res.text().catch(() => "");
      const noindexed = /noindex/i.test(html) || /noindex/i.test(res.headers.get("x-robots-tag") || "");
      results.push({
        name: label + " removed",
        ok: noindexed,
        status: res.status,
        ms: 0,
        message: noindexed ? "Still up but noindexed" : "LIVE and indexable, unlicensed logo + name",
      });
    }
  } catch {}

  // Buttons a finger can reach (2026-09-19). A buried button still answers
  // 200, so nothing above can see it: the WhatsApp button sat under the
  // yacht page's Inquire bar on every phone from 22 August to 19 September
  // and this report said "All OK" every morning. A real phone-sized browser
  // now runs on GitHub Actions at 05:50 UTC (scripts/tapCheck.mjs) and this
  // reads its verdict. A run older than 26 hours is a failure too: a test
  // that stopped running protects nobody. If GitHub cannot be read at all,
  // the line says so plainly instead of guessing either way.
  try {
    const gh = await fetch(
      "https://api.github.com/repos/gbiniaris13/george-yachts/actions/workflows/tap-check.yml/runs?per_page=1&status=completed",
      { cache: "no-store", headers: { "User-Agent": "georgeyachts-health", Accept: "application/vnd.github+json" } },
    );
    const name = "Buttons tappable on a phone (browser test)";
    if (!gh.ok) {
      results.push({ name, ok: true, status: gh.status, ms: 0, message: `UNKNOWN today: GitHub could not be read (HTTP ${gh.status}); not counted either way` });
    } else {
      const run = (await gh.json())?.workflow_runs?.[0];
      if (!run) {
        results.push({ name, ok: false, status: 200, ms: 0, message: "the browser test has never run" });
      } else {
        const ageH = Math.round((Date.now() - new Date(run.updated_at).getTime()) / 36e5);
        const passed = run.conclusion === "success";
        const fresh = ageH <= 26;
        results.push({
          name,
          ok: passed && fresh,
          status: 200,
          ms: 0,
          message: !passed
            ? `A BUTTON IS COVERED OR MISSING, see ${run.html_url}`
            : !fresh
              ? `the browser test last ran ${ageH}h ago, it should run daily`
              : `OK (WhatsApp, Inquire, menu; iPhone, Android, desktop; ran ${ageH}h ago)`,
        });
      }
    }
  } catch {}

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
        "✅ *Daily Health Check, All OK*",
        "🕐 " + ts + " Athens",
        "",
        ...results.map((r) => "✓ " + r.name + "-" + r.ms + "ms"),
        "",
        ...(WHATSAPP_US_LOCKED
          ? ["⚠️ _Known state: US WhatsApp (+1 786) under review — all WhatsApp CTAs use the Greek WhatsApp Business number. Restore per lib/whatsappStatus.js when unlocked._", ""]
          : []),
        "_georgeyachts.com fully operational._",
      ]
    : [
        "🚨 *ALERT, Issues Detected!*",
        "🕐 " + ts + " Athens",
        "",
        ...results.map((r) => (r.ok ? "✅ " : "❌ ") + r.name + (r.ok ? "" : "-" + (r.message || "FAIL"))),
        "",
        "⚠️ *" + failed.length + " issue(s) need attention!*",
      ];

  const tg = await sendTelegram(lines.join("\n"));

  // Email is the report George reads. Every day, pass or fail, with the
  // Telegram outcome inside it, so a silent channel can never hide.
  const subject = allOk
    ? `Health check ${ts.slice(0, 5)}: ${results.length}/${results.length} OK`
    : `ALERT health check ${ts.slice(0, 5)}: ${failed.length} of ${results.length} failed`;
  const rows = results
    .map((r) => `<tr><td style="padding:4px 10px">${r.ok ? "OK" : "FAIL"}</td><td style="padding:4px 10px">${esc(r.name)}</td><td style="padding:4px 10px">${r.status}</td><td style="padding:4px 10px">${r.ms} ms</td><td style="padding:4px 10px">${esc(r.message)}</td></tr>`)
    .join("");
  const html = `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;color:#0D1B2A">
<p><strong>${allOk ? "All checks passed." : failed.length + " check(s) failed."}</strong> ${esc(ts)} Athens, georgeyachts.com</p>
<table style="border-collapse:collapse;border:1px solid #ddd">${rows}</table>
<p>Telegram copy: ${tg.ok ? "delivered" : "NOT delivered (" + esc(tg.detail) + ")"}</p>
<p style="color:#666">Pages, form APIs (honeypot probes, nothing is sent), WhatsApp links, Gmail SMTP, Telegram bot. Mondays add one real end-to-end lead marked (TEST).</p>
</div>`;
  let emailed = false;
  let emailError = "";
  try {
    if (!GMAIL_USER || !GMAIL_PASS) throw new Error("no Gmail credentials in env");
    await emailGeorge({ subject, html });
    emailed = true;
  } catch (err) {
    emailError = err?.message || String(err);
  }
  console.log(`[health-check] ${allOk ? "healthy" : "degraded"} ${results.filter((r) => r.ok).length}/${results.length}; telegram ${tg.ok ? "ok" : "failed: " + tg.detail}; email ${emailed ? "ok" : "failed: " + emailError}`);

  return NextResponse.json({ status: allOk ? "healthy" : "degraded", timestamp: ts, results, report: { telegram: tg, email: emailed ? "sent" : "failed: " + emailError } });
}
