import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
// Removed: import axios from "axios"; // Not needed, using native fetch

// Environment variables (Vercel Project Settings)
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // The private key

// Configure the email transport securely
const transporter = nodemailer.createTransport({
  service: "gmail",
  // Note: For Gmail/Workspace, using service: 'gmail' is standard.
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
  try {
    // 1. Parse Payload
    const payload = await request.json();
    const { name, email, phone, message, recaptchaToken } = payload;

    // 2. Initial Validation (All fields required)
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
        { status: 400 }
      );
    }

    // --- 3. RECAPTCHA VERIFICATION (Using native fetch) ---
    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { message: "Server configuration error (Secret Key missing)." },
        { status: 500 }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    // Make a secure POST request to Google using native fetch
    const verificationResponse = await fetch(verificationUrl, {
      method: "POST",
    });
    const verificationData = await verificationResponse.json();
    const score = verificationData.score;

    // Check if verification failed or score is too low (0.7 is standard threshold)
    if (!verificationData.success || score < 0.7) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        { message: "Bot verification failed. Score: " + score },
        { status: 403 } // Forbidden
      );
    }
    // --- END RECAPTCHA VERIFICATION ---

    // 4. Send Email (Only runs if ReCAPTCHA passes)
    const mailOptions = {
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `[Yacht Inquiry] New Contact from ${name}`,
      replyTo: email,
      html: `
        <h3>New Website Inquiry:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${message}</p>
        <hr>
        <p style="font-size: 10px;">ReCAPTCHA Score: ${score}</p>
      `,
    };

    await sendMailPromise(mailOptions);

    // Success response
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Failed to send email due to server or connection error." },
      { status: 500 }
    );
  }
}

// Ensure the OPTIONS handler is present for preflight checks
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    },
  });
}
