import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";
import { kvLpush, todayKey } from "@/lib/kv";

export const dynamic = "force-dynamic";

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
    `💬 _${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}_`,
    ``,
    `⏱ _Reply within 2 hours!_`,
  ].join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
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

  try {
    const payload = await request.json();

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

    // Updated Validation to check for new fields
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
      !check_out ||
      !embarkation ||
      !disembarkation
    ) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
        { status: 400, headers: defaultHeaders }
      );
    }

    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { message: "Server configuration error (Secret Key missing)." },
        { status: 500, headers: defaultHeaders }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const verificationResponse = await axios.post(verificationUrl, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    });

    const { success, score } = verificationResponse.data;

    if (!success || score < 0.7) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        { message: "Bot verification failed. Score: " + score },
        { status: 403, headers: defaultHeaders }
      );
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
        <p><strong>Route:</strong> ${embarkation} &rarr; ${disembarkation}</p>
        
        <hr>
        
        <h4>Message:</h4>
        <p style="white-space: pre-line;">${message}</p>
        
        <hr>
        <p style="font-size: 10px;">ReCAPTCHA Score: ${score}</p>
      `,
    });

    // Send Telegram notification + store for response tracking (non-blocking)
    const inquiryData = { name, email, phone, country, message, yacht_type, guests, budget, check_in, check_out, embarkation, disembarkation };
    const inquiryId = `${Date.now()}_${name.replace(/\s/g, ‘_’)}`;
    await Promise.allSettled([
      notifyTelegram(inquiryData),
      kvLpush(‘inquiries:pending’, JSON.stringify({ id: inquiryId, name, email, yacht_type, ts: Date.now() })),
      (async () => { const { kvIncr } = await import("@/lib/kv"); await kvIncr(`stats:${todayKey()}:inquiries`); })(),
    ]);

    return NextResponse.json(
      { message: "Thank you — we’ll get back within 24h." },
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
