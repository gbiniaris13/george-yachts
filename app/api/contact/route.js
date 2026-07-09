import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";
import { kvLpush, todayKey } from "@/lib/kv";
import { checkRateLimit } from "@/lib/rateLimit";

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
    `📞 ${data.phone}`,
    `🌍 ${data.country}`,
    ``,
    `⛵ Type: ${data.yacht_type}`,
    `👥 Guests: ${data.guests}`,
    `💰 Budget: ${data.budget}`,
    `📅 ${data.check_in} → ${data.check_out}`,
    `🗺 ${data.embarkation} → ${data.disembarkation}`,
    ``,
    // 2026-07-03 — FULL message, never truncated (was .substring(0,200)
    // which hid what the customer actually asked; George's SOS rule:
    // the complete text reaches every channel, always).
    `💬 _${data.message}_`,
    ``,
    `⏱ _Reply within 2 hours!_`,
  ].join('\n');

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

  try {
    const payload = await request.json();

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
      check_in,
      check_out,
      embarkation,
      disembarkation,
    } = payload;

    // 2026-07-03 SOS FIX (second bug behind George's mobile report):
    // embarkation/disembarkation are OPTIONAL in the form UI (the
    // selects say "Preferred..." and carry no `required`), but this
    // check rejected any submission that left them empty with a 400
    // AFTER the customer had filled everything else. A completed
    // form must never bounce on an optional preference - default to
    // Flexible and let George advise, which is his job anyway.
    const embark = embarkation || "Flexible - Advise Me";
    const disembark = disembarkation || "Flexible - Advise Me";
    if (
      !name ||
      !email ||
      !phone ||
      !country ||
      !message ||
      !recaptchaToken ||
      !yacht_type ||
      !guests ||
      !budget ||
      !check_in ||
      !check_out
    ) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
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
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Country:</strong> ${country}</p>
        
        <hr>
        
        <h4>Charter Preferences:</h4>
        <p><strong>Yacht Type:</strong> ${yacht_type}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Budget/Week:</strong> ${budget}</p>
        <p><strong>Dates:</strong> ${check_in} to ${check_out}</p>
        <p><strong>Route:</strong> ${embark} &rarr; ${disembark}</p>
        
        <hr>
        
        <h4>Message:</h4>
        <p style="white-space: pre-line;">${message}</p>
        
        <hr>
        <p style="font-size: 10px;">ReCAPTCHA Score: ${score}</p>
      `,
    });

    // Send Telegram notification + store for response tracking (non-blocking)
    const inquiryData = { name, email, phone, country, message, yacht_type, guests, budget, check_in, check_out, embarkation: embark, disembarkation: disembark };
    const inquiryId = `${Date.now()}_${name.replace(/\s/g, '_')}`;
    // 2026-07-03 (George's SOS directive) — WhatsApp channel joins
    // Telegram + email: full lead summary to the company US number
    // via CallMeBot (skips silently until the env opt-in exists).
    const waText = [
      `New yacht inquiry (contact form)`,
      `${name} · ${email}${phone ? ` · ${phone}` : ""}`,
      yacht_type ? `Type: ${yacht_type} · Guests: ${guests || "?"} · Budget: ${budget || "?"}` : "",
      check_in ? `Dates: ${check_in} -> ${check_out}` : "",
      message ? `\n${message}` : "",
    ].filter(Boolean).join("\n");
    // 2026-07-08 — instant acknowledgment to the client (email only).
    (async () => {
      const { emailClient } = await import("@/lib/notifyGeorge");
      await emailClient({ to: email, name });
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
    ]);

    return NextResponse.json(
      { message: "Thank you — we'll get back within 24h." },
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
