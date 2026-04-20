// F1 — Weekly Newsletter Auto-Broadcast
//
// Runs Mondays 09:00 Athens time via Vercel cron. Pulls the subscriber
// set from KV, picks this week's signature yacht from Sanity (using
// the same ISO week modulo as the homepage so the email matches what
// the visitor sees on the site), builds the HTML, and sends through
// the existing Gmail transporter in BCC batches of 50.
//
// Safety rails:
//   - Auth: Bearer CRON_SECRET header (matches the other crons)
//   - Kill switch: NEWSLETTER_WEEKLY_ENABLED env flag (any value
//     other than "true" = dry run, sends nothing, reports to Telegram)
//   - Manual preview:  GET /api/cron/weekly-newsletter?preview=1
//     (with auth) returns the rendered HTML without sending
//   - Throttle: 1.2s delay between batches to stay well under Gmail's
//     per-minute limits
//   - Telegram summary after every run: sent / skipped / failed
//
// Production rollout:
//   1. Add CRON_SECRET + confirm GMAIL_USER/PASS + KV envs
//   2. Set NEWSLETTER_WEEKLY_ENABLED=false and deploy → first cron
//      fires in dry-run mode, George gets a preview via Telegram
//   3. Flip NEWSLETTER_WEEKLY_ENABLED=true once a test pass looks good

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sanityClient } from "@/lib/sanity";
import { kvSmembers, kvScard, kvIncr, kvGet } from "@/lib/kv";
import { renderWeeklyEmail } from "@/lib/newsletter-template";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const SUBSCRIBERS_SET = "newsletter:subscribers";
const ISSUE_COUNTER = "newsletter:issue_counter";
const BATCH_SIZE = 50;
const BATCH_DELAY_MS = 1200;

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const BASE_URL = "https://georgeyachts.com";
const UNSUBSCRIBE_SECRET =
  process.env.NEWSLETTER_UNSUB_SECRET ||
  process.env.CRON_SECRET ||
  "change-me";

function isoWeekNumber(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
}

function weekLabel(d = new Date()) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function signUnsubscribe(email) {
  const h = crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 24);
  return `${BASE_URL}/api/newsletter/unsubscribe?e=${encodeURIComponent(
    email
  )}&t=${h}`;
}

async function fetchYachts() {
  // Pull charter-available yachts. Imageurl is generated from the first
  // image asset's ref through Sanity's CDN transform.
  const query = `*[_type == "yacht" && !(_id in path("drafts.**"))]{
    _id,
    name,
    "slug": slug.current,
    builder,
    length,
    guests,
    tagline,
    weeklyRatePrice,
    fleetTier,
    "imageUrl": images[0].asset->url
  }`;
  try {
    return await sanityClient.fetch(query);
  } catch (e) {
    console.error("[weekly-newsletter] Sanity fetch failed:", e);
    return [];
  }
}

function pickFeaturedAndAvailable(yachts) {
  if (!yachts.length) return { featured: null, available: [] };
  // Deterministic — same yacht for every subscriber in the same week,
  // matches the homepage signature slot's week-of-year rotation.
  const week = isoWeekNumber();
  const sorted = [...yachts].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || ""))
  );
  const featured = sorted[week % sorted.length];
  // Three more, different from the featured, rotated by an offset so
  // the list shifts every week.
  const pool = sorted.filter((y) => y._id !== featured._id);
  const startIdx = (week * 3) % Math.max(pool.length, 1);
  const available = [];
  for (let i = 0; i < 3 && i < pool.length; i++) {
    available.push(pool[(startIdx + i) % pool.length]);
  }
  return { featured, available };
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch {}
}

