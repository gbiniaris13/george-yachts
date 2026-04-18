import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

// Notify George via Telegram
async function notifyTelegram(email) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `📬 *New Newsletter Subscriber!*`,
    ``,
    `📧 ${email}`,
    ``,
    `_Added to The George Yachts Journal._`,
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

    // 2. Send welcome email to subscriber
    await transporter.sendMail({
      from: `"George Yachts" <${GMAIL_USER}>`,
      to: email,
      subject: "Welcome to The George Yachts Journal",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2A;">
          <div style="text-align: center; padding: 40px 20px; background: #0D1B2A;">
            <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 300; color: #fff; letter-spacing: 0.1em; margin: 0;">
              THE GEORGE YACHTS JOURNAL
            </h1>
            <p style="font-size: 10px; letter-spacing: 0.3em; color: #C9A84C; margin-top: 8px;">
              MARKET INSIGHTS &middot; NEW ARRIVALS &middot; CHARTER OPPORTUNITIES
            </p>
          </div>

          <div style="padding: 40px 30px; background: #F8F5F0;">
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              Thank you for subscribing.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              You&rsquo;ll receive curated updates on new yacht arrivals, exclusive charter
              opportunities, and insider insights from Greek waters &mdash; delivered
              discreetly and never more than once a week.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              In the meantime, feel free to explore our
              <a href="https://georgeyachts.com/charter-yacht-greece" style="color: #C9A84C;">curated fleet</a> or
              <a href="https://calendly.com/george-georgeyachts/30min" style="color: #C9A84C;">book a personal consultation</a>.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A; margin-top: 24px;">
              Fair winds,<br>
              <strong>George P. Biniaris</strong><br>
              <span style="font-size: 13px; color: #6B7B8D;">Managing Broker &middot; George Yachts</span>
            </p>
          </div>

          <div style="text-align: center; padding: 16px; background: #0D1B2A;">
            <p style="font-size: 9px; letter-spacing: 0.15em; color: rgba(255,255,255,0.3); margin: 0;">
              <a href="https://georgeyachts.com" style="color: rgba(255,255,255,0.3);">georgeyachts.com</a> &middot;
              Unsubscribe by replying to this email.
            </p>
          </div>
        </div>
      `,
    });

    // 3. Telegram notification (non-blocking)
    notifyTelegram(email).catch(() => {});

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
