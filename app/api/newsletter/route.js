import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rateLimit";
import { kvSadd, kvGet, kvSet, kvSismember } from "@/lib/kv";

// Legacy KV set key — kept writing to it during the transition so the
// old weekly-newsletter cron keeps working until cut-over.
const LEGACY_SET = "newsletter:subscribers";

// Brief §9 — four-stream subscriber model. Default new signups land
// in `bridge` (the public-facing UHNW journal). Other streams are
// reserved for the re-engagement campaign or curated invites.
const STREAM_SETS = {
  bridge: "subscribers:bridge",
  wake: "subscribers:wake",
  compass: "subscribers:compass",
  greece: "subscribers:greece",
};
const VALID_STREAMS = new Set(Object.keys(STREAM_SETS));

export const dynamic = "force-dynamic";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

// Notify George via Telegram. Welcome flow status is folded in so a
// silent welcome failure never goes unnoticed.
async function notifyTelegram(email, welcomeResult) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const welcomeLine = welcomeResult
    ? welcomeResult.ok
      ? `✅ Issue #1 sent automatically as welcome (Resend id: ${welcomeResult.message_id ?? "n/a"})`
      : welcomeResult.suppressed
        ? `⚠️ Welcome NOT sent — address is on the suppression list`
        : `🚨 Welcome failed — ${String(welcomeResult.error ?? "unknown").slice(0, 200)}`
    : `(welcome flow skipped — non-bridge stream)`;

  const text = [
    `📬 *New Newsletter Subscriber!*`,
    ``,
    `📧 ${email}`,
    ``,
    welcomeLine,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch {}
}

export async function POST(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Rate limit: 3 newsletter signups per minute per IP
  const rl = checkRateLimit(request, { max: 3, windowMs: 60000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { ...headers, "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    // Honeypot
    if (body.website && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Valid email required." },
        { status: 400, headers }
      );
    }

    if (!GMAIL_USER || !GMAIL_PASS) {
      return NextResponse.json(
        { message: "Email service not configured." },
        { status: 500, headers }
      );
    }

    // 0. Persist the subscriber across all the right KV sets.
    //    Normalized to lowercase so "George@X" and "george@x" resolve
    //    to a single row. Non-blocking if KV is unreachable.
    const normalized = email.trim().toLowerCase();

    // Determine which streams the subscriber is opting into. Body may
    // contain `lists: ["bridge", "wake"]` from the new 4-stream picker.
    // Anything missing/invalid → default ["bridge"] so the old
    // single-field footer signup still works unchanged.
    const requested = Array.isArray(body.lists) && body.lists.length > 0
      ? body.lists.map((s) => String(s).toLowerCase()).filter((s) => VALID_STREAMS.has(s))
      : ["bridge"];

    // Always write the legacy set during transition.
    kvSadd(LEGACY_SET, normalized).catch(() => {});
    // Plus each requested per-stream set.
    for (const stream of requested) {
      const setKey = STREAM_SETS[stream];
      if (setKey) await kvSadd(setKey, normalized).catch(() => {});
    }

    // Write or merge the profile hash (Brief §9.2).
    try {
      const existingRaw = await kvGet(`profile:${normalized}`);
      const existing = existingRaw
        ? typeof existingRaw === "string"
          ? JSON.parse(existingRaw)
          : existingRaw
        : null;
      const prevLists = existing?.lists ?? [];
      const mergedLists = Array.from(new Set([...prevLists, ...requested]));
      const profile = existing
        ? {
            ...existing,
            lists: mergedLists,
            last_engaged_at: new Date().toISOString(),
            newsletter_opt_out: false,
          }
        : {
            email: normalized,
            lists: requested,
            source: "website",
            subscribed_at: new Date().toISOString(),
            last_engaged_at: new Date().toISOString(),
            unsubscribed_lists: [],
            language: "en",
            notes: "",
            gy_command_contact_id: null,
            consent_record: [
              {
                list: requested.join(","),
                method: "single_opt_in",
                timestamp: new Date().toISOString(),
                ip_address: null,
                user_agent: request.headers.get("user-agent") ?? null,
              },
            ],
          };
      await kvSet(`profile:${normalized}`, JSON.stringify(profile)).catch(() => {});
    } catch {
      // best-effort — don't block signup on profile write
    }

    // 0b. Welcome flow (Brief §17.6) — every new signup receives
    //     Issue #1 as their first email, automatically, within 5 min.
    //     Sent via Resend (newsletter@georgeyachts.com) — same channel
    //     as future newsletters so the visual identity is identical
    //     from day one. Suppression-list aware. Best-effort: a Resend
    //     hiccup never blocks the signup itself.
    //
    //     CRITICAL — per-issue dedup. Before sending, check if this
    //     address is already in `issue_sent:bridge:1`. If yes, the
    //     subscriber already received Issue #1 (via a previous tap-✅,
    //     topup, or earlier welcome) and we SKIP this send. Same
    //     primitive protects /approve and topup. Together they make
    //     it structurally impossible to double-send the same issue
    //     to the same address — no matter what entry point fires.
    let welcomeResult = null;
    try {
      if (requested.includes("bridge")) {
        const ISSUE_KEY = "issue_sent:bridge:1";
        const already = await kvSismember(ISSUE_KEY, normalized).catch(() => 0);
        if (already === 1 || already === "1") {
          welcomeResult = {
            ok: true,
            skipped: "already_received_issue_1",
            message_id: null,
          };
        } else {
          const { sendNewsletterFromTemplate } = await import(
            "@/lib/newsletter/resend"
          );
          const {
            ISSUE_1_SUBJECT,
            ISSUE_1_PREHEADER,
            ISSUE_1_BODY_TEXT,
            ISSUE_1_HERO_IMAGE_URL,
          } = await import("@/lib/newsletter/issue-1");
          welcomeResult = await sendNewsletterFromTemplate({
            to: normalized,
            stream: "bridge",
            subject: ISSUE_1_SUBJECT,
            preheader: ISSUE_1_PREHEADER,
            body_text: ISSUE_1_BODY_TEXT,
            hero_image_url: ISSUE_1_HERO_IMAGE_URL,
            tags: [
              { name: "stream", value: "bridge" },
              { name: "kind", value: "welcome" },
              { name: "issue", value: "1" },
            ],
          });
          if (welcomeResult.ok) {
            await kvSadd(ISSUE_KEY, normalized).catch(() => {});
          }
        }
      }
    } catch (err) {
      welcomeResult = {
        ok: false,
        error: err instanceof Error ? err.message : "welcome import failed",
      };
    }

    // 1. Notify George about the new subscriber
    await transporter.sendMail({
      from: GMAIL_USER,
      to: "george@georgeyachts.com",
      subject: `📬 New Newsletter Subscriber — ${email}`,
      html: `
        <h3>New Newsletter Subscriber</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Source:</strong> The George Yachts Journal (footer signup)</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p style="font-size: 12px; color: #888;">Add this email to your mailing list.</p>
      `,
    });

    // 2. (legacy Gmail welcome email removed) — Issue #1 already
    //    fired via Resend in step 0b, so we don't double-message the
    //    new subscriber. The Issue #1 letter IS the welcome from now
    //    on: same template, same Wyoming footer, same per-recipient
    //    one-click unsubscribe.

    // 3. Telegram notification (non-blocking) — include welcome status
    notifyTelegram(email, welcomeResult).catch(() => {});

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again." },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}
