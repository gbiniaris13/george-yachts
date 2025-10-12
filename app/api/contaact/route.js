import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
// Removed: import axios from "axios";

// Environment variables
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
  // Define default headers for all success/error responses
  const defaultHeaders = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    // FIX: Add cache busting headers to ensure Vercel and browser don't reuse cached headers
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  };

  try {
    const payload = await request.json();
    const { name, email, phone, message, recaptchaToken } = payload;

    // 1. Validation Check
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
        { status: 400, headers: defaultHeaders }
      );
    }

    // 2. RECAPTCHA VERIFICATION (Using Native Fetch)
    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { message: "Server configuration error (Secret Key missing)." },
        { status: 500, headers: defaultHeaders }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

    // Create the body using URLSearchParams, as required by Google's verification API
    const verificationBody = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: recaptchaToken,
    });

    // Using native fetch with explicit headers for stability
    const verificationResponse = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // CRUCIAL header for this external API
      },
      body: verificationBody.toString(),
    });

    const verificationData = await verificationResponse.json();
    const score = verificationData.score;

    if (!verificationData.success || score < 0.7) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        { message: "Bot verification failed. Score: " + score },
        { status: 403, headers: defaultHeaders }
      );
    }

    // 3. Send Email
    await sendMailPromise({
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
    });

    // Success response
    return NextResponse.json(
      { message: "Email sent successfully!" },
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

// Ensure the OPTIONS handler is present for preflight checks
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      // FIX: Add cache busting headers to ensure Vercel and browser don't reuse cached headers
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  });
}
