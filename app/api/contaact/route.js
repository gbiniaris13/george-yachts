import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

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
  try {
    // CRITICAL FIX: Get raw text body and parse URL-encoded parameters
    const text = await request.text();
    const params = new URLSearchParams(text);

    // Extract fields directly from URLSearchParams
    const name = params.get("name");
    const email = params.get("email");
    const phone = params.get("phone");
    const message = params.get("message");

    // 1. Validation Check (Minimal)
    if (!name || !email || !phone || !message) {
      // NOTE: We rely on Vercel to handle basic headers for simple requests
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    // Note: Logging the full error in Vercel is important for debugging mail issues.
    return NextResponse.json(
      { message: "Failed to send email due to server or connection error." },
      { status: 500 }
    );
  }
}

// OPTIONS Handler: Bare minimum response to pass preflight check
export async function OPTIONS() {
  // Use a simple Response object with 204 No Content for successful preflight check
  return new Response(null, { status: 204 });
}
