import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";
import { kvLpush, todayKey } from "@/lib/kv";
import { checkRateLimit } from "@/lib/rateLimit";
import { upsertFormContact } from "@/lib/crmContact";

export const dynamic = "force-dynamic";

// CRM Supabase — same env vars already used by /api/track
const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

async function writeCRMNotification(data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return;
  try {
    await fetch(`${CRM_SUPABASE_URL}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch {}
}

// 2026-08-23, George's #2 — the brief arrives knowing what the
// visitor looked at. Client-supplied, so everything is type-checked
// and clipped before it touches a channel.
function contextLines(ctx) {
  if (!ctx || typeof ctx !== "object") return [];
  const lines = [];
  const visit = Array.isArray(ctx.yachts_this_visit)
    ? ctx.yachts_this_visit.filter((v) => typeof v === "string") : [];
  const history = Array.isArray(ctx.yachts_history)
    ? ctx.yachts_history.filter((v) => typeof v === "string") : [];
  const seen = [...new Set([...visit, ...history])].slice(0, 8).map((s) => s.slice(0, 60));
  if (seen.length) lines.push(`Viewed: ${seen.join(", ")}`);
  if (Number.isFinite(ctx.session_minutes) && ctx.session_minutes > 0 && ctx.session_minutes < 600) {
    lines.push(`${ctx.session_minutes} min on site this visit`);
  }
  if (typeof ctx.arrived_from === "string" && ctx.arrived_from && !ctx.arrived_from.includes("georgeyachts.com")) {
    lines.push(`Arrived from: ${ctx.arrived_from.slice(0, 120)}`);
  }
  return lines;
}

// Send inquiry notification to Telegram
async function notifyTelegram(data) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `📩 *New Yacht Inquiry!*`,
    ``,
    `👤 *${data.name}*`,
    `📧 ${data.email}`,
    data.phone ? `📞 ${data.phone}` : null,
    data.country ? `🌍 ${data.country}` : null,
    ``,
    data.yacht_type ? `⛵ Type: ${data.yacht_type}` : null,
    data.guests ? `👥 Guests: ${data.guests}` : null,
    data.budget ? `💰 Budget: ${data.budget}` : null,
    data.check_in ? `📅 ${data.check_in} → ${data.check_out || "?"}` : (data.timing ? `📅 ${data.timing}` : null),
    `🗺 ${data.embarkation} → ${data.disembarkation}`,
    ``,
    // 2026-07-03 — FULL message, never truncated (was .substring(0,200)
    // which hid what the customer actually asked; George's SOS rule:
    // the complete text reaches every channel, always).
    data.message ? `💬 _${data.message}_` : null,
    Array.isArray(data.context) && data.context.length ? `` : null,
    Array.isArray(data.context) && data.context.length ? `👁 ${data.context.join(" · ")}` : null,
    ``,
    `⏱ _Reply within 2 hours!_`,
  ].filter((line) => line !== null).join('\n');

  try {
    const { telegramGeorgeFull } = await import("@/lib/notifyGeorge");
    await telegramGeorgeFull(text);
  } catch {}
}

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

const sendMailPromise = (mailOptions) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err) {
      if (!err) {
        resolve("Email sent");
      } else {
        reject(err.message);
      }
    });
  });

export async function POST(request) {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  // Rate limit: 5 submissions per minute per IP
  const rl = checkRateLimit(request, { max: 5, windowMs: 60000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { ...defaultHeaders, "Retry-After": String(rl.retryAfter) } }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400, headers: defaultHeaders }
    );
  }

  try {
    // Honeypot: if the hidden "website" field is filled, it's a bot
    if (payload.website && payload.website.trim() !== "") {
      // Respond 200 so bot thinks it worked but silently drop
      return NextResponse.json({ ok: true }, { status: 200, headers: defaultHeaders });
    }

    // Updated Destructuring to include new fields
    const {
      name,
      email,
      phone,
      country,
      message,
      recaptchaToken,
      // New Fields added below
      yacht_type,
      guests,
      budget,
      timing,
      check_in,
      check_out,
      embarkation,
      disembarkation,
      visitor_context,
    } = payload;
    const context = contextLines(visitor_context);

    // 2026-08-23 completion pass: only name + email are required.
    // Every other field is a preference George can ask about on the
    // reply. The old check demanded 11 fields, including `message`
    // which the UI never marked required, so completed forms bounced
    // with a 400 after the customer had filled everything visible.
    // A brief must never be lost over an optional detail.
    const embark = embarkation || "Flexible - Advise Me";
    const disembark = disembarkation || "Flexible - Advise Me";
    if (!name || !email) {
      return NextResponse.json(
        { message: "Please share at least a name and an email." },
        { status: 400, headers: defaultHeaders }
      );
    }

    // reCAPTCHA verification — skip if not configured
    let score = 1.0;
    if (RECAPTCHA_SECRET_KEY && recaptchaToken && recaptchaToken !== "no_recaptcha") {
      try {
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const verificationResponse = await axios.post(verificationUrl, null, {
          params: { secret: RECAPTCHA_SECRET_KEY, response: recaptchaToken },
        });
        score = verificationResponse.data.score || 0;
        if (!verificationResponse.data.success || score < 0.7) {
          console.warn(`Bot detected. Score: ${score}`);
          return NextResponse.json(
            { message: "Bot verification failed. Score: " + score },
            { status: 403, headers: defaultHeaders }
          );
        }
      } catch (recaptchaError) {
        console.warn("reCAPTCHA verification failed, proceeding anyway:", recaptchaError.message);
      }
    }

    const shown = (v) => v || "Not specified";
    await sendMailPromise({
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `[Yacht Inquiry] New Contact from ${name}`,
      replyTo: email,
      html: `
        <h3>New Website Inquiry:</h3>

        <h4>Client Details:</h4>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${shown(phone)}</p>
        <p><strong>Country:</strong> ${shown(country)}</p>

        <hr>

        <h4>Charter Preferences:</h4>
        <p><strong>Yacht Type:</strong> ${shown(yacht_type)}</p>
        <p><strong>Guests:</strong> ${shown(guests)}</p>
        <p><strong>Budget/Week:</strong> ${shown(budget)}</p>
        <p><strong>Dates:</strong> ${check_in ? `${check_in} to ${shown(check_out)}` : shown(timing)}</p>
        <p><strong>Route:</strong> ${embark} &rarr; ${disembark}</p>

        <hr>

        <h4>Message:</h4>
        <p style="white-space: pre-line;">${shown(message)}</p>

        ${context.length ? `<hr><h4>Visitor context:</h4><p style="white-space: pre-line;">${context.join("\n")}</p>` : ""}

        <hr>
        <p style="font-size: 10px;">ReCAPTCHA Score: ${score}</p>
      `,
    });

    // Send Telegram notification + store for response tracking (non-blocking)
    const inquiryData = { name, email, phone, country, message, yacht_type, guests, budget, timing, check_in, check_out, embarkation: embark, disembarkation: disembark, context };
    const inquiryId = `${Date.now()}_${name.replace(/\s/g, '_')}`;
    // 2026-07-03 (George's SOS directive) — WhatsApp channel joins
    // Telegram + email: full lead summary to the company US number
    // via CallMeBot (skips silently until the env opt-in exists).
    const waText = [
      `New yacht inquiry (contact form)`,
      `${name} · ${email}${phone ? ` · ${phone}` : ""}`,
      yacht_type ? `Type: ${yacht_type} · Guests: ${guests || "?"} · Budget: ${budget || "?"}` : "",
      check_in ? `Dates: ${check_in} -> ${check_out}` : (timing ? `When: ${timing}` : ""),
      message ? `\n${message}` : "",
    ].filter(Boolean).join("\n");
    // 2026-07-08 — instant acknowledgment to the client (email only).
    // 2026-08-23 (George's #5) — the acknowledgment now carries their
    // brief back to them, clean, plus what happens next.
    const briefLines = [
      yacht_type ? `Yacht type: ${yacht_type}` : null,
      guests ? `Guests: ${guests}` : null,
      budget ? `Weekly budget, all-in: ${budget}` : null,
      check_in ? `Dates: ${check_in} to ${check_out || "open"}` : (timing ? `When: ${timing}` : null),
      `Route: ${embark} -> ${disembark}`,
      message ? `Your note: ${message}` : null,
    ].filter(Boolean);
    (async () => {
      const { emailClient } = await import("@/lib/notifyGeorge");
      await emailClient({ to: email, name, brief: briefLines });
    })().catch(() => {});
    await Promise.allSettled([
      notifyTelegram(inquiryData),
      (async () => { const { whatsappGeorge } = await import("@/lib/notifyGeorge"); await whatsappGeorge(waText); })(),
      kvLpush('inquiries:pending', JSON.stringify({ id: inquiryId, name, email, yacht_type, ts: Date.now() })),
      (async () => { const { kvIncr } = await import("@/lib/kv"); await kvIncr(`stats:${todayKey()}:inquiries`); })(),
      writeCRMNotification({
        type: 'form_submission',
        title: `📩 New yacht inquiry from ${name}`,
        description: `${yacht_type || 'yacht'} · ${guests || '?'} guests · ${budget || '?'} · ${country || ''} · ${email}`,
        link: '/dashboard/contacts',
      }),
      // 2026-08-23 — the form finally writes a real CRM contact.
      // Until now /api/contact sent notifications everywhere but
      // created zero rows in contacts; every brief lived only in
      // Telegram and email.
      upsertFormContact({
        name, email, phone, country,
        source: 'website_form',
        description: [
          `Contact form brief`,
          yacht_type ? `Type: ${yacht_type}` : null,
          guests ? `Guests: ${guests}` : null,
          budget ? `Budget: ${budget}` : null,
          check_in ? `Dates: ${check_in} -> ${check_out || '?'}` : (timing ? `When: ${timing}` : null),
          `Route: ${embark} -> ${disembark}`,
          message ? `Message: ${message}` : null,
          ...context,
        ].filter(Boolean).join('\n'),
        metadata: { yacht_type, guests, budget, timing, check_in, check_out, embarkation: embark, disembarkation: disembark },
      }),
    ]);

    // 2026-08-23 — same road /api/inquiry has walked since 15/7: every
    // brief opens a Helm request automatically, nothing waits for
    // manual re-typing. Hard 4s cap, best-effort, the lead is already
    // in George's hands via the channels above.
    try {
      const crmSecret = process.env.NEWSLETTER_PROXY_SECRET;
      if (crmSecret) {
        await fetch("https://gy-command.vercel.app/api/hooks/website-inquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${crmSecret}`,
          },
          body: JSON.stringify({
            name, email, phone,
            dates: check_in ? `${check_in} to ${check_out || "open"}` : (timing || ""),
            message: [message, yacht_type ? `Type: ${yacht_type}` : "", guests ? `Guests: ${guests}` : "", budget ? `Budget all-in: ${budget}` : ""].filter(Boolean).join(" · "),
            source: "contact_form",
          }),
          signal: AbortSignal.timeout(4000),
        });
      }
    } catch {}

    return NextResponse.json(
      { message: "Thank you, we'll get back within 24h." },
      { status: 200, headers: defaultHeaders }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Failed to send email due to server or connection error." },
      { status: 500, headers: defaultHeaders }
    );
  }
}

export async function OPTIONS() {
  const optionsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  return new Response(null, {
    status: 200,
    headers: optionsHeaders,
  });
}