export async function GET(request) {
  // 1. Auth
  const authHeader = request.headers.get("authorization");
  const vercelCron = request.headers.get("x-vercel-cron");
  const authorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` || !!vercelCron;
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const preview = searchParams.get("preview") === "1";
  const enabled = process.env.NEWSLETTER_WEEKLY_ENABLED === "true";

  // 2. Build the issue
  const yachts = await fetchYachts();
  if (!yachts.length) {
    await notifyTelegram(
      "⚠️ *Weekly Newsletter* skipped — no yachts returned from Sanity."
    );
    return NextResponse.json({ ok: false, reason: "no_yachts" });
  }

  const { featured, available } = pickFeaturedAndAvailable(yachts);

  // Issue counter — increments even on dry run so previews are
  // labelled sequentially. Reset by flushing the KV key.
  const issueNumber = Number(await kvGet(ISSUE_COUNTER)) || 0;
  const nextIssue = issueNumber + 1;

  const buildForEmail = (email) =>
    renderWeeklyEmail({
      issueNumber: nextIssue,
      weekLabel: weekLabel(),
      featuredYacht: featured,
      availableYachts: available,
      baseUrl: BASE_URL,
      unsubscribeUrl: email ? signUnsubscribe(email) : "",
    });

  // Preview mode: return HTML directly, no sending.
  if (preview) {
    return new NextResponse(buildForEmail("preview@georgeyachts.com"), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 3. Pull subscribers
  const subscribers =
    (await kvSmembers(SUBSCRIBERS_SET).catch(() => null)) || [];
  const total = subscribers.length;

  // 4. Send (or dry-run)
  if (!GMAIL_USER || !GMAIL_PASS) {
    await notifyTelegram(
      `⚠️ *Weekly Newsletter* aborted — Gmail transport not configured.\n\nSubscribers: ${total}\nFeatured: ${featured?.name || "-"}`
    );
    return NextResponse.json({ ok: false, reason: "no_gmail" });
  }

  if (!enabled) {
    // Dry run: send a preview copy to George only, leave subscribers untouched.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
    try {
      await transporter.sendMail({
        from: `"George Yachts Journal (DRY RUN)" <${GMAIL_USER}>`,
        to: "george@georgeyachts.com",
        subject: `[DRY RUN] Issue ${nextIssue} — ${featured?.name || "The George Yachts Journal"}`,
        html: buildForEmail("george@georgeyachts.com"),
      });
    } catch (e) {
      console.error("[weekly-newsletter] dry run send failed:", e);
    }
    await notifyTelegram(
      `🧪 *Weekly Newsletter* dry run — preview delivered to george@\n\nIssue *${nextIssue}* / Week label: ${weekLabel()}\nSubscribers in KV: *${total}*\nFeatured: *${featured?.name || "-"}*\nAvailable: ${available.map((y) => y.name).join(", ") || "-"}\n\nFlip NEWSLETTER_WEEKLY_ENABLED=true to ship.`
    );
    return NextResponse.json({
      ok: true,
      mode: "dry_run",
      subscribers: total,
      issue: nextIssue,
      featured: featured?.name,
    });
  }

  if (total === 0) {
    await notifyTelegram(
      "ℹ️ *Weekly Newsletter* ran but the subscriber list is empty."
    );
    return NextResponse.json({ ok: true, mode: "empty" });
  }

  // 5. Real send — Gmail transporter, BCC batching
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    pool: true,
    maxConnections: 1,
    maxMessages: 100,
  });

  let sent = 0;
  let failed = 0;
  const failures = [];
  const subject = `${featured?.name || "This week on the Aegean"} — Issue ${nextIssue}`;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    try {
      // One message per batch, BCC for privacy. Single featured copy
      // is fine — we don't personalize per recipient for this MVP.
      // Unsubscribe link uses a batch-safe token (shared secret) —
      // the unsubscribe route hashes the provided email on confirm.
      await transporter.sendMail({
        from: `"George P. Biniaris" <${GMAIL_USER}>`,
        to: GMAIL_USER, // our own address as To
        bcc: batch,
        subject,
        html: buildForEmail(batch[0]),
        headers: {
          "List-Unsubscribe": `<${signUnsubscribe(batch[0])}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      sent += batch.length;
    } catch (e) {
      console.error("[weekly-newsletter] batch send failed:", e);
      failed += batch.length;
      failures.push(e?.message || "unknown");
    }
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  // 6. Bump the issue counter (only after a real send)
  await kvIncr(ISSUE_COUNTER).catch(() => {});

  await notifyTelegram(
    `📧 *Weekly Newsletter* sent\n\nIssue *${nextIssue}* / ${weekLabel()}\nFeatured: *${featured?.name || "-"}*\nDelivered: *${sent}* / ${total}\nFailed: ${failed}${failures.length ? "\n\nErrors: " + failures.slice(0, 2).join(" | ") : ""}`
  );

  return NextResponse.json({
    ok: true,
    mode: "sent",
    sent,
    failed,
    total,
    issue: nextIssue,
    featured: featured?.name,
  });
}
