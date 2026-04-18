import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";
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
    `🤝 *New Partner Request!*`,
    ``,
    `📧 ${email}`,
    ``,
    `📎 Partnership Programme PDF was auto-sent.`,
    `⏱ _Follow up within 24h!_`,
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

  // Rate limit: 3 partner requests per minute per IP
  const rl = checkRateLimit(request, { max: 3, windowMs: 60000 });
  if (!rl.ok) {
    return NextResponse.json(
      { message: "Too many requests." },
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

    // Read the PDF from public folder
    const pdfPath = join(process.cwd(), "public", "George_Yachts_Partnership_Programme_2026.pdf");
    let pdfBuffer;
    try {
      pdfBuffer = readFileSync(pdfPath);
    } catch {
      return NextResponse.json(
        { message: "Partnership PDF not found on server." },
        { status: 500, headers }
      );
    }

    // 1. Send PDF to the requesting partner
    await transporter.sendMail({
      from: `"George Yachts" <${GMAIL_USER}>`,
      to: email,
      subject: "George Yachts — Partnership Programme 2026",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2A;">
          <div style="text-align: center; padding: 40px 20px; background: #0D1B2A;">
            <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 300; color: #fff; letter-spacing: 0.1em; margin: 0;">
              GEORGE YACHTS
            </h1>
            <p style="font-size: 11px; letter-spacing: 0.3em; color: #C9A84C; margin-top: 8px;">
              PARTNERSHIP PROGRAMME
            </p>
          </div>

          <div style="padding: 40px 30px; background: #F8F5F0;">
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              Thank you for your interest in partnering with George Yachts.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              Please find attached our <strong>Partnership Programme for 2026</strong>,
              which includes our fleet overview, commission structure, and how we work
              with travel professionals.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              We remain invisible to your clients — you stay the hero.
            </p>

            <div style="margin: 32px 0; padding: 20px; border-left: 3px solid #C9A84C; background: rgba(201,168,76,0.05);">
              <p style="font-size: 14px; color: #0D1B2A; margin: 0;">
                <strong>Next step:</strong> Reply to this email or
                <a href="https://calendly.com/george-georgeyachts/30min" style="color: #C9A84C;">book a 30-minute call</a>
                to discuss how we can work together.
              </p>
            </div>

            <p style="font-size: 16px; line-height: 1.8; color: #0D1B2A;">
              Looking forward to collaborating,<br>
              <strong>George P. Biniaris</strong><br>
              <span style="font-size: 13px; color: #6B7B8D;">Managing Broker · IYBA Member</span>
            </p>
          </div>

          <div style="text-align: center; padding: 20px; background: #0D1B2A;">
            <p style="font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.35); margin: 0;">
              GEORGE YACHTS BROKERAGE HOUSE LLC · US REGISTERED · IYBA MEMBER
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "George_Yachts_Partnership_Programme_2026.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // 2. Notify George via email
    await transporter.sendMail({
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `🤝 New Partner Request — ${email}`,
      html: `
        <h3>New Partnership Programme Request</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>PDF was automatically sent to their inbox.</p>
        <p><strong>Action:</strong> Follow up within 24 hours.</p>
      `,
    });

    // 3. Notify via Telegram (non-blocking)
    notifyTelegram(email).catch(() => {});

    return NextResponse.json(
      { message: "Partnership programme sent to your inbox!" },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Partner request error:", error);
    return NextResponse.json(
      { message: "Failed to send. Please try again or email us directly." },
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
