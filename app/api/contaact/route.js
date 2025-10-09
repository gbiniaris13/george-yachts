import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";

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

// The handler for POST requests (form submission)
export async function POST(request) {
  try {
    // 1. Parse Payload (includes form fields AND recaptchaToken)
    const payload = await request.json();
    const { name, email, phone, message, recaptchaToken } = payload; // Added recaptchaToken

    // 2. Simple Validation
    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json(
        { message: "Missing required fields or ReCAPTCHA token." },
        { status: 400 }
      );
    }

    // --- 3. RECAPTCHA VERIFICATION ---
    // If the secret key isn't set in Vercel, block the request
    if (!RECAPTCHA_SECRET_KEY) {
      console.error(
        "RECAPTCHA_SECRET_KEY is not configured in environment variables."
      );
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    // Make a secure POST request to Google for verification
    const verificationResponse = await axios.post(verificationUrl);
    const { success, score } = verificationResponse.data;

    // Check if verification failed or score is too low (e.g., below 0.7 for v3)
    if (!success || score < 0.7) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        { message: "Bot verification failed. Please try refreshing." },
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

    await transporter.sendMail(mailOptions);

    // Success response
    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    // Respond with a 500 error if the mail server fails
    return NextResponse.json(
      { message: "Failed to send email due to server or connection error." },
      { status: 500 }
    );
  }
}
