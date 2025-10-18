import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
// IMPORT THE NEW CONSOLIDATED COMPONENT
import NavDrawerSystem from "./components/NavDrawerSystem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {recaptchaKey && (
          <Script
            id="recaptcha-script"
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`}
            strategy="beforeInteractive"
          />
        )}
        {/* RENDER THE NEW CONSOLIDATED SYSTEM */}
        <NavDrawerSystem /> {children}
      </body>
    </html>
  );
}
