import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
// Removed: const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

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
  // Define bare minimum headers for maximum compatibility
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  };

  try {
    const payload = await request.json();
    // Removed: recaptchaToken from payload destructuring
    const { name, email, phone, message } = payload;

    // 1. Validation Check (No ReCAPTCHA token needed)
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400, headers: defaultHeaders }
      );
    }

    // --- SECURITY STEP REMOVED: ReCAPTCHA Verification ---

    // 2. Send Email
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
  const optionsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, Accept",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    "Content-Length": "0",
  };

  // Use a simple Response object for maximum compatibility with Vercel's edge network
  return new Response(null, {
    status: 204, // 204 No Content for successful preflight
    headers: optionsHeaders,
  });
}
