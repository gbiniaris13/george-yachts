import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Environment variables
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

// Setup Nodemailer transport
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
    const payload = await request.json();
    const { name, email, phone, message } = payload;

    // 1. Validation Check (Minimal)
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 2. Send Email
    await sendMailPromise({
      from: GMAIL_USER,
      to: GMAIL_USER,
      subject: `[Yacht Inquiry] New Contact from ${name}`,
      replyTo: email,
      html: `Name: ${name}<br>Email: ${email}<br>Phone: ${phone}<br>Message: ${message}`,
    });

    // Success response
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Failed to send email." },
      { status: 500 }
    );
  }
}

// OPTIONS Handler: Bare minimum response, relying on next.config.js for headers
export async function OPTIONS() {
  // Use Response object with 204 No Content for successful preflight check
  return new Response(null, { status: 204 });
}
