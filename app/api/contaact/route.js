import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";

// Environment variables (Vercel Project Settings)
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

// --- FIX: OPTIONS Handler (Definitive Preflight Success) ---
export async function OPTIONS() {
  // This explicitly sets the headers needed for a complex JSON POST request to succeed.
  return NextResponse.json(null, {
    status: 204, // Status 204 (No Content) is standard for successful preflight.
    headers: {
      // Crucial: Allows the browser to send the application/json header
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept",
      // Allows the POST method
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

// The handler for POST requests (form submission)
export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, phone, message, recaptchaToken } = payload;

    // 1. Validation Check
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
        { status: 400 }
      );
    }

    // 2. RECAPTCHA VERIFICATION
    if (!RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { message: "Server configuration error (Secret Key missing)." },
        { status: 500 }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const verificationResponse = await axios.post(verificationUrl);
    const { success, score } = verificationResponse.data;

    if (!success || score < 0.7) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        { message: "Bot verification failed. Score: " + score },
        { status: 403 }
      );
    }

    // 3. Send Email
    await transporter.sendMail({
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
